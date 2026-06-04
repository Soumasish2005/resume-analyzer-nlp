import spacy
import nltk
import re
import json
import google.generativeai as genai
from nltk.corpus import stopwords
from app.core.config import settings

# Configure Gemini
genai.configure(api_key=settings.GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

def load_nlp_model():
    try:
        is_gpu = spacy.prefer_gpu()
        model_name = "en_core_web_trf" if is_gpu else "en_core_web_lg"
        return spacy.load(model_name), model_name
    except OSError:
        return spacy.load("en_core_web_sm"), "en_core_web_sm"

nlp, MODEL_NAME = load_nlp_model()

# ── Noise Filtering ──────────────────────────────────────────────────────────

TECHNICAL_STOPLIST = {
    'datum', 'party', 'work', 'job', 'learn', 'learning', 'science', 'field',
    'bachelor', 'principle', 'interface', 'contribution', 'title', 'proficiency',
    'knowledge', 'degree', 'test', 'intern', 'review', 'practice', 'debugging',
    'code', 'performance', 'solution', 'feature', 'experience', 'system', 'team',
    'project', 'management', 'development', 'developer', 'engineer', 'engineering'
}

def clean_tech_text(text: str) -> str:
    text = re.sub(r'express\.js', 'EXPRESSDOTJS', text, flags=re.I)
    text = re.sub(r'node\.js', 'NODEDOTJS', text, flags=re.I)
    text = re.sub(r'c\+\+', 'CPPLANG', text, flags=re.I)
    return text

def restore_tech_names(text: str) -> str:
    text = text.replace('expressdotjs', 'Express.js').replace('nodedotjs', 'Node.js').replace('cpplang', 'C++')
    return text

def extract_keywords(text: str) -> list[str]:
    clean_input = clean_tech_text(text)
    doc = nlp(clean_input)
    keywords = []
    seen = set()
    for token in doc:
        if token.pos_ not in ["PROPN", "NOUN"] or token.is_stop or token.is_punct or len(token.text) < 2:
            continue
        lemma = token.lemma_.lower().strip()
        if lemma in TECHNICAL_STOPLIST: continue
        final_kw = restore_tech_names(lemma)
        if final_kw not in seen:
            seen.add(final_kw)
            keywords.append(final_kw)
    return keywords


# ── Document Validation & OCR ────────────────────────────────────────────────


def validate_document_type(text: str) -> bool:
    """Uses Gemini to check if the text contents belong to a Resume/CV."""
    prompt = f"""
    Analyze the following text and determine if it is a Resume or Curriculum Vitae.
    Respond with ONLY 'YES' if it is a resume, or 'NO' if it is something else (e.g., invoice, letter, receipt, etc.).
    
    Text:
    {text[:2000]}
    """
    try:
        response = model.generate_content(prompt)
        return "YES" in response.text.upper()
    except:
        return True # Fallback

def extract_from_scanned_pdf(file_bytes: bytes) -> dict:
    """Uses Gemini's multimodal capabilities to perform OCR on a scanned PDF."""
    prompt = """
    This is a scanned PDF of a resume. Please perform OCR and extract the text. 
    Format the output as a JSON dictionary with the following keys for sections:
    'summary', 'experience', 'skills', 'projects', 'education', 'contact'.
    Return the result as a valid JSON object.
    """
    try:
        content = [
            prompt,
            {
                "mime_type": "application/pdf",
                "data": file_bytes
            }
        ]
        response = model.generate_content(content)
        text = response.text.strip()
        if "```json" in text: text = text.split("```json")[1].split("```")[0].strip()
        res = json.loads(text)
        if not isinstance(res, dict): return {"other": text}
        return res
    except Exception as e:
        print(f"Scanned OCR Failure: {e}")
        return {"other": "OCR failed. Please try a clearer document."}


# ── Profile Extraction (Advanced AI Pass) ────────────────────────────────────


def extract_entities(sections: dict) -> dict:
    """Uses Gemini with a Local Regex Fallback and strict type enforcement."""
    full_raw = "\n".join(sections.values())
    input_context = "\n".join([f"[{k.upper()}]: {v}" for k,v in sections.items() if v])

    prompt = f"""
    Extract profile JSON from:
    {full_raw[:7000]}
    
    Format:
    {{
        "name": "Full Name",
        "email": "Email",
        "phone": "Phone",
        "linkedin": "LinkedIn",
        "skills": ["Skill"],
        "education": [{{ "degree": "", "institute": "", "year": "" }}],
        "experience": [{{ "title": "", "company": "", "duration": "" }}]
    }}
    """

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if "```json" in text: text = text.split("```json")[1].split("```")[0].strip()
        res = json.loads(text)
        
        if not isinstance(res, dict): raise ValueError("Not a dict")
            
        raw_skills = res.get("skills", [])
        clean_skills = []
        if isinstance(raw_skills, dict):
            for val in raw_skills.values():
                if isinstance(val, list): clean_skills.extend(val)
                else: clean_skills.append(str(val))
        elif isinstance(raw_skills, list):
            for s in raw_skills:
                if isinstance(s, str): clean_skills.append(s)
                elif isinstance(s, dict): clean_skills.extend(list(s.values()))
        res["skills"] = [str(x) for x in clean_skills if x]
            
        return res
    except Exception as e:
        print(f"DEBUG: Gemini Failure. Local Fallback active. {e}")
        return _extract_entities_local(sections)

def _extract_entities_local(sections: dict) -> dict:
    """Intelligent Local Fallback using Heuristics."""
    full_text = "\n".join(sections.values())
    lines = [L.strip() for L in full_text.split("\n") if L.strip()]
    
    # Heuristic for Name: First non-empty line that isn't a known section header
    name = "Candidate"
    headers = {"EDUCATION", "EXPERIENCE", "SKILLS", "PROJECTS", "CONTACT", "SUMMARY"}
    if lines:
        for L in lines[:5]:
            if L.upper() not in headers and len(L.split()) <= 4:
                name = L
                break

    email = re.search(r"\S+@\S+\.\S+", full_text)
    phone = re.search(r"(\+?\d[\d\s\-().]{7,}\d)", full_text)
    linkedin = re.search(r"(linkedin\.com/in/\S+)", full_text)
    skills = extract_keywords(sections.get("skills", "") or full_text)[:30]
    
    # Education
    edu_text = sections.get("education", "") or full_text
    degrees = re.findall(r"\b(B\.?Tech|B\.?E|B\.?Sc|M\.?Tech|M\.?Sc|MBA|PhD)\b", edu_text, re.I)
    univ = re.search(r"([A-Z][\w\s]+(University|College|Institute|School))", edu_text)
    education = [{"degree": d, "institute": univ.group(0) if univ else "Unknown Institute", "year": None} for d in degrees]
    
    # Experience
    exp_text = sections.get("experience", "") or full_text
    exp_lines = [L.strip() for L in exp_text.split("\n") if L.strip()]
    experience = []
    
    titles_found = re.findall(r"(engineer|developer|analyst|intern|manager|architect|lead)[^\n]*", exp_text, re.I)
    for i, title in enumerate(titles_found[:3]):
        # Heuristic: The company name is often on the line above or below the title
        company = "Company"
        for j, line in enumerate(exp_lines):
            if title.lower() in line.lower():
                if j > 0: company = exp_lines[j-1]
                elif j < len(exp_lines) - 1: company = exp_lines[j+1]
                break
        experience.append({"title": title.strip(), "company": company, "duration": None})

    return {
        "name": name,
        "email": email.group(0) if email else None,
        "phone": phone.group(0).strip() if phone else None,
        "linkedin": linkedin.group(0) if linkedin else None,
        "skills": skills,
        "education": education,
        "experience": experience
    }

def add_jd_entity_ruler(jd_text: str):
    if "entity_ruler" not in nlp.pipe_names:
        try: ruler = nlp.add_pipe("entity_ruler", before="ner")
        except: ruler = nlp.add_pipe("entity_ruler")
    else:
        ruler = nlp.get_pipe("entity_ruler")
    
    potential_skills = re.findall(r"\b[A-Z][a-zA-Z0-9+#]*\b", jd_text)
    patterns = [{"label": "SKILL", "pattern": s} for s in set(potential_skills) if len(s) > 1]
    ruler.add_patterns(patterns)
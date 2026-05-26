import spacy
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download required NLTK data on first run
nltk.download("punkt", quiet=True)
nltk.download("punkt_tab", quiet=True)
nltk.download("stopwords", quiet=True)
nltk.download("wordnet", quiet=True)

# Load spaCy model — run: python -m spacy download en_core_web_sm
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    raise RuntimeError(
        "spaCy model not found. Run: python -m spacy download en_core_web_sm"
    )

STOP_WORDS = set(stopwords.words("english"))


# ── Tokenization & lemmatization ──────────────────────────────────────────────

def tokenize_and_lemmatize(text: str) -> list[str]:
    """
    Tokenizes text, removes stop words and punctuation,
    then lemmatizes each token using spaCy.
    Returns a list of clean lemmatized tokens.
    """
    doc = nlp(text.lower())
    tokens = [
        token.lemma_
        for token in doc
        if not token.is_stop
        and not token.is_punct
        and not token.is_space
        and len(token.text) > 1
    ]
    return tokens


# ── Named Entity Recognition ──────────────────────────────────────────────────

def extract_entities(raw_text: str) -> dict:
    """
    Runs spaCy NER on the raw (uncleaned) resume text to extract
    contact info and profile fields before cleaning strips them out.

    Returns a dict with: name, email, phone, skills, education, experience.
    """
    import re

    doc = nlp(raw_text)

    # Extract name — first PERSON entity is usually the candidate name
    name = None
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            name = ent.text
            break

    # Extract email
    email_match = re.search(r"\S+@\S+\.\S+", raw_text)
    email = email_match.group(0) if email_match else None

    # Extract phone
    phone_match = re.search(r"(\+?\d[\d\s\-().]{7,}\d)", raw_text)
    phone = phone_match.group(0).strip() if phone_match else None

    # Extract organizations (used to infer education/experience)
    orgs = [ent.text for ent in doc.ents if ent.label_ == "ORG"]

    # Extract skills via section parsing (heuristic)
    skills = _extract_skills_section(raw_text)

    # Extract education and experience via section heuristics
    education = _extract_education_section(raw_text, doc)
    experience = _extract_experience_section(raw_text, doc)

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "skills": skills,
        "education": education,
        "experience": experience
    }


def _extract_skills_section(text: str) -> list[str]:
    """
    Looks for a Skills section in the resume and extracts comma/newline
    separated skill tokens from it.
    """
    import re
    skills = []
    # Find skills section by common headers
    match = re.search(
        r"(skills|technical skills|core competencies)[:\s]*(.*?)(\n{2,}|education|experience|projects|$)",
        text, re.IGNORECASE | re.DOTALL
    )
    if match:
        raw = match.group(2)
        # Split on commas, pipes, newlines, bullets
        items = re.split(r"[,|\n•\-]+", raw)
        skills = [s.strip() for s in items if len(s.strip()) > 1]
    return skills[:30]  # cap at 30 to avoid noise


def _extract_education_section(text: str, doc) -> list[dict]:
    """
    Extracts education entries as a list of dicts with degree and institute.
    Uses section heuristics + ORG entity recognition.
    """
    import re
    education = []
    degree_pattern = re.compile(
        r"(b\.?tech|b\.?e|b\.?sc|m\.?tech|m\.?sc|mba|phd|bachelor|master|doctorate)[^\n]*",
        re.IGNORECASE
    )
    for match in degree_pattern.finditer(text):
        education.append({"degree": match.group(0).strip(), "institute": None})
    return education[:5]


def _extract_experience_section(text: str, doc) -> list[dict]:
    """
    Extracts experience entries as a list of dicts with title and company.
    Uses ORG entities and common job title keywords.
    """
    import re
    experience = []
    title_pattern = re.compile(
        r"(engineer|developer|analyst|intern|manager|designer|consultant|architect)[^\n]*",
        re.IGNORECASE
    )
    for match in title_pattern.finditer(text):
        experience.append({"title": match.group(0).strip(), "company": None})
    return experience[:5]


# ── Keyword extraction ────────────────────────────────────────────────────────

def extract_keywords(text: str) -> list[str]:
    """
    Returns a deduplicated list of meaningful keywords from the text
    after tokenization, stop word removal, and lemmatization.
    Used on both resume and JD before scoring.
    """
    tokens = tokenize_and_lemmatize(text)
    # Deduplicate while preserving order
    seen = set()
    keywords = []
    for t in tokens:
        if t not in seen and len(t) > 2:
            seen.add(t)
            keywords.append(t)
    return keywords
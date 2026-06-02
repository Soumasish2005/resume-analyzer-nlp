from sentence_transformers import SentenceTransformer, util
import torch

# Load BGE model (Small version is ~130MB, very efficient)
# We use 'cpu' by default as per user optimization request, but switch to 'cuda' if available.
device = "cuda" if torch.cuda.is_available() else "cpu"
model = SentenceTransformer('BAAI/bge-small-en-v1.5', device=device)

def compute_semantic_similarity(text1: str, text2: str) -> float:
    """
    Computes cosine similarity between two texts using BGE embeddings.
    """
    if not text1.strip() or not text2.strip():
        return 0.0
    
    # BGE works best with specific instructions for asymmetric tasks, 
    # but for resume-JD matching, generic embeddings are usually sufficient.
    emb1 = model.encode(text1, convert_to_tensor=True)
    emb2 = model.encode(text2, convert_to_tensor=True)
    
    cos_sim = util.cos_sim(emb1, emb2)
    return round(float(cos_sim), 4)

def compute_match_score(resume_sections: dict, jd_text: str) -> dict:
    """
    Computes a weighted match score based on independent section analysis.
    
    Weights:
    - Skills: 20%
    - Experience: 30%
    - Projects: 40%
    - Education: 10%
    """
    # Extract components (with fallback to 'other' or empty string)
    skills_text = resume_sections.get("skills", "")
    exp_text = resume_sections.get("experience", "")
    projects_text = resume_sections.get("projects", "")
    edu_text = resume_sections.get("education", "")
    
    # If sections are missing but we have 'other', we could potentially use 'other' 
    # for all of them as a fallback, but that might skew scores.
    # For now, we trust the two-pass parser.
    # If all primary sections are empty, use 'other' for everything.
    if not any([skills_text, exp_text, projects_text, edu_text]):
        raw_text = resume_sections.get("other", "")
        # Apply standard weights to the same text if it's the only thing we have
        score = compute_semantic_similarity(raw_text, jd_text)
        return {
            "final_score": score,
            "breakdown": {
                "skills_score": score,
                "experience_score": score,
                "projects_score": score,
                "education_score": score
            }
        }

    # Compute individual scores
    s_score = compute_semantic_similarity(skills_text, jd_text)
    e_score = compute_semantic_similarity(exp_text, jd_text)
    p_score = compute_semantic_similarity(projects_text, jd_text)
    ed_score = compute_semantic_similarity(edu_text, jd_text)

    # Weighted calculation
    final_score = (
        (s_score * 0.20) +
        (e_score * 0.30) +
        (p_score * 0.40) +
        (ed_score * 0.10)
    )

    return {
        "final_score": round(final_score, 4),
        "breakdown": {
            "skills_score": s_score,
            "experience_score": e_score,
            "projects_score": p_score,
            "education_score": ed_score
        }
    }

def get_matched_keywords(resume_keywords: list[str], jd_keywords: list[str]) -> list[str]:
    """
    Deduplicated set intersection of keywords.
    """
    resume_set = set(k.lower() for k in resume_keywords)
    jd_set = set(k.lower() for k in jd_keywords)
    return sorted(resume_set & jd_set)
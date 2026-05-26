from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def compute_match_score(resume_text: str, jd_text: str) -> float:
    """
    Computes a match score between resume and job description
    using TF-IDF vectorization and cosine similarity.

    Returns a float between 0.0 (no match) and 1.0 (perfect match).
    """
    if not resume_text.strip() or not jd_text.strip():
        return 0.0

    vectorizer = TfidfVectorizer()
    try:
        tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
    except ValueError:
        # Catches edge case where vocabulary is empty after stop word removal
        return 0.0

    score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    # Round to 4 decimal places for clean storage
    return round(float(score), 4)


def get_matched_keywords(resume_keywords: list[str], jd_keywords: list[str]) -> list[str]:
    """
    Returns keywords that appear in both the resume and the JD.
    Simple set intersection on lemmatized keyword lists.
    """
    resume_set = set(k.lower() for k in resume_keywords)
    jd_set = set(k.lower() for k in jd_keywords)
    return sorted(resume_set & jd_set)
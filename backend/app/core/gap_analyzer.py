def find_keyword_gaps(resume_keywords: list[str], jd_keywords: list[str]) -> list[str]:
    """
    Identifies keywords present in the JD but missing from the resume.
    These are the gaps the candidate needs to address.

    Returns a sorted list of missing keywords.
    """
    resume_set = set(k.lower() for k in resume_keywords)
    jd_set = set(k.lower() for k in jd_keywords)
    missing = jd_set - resume_set
    return sorted(missing)


def categorize_gaps(missing_keywords: list[str]) -> dict:
    """
    Groups missing keywords into broad categories for richer feedback.
    Uses simple keyword matching against known category terms.

    Returns a dict: { "Technical Skills": [...], "Tools": [...], "Soft Skills": [...], "Other": [...] }
    """
    TECHNICAL = {
        "python", "java", "javascript", "typescript", "c", "c++", "sql", "nosql",
        "react", "node", "django", "fastapi", "flask", "spring", "docker",
        "kubernetes", "aws", "azure", "gcp", "linux", "git", "rest", "api",
        "machine learning", "deep learning", "nlp", "tensorflow", "pytorch",
        "pandas", "numpy", "scikit", "html", "css", "mongodb", "postgresql"
    }
    TOOLS = {
        "jira", "confluence", "figma", "postman", "github", "gitlab", "jenkins",
        "ansible", "terraform", "vscode", "intellij", "excel", "powerbi", "tableau"
    }
    SOFT_SKILLS = {
        "communication", "leadership", "teamwork", "collaboration", "problem",
        "analytical", "management", "agile", "scrum", "presentation", "critical"
    }

    categories = {"Technical Skills": [], "Tools": [], "Soft Skills": [], "Other": []}

    for kw in missing_keywords:
        kw_lower = kw.lower()
        if any(t in kw_lower for t in TECHNICAL):
            categories["Technical Skills"].append(kw)
        elif any(t in kw_lower for t in TOOLS):
            categories["Tools"].append(kw)
        elif any(t in kw_lower for t in SOFT_SKILLS):
            categories["Soft Skills"].append(kw)
        else:
            categories["Other"].append(kw)

    # Remove empty categories
    return {k: v for k, v in categories.items() if v}
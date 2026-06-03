from app.core.skill_ontology import ontology

def find_keyword_gaps(resume_keywords: list[str], jd_keywords: list[str]) -> list[dict]:
    """
    Identifies keywords present in the JD but missing from the resume,
    taking skill equivalence into account.
    
    Returns a list of dicts: [{"keyword": "...", "confidence": 0.0, "is_equivalent": False}]
    """
    resume_set = set(k.lower() for k in resume_keywords)
    jd_set = set(k.lower() for k in jd_keywords)
    
    gaps = []
    
    for jk in jd_set:
        if jk in resume_set:
            continue
            
        # Check ontology for equivalence
        is_covered = False
        highest_conf = 0.0
        
        for rk in resume_set:
            conf = ontology.check_equivalence(rk, jk)
            if conf > 0.6:
                is_covered = True
                highest_conf = conf
                break
        
        if not is_covered:
            gaps.append({
                "keyword": jk,
                "confidence": 1.0, # 1.0 means it's definitely a gap
                "is_equivalent": False
            })
        elif highest_conf < 0.9:
            # If match is weak, we might still count it as a partial gap
            gaps.append({
                "keyword": jk,
                "confidence": round(1.0 - highest_conf, 2),
                "is_equivalent": True,
                "suggestion": f"While you have related experience, consider explicitly mentioning '{jk}'"
            })
            
    return sorted(gaps, key=lambda x: x["confidence"], reverse=True)


def find_related_experience(missing_keyword: str, resume_text: str) -> list[str]:
    """
    Searches the resume for terms related to the missing keyword 
    using the ontology to provide smarter feedback.
    """
    equivalents = ontology.get_equivalents(missing_keyword)
    found_relations = []
    
    resume_lower = resume_text.lower()
    for eq in equivalents:
        if eq.lower() in resume_lower:
            found_relations.append(eq)
            
    return found_relations


def categorize_gaps(gaps: list[dict]) -> dict:
    """Groups gaps into categories for display."""
    # ... existing categorization logic but updated for gap dicts ...
    TECHNICAL = {"python", "react", "docker", "aws", "sql", "ml", "nlp", "api"}
    categories = {"Technical Skills": [], "Soft Skills": [], "Other": []}
    
    for gap in gaps:
        kw = gap["keyword"].lower()
        if any(t in kw for t in TECHNICAL):
            categories["Technical Skills"].append(gap["keyword"])
        else:
            categories["Other"].append(gap["keyword"])
            
    return {k: v for k, v in categories.items() if v}
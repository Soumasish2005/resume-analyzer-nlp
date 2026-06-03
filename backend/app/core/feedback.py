from app.core.gap_analyzer import categorize_gaps

def generate_feedback(
    match_score: float,
    gaps: list[dict], # Now takes a list of gap dicts
    matched_keywords: list[str],
    extracted_profile: dict,
    breakdown: dict = None,
    llm_review: dict = None
) -> dict:
    """
    Consumes multi-layer analysis output and produces rich, explainable feedback.
    """
    suggestions = []
    highlighted_sections = []

    # ── Explainability Block ──────────────────────────────────────────────────
    if breakdown:
        if breakdown.get("skills_score", 0) > 0.8:
            suggestions.append("Exceptional skills alignment with the role requirements.")
        if breakdown.get("experience_score", 0) < 0.5:
            suggestions.append("Work experience section needs better alignment with industry standards for this role.")
            highlighted_sections.append("Experience")

    # ── LLM Recruit Review Integration ────────────────────────────────────────
    if llm_review:
        if isinstance(llm_review, dict):
            verdict = llm_review.get("verdict", "")
            if verdict:
                suggestions.append(f"Recruiter Assessment: {verdict}")
            
            rewrites = llm_review.get("rewrite_suggestions", [])
            for r in rewrites[:2]:
                suggestions.append(f"Resume Tip: {r}")
        else:
            # Handle string case (Direct review or fallback)
            suggestions.append(f"Recruiter Assessment: {llm_review}")

    # ── Keyword gap feedback (Ontology aware) ─────────────────────────────────
    categorized = categorize_gaps(gaps)

    if "Technical Skills" in categorized:
        tech = categorized["Technical Skills"]
        suggestions.append(
            f"Address missing key skills: {', '.join(tech[:5])}."
        )
        highlighted_sections.append("Skills")

    # ── Profile completeness ──────────────────────────────────────────────────
    if not extracted_profile.get("skills"):
        suggestions.append("Add a dedicated Skills section to highlight your technical stack.")
        highlighted_sections.append("Skills")

    if not extracted_profile.get("experience"):
        suggestions.append("Ensure your professional experience is clearly listed with bullet points.")
        highlighted_sections.append("Experience")

    # Deduplicate 
    highlighted_sections = list(dict.fromkeys(highlighted_sections))

    return {
        "suggestions": suggestions,
        "highlighted_sections": highlighted_sections,
        "overall_assessment": (llm_review.get("verdict") if isinstance(llm_review, dict) else llm_review) if llm_review else None
    }
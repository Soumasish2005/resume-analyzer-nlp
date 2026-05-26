from app.core.gap_analyzer import categorize_gaps

def generate_feedback(
    match_score: float,
    missing_keywords: list[str],
    matched_keywords: list[str],
    extracted_profile: dict
) -> dict:
    """
    Consumes NLP engine output and produces structured, actionable feedback.

    Returns a dict with:
    - suggestions: list of specific improvement actions
    - highlighted_sections: resume sections that need attention
    """
    suggestions = []
    highlighted_sections = []

    # ── Score-based feedback ──────────────────────────────────────────────────
    if match_score < 0.3:
        suggestions.append(
            "Your resume has a low match with this job description. "
            "Consider significantly tailoring your resume to this role."
        )
    elif match_score < 0.6:
        suggestions.append(
            "Your resume partially matches the job description. "
            "Incorporate more relevant keywords from the JD."
        )
    else:
        suggestions.append(
            "Strong match! Focus on fine-tuning specific missing keywords to maximize your score."
        )

    # ── Keyword gap feedback ──────────────────────────────────────────────────
    categorized = categorize_gaps(missing_keywords)

    if "Technical Skills" in categorized:
        tech = categorized["Technical Skills"]
        suggestions.append(
            f"Add these technical skills if you have experience with them: {', '.join(tech[:8])}."
        )
        highlighted_sections.append("Skills")

    if "Tools" in categorized:
        tools = categorized["Tools"]
        suggestions.append(
            f"Mention these tools in your experience or skills section: {', '.join(tools[:5])}."
        )
        highlighted_sections.append("Skills")

    if "Soft Skills" in categorized:
        soft = categorized["Soft Skills"]
        suggestions.append(
            f"Highlight these soft skills in your summary or experience: {', '.join(soft[:5])}."
        )
        highlighted_sections.append("Summary / Objective")

    # ── Profile completeness feedback ─────────────────────────────────────────
    if not extracted_profile.get("skills"):
        suggestions.append("No skills section detected. Add a dedicated Skills section to your resume.")
        highlighted_sections.append("Skills")

    if not extracted_profile.get("education"):
        suggestions.append("Education section appears missing or undetected. Ensure it is clearly labeled.")
        highlighted_sections.append("Education")

    if not extracted_profile.get("experience"):
        suggestions.append("Work experience section appears missing or undetected. Ensure it is clearly labeled.")
        highlighted_sections.append("Experience")

    if not extracted_profile.get("name"):
        suggestions.append("Candidate name could not be detected. Ensure your name appears at the top of the resume.")
        highlighted_sections.append("Header")

    # Deduplicate highlighted sections
    highlighted_sections = list(dict.fromkeys(highlighted_sections))

    return {
        "suggestions": suggestions,
        "highlighted_sections": highlighted_sections
    }
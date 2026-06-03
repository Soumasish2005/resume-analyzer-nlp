import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

def get_recruiter_review(sections: dict, jd_text: str, breakdown: dict) -> str:
    """Generates a high-level recruiter review. Falls back to template if AI fails."""
    prompt = f"""
    Act as a Technical Recruiter. Review this candidate for the job.
    Score Breakdown: {breakdown}
    Resume Snippet: {str(sections)[:1000]}
    
    Provide a 3-sentence summary of their fit.
    """

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Recruiter Review Fallback: {e}")
        # Local Fallback based on score
        avg_score = sum(breakdown.values()) / len(breakdown) if breakdown else 0
        if avg_score > 80:
            return "Strong candidate with high technical alignment. Resume exhibits solid project work and relevant skillsets."
        elif avg_score > 50:
            return "Moderate alignment. Candidate possesses several core requirements but lacks some specific technical depth in secondary areas."
        else:
            return "Low alignment. Significant skill gaps detected. Candidate may need to highlight more relevant projects or certifications."

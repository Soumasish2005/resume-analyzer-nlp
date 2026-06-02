import google.generativeai as genai
from app.core.config import settings
import json
import re

genai.configure(api_key=settings.GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

def infer_skills_from_projects(projects_text: str) -> list[str]:
    """Infers tech skills from project descriptions. Enforces a flat list of strings."""
    if not projects_text or len(projects_text) < 20:
        return []

    prompt = f"""
    Analyze these projects and list ONLY the technical tools/languages used as a JSON array of strings:
    {projects_text[:2000]}
    """

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        
        data = json.loads(text)
        # Deep Flattening: Ensure we only return strings
        skills = []
        if isinstance(data, list):
            for item in data:
                if isinstance(item, str): skills.append(item)
                elif isinstance(item, dict): skills.extend(list(item.values()))
        return list(set([str(s).strip() for s in skills if s]))

    except Exception as e:
        print(f"Project Analysis Fallback: {e}")
        potential = re.findall(r"\b[A-Z][a-zA-Z0-9+#]*\b", projects_text)
        blacklist = {"The", "And", "This", "With", "Project", "Built", "Developed"}
        return list(set([str(s) for s in potential if s not in blacklist and len(s) > 1]))

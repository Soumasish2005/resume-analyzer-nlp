import pytest
from app.core.nlp_engine import extract_keywords, extract_entities

def test_extract_keywords():
    text = "Experience with Python, Node.js and React."
    keywords = extract_keywords(text)
    
    # Should contain core tech
    assert "python" in [k.lower() for k in keywords]
    assert "Node.js" in keywords
    assert "React" in keywords
    
    # Should NOT contain generic fillers (logic depends on TECHNICAL_STOPLIST)
    assert "experience" not in [k.lower() for k in keywords]

def test_extract_entities(mock_resume_sections):
    """
    Note: Testing LLM calls usually requires mocking or high-latency.
    This test verifies the return structure.
    """
    profile = extract_entities(mock_resume_sections)
    
    assert "name" in profile
    assert "skills" in profile
    assert isinstance(profile["skills"], list)
    assert len(profile["education"]) > 0
    assert profile["education"][0]["degree"] is not None

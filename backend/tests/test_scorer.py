import pytest
from app.core.scorer import compute_match_score

def test_compute_match_score(mock_resume_sections, mock_jd):
    score_data = compute_match_score(mock_resume_sections, mock_jd)
    
    assert "final_score" in score_data
    assert "breakdown" in score_data
    
    # Verify weights sum up correctly or are handled
    assert 0 <= score_data["final_score"] <= 100
    
    breakdown = score_data["breakdown"]
    assert "experience_score" in breakdown
    assert "skills_score" in breakdown

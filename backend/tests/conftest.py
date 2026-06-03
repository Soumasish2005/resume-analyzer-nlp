import pytest
import os
import sys

# Add the app directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

@pytest.fixture
def mock_resume_sections():
    return {
        "skills": "Python, Java, React, SQL",
        "experience": "Software Engineer at Google (2020-2023). Developed scalable cloud apps.",
        "education": "B.Tech in Computer Science, IIT Delhi (2016-2020)",
        "projects": "Built a resume analyzer using NLP and FastAPI.",
        "summary": "Experienced full-stack developer."
    }

@pytest.fixture
def mock_jd():
    return "Looking for a Software Engineer with experience in Python and React. Cloud knowledge is a plus."

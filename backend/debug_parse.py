import sys
import os
# Add app path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

from app.core.parser import extract_text
from app.core.nlp_engine import extract_entities
import json

def debug_file(path):
    print(f"--- Debugging {path} ---")
    if not os.path.exists(path):
        print("File not found!")
        return

    with open(path, "rb") as f:
        bytes = f.read()
    
    # Check Sectioning
    sections = extract_text(bytes, "pdf")
    print("\n[SECTION KEYS FOUND]:", list(sections.keys()))
    
    if "education" in sections:
        print("\n[EDUCATION CONTENT]:")
        print(sections["education"])
    else:
        print("\n[EDUCATION NOT FOUND IN SECTIONS]")
        print("Other sections contain:", [k for k,v in sections.items() if v])

    # Check Entity Extraction
    entities = extract_entities(sections)
    print("\n[EXTRACTED ENTITIES]:")
    print(json.dumps(entities, indent=2))

if __name__ == "__main__":
    debug_file("../resume-new.pdf")

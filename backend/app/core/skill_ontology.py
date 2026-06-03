import networkx as nx

class SkillOntology:
    """
    A graph-based ontology to manage skill relationships and equivalences.
    Handles parent-child relationships (e.g., React -> Frontend) and synonyms.
    """
    def __init__(self):
        self.graph = nx.DiGraph()
        self._initialize_ontology()

    def _initialize_ontology(self):
        """Initializes the graph with common technical skill hierarchies."""
        # Frontend
        self.graph.add_edge("React", "Frontend Development", weight=0.9)
        self.graph.add_edge("Vue", "Frontend Development", weight=0.9)
        self.graph.add_edge("Angular", "Frontend Development", weight=0.9)
        self.graph.add_edge("Next.js", "React", weight=1.0)
        
        # Backend
        self.graph.add_edge("FastAPI", "Backend Development", weight=0.9)
        self.graph.add_edge("Django", "Backend Development", weight=0.9)
        self.graph.add_edge("Flask", "Backend Development", weight=0.9)
        self.graph.add_edge("Node.js", "Backend Development", weight=0.8)
        
        # Data Science / AI
        self.graph.add_edge("PyTorch", "Machine Learning", weight=0.9)
        self.graph.add_edge("TensorFlow", "Machine Learning", weight=0.9)
        self.graph.add_edge("Scikit-Learn", "Machine Learning", weight=0.8)
        self.graph.add_edge("Machine Learning", "Artificial Intelligence", weight=1.0)
        
        # Infrastructure
        self.graph.add_edge("Docker", "DevOps", weight=0.8)
        self.graph.add_edge("Kubernetes", "DevOps", weight=0.9)
        self.graph.add_edge("Terraform", "Infrastructure as Code", weight=1.0)
        
        # Cloud
        self.graph.add_edge("AWS", "Cloud Computing", weight=0.9)
        self.graph.add_edge("Azure", "Cloud Computing", weight=0.9)
        self.graph.add_edge("GCP", "Cloud Computing", weight=0.9)

        # Languages
        self.graph.add_edge("Python", "Software Engineering", weight=0.7)
        self.graph.add_edge("Java", "Software Engineering", weight=0.7)

    def get_equivalents(self, skill: str) -> set:
        """Returns all related skills (parents, children, and siblings)."""
        skill_clean = skill.title()
        related = {skill_clean}
        
        if not self.graph.has_node(skill_clean):
            return related
            
        # Add parents
        related.update(self.graph.successors(skill_clean))
        # Add children
        related.update(self.graph.predecessors(skill_clean))
        
        return related

    def check_equivalence(self, resume_skill: str, jd_skill: str) -> float:
        """
        Returns a confidence score (0.0 to 1.0) if the resume skill 
        satisfies the JD skill via the ontology.
        """
        r_skill = resume_skill.title()
        j_skill = jd_skill.title()
        
        if r_skill == j_skill:
            return 1.0
            
        if not self.graph.has_node(r_skill) or not self.graph.has_node(j_skill):
            return 0.0
            
        # Check for path from resume skill to JD skill (e.g., React -> Frontend)
        if nx.has_path(self.graph, r_skill, j_skill):
            # The closer the relationship, the higher the confidence
            dist = nx.shortest_path_length(self.graph, r_skill, j_skill)
            return max(0.9 - (dist * 0.1), 0.5)
            
        return 0.0

ontology = SkillOntology()

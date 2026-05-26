from app.db.database import Base, engine

# Import all models so SQLAlchemy registers them before create_all
from app.models import user, resume, job, analysis, logs  # noqa: F401

def init_db():
    Base.metadata.create_all(bind=engine)
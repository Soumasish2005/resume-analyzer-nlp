from app.db.database import Base, engine
# Import all models so SQLAlchemy registers them before create_all
from app.models import user, resume, job, analysis, logs

def init_db():
    print("Connecting to the database...")
    try:
        print("Creating tables if they don't exist...")
        Base.metadata.create_all(bind=engine)
        print("Database initialized successfully!")
    except Exception as e:
        print(f"FAILED to initialize database: {e}")
        # Rethrow to catch in main startup if needed
        raise e

if __name__ == "__main__":
    init_db()
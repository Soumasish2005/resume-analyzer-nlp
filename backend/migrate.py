import psycopg2
from app.core.config import settings

def migrate():
    # Extract connection details from DATABASE_URL
    # Format: postgresql://user:pass@host:port/db
    db_url = settings.DATABASE_URL
    print(f"Connecting to database to apply migration...")
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # Add the linkedin column if it doesn't exist
        print("Checking for 'linkedin' column in 'extracted_profiles'...")
        cur.execute("""
            ALTER TABLE extracted_profiles 
            ADD COLUMN IF NOT EXISTS linkedin VARCHAR(255);
        """)
        
        conn.commit()
        print("SUCCESS: Migration applied. 'linkedin' column added.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"ERROR during migration: {e}")

if __name__ == "__main__":
    migrate()

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Check if the connection is SQLite
is_sqlite = settings.SQLALCHEMY_DATABASE_URI.startswith("sqlite")

# Create engine with appropriate settings
if is_sqlite:
    # For SQLite, we need to set check_same_thread to False
    engine = create_engine(
        settings.SQLALCHEMY_DATABASE_URI, 
        connect_args={"check_same_thread": False},
        pool_pre_ping=True
    )
else:
    # For PostgreSQL and other databases
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 
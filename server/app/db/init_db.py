import logging
from sqlalchemy.orm import Session
from app.db.session import Base, engine
from app.core.config import settings
from app.models import User, Category, Course, Module, Lesson, UserPreference
from app.core.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db(db: Session) -> None:
    # Create tables
    Base.metadata.create_all(bind=engine)
    logger.info("Created database tables")
    
    # Check if we need to create a first superuser
    user = db.query(User).filter(User.email == settings.FIRST_SUPERUSER_EMAIL).first()
    if not user:
        user_in = User(
            email=settings.FIRST_SUPERUSER_EMAIL,
            hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
            full_name="Initial Admin",
            is_superuser=True,
        )
        db.add(user_in)
        db.commit()
        logger.info(f"Created superuser: {settings.FIRST_SUPERUSER_EMAIL}")
    
    # Create initial categories if none exist
    if db.query(Category).count() == 0:
        categories = [
            Category(name="Communication Skills", description="Courses focused on developing verbal and non-verbal communication skills."),
            Category(name="Social Skills", description="Courses designed to improve social interaction and understanding."),
            Category(name="Life Skills", description="Practical courses for developing independence and daily living skills."),
            Category(name="Academic Support", description="Courses providing academic assistance and learning strategies."),
            Category(name="Sensory Processing", description="Courses addressing sensory sensitivities and integration."),
        ]
        db.add_all(categories)
        db.commit()
        logger.info("Created initial categories")

def main() -> None:
    from app.db.session import SessionLocal
    
    db = SessionLocal()
    try:
        logger.info("Initializing database")
        init_db(db)
        logger.info("Database initialization completed")
    finally:
        db.close()

if __name__ == "__main__":
    main() 
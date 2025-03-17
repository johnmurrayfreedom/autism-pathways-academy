from app.db.session import Base
from app.models.user import User
from app.models.course import Course, Module, Lesson, Category, CourseProgress, LessonCompletion
from app.models.user_preference import UserPreference
from app.models.message import Message

# For type checking
__all__ = [
    "Base",
    "User",
    "Course",
    "Module",
    "Lesson",
    "Category",
    "CourseProgress",
    "LessonCompletion",
    "UserPreference",
    "Message"
]

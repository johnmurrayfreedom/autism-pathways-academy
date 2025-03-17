from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, Table, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.db.session import Base
from app.core.config import settings

# Check if we're using SQLite
is_sqlite = settings.SQLALCHEMY_DATABASE_URI.startswith("sqlite")

# Many-to-many relationship between courses and categories
course_category = Table(
    "course_category",
    Base.metadata,
    Column("course_id", Integer, ForeignKey("courses.id")),
    Column("category_id", Integer, ForeignKey("categories.id"))
)

# Define enum class for course level
class CourseLevel(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)
    
    courses = relationship("Course", secondary=course_category, back_populates="categories")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    # Handle SQLite differently for enum types
    if is_sqlite:
        level = Column(String(20), default=CourseLevel.beginner.value)
    else:
        level = Column(Enum(CourseLevel), default=CourseLevel.beginner)
    image_url = Column(String, nullable=True)
    estimated_time = Column(Integer)  # In minutes
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_published = Column(Boolean, default=False)
    
    # Relationships
    categories = relationship("Category", secondary=course_category, back_populates="courses")
    modules = relationship("Module", back_populates="course", cascade="all, delete-orphan")
    prerequisites = relationship(
        "Course",
        secondary="course_prerequisites",
        primaryjoin="Course.id == course_prerequisites.c.course_id",
        secondaryjoin="Course.id == course_prerequisites.c.prerequisite_id",
        backref="prerequisite_for"
    )
    progresses = relationship("CourseProgress", back_populates="course")
    
# Course prerequisites
course_prerequisites = Table(
    "course_prerequisites",
    Base.metadata,
    Column("course_id", Integer, ForeignKey("courses.id"), primary_key=True),
    Column("prerequisite_id", Integer, ForeignKey("courses.id"), primary_key=True)
)

class Module(Base):
    __tablename__ = "modules"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    order = Column(Integer)
    course_id = Column(Integer, ForeignKey("courses.id"))
    
    # Relationships
    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    video_url = Column(String, nullable=True)
    order = Column(Integer)
    module_id = Column(Integer, ForeignKey("modules.id"))
    
    # Relationships
    module = relationship("Module", back_populates="lessons")
    completions = relationship("LessonCompletion", back_populates="lesson")
    messages = relationship("Message", back_populates="lesson")

class CourseProgress(Base):
    __tablename__ = "course_progresses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    last_accessed = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="course_progresses")
    course = relationship("Course", back_populates="progresses")
    lesson_completions = relationship("LessonCompletion", back_populates="course_progress")

class LessonCompletion(Base):
    __tablename__ = "lesson_completions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    course_progress_id = Column(Integer, ForeignKey("course_progresses.id"))
    completed_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User")
    lesson = relationship("Lesson", back_populates="completions")
    course_progress = relationship("CourseProgress", back_populates="lesson_completions") 
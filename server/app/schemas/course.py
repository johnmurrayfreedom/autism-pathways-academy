from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

# Category schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    
    class Config:
        from_attributes = True

# Lesson schemas
class LessonBase(BaseModel):
    title: str
    content: str
    video_url: Optional[str] = None
    order: int

class LessonCreate(LessonBase):
    module_id: int

class Lesson(LessonBase):
    id: int
    module_id: int
    
    class Config:
        from_attributes = True

# Module schemas
class ModuleBase(BaseModel):
    title: str
    description: Optional[str] = None
    order: int

class ModuleCreate(ModuleBase):
    course_id: int

class Module(ModuleBase):
    id: int
    course_id: int
    lessons: List[Lesson] = []
    
    class Config:
        from_attributes = True

# Course schemas
class CourseBase(BaseModel):
    title: str
    description: str
    level: str
    image_url: Optional[str] = None
    estimated_time: int
    is_published: bool = False

class CourseCreate(CourseBase):
    category_ids: List[int]

class CourseUpdate(CourseBase):
    category_ids: Optional[List[int]] = None

class Course(CourseBase):
    id: int
    created_at: datetime
    updated_at: datetime
    categories: List[Category] = []
    modules: List[Module] = []
    
    class Config:
        from_attributes = True

# Progress schemas
class CourseProgressBase(BaseModel):
    course_id: int
    completed_at: Optional[datetime] = None

class CourseProgress(CourseProgressBase):
    id: int
    user_id: int
    started_at: datetime
    last_accessed: datetime
    
    class Config:
        from_attributes = True

class LessonCompletionBase(BaseModel):
    lesson_id: int
    course_progress_id: int

class LessonCompletion(LessonCompletionBase):
    id: int
    user_id: int
    completed_at: datetime
    
    class Config:
        from_attributes = True 
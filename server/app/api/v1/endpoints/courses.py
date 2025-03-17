from typing import List, Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.models import User, Course, Category, Module, Lesson, CourseProgress, LessonCompletion
from app.schemas.course import (
    Course as CourseSchema,
    CourseCreate,
    CourseUpdate,
    Category as CategorySchema,
    Module as ModuleSchema,
    Lesson as LessonSchema,
    CourseProgress as CourseProgressSchema,
    LessonCompletion as LessonCompletionSchema
)

router = APIRouter()

@router.get("/categories", response_model=List[CategorySchema])
async def list_categories(
    db: Annotated[Session, Depends(deps.get_db)],
    skip: int = 0,
    limit: int = 100
) -> List[Category]:
    """
    Retrieve categories.
    """
    return db.query(Category).offset(skip).limit(limit).all()

@router.get("/", response_model=List[CourseSchema])
async def list_courses(
    db: Annotated[Session, Depends(deps.get_db)],
    skip: int = 0,
    limit: int = 100,
    category_id: int | None = None
) -> List[Course]:
    """
    Retrieve courses.
    """
    query = db.query(Course)
    if category_id:
        query = query.filter(Course.categories.any(Category.id == category_id))
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=CourseSchema)
async def create_course(
    *,
    db: Annotated[Session, Depends(deps.get_db)],
    course_in: CourseCreate,
    current_user: Annotated[User, Depends(deps.get_current_active_superuser)]
) -> Course:
    """
    Create new course.
    """
    categories = db.query(Category).filter(Category.id.in_(course_in.category_ids)).all()
    if len(categories) != len(course_in.category_ids):
        raise HTTPException(
            status_code=400,
            detail="One or more category IDs are invalid"
        )
    
    course = Course(
        title=course_in.title,
        description=course_in.description,
        level=course_in.level,
        image_url=course_in.image_url,
        estimated_time=course_in.estimated_time,
        is_published=course_in.is_published,
        categories=categories
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return course

@router.get("/{course_id}", response_model=CourseSchema)
async def get_course(
    course_id: int,
    db: Annotated[Session, Depends(deps.get_db)]
) -> Course:
    """
    Get course by ID.
    """
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.put("/{course_id}", response_model=CourseSchema)
async def update_course(
    *,
    course_id: int,
    course_in: CourseUpdate,
    db: Annotated[Session, Depends(deps.get_db)],
    current_user: Annotated[User, Depends(deps.get_current_active_superuser)]
) -> Course:
    """
    Update course.
    """
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if course_in.category_ids is not None:
        categories = db.query(Category).filter(Category.id.in_(course_in.category_ids)).all()
        if len(categories) != len(course_in.category_ids):
            raise HTTPException(
                status_code=400,
                detail="One or more category IDs are invalid"
            )
        course.categories = categories
    
    for field, value in course_in.dict(exclude={'category_ids'}).items():
        setattr(course, field, value)
    
    db.commit()
    db.refresh(course)
    return course

@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(
    course_id: int,
    db: Annotated[Session, Depends(deps.get_db)],
    current_user: Annotated[User, Depends(deps.get_current_active_superuser)]
) -> None:
    """
    Delete course.
    """
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()

@router.post("/{course_id}/start", response_model=CourseProgressSchema)
async def start_course(
    course_id: int,
    db: Annotated[Session, Depends(deps.get_db)],
    current_user: Annotated[User, Depends(deps.get_current_user)]
) -> CourseProgress:
    """
    Start a course for the current user.
    """
    # Check if course exists
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check if user already started this course
    progress = db.query(CourseProgress).filter(
        CourseProgress.user_id == current_user.id,
        CourseProgress.course_id == course_id
    ).first()
    
    if progress:
        return progress
    
    # Create new progress
    progress = CourseProgress(
        user_id=current_user.id,
        course_id=course_id
    )
    db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress

@router.post("/lessons/{lesson_id}/complete", response_model=LessonCompletionSchema)
async def complete_lesson(
    lesson_id: int,
    db: Annotated[Session, Depends(deps.get_db)],
    current_user: Annotated[User, Depends(deps.get_current_user)]
) -> LessonCompletion:
    """
    Mark a lesson as completed for the current user.
    """
    # Check if lesson exists
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Get course progress
    progress = db.query(CourseProgress).filter(
        CourseProgress.user_id == current_user.id,
        CourseProgress.course_id == lesson.module.course_id
    ).first()
    
    if not progress:
        raise HTTPException(
            status_code=400,
            detail="You must start the course before completing lessons"
        )
    
    # Check if lesson is already completed
    completion = db.query(LessonCompletion).filter(
        LessonCompletion.user_id == current_user.id,
        LessonCompletion.lesson_id == lesson_id
    ).first()
    
    if completion:
        return completion
    
    # Create new completion
    completion = LessonCompletion(
        user_id=current_user.id,
        lesson_id=lesson_id,
        course_progress_id=progress.id
    )
    db.add(completion)
    db.commit()
    db.refresh(completion)
    return completion 
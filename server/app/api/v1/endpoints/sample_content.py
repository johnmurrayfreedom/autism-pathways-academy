from fastapi import APIRouter, HTTPException
from app.data.sample_courses.web_development_intro import sample_courses

router = APIRouter()

@router.get("/courses/{course_id}")
async def get_sample_course(course_id: str):
    """Get a sample course by ID."""
    if course_id not in sample_courses:
        raise HTTPException(status_code=404, detail="Sample course not found")
    return sample_courses[course_id]

@router.get("/courses")
async def list_sample_courses():
    """List all available sample courses."""
    return {
        "courses": [
            {
                "id": course_id,
                "title": course.title,
                "description": course.description,
                "difficulty_level": course.difficulty_level,
                "estimated_duration": course.estimated_duration,
            }
            for course_id, course in sample_courses.items()
        ]
    } 
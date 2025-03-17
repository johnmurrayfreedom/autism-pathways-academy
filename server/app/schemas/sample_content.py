from typing import List, Optional, Dict
from pydantic import BaseModel

class ConceptReference(BaseModel):
    """Reference to a key concept that can be explained by the AI Tutor"""
    id: str
    name: str
    description: str
    related_concepts: List[str] = []
    example_code: Optional[str] = None
    visual_aid_url: Optional[str] = None

class ResourceLink(BaseModel):
    """External resource for additional learning"""
    title: str
    url: str
    description: str
    type: str  # 'article', 'video', 'interactive', 'documentation'
    difficulty_level: str  # 'beginner', 'intermediate', 'advanced'

class LearningObjective(BaseModel):
    """Specific learning goal for a lesson"""
    id: str
    description: str
    assessment_criteria: List[str]
    concepts: List[ConceptReference]

class PracticeExercise(BaseModel):
    """Interactive exercise for applying learned concepts"""
    id: str
    title: str
    description: str
    instructions: List[str]
    starter_code: Optional[str]
    solution_code: Optional[str]
    hints: List[str]
    validation_points: List[str]

class SampleLesson(BaseModel):
    """Enhanced lesson content with AI Tutor integration"""
    id: int
    title: str
    description: str
    order: int
    module_id: int
    content: str
    video_url: Optional[str]
    learning_objectives: List[LearningObjective]
    key_concepts: List[ConceptReference]
    practice_exercises: List[PracticeExercise]
    additional_resources: List[ResourceLink]
    accessibility_notes: Dict[str, str] = {
        "language_level": "clear and direct",
        "visual_alternatives": "provided for all images",
        "interaction_methods": "keyboard and mouse",
        "estimated_duration": "30 minutes",
    }
    ai_tutor_prompts: List[str] = [
        "Can you explain {concept} in simpler terms?",
        "How does {concept} relate to what we learned before?",
        "Can you show me a step-by-step example of {concept}?",
        "What are common mistakes to avoid with {concept}?",
    ]

class SampleModule(BaseModel):
    """Module containing multiple lessons"""
    id: int
    title: str
    description: str
    order: int
    course_id: int
    lessons: List[SampleLesson]
    prerequisites: List[str]
    learning_path: List[str]
    module_objectives: List[str]

class SampleCourse(BaseModel):
    """Complete course structure with metadata"""
    id: int
    title: str
    description: str
    category_id: int
    modules: List[SampleModule]
    target_audience: List[str]
    prerequisites: List[str]
    learning_outcomes: List[str]
    estimated_duration: str
    difficulty_level: str
    accessibility_features: List[str]
    support_resources: List[ResourceLink] 
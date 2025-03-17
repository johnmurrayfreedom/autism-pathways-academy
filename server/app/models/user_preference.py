from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.db.session import Base

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    theme = Column(String, default="light")
    notifications_enabled = Column(Boolean, default=True)
    accessibility_settings = Column(JSON, default={})
    learning_style = Column(String, nullable=True)
    communication_preference = Column(String, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="preferences") 
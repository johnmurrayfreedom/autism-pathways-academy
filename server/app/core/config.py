from pydantic import BaseSettings, validator
from typing import List, Optional, Union, Dict, Any
import secrets
from dotenv import load_dotenv
import os

# Load environment variables from .env file or .env.demo if .env doesn't exist
if os.path.exists(".env"):
    load_dotenv()
elif os.path.exists(".env.demo"):
    load_dotenv(".env.demo")

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 7 days = 7 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    SERVER_NAME: str = "Autism Pathways Academy"
    SERVER_HOST: str = "localhost"
    
    # BACKEND_CORS_ORIGINS is a comma-separated list of origins
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost", "http://localhost:3000"]

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Database settings - support both PostgreSQL and SQLite
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "autism_pathways"
    
    # Support direct configuration via DATABASE_URL or SQLALCHEMY_DATABASE_URI
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> str:
        if isinstance(v, str):
            return v
        
        # Check if we have a direct DATABASE_URL setting
        database_url = os.getenv("DATABASE_URL")
        if database_url:
            return database_url
            
        # If not, try to build PostgreSQL connection string
        try:
            return f"postgresql://{values.get('POSTGRES_USER')}:{values.get('POSTGRES_PASSWORD')}@{values.get('POSTGRES_SERVER')}/{values.get('POSTGRES_DB')}"
        except Exception:
            # Fallback to SQLite for development
            return "sqlite:///./test.db"
    
    # OpenAI API or Anthropic API settings
    OPENAI_API_KEY: Optional[str] = None
    AI_MODEL: str = "gpt-4"  # or "claude-2" if using Anthropic
    
    # First superuser
    FIRST_SUPERUSER_EMAIL: str = "admin@example.com"
    FIRST_SUPERUSER_PASSWORD: str = "admin123"
    
    # Email settings if needed
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = None
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = None
    EMAILS_FROM_NAME: Optional[str] = None

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings() 
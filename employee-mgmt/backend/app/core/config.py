from pydantic_settings import BaseSettings
from pydantic import AnyUrl
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "Employee Management API"
    API_V1_PREFIX: str = "/api/v1"
    BACKEND_CORS_ORIGINS: str = "*"  # comma-separated or '*'

    # MySQL DSN like: mysql+mysqlconnector://user:pass@host:3306/dbname
    SQLALCHEMY_DATABASE_URI: str

    DEBUG: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
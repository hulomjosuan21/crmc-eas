import os
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, "../.env.local")

# Debug: Uncomment this to see exactly where it is looking if it still fails
# print(f"Loading .env from: {ENV_PATH}")

class Settings(BaseSettings):
    PROJECT_NAME: str = "CRMC-EAS Backend"
    DEBUG: bool = True
    DATABASE_URL: str

    FILES_STORAGE_PATH: str = "uploads"
    FILES_STATIC_URL: str = "/static"

    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    RQ_QUEUE_NAME: str = "default"

    GOOGLE_CLIENT_ID: str = os.getenv("YOUR_GOOGLE_CLIENT_ID_HERE", "YOUR_GOOGLE_CLIENT_ID_HERE")
    GOOGLE_CLIENT_SECRET: str = os.getenv("YOUR_GOOGLE_CLIENT_SECRET_HERE", "YOUR_GOOGLE_CLIENT_SECRET_HERE")
    
    model_config = SettingsConfigDict(
        env_file=ENV_PATH,
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
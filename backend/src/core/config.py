import os
from typing import List
import json
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "../data")
PERMISSIONS_FILE = os.path.join(DATA_DIR, "route-permissions.json")
STUDENT_SCHOOL_DB = os.path.join(DATA_DIR, "fake_school_db.json")
ENV_PATH = os.path.join(BASE_DIR, "../.env.local")

# Debug: Uncomment this to see exactly where it is looking if it still fails
# print(f"Loading .env from: {ENV_PATH}")

def load_permission_values() -> List[str]:
    try:
        if os.path.exists(PERMISSIONS_FILE):
            with open(PERMISSIONS_FILE, "r") as f:
                data = json.load(f)
                return [item["value"] for item in data if "value" in item]
        print(f"Warning: Permissions file not found at {PERMISSIONS_FILE}")
        return []
    except Exception as e:
        print(f"Error loading permissions: {e}")
        return []

class Settings(BaseSettings):
    PROJECT_NAME: str = "CRMC-EAS Backend"
    DEBUG: bool = True
    DATABASE_URL: str

    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "THIS_IS_A_VERY_LONG_AND_SECURE_DEFAULT_SECRET_KEY_NEVER_USE_IN_PRODUCTION"
    )

    _all_permissions: List[str] = load_permission_values()
    def get_permission_values(self, exclude: List[str] = None) -> List[str]:
        if exclude is None:
            exclude = []
        return [p for p in self._all_permissions if p not in exclude]

    FILES_STORAGE_PATH: str = "uploads"
    FILES_STATIC_URL: str = "/static"

    CLIENT_WEB_URL: str = os.getenv("CLIENT_WEB_URL", "YOUR_CLIENT_WEB_URL_HERE")
    CLIENT_MOBILE_SCHEMA: str = os.getenv("CLIENT_MOBILE_SCHEMA", "YOUR_CLIENT_MOBILE_SCHEMA_HERE")

    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    RQ_QUEUE_NAME: str = "default"

    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "YOUR_GOOGLE_CLIENT_ID_HERE")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "YOUR_GOOGLE_CLIENT_SECRET_HERE")
    
    model_config = SettingsConfigDict(
        env_file=ENV_PATH,
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    frontend_url: str
    redis_url: str
    youtube_api_key: str
    groq_api_key: str
    google_api_key: str
    
    model_config = SettingsConfigDict(env_file=".env")
    
class YoutubeVideo(BaseModel):
    url: str

class Task(BaseModel):
    task_id: str
    
class AnalyzedComment(BaseModel):
    id: str
    category: str
    reasoning: str
    
class TaskStatus(BaseModel):
    task_id: str
    status: str
    data: dict
    

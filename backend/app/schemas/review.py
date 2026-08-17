from datetime import datetime
from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    content: str = Field(min_length=1, max_length=5000)


class ReviewUpdate(BaseModel):
    content: str = Field(min_length=1, max_length=5000)


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    movie_id: int
    content: str
    username: str
    created_at: datetime
    updated_at: datetime

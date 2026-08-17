from datetime import datetime
from pydantic import BaseModel, Field


class RatingCreate(BaseModel):
    value: int = Field(ge=1, le=10)


class RatingResponse(BaseModel):
    id: int
    user_id: int
    movie_id: int
    value: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

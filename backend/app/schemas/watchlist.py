from datetime import datetime
from pydantic import BaseModel


class WatchlistResponse(BaseModel):
    id: int
    movie_id: int
    created_at: datetime

    model_config = {"from_attributes": True}

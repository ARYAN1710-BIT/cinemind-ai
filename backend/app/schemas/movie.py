from pydantic import BaseModel


class Movie(BaseModel):
    id: int
    title: str
    rating: float | None = None
    poster: str | None = None
    backdrop: str | None = None
    overview: str | None = None
    releaseDate: str | None = None

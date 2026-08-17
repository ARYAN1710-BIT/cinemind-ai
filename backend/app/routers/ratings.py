from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.core.dependencies import CurrentUser, DBSession
from app.models.rating import Rating
from app.schemas.rating import RatingCreate, RatingResponse

router = APIRouter()


@router.post("/{movie_id}", response_model=RatingResponse, status_code=status.HTTP_201_CREATED)
def create_rating(movie_id: int, data: RatingCreate, current_user: CurrentUser, db: DBSession):
    existing = db.scalar(
        select(Rating).where(
            Rating.user_id == current_user.id,
            Rating.movie_id == movie_id,
        )
    )
    if existing:
        existing.value = data.value
        db.commit()
        db.refresh(existing)
        return existing

    rating = Rating(user_id=current_user.id, movie_id=movie_id, value=data.value)
    db.add(rating)
    db.commit()
    db.refresh(rating)
    return rating


@router.get("/{movie_id}", response_model=list[RatingResponse])
def get_ratings(movie_id: int, db: DBSession):
    return list(db.scalars(select(Rating).where(Rating.movie_id == movie_id)))


@router.put("/{movie_id}", response_model=RatingResponse)
def update_rating(movie_id: int, data: RatingCreate, current_user: CurrentUser, db: DBSession):
    rating = db.scalar(
        select(Rating).where(
            Rating.user_id == current_user.id,
            Rating.movie_id == movie_id,
        )
    )
    if not rating:
        raise HTTPException(status_code=404, detail="Rating not found")

    rating.value = data.value
    db.commit()
    db.refresh(rating)
    return rating


@router.delete("/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rating(movie_id: int, current_user: CurrentUser, db: DBSession):
    rating = db.scalar(
        select(Rating).where(
            Rating.user_id == current_user.id,
            Rating.movie_id == movie_id,
        )
    )
    if not rating:
        raise HTTPException(status_code=404, detail="Rating not found")

    db.delete(rating)
    db.commit()

from fastapi import APIRouter, HTTPException
from sqlalchemy import func, select

from app.core.dependencies import CurrentUser, DBSession
from app.models.favorite import Favorite
from app.models.rating import Rating
from app.models.review import Review
from app.models.user import User
from app.models.watchlist import Watchlist
from app.schemas.user import ProfileResponse, UserStats, UserUpdate

router = APIRouter()


@router.get("/me", response_model=ProfileResponse)
def get_profile(current_user: CurrentUser, db: DBSession):
    stats = UserStats(
        favorites_count=db.scalar(
            select(func.count(Favorite.id)).where(
                Favorite.user_id == current_user.id
            )
        ) or 0,
        watchlist_count=db.scalar(
            select(func.count(Watchlist.id)).where(
                Watchlist.user_id == current_user.id
            )
        ) or 0,
        ratings_count=db.scalar(
            select(func.count(Rating.id)).where(
                Rating.user_id == current_user.id
            )
        ) or 0,
        reviews_count=db.scalar(
            select(func.count(Review.id)).where(
                Review.user_id == current_user.id
            )
        ) or 0,
    )

    return ProfileResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        created_at=current_user.created_at,
        stats=stats,
    )


@router.put("/me", response_model=ProfileResponse)
def update_profile(data: UserUpdate, current_user: CurrentUser, db: DBSession):
    if data.username is not None and data.username != current_user.username:
        if db.scalar(select(User).where(User.username == data.username)):
            raise HTTPException(status_code=409, detail="Username already exists")
        current_user.username = data.username

    if data.email is not None and data.email != current_user.email:
        if db.scalar(select(User).where(User.email == data.email)):
            raise HTTPException(status_code=409, detail="Email already exists")
        current_user.email = data.email

    db.commit()
    db.refresh(current_user)

    return get_profile(current_user, db)

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.core.dependencies import CurrentUser, DBSession
from app.models.watchlist import Watchlist
from app.schemas.watchlist import WatchlistResponse

router = APIRouter()


@router.post("/{movie_id}", response_model=WatchlistResponse, status_code=status.HTTP_201_CREATED)
def add_watchlist(movie_id: int, current_user: CurrentUser, db: DBSession):
    existing = db.scalar(
        select(Watchlist).where(
            Watchlist.user_id == current_user.id,
            Watchlist.movie_id == movie_id,
        )
    )
    if existing:
        raise HTTPException(status_code=409, detail="Movie already in watchlist")

    item = Watchlist(user_id=current_user.id, movie_id=movie_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("", response_model=list[WatchlistResponse])
def get_watchlist(current_user: CurrentUser, db: DBSession):
    return list(
        db.scalars(
            select(Watchlist)
            .where(Watchlist.user_id == current_user.id)
            .order_by(Watchlist.created_at.desc())
        )
    )


@router.delete("/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_watchlist(movie_id: int, current_user: CurrentUser, db: DBSession):
    item = db.scalar(
        select(Watchlist).where(
            Watchlist.user_id == current_user.id,
            Watchlist.movie_id == movie_id,
        )
    )
    if not item:
        raise HTTPException(status_code=404, detail="Watchlist item not found")

    db.delete(item)
    db.commit()

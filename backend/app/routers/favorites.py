from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.core.dependencies import CurrentUser, DBSession
from app.models.favorite import Favorite
from app.schemas.favorite import FavoriteResponse

router = APIRouter()


@router.post("/{movie_id}", response_model=FavoriteResponse, status_code=status.HTTP_201_CREATED)
def add_favorite(movie_id: int, current_user: CurrentUser, db: DBSession):
    existing = db.scalar(
        select(Favorite).where(
            Favorite.user_id == current_user.id,
            Favorite.movie_id == movie_id,
        )
    )
    if existing:
        raise HTTPException(status_code=409, detail="Movie already in favorites")

    item = Favorite(user_id=current_user.id, movie_id=movie_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("", response_model=list[FavoriteResponse])
def get_favorites(current_user: CurrentUser, db: DBSession):
    return list(
        db.scalars(
            select(Favorite)
            .where(Favorite.user_id == current_user.id)
            .order_by(Favorite.created_at.desc())
        )
    )


@router.delete("/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_favorite(movie_id: int, current_user: CurrentUser, db: DBSession):
    item = db.scalar(
        select(Favorite).where(
            Favorite.user_id == current_user.id,
            Favorite.movie_id == movie_id,
        )
    )
    if not item:
        raise HTTPException(status_code=404, detail="Favorite not found")

    db.delete(item)
    db.commit()

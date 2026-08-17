from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.core.dependencies import CurrentUser, DBSession
from app.models.review import Review
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewResponse, ReviewUpdate

router = APIRouter()


def to_response(review: Review) -> ReviewResponse:
    return ReviewResponse(
        id=review.id,
        user_id=review.user_id,
        movie_id=review.movie_id,
        content=review.content,
        username=review.user.username,
        created_at=review.created_at,
        updated_at=review.updated_at,
    )


@router.post("/{movie_id}", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(movie_id: int, data: ReviewCreate, current_user: CurrentUser, db: DBSession):
    review = Review(
        user_id=current_user.id,
        movie_id=movie_id,
        content=data.content,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return to_response(review)


@router.get("/{movie_id}", response_model=list[ReviewResponse])
def get_reviews(movie_id: int, db: DBSession):
    reviews = list(
        db.scalars(
            select(Review)
            .join(User)
            .where(Review.movie_id == movie_id)
            .order_by(Review.created_at.desc())
        )
    )
    return [to_response(review) for review in reviews]


@router.put("/{review_id}", response_model=ReviewResponse)
def update_review(
    review_id: int,
    data: ReviewUpdate,
    current_user: CurrentUser,
    db: DBSession,
):
    review = db.get(Review, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only edit your own review")

    review.content = data.content
    db.commit()
    db.refresh(review)
    return to_response(review)


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(review_id: int, current_user: CurrentUser, db: DBSession):
    review = db.get(Review, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own review")

    db.delete(review)
    db.commit()

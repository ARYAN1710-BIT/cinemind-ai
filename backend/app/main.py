from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db, engine, Base
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.routers import auth, users, movies, favorites, watchlist, ratings, reviews

app = FastAPI(
    title="CineMind AI API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(movies.router, prefix="/api/movies", tags=["Movies"])
app.include_router(favorites.router, prefix="/api/favorites", tags=["Favorites"])
app.include_router(watchlist.router, prefix="/api/watchlist", tags=["Watchlist"])
app.include_router(ratings.router, prefix="/api/ratings", tags=["Ratings"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["Reviews"])

Base.metadata.create_all(bind=engine)
@app.get("/")
def root():
    return {"message": "CineMind AI Backend is running"}


@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/db-check")
def db_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"database": "connected"}
    except Exception as e:
        return {"database": "failed", "error": str(e)}
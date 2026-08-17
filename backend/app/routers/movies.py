from fastapi import APIRouter, HTTPException, Query

from app.schemas.movie import Movie
from app.services.tmdb_service import TMDBService

router = APIRouter()
tmdb = TMDBService()


@router.get("/trending", response_model=list[Movie])
async def trending():
    return await tmdb.get_trending_movies()


@router.get("/popular", response_model=list[Movie])
async def popular():
    return await tmdb.get_popular_movies()


@router.get("/top-rated", response_model=list[Movie])
async def top_rated():
    return await tmdb.get_top_rated_movies()


@router.get("/upcoming", response_model=list[Movie])
async def upcoming():
    return await tmdb.get_upcoming_movies()


@router.get("/search", response_model=list[Movie])
async def search(query: str = Query(min_length=1)):
    return await tmdb.search_movies(query)


@router.get("/{movie_id}", response_model=Movie)
async def details(movie_id: int):
    try:
        return await tmdb.get_movie_details(movie_id)
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Unable to fetch movie details") from exc

import asyncio
import httpx

from app.core.config import settings


class TMDBService:
    BASE_URL = "https://api.themoviedb.org/3"
    IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"
    BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280"

    def __init__(self):
        self.headers = {
            "Authorization": f"Bearer {settings.TMDB_API_TOKEN}",
            "accept": "application/json",
        }

        self.client = httpx.AsyncClient(
            timeout=30.0,
            trust_env=False,
            limits=httpx.Limits(
                max_connections=10,
                max_keepalive_connections=5,
            ),
        )

    def _map_movie(self, movie: dict) -> dict:
        return {
            "id": movie.get("id"),
            "title": movie.get("title"),
            "rating": movie.get("vote_average"),
            "poster": (
                f"{self.IMAGE_BASE_URL}{movie['poster_path']}"
                if movie.get("poster_path")
                else None
            ),
            "backdrop": (
                f"{self.BACKDROP_BASE_URL}{movie['backdrop_path']}"
                if movie.get("backdrop_path")
                else None
            ),
            "overview": movie.get("overview"),
            "releaseDate": movie.get("release_date"),
            "runtime": movie.get("runtime"),
            "genres": movie.get("genres", []),
        }

    async def _get(
        self,
        endpoint: str,
        params: dict | None = None
    ) -> dict:

        url = f"{self.BASE_URL}{endpoint}"

        for attempt in range(3):
            try:
                response = await self.client.get(
                    url,
                    headers=self.headers,
                    params=params,
                )

                response.raise_for_status()

                return response.json()

            except (httpx.ConnectError, httpx.ConnectTimeout):

                if attempt == 2:
                    raise

                await asyncio.sleep(1)

    async def get_trending_movies(self):
        data = await self._get("/trending/movie/week")

        return [
            self._map_movie(movie)
            for movie in data.get("results", [])
        ]

    async def get_popular_movies(self):
        data = await self._get("/movie/popular")

        return [
            self._map_movie(movie)
            for movie in data.get("results", [])
        ]

    async def get_top_rated_movies(self):
        data = await self._get("/movie/top_rated")

        return [
            self._map_movie(movie)
            for movie in data.get("results", [])
        ]

    async def get_upcoming_movies(self):
        data = await self._get("/movie/upcoming")

        return [
            self._map_movie(movie)
            for movie in data.get("results", [])
        ]

    async def search_movies(self, query: str):
        data = await self._get(
            "/search/movie",
            {"query": query}
        )

        return [
            self._map_movie(movie)
            for movie in data.get("results", [])
        ]

    async def get_movie_details(self, movie_id: int):
        movie = await self._get(f"/movie/{movie_id}")

        return self._map_movie(movie)
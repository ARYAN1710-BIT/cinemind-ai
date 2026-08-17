# CineMind AI FastAPI Backend

## 1. Create the MySQL database

```sql
CREATE DATABASE cinemind_db;
```

## 2. Create the environment file

Copy `.env.example` to `.env` and fill in:

- MySQL password
- TMDB API read access token
- a strong JWT secret

## 3. Install packages

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## 4. Run migrations

```bash
alembic upgrade head
```

## 5. Start the API

```bash
uvicorn app.main:app --reload
```

Swagger:
http://127.0.0.1:8000/docs

## Movie endpoints

- GET /api/movies/trending
- GET /api/movies/popular
- GET /api/movies/top-rated
- GET /api/movies/upcoming
- GET /api/movies/search?query=Batman
- GET /api/movies/{movie_id}

## Authentication

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

Use the returned access token in Swagger's Authorize button as:

`Bearer YOUR_TOKEN`

## User features

- GET /api/users/me
- PUT /api/users/me
- GET /api/favorites
- POST /api/favorites/{movie_id}
- DELETE /api/favorites/{movie_id}
- GET /api/watchlist
- POST /api/watchlist/{movie_id}
- DELETE /api/watchlist/{movie_id}
- GET /api/ratings/{movie_id}
- POST /api/ratings/{movie_id}
- PUT /api/ratings/{movie_id}
- DELETE /api/ratings/{movie_id}
- GET /api/reviews/{movie_id}
- POST /api/reviews/{movie_id}
- PUT /api/reviews/{review_id}
- DELETE /api/reviews/{review_id}

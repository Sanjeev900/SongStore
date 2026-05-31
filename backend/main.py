"""FastAPI application with song dashboard routes."""

import json
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

import database
from dto.song_dto import (
    HealthResponse,
    PaginatedSongsResponse,
    RatingResponse,
    RatingUpdate,
    Song,
)
from repositories.song_repository import SongRepository
from services.song_service import SongService


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database and seed data on startup."""
    database.init_db()
    data_path = Path(__file__).parent / "data.json"
    if data_path.exists():
        with open(data_path) as f:
            raw = json.load(f)
        service = SongService(repository=SongRepository(db_path=database.DB_PATH))
        service.seed_if_empty(raw)
    else:
        print("WARNING: data.json not found.")
    yield


app = FastAPI(title="Song Dashboard API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Dependency injection factories ---

def get_repository() -> SongRepository:
    """Provide a SongRepository instance (overridable in tests)."""
    return SongRepository(db_path=database.DB_PATH)


def get_service(
    repository: SongRepository = Depends(get_repository),
) -> SongService:
    """Provide a SongService instance via DI."""
    return SongService(repository=repository)


@app.get("/", response_model=HealthResponse)
def health_check() -> HealthResponse:
    """Health check endpoint."""
    return HealthResponse(status="ok", message="Song Dashboard API is running")


@app.get("/songs", response_model=PaginatedSongsResponse)
def get_songs(
    cursor: int = Query(default=0),
    limit: int = Query(default=10, ge=1, le=100),
    service: SongService = Depends(get_service),
) -> PaginatedSongsResponse:
    """Get paginated songs."""
    result = service.get_page(cursor, limit)
    return PaginatedSongsResponse(**result)


@app.get("/songs/all", response_model=list[Song])
def get_all_songs(
    service: SongService = Depends(get_service),
) -> list[Song]:
    """Get all songs."""
    songs = service.get_all()
    return [Song(**s) for s in songs]


@app.get("/songs/search", response_model=Song)
def search_song(
    title: str = Query(...),
    service: SongService = Depends(get_service),
) -> Song:
    """Search for a song by exact title (case-insensitive)."""
    song = service.search_by_title(title)
    if song is None:
        raise HTTPException(status_code=404, detail="Song not found.")
    return Song(**song)


@app.patch("/songs/{song_id}/rating", response_model=RatingResponse)
def update_rating(
    song_id: str,
    body: RatingUpdate,
    service: SongService = Depends(get_service),
) -> RatingResponse:
    """Update song rating."""
    success = service.rate_song(song_id, body.rating)
    if not success:
        raise HTTPException(status_code=404, detail="Song not found.")
    return RatingResponse(song_id=song_id, rating=body.rating, success=True)

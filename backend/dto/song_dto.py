"""Pydantic DTOs for strict API response/request contracts."""

from typing import Optional

from pydantic import BaseModel, Field


class Song(BaseModel):
    """Song response model."""

    idx: int
    id: str
    title: str
    danceability: Optional[float] = None
    energy: Optional[float] = None
    key: Optional[int] = None
    loudness: Optional[float] = None
    mode: Optional[int] = None
    acousticness: Optional[float] = None
    instrumentalness: Optional[float] = None
    liveness: Optional[float] = None
    valence: Optional[float] = None
    tempo: Optional[float] = None
    duration_ms: Optional[int] = None
    time_signature: Optional[int] = None
    num_bars: Optional[int] = None
    num_sections: Optional[int] = None
    num_segments: Optional[int] = None
    star_rating: int = 0


class PaginatedSongsResponse(BaseModel):
    """Paginated songs response model."""

    data: list[Song]
    next_cursor: Optional[int] = None
    has_more: bool
    total: int


class RatingUpdate(BaseModel):
    """Rating update request model."""

    rating: int = Field(..., ge=1, le=5)


class RatingResponse(BaseModel):
    """Rating update response model."""

    song_id: str
    rating: int
    success: bool


class HealthResponse(BaseModel):
    """Health check response model."""

    status: str
    message: str

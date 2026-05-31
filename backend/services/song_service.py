"""Service layer for song business logic."""

from adapters.columnar_json_adapter import ColumnarJsonAdapter
from factories.song_factory import SongFactory
from repositories.song_repository import SongRepository


class SongService:
    """Encapsulates business logic. No SQL allowed."""

    def __init__(self, repository: SongRepository) -> None:
        self._repository = repository

    def seed_if_empty(self, raw: dict) -> None:
        """If repository empty: adapter -> factory -> insert_many."""
        if self._repository.is_empty():
            flat_rows = ColumnarJsonAdapter.to_rows(raw)
            db_rows = SongFactory.build_rows(flat_rows)
            self._repository.insert_many(db_rows)

    def get_page(self, cursor: int, limit: int = 10) -> dict:
        """
        Get a paginated page of songs.

        Returns dict with data, next_cursor, has_more, total.
        """
        raw_rows = self._repository.find_page(cursor, limit)
        data = raw_rows[:limit]
        has_more = len(raw_rows) > limit
        next_cursor = data[-1]["idx"] if has_more and data else None
        total = self._repository.count()

        return {
            "data": data,
            "next_cursor": next_cursor,
            "has_more": has_more,
            "total": total,
        }

    def get_all(self) -> list[dict]:
        """Return all songs."""
        return self._repository.find_all()

    def search_by_title(self, title: str) -> dict | None:
        """Search for a song by exact title (case-insensitive)."""
        return self._repository.find_by_title(title)

    def rate_song(self, song_id: str, rating: int) -> bool:
        """Update rating for a song. Returns True if successful."""
        return self._repository.update_rating(song_id, rating)

"""Repository for all song database operations."""

import sqlite3


class SongRepository:
    """Encapsulates ALL SQL/database access for songs."""

    def __init__(self, db_path: str) -> None:
        self._db_path = db_path

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self._db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def is_empty(self) -> bool:
        """Check if songs table has no rows."""
        with self._connect() as conn:
            cursor = conn.execute("SELECT COUNT(*) as cnt FROM songs")
            row = cursor.fetchone()
            return row["cnt"] == 0

    def count(self) -> int:
        """Return total number of songs."""
        with self._connect() as conn:
            cursor = conn.execute("SELECT COUNT(*) as cnt FROM songs")
            row = cursor.fetchone()
            return row["cnt"]

    def insert_many(self, rows: list[dict]) -> None:
        """INSERT OR IGNORE using executemany. Must call conn.commit()."""
        with self._connect() as conn:
            conn.executemany(
                """
                INSERT OR IGNORE INTO songs (
                    idx, id, title, danceability, energy, key, loudness,
                    mode, acousticness, instrumentalness, liveness,
                    valence, tempo, duration_ms, time_signature,
                    num_bars, num_sections, num_segments, star_rating
                ) VALUES (
                    :idx, :id, :title, :danceability, :energy, :key,
                    :loudness, :mode, :acousticness, :instrumentalness,
                    :liveness, :valence, :tempo, :duration_ms,
                    :time_signature, :num_bars, :num_sections,
                    :num_segments, :star_rating
                )
                """,
                rows,
            )
            conn.commit()

    def find_page(self, cursor: int, limit: int) -> list[dict]:
        """
        Fetch a page of songs using cursor-based pagination.

        Returns limit+1 rows to determine if there are more pages.
        """
        limit_plus_one = limit + 1
        with self._connect() as conn:
            result = conn.execute(
                """
                SELECT *
                FROM songs
                WHERE idx > :cursor
                ORDER BY idx ASC
                LIMIT :limit_plus_one
                """,
                {"cursor": cursor, "limit_plus_one": limit_plus_one},
            )
            return [dict(row) for row in result.fetchall()]

    def find_all(self) -> list[dict]:
        """Return all songs ordered by idx."""
        with self._connect() as conn:
            result = conn.execute("SELECT * FROM songs ORDER BY idx ASC")
            return [dict(row) for row in result.fetchall()]

    def find_by_title(self, title: str) -> dict | None:
        """Case-insensitive exact title match."""
        with self._connect() as conn:
            result = conn.execute(
                "SELECT * FROM songs WHERE LOWER(title) = LOWER(:title)",
                {"title": title},
            )
            row = result.fetchone()
            return dict(row) if row else None

    def update_rating(self, song_id: str, rating: int) -> bool:
        """Update star_rating for a song. Return True if row was updated."""
        with self._connect() as conn:
            cursor = conn.execute(
                "UPDATE songs SET star_rating = :rating WHERE id = :song_id",
                {"rating": rating, "song_id": song_id},
            )
            conn.commit()
            return cursor.rowcount > 0

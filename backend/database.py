"""Database connection management and schema creation."""

import os
import sqlite3
from pathlib import Path

_env_db = os.environ.get("DB_PATH")

if _env_db:
    DB_PATH = _env_db
else:
    # if /data is writable (container volume), use it; otherwise use project-local DB
    candidate = Path("/data") / "songs.db"
    try:
        candidate.parent.mkdir(parents=True, exist_ok=True)
        # try opening for write to ensure it's usable
        with open(candidate, "ab"):
            pass
        DB_PATH = str(candidate)
    except Exception:
        DB_PATH = str(Path(__file__).parent / "songs.db")


def get_connection(db_path: str = DB_PATH) -> sqlite3.Connection:
    """Return sqlite connection with row_factory = sqlite3.Row."""
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(db_path: str = DB_PATH) -> None:
    """Create schema + indexes if not existing. Called once on startup."""
    # ensure parent dir exists to avoid sqlite "unable to open database file"
    parent = Path(db_path).parent
    try:
        parent.mkdir(parents=True, exist_ok=True)
    except Exception:
        # best-effort; if this fails, sqlite will raise a useful error
        pass
    conn = get_connection(db_path)
    try:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS songs (
                idx               INTEGER PRIMARY KEY,
                id                TEXT NOT NULL UNIQUE,
                title             TEXT NOT NULL,
                danceability      REAL,
                energy            REAL,
                key               INTEGER,
                loudness          REAL,
                mode              INTEGER,
                acousticness      REAL,
                instrumentalness  REAL,
                liveness          REAL,
                valence           REAL,
                tempo             REAL,
                duration_ms       INTEGER,
                time_signature    INTEGER,
                num_bars          INTEGER,
                num_sections      INTEGER,
                num_segments      INTEGER,
                star_rating       INTEGER DEFAULT 0
            );
        """)
        conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_songs_title
            ON songs(LOWER(title));
        """)
        conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_songs_idx
            ON songs(idx);
        """)
        conn.commit()
    finally:
        conn.close()

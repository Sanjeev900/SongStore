"""Test fixtures for backend API tests."""

import sys
import tempfile
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

import database
from repositories.song_repository import SongRepository
from services.song_service import SongService


SAMPLE_DATA = {
    "id": {
        "0": "song_id_0",
        "1": "song_id_1",
        "2": "song_id_2",
        "3": "song_id_3",
        "4": "song_id_4",
        "5": "song_id_5",
        "6": "song_id_6",
        "7": "song_id_7",
        "8": "song_id_8",
        "9": "song_id_9",
        "10": "song_id_10",
        "11": "song_id_11",
    },
    "title": {
        "0": "Alpha Song",
        "1": "Beta Track",
        "2": "Charlie Beat",
        "3": "Delta Rhythm",
        "4": "Echo Melody",
        "5": "Foxtrot Tune",
        "6": "Golf Harmony",
        "7": "Hotel Groove",
        "8": "India Jam",
        "9": "Juliet Ballad",
        "10": "Kilo Anthem",
        "11": "Lima Chorus",
    },
    "danceability": {
        "0": 0.7, "1": 0.6, "2": 0.8, "3": 0.5,
        "4": 0.9, "5": 0.4, "6": 0.75, "7": 0.65,
        "8": 0.55, "9": 0.85, "10": 0.72, "11": 0.48,
    },
    "energy": {
        "0": 0.5, "1": 0.8, "2": 0.6, "3": 0.7,
        "4": 0.9, "5": 0.3, "6": 0.82, "7": 0.71,
        "8": 0.62, "9": 0.88, "10": 0.79, "11": 0.55,
    },
    "key": {
        "0": 7, "1": 5, "2": 0, "3": 2,
        "4": 11, "5": 4, "6": 9, "7": 1,
        "8": 6, "9": 3, "10": 10, "11": 8,
    },
    "loudness": {
        "0": -7.0, "1": -4.5, "2": -6.0, "3": -5.5,
        "4": -3.0, "5": -9.0, "6": -4.8, "7": -6.3,
        "8": -5.2, "9": -4.1, "10": -3.8, "11": -7.9,
    },
    "mode": {
        "0": 1, "1": 0, "2": 1, "3": 1,
        "4": 0, "5": 1, "6": 0, "7": 1,
        "8": 0, "9": 1, "10": 1, "11": 0,
    },
    "acousticness": {
        "0": 0.24, "1": 0.01, "2": 0.45, "3": 0.09,
        "4": 0.03, "5": 0.68, "6": 0.02, "7": 0.31,
        "8": 0.14, "9": 0.07, "10": 0.05, "11": 0.52,
    },
    "instrumentalness": {
        "0": 0.0, "1": 0.001, "2": 0.0, "3": 0.005,
        "4": 0.0, "5": 0.0, "6": 0.008, "7": 0.0,
        "8": 0.012, "9": 0.0, "10": 0.0, "11": 0.002,
    },
    "liveness": {
        "0": 0.12, "1": 0.35, "2": 0.1, "3": 0.23,
        "4": 0.57, "5": 0.09, "6": 0.41, "7": 0.18,
        "8": 0.27, "9": 0.35, "10": 0.49, "11": 0.16,
    },
    "valence": {
        "0": 0.45, "1": 0.68, "2": 0.53, "3": 0.79,
        "4": 0.91, "5": 0.23, "6": 0.82, "7": 0.57,
        "8": 0.44, "9": 0.71, "10": 0.83, "11": 0.31,
    },
    "tempo": {
        "0": 105.0, "1": 128.0, "2": 80.0, "3": 112.0,
        "4": 145.0, "5": 72.0, "6": 132.0, "7": 98.0,
        "8": 118.0, "9": 140.0, "10": 135.0, "11": 88.0,
    },
    "duration_ms": {
        "0": 234000, "1": 198000, "2": 267000, "3": 212000,
        "4": 189000, "5": 298000, "6": 201000, "7": 245000,
        "8": 223000, "9": 178000, "10": 256000, "11": 312000,
    },
    "time_signature": {
        "0": 4, "1": 4, "2": 4, "3": 4,
        "4": 4, "5": 3, "6": 4, "7": 4,
        "8": 4, "9": 4, "10": 4, "11": 4,
    },
    "num_bars": {
        "0": 89, "1": 102, "2": 76, "3": 95,
        "4": 112, "5": 68, "6": 98, "7": 84,
        "8": 91, "9": 108, "10": 104, "11": 72,
    },
    "num_sections": {
        "0": 10, "1": 12, "2": 8, "3": 11,
        "4": 14, "5": 7, "6": 13, "7": 9,
        "8": 10, "9": 12, "10": 11, "11": 8,
    },
    "num_segments": {
        "0": 456, "1": 523, "2": 389, "3": 478,
        "4": 567, "5": 312, "6": 501, "7": 423,
        "8": 445, "9": 534, "10": 512, "11": 367,
    },
}


@pytest.fixture
def test_db():
    """Create a temporary database for testing."""
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as f:
        db_path = f.name

    database.init_db(db_path)
    yield db_path

    import os
    try:
        os.unlink(db_path)
    except PermissionError:
        pass


@pytest.fixture
def seeded_db(test_db):
    """Create a seeded test database."""
    repo = SongRepository(db_path=test_db)
    service = SongService(repository=repo)
    service.seed_if_empty(SAMPLE_DATA)
    return test_db


@pytest.fixture
def client(seeded_db):
    """Create a test client with seeded database."""
    import main

    # Override dependencies via FastAPI's dependency_overrides
    test_repo = SongRepository(db_path=seeded_db)
    test_service = SongService(repository=test_repo)

    main.app.dependency_overrides[main.get_repository] = lambda: test_repo
    main.app.dependency_overrides[main.get_service] = lambda: test_service

    yield TestClient(main.app)

    main.app.dependency_overrides.clear()

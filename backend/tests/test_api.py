"""API integration tests for the Song Dashboard backend."""

import pytest


class TestHealthEndpoint:
    """Tests for GET /."""

    def test_health_check(self, client):
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "message" in data


class TestPaginationEndpoint:
    """Tests for GET /songs."""

    def test_first_page_returns_10_songs(self, client):
        response = client.get("/songs?cursor=-1&limit=10")
        assert response.status_code == 200
        data = response.json()
        assert len(data["data"]) == 10
        assert data["has_more"] is True
        assert data["total"] == 12
        assert data["next_cursor"] is not None

    def test_second_page_returns_remaining(self, client):
        # First page
        first = client.get("/songs?cursor=-1&limit=10").json()
        next_cursor = first["next_cursor"]

        # Second page
        response = client.get(f"/songs?cursor={next_cursor}&limit=10")
        assert response.status_code == 200
        data = response.json()
        assert len(data["data"]) == 2
        assert data["has_more"] is False
        assert data["next_cursor"] is None
        assert data["total"] == 12

    def test_cursor_minus_one_starts_at_beginning(self, client):
        response = client.get("/songs?cursor=-1&limit=10")
        data = response.json()
        assert data["data"][0]["idx"] == 0

    def test_pagination_order_ascending(self, client):
        response = client.get("/songs?cursor=-1&limit=10")
        data = response.json()
        idxs = [song["idx"] for song in data["data"]]
        assert idxs == sorted(idxs)

    def test_default_star_rating_is_zero(self, client):
        response = client.get("/songs?cursor=-1&limit=10")
        data = response.json()
        for song in data["data"]:
            assert song["star_rating"] == 0

    def test_limit_zero_rejected(self, client):
        response = client.get("/songs?cursor=-1&limit=0")
        assert response.status_code == 422

    def test_limit_negative_rejected(self, client):
        response = client.get("/songs?cursor=-1&limit=-5")
        assert response.status_code == 422

    def test_limit_exceeds_max_rejected(self, client):
        response = client.get("/songs?cursor=-1&limit=101")
        assert response.status_code == 422

    def test_limit_at_max_accepted(self, client):
        response = client.get("/songs?cursor=-1&limit=100")
        assert response.status_code == 200

    def test_numeric_types_correct(self, client):
        response = client.get("/songs?cursor=-1&limit=10")
        data = response.json()
        song = data["data"][0]
        assert isinstance(song["idx"], int)
        assert isinstance(song["id"], str)
        assert isinstance(song["title"], str)
        assert isinstance(song["danceability"], float)
        assert isinstance(song["energy"], float)
        assert isinstance(song["key"], int)
        assert isinstance(song["loudness"], float)
        assert isinstance(song["mode"], int)
        assert isinstance(song["duration_ms"], int)
        assert isinstance(song["star_rating"], int)


class TestGetAllEndpoint:
    """Tests for GET /songs/all."""

    def test_returns_all_12_songs(self, client):
        response = client.get("/songs/all")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 12

    def test_songs_ordered_by_idx(self, client):
        response = client.get("/songs/all")
        data = response.json()
        idxs = [song["idx"] for song in data]
        assert idxs == list(range(12))


class TestSearchEndpoint:
    """Tests for GET /songs/search."""

    def test_search_exact_match(self, client):
        response = client.get("/songs/search?title=Alpha Song")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Alpha Song"
        assert data["id"] == "song_id_0"

    def test_search_case_insensitive(self, client):
        response = client.get("/songs/search?title=alpha song")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Alpha Song"

    def test_search_uppercase(self, client):
        response = client.get("/songs/search?title=BETA TRACK")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Beta Track"

    def test_search_not_found(self, client):
        response = client.get("/songs/search?title=Nonexistent Song")
        assert response.status_code == 404
        data = response.json()
        assert data["detail"] == "Song not found."

    def test_search_missing_title_param(self, client):
        response = client.get("/songs/search")
        assert response.status_code == 422


class TestRatingEndpoint:
    """Tests for PATCH /songs/{song_id}/rating."""

    def test_update_rating_success(self, client):
        response = client.patch(
            "/songs/song_id_0/rating",
            json={"rating": 4},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["song_id"] == "song_id_0"
        assert data["rating"] == 4
        assert data["success"] is True

    def test_rating_persists(self, client):
        client.patch("/songs/song_id_0/rating", json={"rating": 5})
        response = client.get("/songs/search?title=Alpha Song")
        data = response.json()
        assert data["star_rating"] == 5

    def test_rating_not_found(self, client):
        response = client.patch(
            "/songs/nonexistent_id/rating",
            json={"rating": 3},
        )
        assert response.status_code == 404
        data = response.json()
        assert data["detail"] == "Song not found."

    def test_rating_below_minimum(self, client):
        response = client.patch(
            "/songs/song_id_0/rating",
            json={"rating": 0},
        )
        assert response.status_code == 422

    def test_rating_above_maximum(self, client):
        response = client.patch(
            "/songs/song_id_0/rating",
            json={"rating": 6},
        )
        assert response.status_code == 422

    def test_rating_non_integer(self, client):
        response = client.patch(
            "/songs/song_id_0/rating",
            json={"rating": "abc"},
        )
        assert response.status_code == 422


class TestSeedIdempotency:
    """Tests for seed idempotency."""

    def test_seed_does_not_duplicate_rows(self, client, seeded_db):
        from repositories.song_repository import SongRepository
        from services.song_service import SongService
        from tests.conftest import SAMPLE_DATA

        repo = SongRepository(db_path=seeded_db)
        service = SongService(repository=repo)

        # Seed again
        service.seed_if_empty(SAMPLE_DATA)

        assert repo.count() == 12

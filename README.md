# Song Dashboard

A full-stack application for browsing, searching, and rating songs with interactive data visualizations.

## Overview

Song Dashboard is a production-quality web application that provides:
- Paginated song browsing with sortable columns
- Exact title search (case-insensitive)
- Star ratings with optimistic updates
- Interactive charts (scatter plot, histogram, grouped bar)
- CSV export of all song data

## Architecture

```
┌──────────────┐       ┌──────────────┐
│   Frontend   │──────▶│   Backend    │
│   React 18   │  API  │   FastAPI    │
│   Port 3000  │◀──────│   Port 8000  │
└──────────────┘       └──────┬───────┘
                              │
                       ┌──────▼───────┐
                       │    SQLite    │
                       │  /app/songs  │
                       └──────────────┘
```

## Patterns Used

| Pattern | Location | Purpose |
|---------|----------|---------|
| Repository | `repositories/song_repository.py` | Encapsulate all SQL access |
| Service Layer | `services/song_service.py` | Business logic |
| Adapter | `adapters/columnar_json_adapter.py` | Convert columnar JSON to rows |
| Factory | `factories/song_factory.py` | Build DB-ready rows |
| DTO | `dto/song_dto.py` | API contracts via Pydantic |
| Strategy | `utils/sortStrategies.js` | Frontend sorting behavior |
| Custom Hook | `hooks/` | Encapsulate stateful UI logic |

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be available at http://localhost:8000.

### Frontend

```bash
cd frontend
npm install
npm start
```

The app will open at http://localhost:3000.

> The frontend expects the backend to be running on port 8000. If you need a different port, set the `REACT_APP_API_URL` environment variable before starting.

## API Documentation

### GET /
Health check endpoint.

**Response:** `{ "status": "ok", "message": "..." }`

### GET /songs
Paginated songs endpoint.

**Query Parameters:**
- `cursor` (int, default=0): Cursor position for pagination
- `limit` (int, default=10, min=1, max=100): Page size

**Response:**
```json
{
  "data": [...],
  "next_cursor": 9,
  "has_more": true,
  "total": 12
}
```

### GET /songs/all
Returns all songs.

**Response:** Array of Song objects

### GET /songs/search
Search for a song by exact title (case-insensitive).

**Query Parameters:**
- `title` (str, required): Exact song title

**Response:** Song object or 404

### PATCH /songs/{song_id}/rating
Update a song's star rating.

**Body:** `{ "rating": 1-5 }`

**Response:** `{ "song_id": "...", "rating": 4, "success": true }`

## Pagination Walkthrough

1. **First request:** `GET /songs?cursor=-1&limit=10`
   - `WHERE idx > -1` correctly returns songs starting at idx=0
   - Returns first 10 songs + `has_more: true` + `next_cursor: 9`

2. **Next page:** `GET /songs?cursor=9&limit=10`
   - `WHERE idx > 9` returns songs starting at idx=10
   - Returns remaining songs + `has_more: false` + `next_cursor: null`

3. **Frontend tracks** `cursorHistory` array for backward navigation

## Testing

### Backend Tests

```bash
cd backend
pytest tests/ -v
```

### Frontend Tests

```bash
cd frontend
npm test
```

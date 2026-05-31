const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Fetch a paginated page of songs.
 * @param {number} cursor - Cursor position (-1 for first page)
 * @returns {Promise<Object>} Paginated response
 */
export async function fetchSongsPage(cursor = -1) {
  const response = await fetch(`${API_BASE}/songs?cursor=${cursor}&limit=10`);
  if (!response.ok) {
    throw { status: response.status, message: 'Failed to fetch songs page.' };
  }
  return response.json();
}

/**
 * Fetch all songs.
 * @returns {Promise<Array>} All songs
 */
export async function fetchAllSongs() {
  const response = await fetch(`${API_BASE}/songs/all`);
  if (!response.ok) {
    throw { status: response.status, message: 'Failed to fetch all songs.' };
  }
  return response.json();
}

/**
 * Search for a song by exact title.
 * @param {string} title - Exact song title
 * @returns {Promise<Object>} Song object
 */
export async function searchSongByTitle(title) {
  const response = await fetch(
    `${API_BASE}/songs/search?title=${encodeURIComponent(title)}`
  );
  if (!response.ok) {
    throw { status: response.status, message: 'Song not found.' };
  }
  return response.json();
}

/**
 * Update a song's rating.
 * @param {string} songId - Song ID
 * @param {number} rating - Rating value (1-5)
 * @returns {Promise<Object>} Rating response
 */
export async function updateSongRating(songId, rating) {
  const response = await fetch(`${API_BASE}/songs/${songId}/rating`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating }),
  });
  if (!response.ok) {
    throw { status: response.status, message: 'Failed to update rating.' };
  }
  return response.json();
}

import { useState, useCallback } from 'react';
import { searchSongByTitle } from '../services/api';

/**
 * Hook for managing song search by exact title.
 * @returns {Object} Search state and actions
 */
export function useSearch() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (title) => {
    if (!title || !title.trim()) {
      setResult(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const song = await searchSongByTitle(title.trim());
      setResult(song);
    } catch (err) {
      if (err.status === 404) {
        setError('Song not found.');
      } else {
        setError('Search failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, search, clear };
}

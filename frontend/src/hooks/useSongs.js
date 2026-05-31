import { useState, useEffect, useCallback } from 'react';
import { fetchSongsPage, fetchAllSongs, updateSongRating } from '../services/api';

/**
 * Hook for managing paginated songs data with optimistic rating updates.
 * @returns {Object} Songs state and actions
 */
export function useSongs() {
  const [songs, setSongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [cursorHistory, setCursorHistory] = useState([-1]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPage = useCallback(async (cursor) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSongsPage(cursor);
      setSongs(result.data);
      setHasMore(result.has_more);
      setTotal(result.total);
    } catch (err) {
      setError('Failed to load songs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function initialLoad() {
      setLoading(true);
      setError(null);
      try {
        const [pageResult, allResult] = await Promise.all([
          fetchSongsPage(-1),
          fetchAllSongs(),
        ]);
        setSongs(pageResult.data);
        setHasMore(pageResult.has_more);
        setTotal(pageResult.total);
        setAllSongs(allResult);
      } catch (err) {
        setError('Failed to load songs.');
      } finally {
        setLoading(false);
      }
    }
    initialLoad();
  }, []);

  const goToNext = useCallback(() => {
    if (!hasMore || songs.length === 0) return;
    const nextCursor = songs[songs.length - 1].idx;
    setCursorHistory((prev) => [...prev, nextCursor]);
    loadPage(nextCursor);
  }, [hasMore, songs, loadPage]);

  const goToPrev = useCallback(() => {
    if (cursorHistory.length <= 1) return;
    const newHistory = cursorHistory.slice(0, -1);
    setCursorHistory(newHistory);
    loadPage(newHistory[newHistory.length - 1]);
  }, [cursorHistory, loadPage]);

  const onRatingChange = useCallback(async (songId, rating) => {
    // Optimistic update for current page
    setSongs((prev) =>
      prev.map((s) => (s.id === songId ? { ...s, star_rating: rating } : s))
    );
    // Optimistic update for all songs
    setAllSongs((prev) =>
      prev.map((s) => (s.id === songId ? { ...s, star_rating: rating } : s))
    );

    try {
      await updateSongRating(songId, rating);
    } catch (err) {
      // Revert on failure
      setSongs((prev) =>
        prev.map((s) => (s.id === songId ? { ...s, star_rating: 0 } : s))
      );
      setAllSongs((prev) =>
        prev.map((s) => (s.id === songId ? { ...s, star_rating: 0 } : s))
      );
    }
  }, []);

  return {
    songs,
    allSongs,
    hasMore,
    total,
    cursorHistory,
    loading,
    error,
    goToNext,
    goToPrev,
    onRatingChange,
  };
}

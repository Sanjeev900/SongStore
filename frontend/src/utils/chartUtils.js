/**
 * Chart utility functions for data transformations.
 */

/**
 * Build histogram bins for song duration.
 * Converts duration_ms to seconds and creates bins.
 * Clamps max value into last bin.
 * @param {Array<Object>} songs - Array of song objects
 * @param {number} [binSize=30] - Bin size in seconds
 * @returns {Array<Object>} Array of { range, count } objects
 */
export function buildDurationHistogram(songs, binSize = 30) {
  if (!songs || songs.length === 0) return [];

  const durations = songs
    .filter((s) => s.duration_ms != null)
    .map((s) => s.duration_ms / 1000);

  if (durations.length === 0) return [];

  const maxDuration = Math.max(...durations);
  const binCount = Math.ceil(maxDuration / binSize);
  const bins = [];

  for (let i = 0; i < binCount; i++) {
    const low = i * binSize;
    const high = (i + 1) * binSize;
    bins.push({
      range: `${low}-${high}s`,
      count: 0,
    });
  }

  for (const dur of durations) {
    let binIndex = Math.floor(dur / binSize);
    // Clamp max value into last bin
    if (binIndex >= binCount) {
      binIndex = binCount - 1;
    }
    bins[binIndex].count++;
  }

  return bins;
}

/**
 * Build scatter plot data for danceability vs tempo.
 * @param {Array<Object>} songs
 * @returns {Array<Object>} Array of { danceability, tempo, title } objects
 */
export function buildScatterData(songs) {
  if (!songs || songs.length === 0) return [];

  return songs
    .filter((s) => s.danceability != null && s.tempo != null)
    .map((s) => ({
      danceability: s.danceability,
      tempo: s.tempo,
      title: s.title,
    }));
}

/**
 * Build grouped bar chart data for acousticness and tempo.
 * @param {Array<Object>} songs
 * @returns {Array<Object>} Array of { title, acousticness, tempo } objects
 */
export function buildGroupedBarData(songs) {
  if (!songs || songs.length === 0) return [];

  return songs
    .filter((s) => s.acousticness != null && s.tempo != null)
    .map((s) => ({
      title: s.title,
      acousticness: s.acousticness,
      tempo: s.tempo,
    }));
}

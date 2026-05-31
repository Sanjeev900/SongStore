import React from 'react';
import { useSort } from '../hooks/useSort';
import { exportToCsv } from '../utils/csvExport';
import StarRating from './StarRating';

const COLUMNS = [
  { key: 'idx', label: '#' },
  { key: 'title', label: 'Title' },
  { key: 'danceability', label: 'Danceability' },
  { key: 'energy', label: 'Energy' },
  { key: 'acousticness', label: 'Acousticness' },
  { key: 'instrumentalness', label: 'Instrumentalness' },
  { key: 'liveness', label: 'Liveness' },
  { key: 'valence', label: 'Valence' },
  { key: 'tempo', label: 'Tempo' },
  { key: 'loudness', label: 'Loudness' },
  { key: 'key', label: 'Key' },
  { key: 'mode', label: 'Mode' },
  { key: 'duration_ms', label: 'Duration' },
  { key: 'num_bars', label: 'Bars' },
  { key: 'num_sections', label: 'Sections' },
  { key: 'num_segments', label: 'Segments' },
  { key: 'star_rating', label: 'Rating' },
];

/**
 * Format cell value for display.
 */
function formatCell(key, value) {
  if (key === 'mode') {
    return value === 1 ? 'Major' : 'Minor';
  }
  if (key === 'duration_ms' && value != null) {
    return (value / 1000).toFixed(1) + 's';
  }
  if (value == null) return '—';
  return value;
}

/**
 * SongsTable component with pagination, sorting, and CSV export.
 */
function SongsTable({
  songs,
  allSongs,
  hasMore,
  total,
  cursorHistory,
  goToNext,
  goToPrev,
  onRatingChange,
  loading,
}) {
  const { sortedData, sortColumn, sortDirection, toggle } = useSort(songs);
  const currentPage = cursorHistory.length;
  const totalPages = Math.ceil(total / 10) || 1;

  const getSortIndicator = (key) => {
    if (sortColumn !== key) return '';
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  if (loading) {
    return <p className="loading">Loading songs...</p>;
  }

  if (!songs || songs.length === 0) {
    return <p className="empty-state">No songs available.</p>;
  }

  return (
    <div className="songs-table-container">
      <div className="table-actions">
        <button
          className="csv-button"
          onClick={() => exportToCsv(allSongs)}
          disabled={!allSongs || allSongs.length === 0}
        >
          Download CSV
        </button>
      </div>

      <div className="table-scroll">
        <table className="songs-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggle(col.key)}
                  className="sortable-header"
                >
                  {col.label}{getSortIndicator(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((song) => (
              <tr key={song.id}>
                {COLUMNS.map((col) => (
                  <td key={col.key}>
                    {col.key === 'star_rating' ? (
                      <StarRating
                        rating={song.star_rating}
                        onChange={(rating) => onRatingChange(song.id, rating)}
                      />
                    ) : (
                      formatCell(col.key, song[col.key])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={goToPrev} disabled={cursorHistory.length <= 1}>
          Prev
        </button>
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={goToNext} disabled={!hasMore}>
          Next
        </button>
      </div>
    </div>
  );
}

export default SongsTable;

/**
 * CSV export utility with UTF-8 BOM.
 */

/**
 * Escape a CSV value: wrap in quotes if it contains commas, quotes, or newlines.
 * Escape quotes by doubling them.
 * @param {*} value
 * @returns {string}
 */
function escapeValue(value) {
  if (value == null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * Export an array of song objects to a CSV file download.
 * Includes UTF-8 BOM for Excel compatibility.
 * @param {Array<Object>} songs - Array of song objects to export
 * @param {string} [filename='songs.csv'] - Download filename
 */
export function exportToCsv(songs, filename = 'songs.csv') {
  if (!songs || songs.length === 0) return;

  const headers = Object.keys(songs[0]);
  const headerRow = headers.map(escapeValue).join(',');

  const dataRows = songs.map((song) =>
    headers.map((key) => escapeValue(song[key])).join(',')
  );

  const csvContent = [headerRow, ...dataRows].join('\n');
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

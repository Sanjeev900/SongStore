import { useState, useMemo, useCallback } from 'react';
import { COLUMN_TYPES, getSortStrategy } from '../utils/sortStrategies';

/**
 * Hook for managing sorting state on current page data.
 * NEVER mutates the input array.
 * @param {Array} data - Current page songs array
 * @returns {Object} Sorted data and sort controls
 */
export function useSort(data) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const toggle = useCallback((column) => {
    setSortColumn((prevCol) => {
      if (prevCol === column) {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        return column;
      }
      setSortDirection('asc');
      return column;
    });
  }, []);

  const sortedData = useMemo(() => {
    if (!sortColumn || !data) return data;

    const type = COLUMN_TYPES[sortColumn] || 'numeric';
    const strategy = getSortStrategy(type, sortDirection);
    const copy = [...data];
    copy.sort((a, b) => strategy(a[sortColumn], b[sortColumn]));
    return copy;
  }, [data, sortColumn, sortDirection]);

  return { sortedData, sortColumn, sortDirection, toggle };
}

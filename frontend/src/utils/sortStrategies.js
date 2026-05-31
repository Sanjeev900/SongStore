/**
 * Sort strategy functions for different column types.
 */

/** @param {number} a @param {number} b */
export function numericAsc(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return a - b;
}

/** @param {number} a @param {number} b */
export function numericDesc(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return b - a;
}

/** @param {string} a @param {string} b */
export function stringAsc(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return a.localeCompare(b);
}

/** @param {string} a @param {string} b */
export function stringDesc(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return b.localeCompare(a);
}

/**
 * Column type mapping. All columns not listed here are numeric.
 */
export const COLUMN_TYPES = {
  title: 'string',
};

/**
 * Get the appropriate sort strategy for a column type and direction.
 * @param {string} type - 'string' or 'numeric'
 * @param {string} direction - 'asc' or 'desc'
 * @returns {Function} Comparator function
 */
export function getSortStrategy(type, direction) {
  if (type === 'string') {
    return direction === 'asc' ? stringAsc : stringDesc;
  }
  return direction === 'asc' ? numericAsc : numericDesc;
}

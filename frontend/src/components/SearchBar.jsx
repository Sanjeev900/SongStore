import React, { useState } from 'react';

/**
 * SearchBar component for exact song title search.
 * Search triggers ONLY on button click.
 */
function SearchBar({ onSearch, onClear, loading }) {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (!value.trim()) {
      onClear();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <label htmlFor="song-search">Song Title</label>
      <input
        id="song-search"
        type="text"
        placeholder="Enter exact song title"
        value={query}
        onChange={handleInputChange}
        disabled={loading}
      />
      <button type="submit" disabled={loading || !query.trim()}>
        {loading ? 'Searching...' : 'Get Song'}
      </button>
    </form>
  );
}

export default SearchBar;

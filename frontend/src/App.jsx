import React, { useState } from 'react';
import { useSongs } from './hooks/useSongs';
import { useSearch } from './hooks/useSearch';
import SearchBar from './components/SearchBar';
import SongsTable from './components/SongsTable';
import Charts from './components/Charts';

function App() {
  const [activeTab, setActiveTab] = useState('table');
  const {
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
  } = useSongs();

  const {
    result: searchResult,
    loading: searchLoading,
    error: searchError,
    search,
    clear: clearSearch,
  } = useSearch();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Song Dashboard</h1>
        <nav className="tab-nav">
          <button
            className={activeTab === 'table' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('table')}
          >
            Table
          </button>
          <button
            className={activeTab === 'charts' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('charts')}
          >
            Charts
          </button>
        </nav>
      </header>

      <SearchBar
        onSearch={search}
        onClear={clearSearch}
        loading={searchLoading}
      />

      {searchError && <p className="error-message">{searchError}</p>}

      {searchResult && (
        <div className="search-result">
          <h3>Search Result</h3>
          <p>
            <strong>{searchResult.title}</strong> — Danceability:{' '}
            {searchResult.danceability}, Energy: {searchResult.energy}, Tempo:{' '}
            {searchResult.tempo}
          </p>
        </div>
      )}

      <main className="main-content">
        {error && <p className="error-message">{error}</p>}

        {activeTab === 'table' && (
          <SongsTable
            songs={songs}
            allSongs={allSongs}
            hasMore={hasMore}
            total={total}
            cursorHistory={cursorHistory}
            goToNext={goToNext}
            goToPrev={goToPrev}
            onRatingChange={onRatingChange}
            loading={loading}
          />
        )}

        {activeTab === 'charts' && <Charts allSongs={allSongs} />}
      </main>
    </div>
  );
}

export default App;

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SongsTable from './SongsTable';

const mockSongs = [
  { idx: 0, id: 'song1', title: 'Alpha', danceability: 0.7, energy: 0.5, key: 7, loudness: -7.0, mode: 1, acousticness: 0.24, instrumentalness: 0.0, liveness: 0.12, valence: 0.45, tempo: 105.0, duration_ms: 234000, time_signature: 4, num_bars: 89, num_sections: 10, num_segments: 456, star_rating: 0 },
  { idx: 1, id: 'song2', title: 'Beta', danceability: 0.6, energy: 0.8, key: 5, loudness: -4.5, mode: 0, acousticness: 0.01, instrumentalness: 0.001, liveness: 0.35, valence: 0.68, tempo: 128.0, duration_ms: 198000, time_signature: 4, num_bars: 102, num_sections: 12, num_segments: 523, star_rating: 3 },
];

const defaultProps = {
  songs: mockSongs,
  allSongs: mockSongs,
  hasMore: false,
  total: 2,
  cursorHistory: [-1],
  goToNext: jest.fn(),
  goToPrev: jest.fn(),
  onRatingChange: jest.fn(),
  loading: false,
};

test('renders table with correct columns', () => {
  render(<SongsTable {...defaultProps} />);
  expect(screen.getByText('Title')).toBeInTheDocument();
  expect(screen.getByText('Danceability')).toBeInTheDocument();
  expect(screen.getByText('Energy')).toBeInTheDocument();
  expect(screen.getByText('Rating')).toBeInTheDocument();
});

test('renders song data correctly', () => {
  render(<SongsTable {...defaultProps} />);
  expect(screen.getByText('Alpha')).toBeInTheDocument();
  expect(screen.getByText('Beta')).toBeInTheDocument();
});

test('displays mode as Major/Minor', () => {
  render(<SongsTable {...defaultProps} />);
  expect(screen.getByText('Major')).toBeInTheDocument();
  expect(screen.getByText('Minor')).toBeInTheDocument();
});

test('displays duration in seconds', () => {
  render(<SongsTable {...defaultProps} />);
  expect(screen.getByText('234.0s')).toBeInTheDocument();
  expect(screen.getByText('198.0s')).toBeInTheDocument();
});

test('pagination buttons disabled appropriately', () => {
  render(<SongsTable {...defaultProps} />);
  expect(screen.getByText('Prev')).toBeDisabled();
  expect(screen.getByText('Next')).toBeDisabled();
});

test('pagination shows page info', () => {
  render(<SongsTable {...defaultProps} />);
  expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
});

test('Next button enabled when hasMore is true', () => {
  render(<SongsTable {...defaultProps} hasMore={true} total={20} />);
  expect(screen.getByText('Next')).not.toBeDisabled();
});

test('clicking sort header sorts data', () => {
  render(<SongsTable {...defaultProps} />);
  fireEvent.click(screen.getByText('Title'));
  const rows = screen.getAllByRole('row');
  expect(rows.length).toBeGreaterThan(1);
});

test('CSV button disabled when no allSongs', () => {
  render(<SongsTable {...defaultProps} allSongs={[]} />);
  expect(screen.getByText('Download CSV')).toBeDisabled();
});

test('CSV button enabled when allSongs present', () => {
  render(<SongsTable {...defaultProps} />);
  expect(screen.getByText('Download CSV')).not.toBeDisabled();
});

test('shows loading state', () => {
  render(<SongsTable {...defaultProps} loading={true} />);
  expect(screen.getByText('Loading songs...')).toBeInTheDocument();
});

test('shows empty state when no songs', () => {
  render(<SongsTable {...defaultProps} songs={[]} />);
  expect(screen.getByText('No songs available.')).toBeInTheDocument();
});

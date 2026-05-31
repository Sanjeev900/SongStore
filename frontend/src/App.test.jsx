import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import App from './App';

const mockPageResponse = {
  data: [
    { idx: 0, id: 'song1', title: 'Test Song', danceability: 0.7, energy: 0.5, key: 7, loudness: -7.0, mode: 1, acousticness: 0.24, instrumentalness: 0.0, liveness: 0.12, valence: 0.45, tempo: 105.0, duration_ms: 234000, time_signature: 4, num_bars: 89, num_sections: 10, num_segments: 456, star_rating: 0 },
  ],
  next_cursor: null,
  has_more: false,
  total: 1,
};

const mockAllSongs = [mockPageResponse.data[0]];

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes('/songs/all')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAllSongs),
      });
    }
    if (url.includes('/songs?')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPageResponse),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders Song Dashboard heading', async () => {
  await act(async () => {
    render(<App />);
  });
  await waitFor(() => {
    expect(screen.getByText('Song Dashboard')).toBeInTheDocument();
  });
});

test('renders search bar', async () => {
  await act(async () => {
    render(<App />);
  });
  await waitFor(() => {
    expect(screen.getByLabelText('Song Title')).toBeInTheDocument();
    expect(screen.getByText('Get Song')).toBeInTheDocument();
  });
});

test('renders tab navigation', async () => {
  await act(async () => {
    render(<App />);
  });
  await waitFor(() => {
    expect(screen.getByText('Table')).toBeInTheDocument();
    expect(screen.getByText('Charts')).toBeInTheDocument();
  });
});

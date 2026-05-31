import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

test('renders label and input', () => {
  render(<SearchBar onSearch={jest.fn()} onClear={jest.fn()} loading={false} />);
  expect(screen.getByLabelText('Song Title')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Enter exact song title')).toBeInTheDocument();
});

test('renders Get Song button', () => {
  render(<SearchBar onSearch={jest.fn()} onClear={jest.fn()} loading={false} />);
  expect(screen.getByText('Get Song')).toBeInTheDocument();
});

test('button disabled when input is empty', () => {
  render(<SearchBar onSearch={jest.fn()} onClear={jest.fn()} loading={false} />);
  expect(screen.getByText('Get Song')).toBeDisabled();
});

test('button enabled when input has text', () => {
  render(<SearchBar onSearch={jest.fn()} onClear={jest.fn()} loading={false} />);
  fireEvent.change(screen.getByLabelText('Song Title'), {
    target: { value: 'Test Song' },
  });
  expect(screen.getByText('Get Song')).not.toBeDisabled();
});

test('calls onSearch when button clicked', () => {
  const onSearch = jest.fn();
  render(<SearchBar onSearch={onSearch} onClear={jest.fn()} loading={false} />);
  fireEvent.change(screen.getByLabelText('Song Title'), {
    target: { value: 'Test Song' },
  });
  fireEvent.click(screen.getByText('Get Song'));
  expect(onSearch).toHaveBeenCalledWith('Test Song');
});

test('calls onClear when input emptied', () => {
  const onClear = jest.fn();
  render(<SearchBar onSearch={jest.fn()} onClear={onClear} loading={false} />);
  const input = screen.getByLabelText('Song Title');
  fireEvent.change(input, { target: { value: 'Test' } });
  fireEvent.change(input, { target: { value: '' } });
  expect(onClear).toHaveBeenCalled();
});

test('shows Searching... when loading', () => {
  render(<SearchBar onSearch={jest.fn()} onClear={jest.fn()} loading={true} />);
  expect(screen.getByText('Searching...')).toBeInTheDocument();
});

test('input disabled when loading', () => {
  render(<SearchBar onSearch={jest.fn()} onClear={jest.fn()} loading={true} />);
  expect(screen.getByLabelText('Song Title')).toBeDisabled();
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StarRating from './StarRating';

test('renders 5 stars', () => {
  render(<StarRating rating={0} onChange={jest.fn()} />);
  const stars = screen.getAllByRole('button');
  expect(stars).toHaveLength(5);
});

test('displays correct filled stars for rating 3', () => {
  render(<StarRating rating={3} onChange={jest.fn()} />);
  const stars = screen.getAllByRole('button');
  expect(stars[0]).toHaveTextContent('★');
  expect(stars[1]).toHaveTextContent('★');
  expect(stars[2]).toHaveTextContent('★');
  expect(stars[3]).toHaveTextContent('☆');
  expect(stars[4]).toHaveTextContent('☆');
});

test('displays all empty stars for rating 0', () => {
  render(<StarRating rating={0} onChange={jest.fn()} />);
  const stars = screen.getAllByRole('button');
  stars.forEach((star) => {
    expect(star).toHaveTextContent('☆');
  });
});

test('calls onChange with correct value on click', () => {
  const onChange = jest.fn();
  render(<StarRating rating={0} onChange={onChange} />);
  const stars = screen.getAllByRole('button');
  fireEvent.click(stars[3]);
  expect(onChange).toHaveBeenCalledWith(4);
});

test('shows hover preview', () => {
  render(<StarRating rating={0} onChange={jest.fn()} />);
  const stars = screen.getAllByRole('button');
  fireEvent.mouseEnter(stars[2]);
  expect(stars[0]).toHaveTextContent('★');
  expect(stars[1]).toHaveTextContent('★');
  expect(stars[2]).toHaveTextContent('★');
  expect(stars[3]).toHaveTextContent('☆');
  expect(stars[4]).toHaveTextContent('☆');
});

test('resets hover preview on mouse leave', () => {
  render(<StarRating rating={1} onChange={jest.fn()} />);
  const container = screen.getByLabelText(/Rating/);
  const stars = screen.getAllByRole('button');
  fireEvent.mouseEnter(stars[4]);
  fireEvent.mouseLeave(container);
  expect(stars[0]).toHaveTextContent('★');
  expect(stars[1]).toHaveTextContent('☆');
});

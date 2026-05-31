import React, { useState } from 'react';

/**
 * StarRating component displaying 5 stars with hover preview.
 * Click triggers onChange with value 1-5.
 */
function StarRating({ rating = 0, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <span
      className="star-rating"
      onMouseLeave={() => setHovered(0)}
      aria-label={`Rating: ${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="star"
          onMouseEnter={() => setHovered(star)}
          onClick={() => onChange(star)}
          role="button"
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          {star <= (hovered || rating) ? '★' : '☆'}
        </span>
      ))}
    </span>
  );
}

export default StarRating;

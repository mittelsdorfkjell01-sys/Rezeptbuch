'use client';

import React from 'react';
import { Rating } from '@/types';

interface Props {
  value?: Rating;
  onChange?: (r: Rating) => void;
  readonly?: boolean;
}

export function StarRating({ value, onChange, readonly = false }: Props) {
  return (
    <div className="star-rating" aria-label={`Bewertung: ${value ?? 0} von 5`}>
      {([1, 2, 3, 4, 5] as Rating[]).map((star) => (
        <button
          key={star}
          type="button"
          className={`star-rating__star${(value ?? 0) >= star ? ' star-rating__star--active' : ''}`}
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          aria-label={`${star} Stern${star > 1 ? 'e' : ''}`}
        >
          {(value ?? 0) >= star ? '★' : '☆'}
        </button>
      ))}
    </div>
  );
}

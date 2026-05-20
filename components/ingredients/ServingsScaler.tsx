'use client';

import React from 'react';

interface Props {
  value: number;
  min?: number;
  max?: number;
  onChange: (n: number) => void;
}

export function ServingsScaler({ value, min = 1, max = 50, onChange }: Props) {
  return (
    <div className="servings-scaler" aria-label="Portionen anpassen">
      <button
        type="button"
        className="servings-scaler__btn servings-scaler__btn--minus"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Portionen verringern"
        disabled={value <= min}
      >
        −
      </button>
      <span className="servings-scaler__value" aria-live="polite" aria-atomic="true">
        {value} {value === 1 ? 'Portion' : 'Portionen'}
      </span>
      <button
        type="button"
        className="servings-scaler__btn servings-scaler__btn--plus"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Portionen erhöhen"
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}

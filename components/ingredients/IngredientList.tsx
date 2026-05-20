'use client';

import React, { useState } from 'react';
import { Ingredient } from '@/types';
import { scaleAmount, formatAmount } from '@/lib/utils/scaling';

interface Props {
  ingredients: Ingredient[];
  baseServings: number;
  currentServings: number;
  showCheckboxes?: boolean;
}

export function IngredientList({ ingredients, baseServings, currentServings, showCheckboxes = false }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const groups = ingredients.reduce<Record<string, Ingredient[]>>((acc, ing) => {
    const g = ing.group ?? 'Zutaten';
    if (!acc[g]) acc[g] = [];
    acc[g].push(ing);
    return acc;
  }, {});

  return (
    <div className="ingredient-list">
      {Object.entries(groups).map(([group, items]) => (
        <div key={group} className="ingredient-list__group">
          {Object.keys(groups).length > 1 && (
            <h3 className="ingredient-list__group-title">{group}</h3>
          )}
          <ul className="ingredient-list__items">
            {items.map((ing) => {
              const scaled = scaleAmount(ing.amount, baseServings, currentServings);
              return (
                <li
                  key={ing.id}
                  className={`ingredient-list__item${showCheckboxes && checked[ing.id] ? ' ingredient-list__item--checked' : ''}`}
                >
                  {showCheckboxes && (
                    <input
                      type="checkbox"
                      id={`ing-${ing.id}`}
                      className="ingredient-list__checkbox"
                      checked={!!checked[ing.id]}
                      onChange={() => toggle(ing.id)}
                      aria-label={`${ing.name} abgehakt`}
                    />
                  )}
                  <label
                    htmlFor={showCheckboxes ? `ing-${ing.id}` : undefined}
                    className="ingredient-list__label"
                  >
                    <span className="ingredient-list__amount">{formatAmount(scaled)}</span>
                    <span className="ingredient-list__unit">{ing.unit}</span>
                    <span className="ingredient-list__name">{ing.name}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

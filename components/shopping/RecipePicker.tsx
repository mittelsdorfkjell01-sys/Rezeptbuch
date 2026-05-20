'use client';

import React from 'react';
import { Recipe } from '@/types';
import { ServingsScaler } from '@/components/ingredients/ServingsScaler';

interface Props {
  recipes: Recipe[];
  selectedIds: string[];
  servingsMap: Record<string, number>;
  onToggle: (id: string) => void;
  onServingsChange: (id: string, n: number) => void;
}

export function RecipePicker({ recipes, selectedIds, servingsMap, onToggle, onServingsChange }: Props) {
  return (
    <div className="recipe-picker" aria-label="Rezepte auswählen">
      <ul className="recipe-picker__list">
        {recipes.map((recipe) => {
          const selected = selectedIds.includes(recipe.id);
          return (
            <li key={recipe.id} className={`recipe-picker__item${selected ? ' recipe-picker__item--selected' : ''}`}>
              <button
                type="button"
                className="recipe-picker__chip"
                onClick={() => onToggle(recipe.id)}
                aria-pressed={selected}
                aria-label={`${recipe.title} ${selected ? 'abwählen' : 'auswählen'}`}
              >
                {recipe.title}
              </button>
              {selected && (
                <div className="recipe-picker__servings">
                  <ServingsScaler
                    value={servingsMap[recipe.id] ?? recipe.servings}
                    onChange={(n) => onServingsChange(recipe.id, n)}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

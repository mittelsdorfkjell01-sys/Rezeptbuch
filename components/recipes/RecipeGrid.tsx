'use client';

import React from 'react';
import { Recipe } from '@/types';
import { RecipeCard } from './RecipeCard';

interface Props {
  recipes: Recipe[];
}

export function RecipeGrid({ recipes }: Props) {
  if (recipes.length === 0) {
    return (
      <div className="recipe-grid__empty" role="status" aria-live="polite">
        <p>Keine Rezepte gefunden.</p>
      </div>
    );
  }

  return (
    <section className="recipe-grid" aria-label="Rezepte">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </section>
  );
}

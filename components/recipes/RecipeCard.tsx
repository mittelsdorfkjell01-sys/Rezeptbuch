'use client';

import React from 'react';
import Link from 'next/link';
import { Recipe } from '@/types';

interface Props {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: Props) {
  return (
    <article className="recipe-card" aria-label={recipe.title}>
      {recipe.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={recipe.photo_url}
          alt={recipe.title}
          className="recipe-card__photo"
        />
      ) : (
        <div className="recipe-card__placeholder" aria-hidden="true" />
      )}

      <div className="recipe-card__overlay" aria-hidden="true" />

      <Link href={`/rezept/${recipe.id}`} className="recipe-card__link" aria-label={`Rezept ${recipe.title} öffnen`}>
        <div className="recipe-card__body">
          <h2 className="recipe-card__title">{recipe.title}</h2>
          <div className="recipe-card__meta">
            <span className="recipe-card__meta-item recipe-card__meta-item--duration" aria-label={`Dauer: ${recipe.duration_min} Minuten`}>
              {recipe.duration_min} Min
            </span>
            <span className="recipe-card__meta-item recipe-card__meta-item--servings" aria-label={`${recipe.servings} Portionen`}>
              {recipe.servings} Port.
            </span>
            {recipe.rating && (
              <span className="recipe-card__meta-item recipe-card__meta-item--rating" aria-label={`Bewertung: ${recipe.rating} von 5`}>
                {'★'.repeat(recipe.rating)}{'☆'.repeat(5 - recipe.rating)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

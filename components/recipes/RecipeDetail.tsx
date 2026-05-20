'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Recipe, Rating } from '@/types';
import { useRecipes } from '@/context/RecipeContext';
import { IngredientList } from '@/components/ingredients/IngredientList';
import { StepList } from '@/components/steps/StepList';
import { ServingsScaler } from '@/components/ingredients/ServingsScaler';
import { StarRating } from '@/components/ui/StarRating';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { exportRecipePdf } from '@/lib/utils/export';

interface Props {
  recipe: Recipe;
}

export function RecipeDetail({ recipe }: Props) {
  const router = useRouter();
  const { updateRecipe, deleteRecipe } = useRecipes();
  const [servings, setServings] = useState(recipe.servings);
  const [showDelete, setShowDelete] = useState(false);

  function handleRating(r: Rating) {
    updateRecipe({ ...recipe, rating: r, updated_at: new Date().toISOString() });
  }

  function handleDelete() {
    deleteRecipe(recipe.id);
    router.push('/');
  }

  async function handlePdfExport() {
    const title = recipe.title.toLowerCase().replace(/\s+/g, '-');
    await exportRecipePdf('recipe-detail-print', `${title}.pdf`);
  }

  return (
    <article className="recipe-detail" id="recipe-detail-print" aria-label={recipe.title}>
      <div className="recipe-detail__image-col">
        {recipe.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.photo_url}
            alt={recipe.title}
            className="recipe-detail__photo"
          />
        ) : (
          <div className="recipe-detail__placeholder" aria-hidden="true" />
        )}
        <div className="recipe-detail__image-overlay" aria-hidden="true" />
        <div className="recipe-detail__image-content">
          <h1 className="recipe-detail__title">{recipe.title}</h1>
          <div className="recipe-detail__meta">
            <span className="recipe-detail__meta-item" aria-label={`Dauer: ${recipe.duration_min} Minuten`}>
              {recipe.duration_min} Min
            </span>
            <span className="recipe-detail__meta-item" aria-label={`${recipe.servings} Portionen`}>
              {recipe.servings} Portionen
            </span>
            <span className="recipe-detail__meta-item" aria-label={`Schwierigkeit: ${recipe.difficulty}`}>
              {recipe.difficulty}
            </span>
          </div>
          <div className="recipe-detail__rating">
            <StarRating value={recipe.rating} onChange={handleRating} />
          </div>
          <div className="recipe-detail__servings">
            <ServingsScaler value={servings} onChange={setServings} />
          </div>
        </div>
      </div>

      <div className="recipe-detail__content-col">
        {recipe.description && (
          <section className="recipe-detail__section" aria-labelledby="desc-heading">
            <h2 id="desc-heading" className="recipe-detail__section-title">Beschreibung</h2>
            <p className="recipe-detail__description">{recipe.description}</p>
          </section>
        )}

        <section className="recipe-detail__section" aria-labelledby="ing-heading">
          <h2 id="ing-heading" className="recipe-detail__section-title">Zutaten</h2>
          <IngredientList
            ingredients={recipe.ingredients}
            baseServings={recipe.servings}
            currentServings={servings}
            showCheckboxes
          />
        </section>

        <section className="recipe-detail__section" aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="recipe-detail__section-title">Zubereitung</h2>
          <StepList steps={recipe.steps} />
        </section>

        {recipe.notes && (
          <section className="recipe-detail__section" aria-labelledby="notes-heading">
            <h2 id="notes-heading" className="recipe-detail__section-title">Notizen</h2>
            <p className="recipe-detail__notes">{recipe.notes}</p>
          </section>
        )}

        <div className="recipe-detail__actions">
          <button
            type="button"
            className="recipe-detail__action"
            onClick={handlePdfExport}
            aria-label="Als PDF exportieren"
          >
            Als PDF exportieren
          </button>
          <Link
            href={`/rezept/${recipe.id}/bearbeiten`}
            className="recipe-detail__action"
            aria-label="Rezept bearbeiten"
          >
            Bearbeiten
          </Link>
          <button
            type="button"
            className="recipe-detail__action recipe-detail__action--danger"
            onClick={() => setShowDelete(true)}
            aria-label="Rezept löschen"
          >
            Löschen
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        title="Rezept löschen"
        message={`Möchtest du „${recipe.title}" wirklich unwiderruflich löschen?`}
        confirmLabel="Löschen"
        cancelLabel="Abbrechen"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </article>
  );
}

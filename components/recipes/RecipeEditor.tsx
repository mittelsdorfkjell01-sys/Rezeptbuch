'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Recipe, Difficulty, Rating } from '@/types';
import { useRecipes } from '@/context/RecipeContext';
import { IngredientEditor } from '@/components/ingredients/IngredientEditor';
import { StepEditor } from '@/components/steps/StepEditor';
import { StarRating } from '@/components/ui/StarRating';
import { PhotoUpload } from '@/components/ui/PhotoUpload';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { RecipeCard } from './RecipeCard';

interface Props {
  initial?: Recipe;
}

function emptyRecipe(): Recipe {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    title: '',
    duration_min: 30,
    servings: 4,
    difficulty: 'einfach',
    ingredients: [],
    steps: [],
    created_at: now,
    updated_at: now,
  };
}

export function RecipeEditor({ initial }: Props) {
  const router = useRouter();
  const { addRecipe, updateRecipe, deleteRecipe } = useRecipes();
  const [form, setForm] = useState<Recipe>(initial ?? emptyRecipe());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = !!initial;

  function set<K extends keyof Recipe>(field: K, value: Recipe[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Titel ist erforderlich';
    if (form.duration_min <= 0) e.duration_min = 'Dauer muss größer als 0 sein';
    if (form.servings <= 0) e.servings = 'Portionen müssen größer als 0 sein';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const now = new Date().toISOString();
    const recipe: Recipe = { ...form, updated_at: now };
    if (isEdit) {
      updateRecipe(recipe);
    } else {
      addRecipe({ ...recipe, created_at: now });
    }
    router.push(`/rezept/${recipe.id}`);
  }

  function handleDelete() {
    deleteRecipe(form.id);
    router.push('/');
  }

  return (
    <div className="recipe-editor">
      <div className="recipe-editor__form-col">
        <form
          className="recipe-editor__form"
          onSubmit={handleSubmit}
          noValidate
          aria-label={isEdit ? 'Rezept bearbeiten' : 'Neues Rezept erstellen'}
        >
          <h1 className="recipe-editor__heading">
            {isEdit ? 'Rezept bearbeiten' : 'Neues Rezept'}
          </h1>

          <fieldset className="recipe-editor__fieldset">
            <legend className="recipe-editor__legend">Grunddaten</legend>

            <div className="recipe-editor__field">
              <label htmlFor="field-title" className="recipe-editor__label">
                Titel <span aria-hidden="true">*</span>
              </label>
              <input
                id="field-title"
                className={`recipe-editor__input${errors.title ? ' recipe-editor__input--error' : ''}`}
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Rezepttitel"
                required
                aria-required="true"
                aria-describedby={errors.title ? 'err-title' : undefined}
              />
              {errors.title && <span id="err-title" className="recipe-editor__error" role="alert">{errors.title}</span>}
            </div>

            <div className="recipe-editor__field">
              <label className="recipe-editor__label">Foto</label>
              <PhotoUpload value={form.photo_url} onChange={(v) => set('photo_url', v || undefined)} />
            </div>

            <div className="recipe-editor__field">
              <label htmlFor="field-desc" className="recipe-editor__label">Beschreibung</label>
              <textarea
                id="field-desc"
                className="recipe-editor__textarea"
                value={form.description ?? ''}
                onChange={(e) => set('description', e.target.value || undefined)}
                placeholder="Kurze Beschreibung des Rezepts"
                rows={3}
                aria-label="Beschreibung"
              />
            </div>

            <div className="recipe-editor__row">
              <div className="recipe-editor__field">
                <label htmlFor="field-duration" className="recipe-editor__label">
                  Dauer (Minuten) <span aria-hidden="true">*</span>
                </label>
                <input
                  id="field-duration"
                  className={`recipe-editor__input${errors.duration_min ? ' recipe-editor__input--error' : ''}`}
                  type="number"
                  min="1"
                  value={form.duration_min}
                  onChange={(e) => set('duration_min', Number(e.target.value))}
                  aria-required="true"
                  aria-describedby={errors.duration_min ? 'err-duration' : undefined}
                />
                {errors.duration_min && <span id="err-duration" className="recipe-editor__error" role="alert">{errors.duration_min}</span>}
              </div>

              <div className="recipe-editor__field">
                <label htmlFor="field-servings" className="recipe-editor__label">
                  Portionen <span aria-hidden="true">*</span>
                </label>
                <input
                  id="field-servings"
                  className={`recipe-editor__input${errors.servings ? ' recipe-editor__input--error' : ''}`}
                  type="number"
                  min="1"
                  value={form.servings}
                  onChange={(e) => set('servings', Number(e.target.value))}
                  aria-required="true"
                  aria-describedby={errors.servings ? 'err-servings' : undefined}
                />
                {errors.servings && <span id="err-servings" className="recipe-editor__error" role="alert">{errors.servings}</span>}
              </div>

              <div className="recipe-editor__field">
                <label htmlFor="field-difficulty" className="recipe-editor__label">Schwierigkeit</label>
                <select
                  id="field-difficulty"
                  className="recipe-editor__select"
                  value={form.difficulty}
                  onChange={(e) => set('difficulty', e.target.value as Difficulty)}
                  aria-label="Schwierigkeit wählen"
                >
                  <option value="einfach">Einfach</option>
                  <option value="mittel">Mittel</option>
                  <option value="aufwändig">Aufwändig</option>
                </select>
              </div>
            </div>

            <div className="recipe-editor__field">
              <label className="recipe-editor__label">Bewertung</label>
              <StarRating value={form.rating} onChange={(r) => set('rating', r as Rating)} />
            </div>

            <div className="recipe-editor__field">
              <label htmlFor="field-notes" className="recipe-editor__label">Notizen</label>
              <textarea
                id="field-notes"
                className="recipe-editor__textarea"
                value={form.notes ?? ''}
                onChange={(e) => set('notes', e.target.value || undefined)}
                placeholder="Persönliche Notizen, Tipps, Variationen…"
                rows={3}
                aria-label="Notizen"
              />
            </div>
          </fieldset>

          <fieldset className="recipe-editor__fieldset">
            <legend className="recipe-editor__legend">Zutaten</legend>
            <IngredientEditor
              ingredients={form.ingredients}
              onChange={(ing) => set('ingredients', ing)}
            />
          </fieldset>

          <fieldset className="recipe-editor__fieldset">
            <legend className="recipe-editor__legend">Zubereitung</legend>
            <StepEditor steps={form.steps} onChange={(s) => set('steps', s)} />
          </fieldset>

          <div className="recipe-editor__actions">
            <button type="submit" className="recipe-editor__save" aria-label="Rezept speichern">
              Speichern
            </button>
            <button
              type="button"
              className="recipe-editor__cancel"
              onClick={() => router.back()}
              aria-label="Bearbeitung abbrechen"
            >
              Abbrechen
            </button>
            {isEdit && (
              <button
                type="button"
                className="recipe-editor__delete"
                onClick={() => setShowDeleteDialog(true)}
                aria-label="Rezept löschen"
              >
                Rezept löschen
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="recipe-editor__preview-col" aria-label="Vorschau" aria-live="polite">
        <h2 className="recipe-editor__preview-heading">Vorschau</h2>
        <RecipeCard recipe={{ ...form, title: form.title || 'Rezepttitel' }} />
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Rezept löschen"
        message={`Möchtest du „${form.title}" wirklich unwiderruflich löschen?`}
        confirmLabel="Löschen"
        cancelLabel="Abbrechen"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}

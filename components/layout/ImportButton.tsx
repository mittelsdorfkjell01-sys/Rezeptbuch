'use client';

import React, { useRef, useState } from 'react';
import { Recipe } from '@/types';
import { useRecipes } from '@/context/RecipeContext';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

function isValidRecipe(obj: unknown): obj is Recipe {
  if (typeof obj !== 'object' || obj === null) return false;
  const r = obj as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.title === 'string' &&
    typeof r.duration_min === 'number' &&
    typeof r.servings === 'number' &&
    Array.isArray(r.ingredients) &&
    Array.isArray(r.steps)
  );
}

export function ImportButton() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Recipe[] | null>(null);
  const [mode, setMode] = useState<'merge' | 'replace'>('merge');
  const { importRecipes } = useRecipes();

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        const valid = arr.filter(isValidRecipe);
        if (valid.length === 0) {
          alert('Keine gültigen Rezepte in der Datei gefunden.');
          return;
        }
        setPending(valid);
      } catch {
        alert('Ungültige JSON-Datei.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function confirm() {
    if (pending) {
      importRecipes(pending, mode);
      setPending(null);
    }
  }

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        className="sr-only"
        onChange={handleFile}
        aria-label="JSON-Datei importieren"
        id="import-file"
      />
      <button
        type="button"
        className="toolbar__import-btn"
        onClick={() => fileRef.current?.click()}
        aria-label="Rezepte importieren"
      >
        Importieren
      </button>

      {pending && (
        <div className="import-dialog" role="dialog" aria-modal="true" aria-label="Import-Optionen">
          <div className="import-dialog__content">
            <h2 className="import-dialog__title">
              {pending.length} Rezept{pending.length !== 1 ? 'e' : ''} importieren
            </h2>
            <div className="import-dialog__mode" role="group" aria-label="Import-Modus">
              <label className="import-dialog__option">
                <input
                  type="radio"
                  name="import-mode"
                  value="merge"
                  checked={mode === 'merge'}
                  onChange={() => setMode('merge')}
                  aria-label="Zusammenführen: bestehende Rezepte behalten"
                />
                Zusammenführen (bestehende behalten)
              </label>
              <label className="import-dialog__option">
                <input
                  type="radio"
                  name="import-mode"
                  value="replace"
                  checked={mode === 'replace'}
                  onChange={() => setMode('replace')}
                  aria-label="Ersetzen: alle bisherigen Rezepte löschen"
                />
                Ersetzen (alle bisherigen löschen)
              </label>
            </div>
            <div className="import-dialog__actions">
              <button
                type="button"
                className="import-dialog__cancel"
                onClick={() => setPending(null)}
                aria-label="Import abbrechen"
              >
                Abbrechen
              </button>
              <button
                type="button"
                className="import-dialog__confirm"
                onClick={confirm}
                aria-label="Import bestätigen"
              >
                Importieren
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

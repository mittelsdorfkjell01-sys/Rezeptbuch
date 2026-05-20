'use client';

import React, { DragEvent, useRef } from 'react';
import { Ingredient } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const UNIT_OPTIONS = ['g', 'kg', 'ml', 'l', 'EL', 'TL', 'Stk', 'Prise', 'Bund', 'Scheibe', 'cm'];
const GROUP_OPTIONS = ['Gemüse', 'Obst', 'Kühlregal', 'Fleisch & Fisch', 'Backzutaten', 'Nudeln & Reis', 'Konserven', 'Gewürze', 'Öle & Essig', 'Brot & Backwaren', 'Sonstiges'];

interface Props {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
}

export function IngredientEditor({ ingredients, onChange }: Props) {
  const dragIndex = useRef<number | null>(null);

  function addRow() {
    onChange([
      ...ingredients,
      { id: uuidv4(), amount: 0, unit: 'g', name: '' },
    ]);
  }

  function removeRow(id: string) {
    onChange(ingredients.filter((i) => i.id !== id));
  }

  function updateRow(id: string, field: keyof Ingredient, value: string | number) {
    onChange(
      ingredients.map((i) =>
        i.id === id ? { ...i, [field]: field === 'amount' ? Number(value) : value } : i
      )
    );
  }

  function onDragStart(e: DragEvent<HTMLLIElement>, index: number) {
    dragIndex.current = index;
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(e: DragEvent<HTMLLIElement>, index: number) {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;
    const next = [...ingredients];
    const [moved] = next.splice(dragIndex.current, 1);
    next.splice(index, 0, moved);
    dragIndex.current = index;
    onChange(next);
  }

  function onDragEnd() {
    dragIndex.current = null;
  }

  return (
    <div className="ingredient-editor">
      <ul className="ingredient-editor__list">
        {ingredients.map((ing, index) => (
          <li
            key={ing.id}
            className="ingredient-editor__row"
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDragEnd={onDragEnd}
            aria-label={`Zutat ${index + 1}`}
          >
            <span className="ingredient-editor__drag-handle" aria-hidden="true">⠿</span>

            <label htmlFor={`ing-amount-${ing.id}`} className="ingredient-editor__sr-label">
              Menge
            </label>
            <input
              id={`ing-amount-${ing.id}`}
              className="ingredient-editor__amount"
              type="number"
              min="0"
              step="0.1"
              value={ing.amount || ''}
              onChange={(e) => updateRow(ing.id, 'amount', e.target.value)}
              placeholder="Menge"
              aria-label="Menge"
            />

            <label htmlFor={`ing-unit-${ing.id}`} className="ingredient-editor__sr-label">
              Einheit
            </label>
            <input
              id={`ing-unit-${ing.id}`}
              className="ingredient-editor__unit"
              type="text"
              list="unit-options"
              value={ing.unit}
              onChange={(e) => updateRow(ing.id, 'unit', e.target.value)}
              placeholder="Einheit"
              aria-label="Einheit"
            />
            <datalist id="unit-options">
              {UNIT_OPTIONS.map((u) => <option key={u} value={u} />)}
            </datalist>

            <label htmlFor={`ing-name-${ing.id}`} className="ingredient-editor__sr-label">
              Zutat
            </label>
            <input
              id={`ing-name-${ing.id}`}
              className="ingredient-editor__name"
              type="text"
              value={ing.name}
              onChange={(e) => updateRow(ing.id, 'name', e.target.value)}
              placeholder="Zutat"
              aria-label="Zutat"
            />

            <label htmlFor={`ing-group-${ing.id}`} className="ingredient-editor__sr-label">
              Gruppe
            </label>
            <input
              id={`ing-group-${ing.id}`}
              className="ingredient-editor__group"
              type="text"
              list="group-options"
              value={ing.group ?? ''}
              onChange={(e) => updateRow(ing.id, 'group', e.target.value)}
              placeholder="Gruppe (optional)"
              aria-label="Gruppe"
            />
            <datalist id="group-options">
              {GROUP_OPTIONS.map((g) => <option key={g} value={g} />)}
            </datalist>

            <button
              type="button"
              className="ingredient-editor__remove"
              onClick={() => removeRow(ing.id)}
              aria-label={`Zutat ${ing.name || index + 1} entfernen`}
            >
              Entfernen
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="ingredient-editor__add"
        onClick={addRow}
        aria-label="Zutat hinzufügen"
      >
        + Zutat hinzufügen
      </button>
    </div>
  );
}

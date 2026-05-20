'use client';

import React, { DragEvent, useRef } from 'react';
import { Step } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  steps: Step[];
  onChange: (steps: Step[]) => void;
}

export function StepEditor({ steps, onChange }: Props) {
  const dragIndex = useRef<number | null>(null);
  const sorted = [...steps].sort((a, b) => a.order - b.order);

  function addRow() {
    const next: Step = {
      id: uuidv4(),
      order: steps.length + 1,
      title: '',
      text: '',
    };
    onChange([...steps, next]);
  }

  function removeRow(id: string) {
    const next = steps
      .filter((s) => s.id !== id)
      .map((s, i) => ({ ...s, order: i + 1 }));
    onChange(next);
  }

  function updateRow(id: string, field: keyof Step, value: string | number) {
    onChange(
      steps.map((s) =>
        s.id === id
          ? {
              ...s,
              [field]:
                field === 'order' || field === 'timer_min'
                  ? value === ''
                    ? undefined
                    : Number(value)
                  : value,
            }
          : s
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
    const next = [...sorted];
    const [moved] = next.splice(dragIndex.current, 1);
    next.splice(index, 0, moved);
    dragIndex.current = index;
    onChange(next.map((s, i) => ({ ...s, order: i + 1 })));
  }

  function onDragEnd() {
    dragIndex.current = null;
  }

  return (
    <div className="step-editor">
      <ol className="step-editor__list">
        {sorted.map((step, index) => (
          <li
            key={step.id}
            className="step-editor__row"
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDragEnd={onDragEnd}
            aria-label={`Schritt ${step.order}`}
          >
            <span className="step-editor__drag-handle" aria-hidden="true">⠿</span>
            <span className="step-editor__order" aria-hidden="true">{step.order}</span>

            <div className="step-editor__fields">
              <label htmlFor={`step-title-${step.id}`} className="step-editor__label">
                Titel
              </label>
              <input
                id={`step-title-${step.id}`}
                className="step-editor__title"
                type="text"
                value={step.title}
                onChange={(e) => updateRow(step.id, 'title', e.target.value)}
                placeholder="Schritt-Titel"
                aria-label="Schritt-Titel"
              />

              <label htmlFor={`step-text-${step.id}`} className="step-editor__label">
                Beschreibung
              </label>
              <textarea
                id={`step-text-${step.id}`}
                className="step-editor__text"
                value={step.text}
                onChange={(e) => updateRow(step.id, 'text', e.target.value)}
                placeholder="Beschreibung des Schritts"
                rows={3}
                aria-label="Schritt-Beschreibung"
              />

              <label htmlFor={`step-timer-${step.id}`} className="step-editor__label">
                Timer (Minuten, optional)
              </label>
              <input
                id={`step-timer-${step.id}`}
                className="step-editor__timer"
                type="number"
                min="1"
                value={step.timer_min ?? ''}
                onChange={(e) => updateRow(step.id, 'timer_min', e.target.value)}
                placeholder="Timer in Minuten"
                aria-label="Timer in Minuten"
              />
            </div>

            <button
              type="button"
              className="step-editor__remove"
              onClick={() => removeRow(step.id)}
              aria-label={`Schritt ${step.order} entfernen`}
            >
              Entfernen
            </button>
          </li>
        ))}
      </ol>
      <button
        type="button"
        className="step-editor__add"
        onClick={addRow}
        aria-label="Schritt hinzufügen"
      >
        + Schritt hinzufügen
      </button>
    </div>
  );
}

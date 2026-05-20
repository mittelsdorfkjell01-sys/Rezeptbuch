'use client';

import React, { useState } from 'react';
import { useRecipes } from '@/context/RecipeContext';
import { ShoppingItem as ShoppingItemType } from '@/types';
import { aggregateIngredients } from '@/lib/utils/aggregation';
import { exportShoppingListText } from '@/lib/utils/export';
import { RecipePicker } from './RecipePicker';
import { ShoppingItemRow } from './ShoppingItemRow';

interface Props {
  onClose: () => void;
}

export function ShoppingExportModal({ onClose }: Props) {
  const { recipes } = useRecipes();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [servingsMap, setServingsMap] = useState<Record<string, number>>({});
  const [items, setItems] = useState<ShoppingItemType[]>([]);
  const [generated, setGenerated] = useState(false);

  function toggleRecipe(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function setServings(id: string, n: number) {
    setServingsMap((prev) => ({ ...prev, [id]: n }));
  }

  function generate() {
    const selected = recipes.filter((r) => selectedIds.includes(r.id));
    const aggregated = aggregateIngredients(selected, servingsMap);
    setItems(aggregated);
    setGenerated(true);
  }

  function toggleItem(index: number) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item))
    );
  }

  function downloadText() {
    const text = exportShoppingListText(items);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'einkaufsliste.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  const groups = items.reduce<Record<string, { items: ShoppingItemType[]; indices: number[] }>>(
    (acc, item, i) => {
      const g = item.group ?? 'Sonstiges';
      if (!acc[g]) acc[g] = { items: [], indices: [] };
      acc[g].items.push(item);
      acc[g].indices.push(i);
      return acc;
    },
    {}
  );

  return (
    <div
      className="shopping-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Einkaufsliste erstellen"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="shopping-modal__content">
        <div className="shopping-modal__header">
          <h2 className="shopping-modal__title">Einkaufsliste</h2>
          <button
            type="button"
            className="shopping-modal__close"
            onClick={onClose}
            aria-label="Modal schließen"
          >
            ✕
          </button>
        </div>

        <div className="shopping-modal__body">
          <div className="shopping-modal__picker-col">
            <h3 className="shopping-modal__col-title">Rezepte wählen</h3>
            <RecipePicker
              recipes={recipes}
              selectedIds={selectedIds}
              servingsMap={servingsMap}
              onToggle={toggleRecipe}
              onServingsChange={setServings}
            />
            <button
              type="button"
              className="shopping-modal__generate"
              onClick={generate}
              disabled={selectedIds.length === 0}
              aria-label="Einkaufsliste generieren"
            >
              Liste generieren
            </button>
          </div>

          <div className="shopping-modal__list-col">
            {!generated && (
              <p className="shopping-modal__empty" role="status">
                Wähle Rezepte aus und klicke auf „Liste generieren".
              </p>
            )}
            {generated && items.length === 0 && (
              <p className="shopping-modal__empty" role="status">
                Keine Zutaten vorhanden.
              </p>
            )}
            {generated && items.length > 0 && (
              <>
                <div className="shopping-modal__list-actions">
                  <button
                    type="button"
                    className="shopping-modal__export-btn"
                    onClick={downloadText}
                    aria-label="Als Textdatei herunterladen"
                  >
                    Als Text herunterladen
                  </button>
                </div>
                <div className="shopping-list">
                  {Object.entries(groups).map(([group, { items: groupItems, indices }]) => (
                    <section key={group} className="shopping-list__group" aria-labelledby={`group-${group}`}>
                      <h3 id={`group-${group}`} className="shopping-list__group-title">{group}</h3>
                      <ul className="shopping-list__items">
                        {groupItems.map((item, gi) => (
                          <ShoppingItemRow
                            key={`${item.name}-${item.unit}`}
                            item={item}
                            onToggle={() => toggleItem(indices[gi])}
                          />
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

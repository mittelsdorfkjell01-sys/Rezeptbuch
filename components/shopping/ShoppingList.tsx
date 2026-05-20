'use client';

import React, { useState } from 'react';
import { useRecipes } from '@/context/RecipeContext';
import { ShoppingItem as ShoppingItemType } from '@/types';
import { aggregateIngredients } from '@/lib/utils/aggregation';
import { exportRecipePdf, exportShoppingListText } from '@/lib/utils/export';
import { RecipePicker } from './RecipePicker';
import { ShoppingItemRow } from './ShoppingItemRow';

export function ShoppingList() {
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
    const merged = servingsMap;
    const aggregated = aggregateIngredients(selected, merged);
    setItems(aggregated);
    setGenerated(true);
  }

  function toggleItem(index: number) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item))
    );
  }

  function copyText() {
    const text = exportShoppingListText(items);
    navigator.clipboard.writeText(text).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
  }

  async function exportPdf() {
    await exportRecipePdf('shopping-list-print', 'einkaufsliste.pdf');
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'einkaufsliste.json';
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
    <div className="shopping-list-page">
      <div className="shopping-list-page__picker-col">
        <h2 className="shopping-list-page__col-title">Rezepte auswählen</h2>
        <RecipePicker
          recipes={recipes}
          selectedIds={selectedIds}
          servingsMap={servingsMap}
          onToggle={toggleRecipe}
          onServingsChange={setServings}
        />
        <button
          type="button"
          className="shopping-list-page__generate"
          onClick={generate}
          disabled={selectedIds.length === 0}
          aria-label="Einkaufsliste generieren"
        >
          Liste generieren
        </button>
      </div>

      <div className="shopping-list-page__list-col">
        <div className="shopping-list-page__list-header">
          <h2 className="shopping-list-page__col-title">Einkaufsliste</h2>
          {generated && items.length > 0 && (
            <div className="shopping-list-page__export-actions">
              <button
                type="button"
                className="shopping-list-page__export-btn"
                onClick={exportPdf}
                aria-label="Einkaufsliste als PDF exportieren"
              >
                Als PDF
              </button>
              <button
                type="button"
                className="shopping-list-page__export-btn"
                onClick={copyText}
                aria-label="Einkaufsliste als Text kopieren"
              >
                Text kopieren
              </button>
              <button
                type="button"
                className="shopping-list-page__export-btn"
                onClick={exportJson}
                aria-label="Einkaufsliste als JSON herunterladen"
              >
                JSON
              </button>
            </div>
          )}
        </div>

        {!generated && (
          <p className="shopping-list-page__empty" role="status">
            Wähle Rezepte aus und klicke auf „Liste generieren".
          </p>
        )}

        {generated && items.length === 0 && (
          <p className="shopping-list-page__empty" role="status">
            Keine Zutaten vorhanden.
          </p>
        )}

        {generated && items.length > 0 && (
          <div id="shopping-list-print" className="shopping-list">
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
        )}
      </div>
    </div>
  );
}

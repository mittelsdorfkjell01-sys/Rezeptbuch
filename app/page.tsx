'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { RecipeGrid } from '@/components/recipes/RecipeGrid';
import { ShoppingExportModal } from '@/components/shopping/ShoppingExportModal';
import { ImportButton } from '@/components/layout/ImportButton';
import { useRecipes } from '@/context/RecipeContext';
import { exportRecipesJson } from '@/lib/utils/export';

export default function HomePage() {
  const { recipes } = useRecipes();
  const [showShopping, setShowShopping] = useState(false);

  return (
    <AppShell>
      <header className="dashboard__header">
        <h1 className="dashboard__title">Mein Rezeptbuch</h1>
        <div className="dashboard__actions">
          <button
            type="button"
            className="dashboard__export-btn"
            onClick={() => exportRecipesJson(recipes)}
            aria-label="Rezepte als JSON exportieren"
          >
            Exportieren
          </button>
          <ImportButton />
          <button
            type="button"
            className="dashboard__shopping-btn"
            onClick={() => setShowShopping(true)}
            aria-label="Einkaufsliste erstellen"
          >
            Einkaufsliste
          </button>
          <Link href="/rezept/neu" className="dashboard__add-btn" aria-label="Neues Rezept hinzufügen">
            + Hinzufügen
          </Link>
        </div>
      </header>
      <RecipeGrid recipes={recipes} />
      {showShopping && <ShoppingExportModal onClose={() => setShowShopping(false)} />}
    </AppShell>
  );
}

'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { RecipeEditor } from '@/components/recipes/RecipeEditor';
import { useRecipes } from '@/context/RecipeContext';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditRecipePage({ params }: Props) {
  const { id } = React.use(params);
  const { recipes } = useRecipes();
  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) return notFound();

  return (
    <AppShell>
      <RecipeEditor initial={recipe} />
    </AppShell>
  );
}

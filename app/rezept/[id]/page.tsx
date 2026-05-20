'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { RecipeDetail } from '@/components/recipes/RecipeDetail';
import { useRecipes } from '@/context/RecipeContext';

interface Props {
  params: Promise<{ id: string }>;
}

export default function RecipeDetailPage({ params }: Props) {
  const { id } = React.use(params);
  const { recipes } = useRecipes();
  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) return notFound();

  return (
    <AppShell>
      <RecipeDetail recipe={recipe} />
    </AppShell>
  );
}

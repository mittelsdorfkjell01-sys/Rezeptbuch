import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { RecipeEditor } from '@/components/recipes/RecipeEditor';

export default function NewRecipePage() {
  return (
    <AppShell>
      <RecipeEditor />
    </AppShell>
  );
}

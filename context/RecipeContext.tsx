'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Recipe } from '@/types';
import { loadRecipes, saveRecipes } from '@/lib/store/RecipeStore';
import { SEED_RECIPES } from '@/lib/seed';

interface RecipeContextValue {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  importRecipes: (incoming: Recipe[], mode: 'merge' | 'replace') => void;
}

const RecipeContext = createContext<RecipeContextValue | null>(null);

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const stored = loadRecipes();
    if (stored.length === 0) {
      saveRecipes(SEED_RECIPES);
      setRecipes(SEED_RECIPES);
    } else {
      setRecipes(stored);
    }
  }, []);

  const addRecipe = useCallback((recipe: Recipe) => {
    setRecipes((prev) => {
      const next = [...prev, recipe];
      saveRecipes(next);
      return next;
    });
  }, []);

  const updateRecipe = useCallback((recipe: Recipe) => {
    setRecipes((prev) => {
      const next = prev.map((r) => (r.id === recipe.id ? recipe : r));
      saveRecipes(next);
      return next;
    });
  }, []);

  const deleteRecipe = useCallback((id: string) => {
    setRecipes((prev) => {
      const next = prev.filter((r) => r.id !== id);
      saveRecipes(next);
      return next;
    });
  }, []);

  const importRecipes = useCallback((incoming: Recipe[], mode: 'merge' | 'replace') => {
    setRecipes((prev) => {
      const next =
        mode === 'replace'
          ? incoming
          : [
              ...prev,
              ...incoming.filter((r) => !prev.some((p) => p.id === r.id)),
            ];
      saveRecipes(next);
      return next;
    });
  }, []);

  return (
    <RecipeContext.Provider value={{ recipes, addRecipe, updateRecipe, deleteRecipe, importRecipes }}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes(): RecipeContextValue {
  const ctx = useContext(RecipeContext);
  if (!ctx) throw new Error('useRecipes must be used within RecipeProvider');
  return ctx;
}

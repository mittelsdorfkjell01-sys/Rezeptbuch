import { Recipe } from '@/types';

const STORAGE_KEY_RECIPES = 'rezeptbuch_recipes';
const STORAGE_KEY_FAVORITES = 'rezeptbuch_favorites';
const STORAGE_KEY_RECENTLY_VIEWED = 'rezeptbuch_recently_viewed';

export function loadRecipes(): Recipe[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECIPES);
    return raw ? (JSON.parse(raw) as Recipe[]) : [];
  } catch {
    return [];
  }
}

export function saveRecipes(recipes: Recipe[]): void {
  localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify(recipes));
}

export function addRecipe(recipe: Recipe): void {
  const recipes = loadRecipes();
  saveRecipes([...recipes, recipe]);
}

export function updateRecipe(updated: Recipe): void {
  const recipes = loadRecipes().map((r) => (r.id === updated.id ? updated : r));
  saveRecipes(recipes);
}

export function deleteRecipe(id: string): void {
  saveRecipes(loadRecipes().filter((r) => r.id !== id));
}

export function loadFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAVORITES);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(ids: string[]): void {
  localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(ids));
}

export function loadRecentlyViewed(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECENTLY_VIEWED);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(id: string): void {
  const recent = loadRecentlyViewed().filter((r) => r !== id);
  const updated = [id, ...recent].slice(0, 10);
  localStorage.setItem(STORAGE_KEY_RECENTLY_VIEWED, JSON.stringify(updated));
}

export interface Ingredient {
  id: string;
  amount: number;
  unit: string;
  name: string;
  group?: string;
}

export interface Step {
  id: string;
  order: number;
  title: string;
  text: string;
  timer_min?: number;
}

export type Difficulty = 'einfach' | 'mittel' | 'aufwändig';
export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  photo_url?: string;
  duration_min: number;
  servings: number;
  difficulty: Difficulty;
  rating?: Rating;
  notes?: string;
  ingredients: Ingredient[];
  steps: Step[];
  created_at: string;
  updated_at: string;
}

export interface ShoppingItem {
  name: string;
  total_amount: number;
  unit: string;
  group?: string;
  checked: boolean;
  recipe_names: string[];
}

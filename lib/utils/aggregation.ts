import { Recipe, ShoppingItem } from '@/types';
import { scaleAmount } from './scaling';

export function aggregateIngredients(
  recipes: Recipe[],
  servingsMap: Record<string, number>
): ShoppingItem[] {
  const map = new Map<string, ShoppingItem>();

  for (const recipe of recipes) {
    const targetServings = servingsMap[recipe.id] ?? recipe.servings;
    for (const ing of recipe.ingredients) {
      const key = `${ing.name.toLowerCase()}__${ing.unit.toLowerCase()}`;
      const scaled = scaleAmount(ing.amount, recipe.servings, targetServings);
      const existing = map.get(key);
      if (existing) {
        existing.total_amount = Math.round((existing.total_amount + scaled) * 10) / 10;
        if (!existing.recipe_names.includes(recipe.title)) {
          existing.recipe_names.push(recipe.title);
        }
      } else {
        map.set(key, {
          name: ing.name,
          total_amount: scaled,
          unit: ing.unit,
          group: ing.group,
          checked: false,
          recipe_names: [recipe.title],
        });
      }
    }
  }

  const items = Array.from(map.values());
  items.sort((a, b) => {
    const groupA = a.group ?? 'zzz';
    const groupB = b.group ?? 'zzz';
    if (groupA !== groupB) return groupA.localeCompare(groupB);
    return a.name.localeCompare(b.name);
  });

  return items;
}

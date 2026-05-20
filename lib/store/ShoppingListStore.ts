const STORAGE_KEY_SHOPPING_LIST = 'rezeptbuch_shopping_list';

export function clearShoppingList(): void {
  localStorage.removeItem(STORAGE_KEY_SHOPPING_LIST);
}

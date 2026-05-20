'use client';

import React from 'react';
import { ShoppingItem } from '@/types';
import { formatAmount } from '@/lib/utils/scaling';

interface Props {
  item: ShoppingItem;
  onToggle: () => void;
}

export function ShoppingItemRow({ item, onToggle }: Props) {
  return (
    <li className={`shopping-item${item.checked ? ' shopping-item--checked' : ''}`}>
      <input
        type="checkbox"
        id={`shop-${item.name}-${item.unit}`}
        className="shopping-item__checkbox"
        checked={item.checked}
        onChange={onToggle}
        aria-label={`${item.name} abgehakt`}
      />
      <label
        htmlFor={`shop-${item.name}-${item.unit}`}
        className="shopping-item__label"
      >
        <span className="shopping-item__amount">{formatAmount(item.total_amount)}</span>
        <span className="shopping-item__unit">{item.unit}</span>
        <span className="shopping-item__name">{item.name}</span>
        <span
          className="shopping-item__source"
          title={`Aus: ${item.recipe_names.join(', ')}`}
          aria-label={`Aus Rezept${item.recipe_names.length > 1 ? 'en' : ''}: ${item.recipe_names.join(', ')}`}
        >
          ({item.recipe_names.join(', ')})
        </span>
      </label>
    </li>
  );
}

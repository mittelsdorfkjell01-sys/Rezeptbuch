'use client';

import React, { useState, KeyboardEvent } from 'react';

interface Props {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ tags, onChange, placeholder = 'Tag hinzufügen…' }: Props) {
  const [input, setInput] = useState('');

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      const tag = input.trim().replace(/,$/, '');
      if (tag && !tags.includes(tag)) {
        onChange([...tags, tag]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  return (
    <div className="tag-input">
      <div className="tag-input__tags">
        {tags.map((tag) => (
          <span key={tag} className="tag-input__tag">
            {tag}
            <button
              type="button"
              className="tag-input__remove"
              onClick={() => removeTag(tag)}
              aria-label={`Tag ${tag} entfernen`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        className="tag-input__field"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Neues Tag eingeben"
      />
    </div>
  );
}

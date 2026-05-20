'use client';

import React, { ChangeEvent } from 'react';

interface Props {
  value?: string;
  onChange: (url: string) => void;
}

export function PhotoUpload({ value, onChange }: Props) {
  function handleUrl(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="photo-upload">
      {value && (
        <div className="photo-upload__preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Vorschau" className="photo-upload__img" />
          <button
            type="button"
            className="photo-upload__remove"
            onClick={() => onChange('')}
            aria-label="Foto entfernen"
          >
            Foto entfernen
          </button>
        </div>
      )}
      <div className="photo-upload__inputs">
        <label className="photo-upload__label" htmlFor="photo-url">
          Foto-URL
        </label>
        <input
          id="photo-url"
          className="photo-upload__url"
          type="url"
          placeholder="https://..."
          value={value?.startsWith('data:') ? '' : (value ?? '')}
          onChange={handleUrl}
          aria-label="Foto-URL eingeben"
        />
        <label className="photo-upload__label" htmlFor="photo-file">
          Oder Datei hochladen
        </label>
        <input
          id="photo-file"
          className="photo-upload__file"
          type="file"
          accept="image/*"
          onChange={handleFile}
          aria-label="Foto hochladen"
        />
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found__title">404 – Nicht gefunden</h1>
      <p className="not-found__message">Diese Seite existiert nicht.</p>
      <Link href="/" className="not-found__link" aria-label="Zurück zur Übersicht">
        Zurück zur Übersicht
      </Link>
    </div>
  );
}

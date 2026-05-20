'use client';

import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function AppShell({ children }: Props) {
  return (
    <div className="app-shell">
      <main className="app-shell__main" role="main">
        {children}
      </main>
    </div>
  );
}

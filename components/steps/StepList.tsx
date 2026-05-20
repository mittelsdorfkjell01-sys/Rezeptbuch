'use client';

import React from 'react';
import { Step } from '@/types';
import { StepTimer } from './StepTimer';

interface Props {
  steps: Step[];
}

export function StepList({ steps }: Props) {
  const sorted = [...steps].sort((a, b) => a.order - b.order);

  return (
    <ol className="step-list">
      {sorted.map((step) => (
        <li key={step.id} className="step-list__item">
          <div className="step-list__header">
            <span className="step-list__order" aria-hidden="true">{step.order}</span>
            <h3 className="step-list__title">{step.title}</h3>
          </div>
          <p className="step-list__text">{step.text}</p>
          {step.timer_min && (
            <div className="step-list__timer">
              <StepTimer minutes={step.timer_min} />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

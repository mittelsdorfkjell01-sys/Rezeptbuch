'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Props {
  minutes: number;
}

export function StepTimer({ minutes }: Props) {
  const totalSeconds = minutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  function reset() {
    setRunning(false);
    setRemaining(totalSeconds);
  }

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="step-timer" aria-label={`Timer: ${display}`}>
      <span className="step-timer__display" aria-live="polite" aria-atomic="true">
        {display}
      </span>
      <button
        type="button"
        className="step-timer__toggle"
        onClick={() => setRunning((r) => !r)}
        aria-label={running ? 'Timer pausieren' : 'Timer starten'}
      >
        {running ? 'Pausieren' : remaining === totalSeconds ? 'Starten' : 'Fortsetzen'}
      </button>
      <button
        type="button"
        className="step-timer__reset"
        onClick={reset}
        aria-label="Timer zurücksetzen"
      >
        Zurücksetzen
      </button>
    </div>
  );
}

export function scaleAmount(
  baseAmount: number,
  baseServings: number,
  targetServings: number
): number {
  const scaled = baseAmount * (targetServings / baseServings);
  return scaled >= 10 ? Math.round(scaled) : Math.round(scaled * 10) / 10;
}

export function formatAmount(amount: number): string {
  if (amount === Math.floor(amount)) return String(amount);
  return String(amount);
}

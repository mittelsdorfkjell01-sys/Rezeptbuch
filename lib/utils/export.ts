'use client';

import { Recipe, ShoppingItem } from '@/types';

export function exportRecipesJson(recipes: Recipe[]): void {
  const date = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(recipes, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rezeptbuch-backup-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportShoppingListText(items: ShoppingItem[]): string {
  const groups = new Map<string, ShoppingItem[]>();
  for (const item of items) {
    const g = item.group ?? 'Sonstiges';
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(item);
  }

  const lines: string[] = ['Einkaufsliste', '=============', ''];
  for (const [group, groupItems] of groups) {
    lines.push(`[${group}]`);
    for (const item of groupItems) {
      lines.push(`${item.checked ? '[x]' : '[ ]'} ${item.total_amount} ${item.unit} ${item.name}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

export async function exportRecipePdf(elementId: string, filename: string): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const { default: html2canvas } = await import('html2canvas');
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let y = 10;
  let remaining = imgHeight;

  while (remaining > 0) {
    const sliceHeight = Math.min(remaining, pageHeight - 20);
    const sourceY = (imgHeight - remaining) * (canvas.height / imgHeight);
    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = sliceHeight * (canvas.height / imgHeight);
    const ctx = sliceCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(canvas, 0, -sourceY);
    }
    pdf.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', 10, y, imgWidth, sliceHeight);
    remaining -= sliceHeight;
    if (remaining > 0) {
      pdf.addPage();
      y = 10;
    }
  }

  pdf.save(filename);
}

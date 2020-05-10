export function formatValue(num: number, decimals = true) {
  if (isNaN(num)) return '0.00';

  return `${num
    .toFixed(decimals ? 2 : 0)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
}

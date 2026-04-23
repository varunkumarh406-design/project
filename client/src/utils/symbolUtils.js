/**
 * Formats a stock symbol for clean display in the UI.
 * e.g., RELIANCE.NS -> RELIANCE
 */
export const formatDisplaySymbol = (symbol) => {
  if (!symbol) return '';
  // Remove .NS (NSE) or .BO (BSE) suffixes
  return symbol.split('.')[0].replace('NSE:', '').replace('BSE:', '');
};

/**
 * Maps a Yahoo Finance symbol to a TradingView compatible symbol.
 * e.g., RELIANCE.NS -> NSE:RELIANCE
 */
export const mapToTradingView = (symbol) => {
  if (!symbol) return 'NSE:RELIANCE';
  const s = symbol.toUpperCase();
  if (s.endsWith('.NS')) return `NSE:${s.replace('.NS', '')}`;
  if (s.endsWith('.BO')) return `BSE:${s.replace('.BO', '')}`;
  // If it already has a prefix, return as is
  if (s.includes(':')) return s;
  return s;
};

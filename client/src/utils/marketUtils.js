/**
 * Indian Market Hours Utility (IST: UTC+5:30)
 * Trading Session: 9:00 AM to 3:30 PM
 */

export const isMarketOpen = () => {
  const now = new Date();
  
  // Calculate IST time
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + istOffset);
  
  const day = istTime.getDay();
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  
  // Weekends
  if (day === 0 || day === 6) return false;
  
  const currentTime = hours * 60 + minutes;
  const openTime = 9 * 60; // 09:00
  const closeTime = 15 * 60 + 30; // 15:30
  
  return currentTime >= openTime && currentTime <= closeTime;
};

export const getMarketStatus = () => {
  const open = isMarketOpen();
  if (open) return { status: 'OPEN', color: 'text-emerald-500', bg: 'bg-emerald-50' };
  return { status: 'CLOSED', color: 'text-red-500', bg: 'bg-red-50' };
};

export const getNextMarketOpen = () => {
  // Simple version: next day at 9:00 AM
  return "Next session starts at 9:00 AM IST";
};

import { useEffect, useRef, memo } from 'react';
import { mapToTradingView } from '../../utils/symbolUtils';

const TradingViewChart = ({ symbol }) => {
  const containerRef = useRef();
  const tvSymbol = mapToTradingView(symbol);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    // Create unique ID for the widget container
    const widgetId = `tv-widget-${Math.random().toString(36).substring(7)}`;
    const widgetDiv = document.createElement('div');
    widgetDiv.id = widgetId;
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';
    container.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": tvSymbol,
      "interval": "D",
      "timezone": "Asia/Kolkata",
      "theme": "light",
      "style": "1",
      "locale": "en",
      "allow_symbol_change": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    });

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [tvSymbol]);

  return (
    <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm min-h-[500px]">
      <div ref={containerRef} className="w-full h-full" id="tradingview_container" />
    </div>
  );
};

export default memo(TradingViewChart);

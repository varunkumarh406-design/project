import { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

const StockCandleChart = ({ data }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();

  useEffect(() => {
    console.log('[DEBUG] StockCandleChart Rendering with data:', data?.length, 'candles');
    
    if (!data || data.length === 0) {
      console.warn('[DEBUG] No data provided to StockCandleChart');
      return;
    }

    // Create chart if not exists
    if (!chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#64748b',
          fontFamily: 'Inter, sans-serif',
        },
        grid: {
          vertLines: { color: '#f1f5f9' },
          horzLines: { color: '#f1f5f9' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
        timeScale: {
          borderVisible: false,
          timeVisible: true,
          secondsVisible: false,
        },
        rightPriceScale: {
          borderVisible: false,
        },
      });

      seriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });
    }

    // Update data
    try {
      seriesRef.current.setData(data);
      chartRef.current.timeScale().fitContent();
    } catch (err) {
      console.error('[DEBUG] Error setting chart data:', err);
    }

    const handleResize = () => {
      chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data]);

  return (
    <div className="relative w-full h-full bg-white rounded-2xl p-4 border border-slate-50 shadow-sm">
      <div ref={chartContainerRef} className="w-full h-full" />
      {(!data || data.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 rounded-2xl">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Waiting for market data...</p>
        </div>
      )}
    </div>
  );
};

export default StockCandleChart;

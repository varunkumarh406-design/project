import { useEffect, useRef, memo } from 'react';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';

const StockCandleChart = ({ data }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0 || !chartContainerRef.current) return;

    // Create chart if not exists
    if (!chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#64748b',
          fontFamily: 'Inter, sans-serif',
        },
        grid: {
          vertLines: { color: 'rgba(241, 245, 249, 0.5)' },
          horzLines: { color: 'rgba(241, 245, 249, 0.5)' },
        },
        crosshair: {
            mode: CrosshairMode.Normal,
        },
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight || 450,
        timeScale: {
          borderVisible: false,
          timeVisible: true,
          secondsVisible: false,
          barSpacing: 10,
        },
        rightPriceScale: {
          borderVisible: false,
          scaleMargins: {
            top: 0.1,
            bottom: 0.1,
          },
        },
        handleScroll: true,
        handleScale: true,
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
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ 
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight
        });
      }
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
    <div className="relative w-full h-full bg-white rounded-3xl p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md">
      <div ref={chartContainerRef} className="w-full h-full" />
      {(!data || data.length === 0) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm rounded-3xl">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Analyzing Market Data...</p>
        </div>
      )}
    </div>
  );
};

export default memo(StockCandleChart);

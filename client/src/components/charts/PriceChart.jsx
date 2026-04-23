import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const PriceChart = ({ data }) => {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-secondary">No historical data available</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        <XAxis 
          dataKey="date" 
          stroke="#64748b" 
          fontSize={10} 
          tickFormatter={(val) => val.split('-').slice(1).join('/')}
        />
        <YAxis 
          stroke="#64748b" 
          fontSize={10} 
          domain={['auto', 'auto']}
          tickFormatter={(val) => `$${val}`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#161618', border: '1px solid #27272a', borderRadius: '8px' }}
          labelStyle={{ color: '#64748b' }}
        />
        <Area type="monotone" dataKey="price" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPrice)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;

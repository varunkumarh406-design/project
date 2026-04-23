import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const PriceChart = ({ data }) => {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-slate-400">No historical data available</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis 
          dataKey="date" 
          stroke="#94a3b8" 
          fontSize={11} 
          tickLine={false}
          axisLine={false}
          tickFormatter={(val) => val.split('-').slice(1).join('/')}
        />
        <YAxis 
          stroke="#94a3b8" 
          fontSize={11} 
          tickLine={false}
          axisLine={false}
          domain={['auto', 'auto']}
          tickFormatter={(val) => `$${val}`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
          labelStyle={{ color: '#64748b', fontWeight: '600' }}
        />
        <Area type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;

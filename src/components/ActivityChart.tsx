/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { DailyData } from '../types';

interface ActivityChartProps {
  data: DailyData[];
  metric: 'strain' | 'recovery';
  color: string;
}

export function ActivityChart({ data, metric, color }: ActivityChartProps) {
  return (
    <div className="w-full h-full mt-2" id={`chart-${metric}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0.04}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#474d5a" opacity={0.9} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#bbb4a6', fontSize: 11, fontWeight: 600 }} 
            dy={10}
          />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#353a45', border: '1px solid #4c5261', borderRadius: '12px', fontSize: '11px', fontWeight: 600, color: '#f0ece4', boxShadow: '0 12px 28px rgba(11, 9, 8, 0.42)' }}
            itemStyle={{ color: color }}
            cursor={{ stroke: '#6b7283', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey={metric}
            stroke={color}
            strokeWidth={3}
            fillOpacity={1}
            fill={`url(#gradient-${metric})`}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

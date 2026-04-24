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
    <div className="w-full h-full mt-4" id={`chart-${metric}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2A2E" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9A9A9E', fontSize: 10, fontWeight: 700 }} 
            dy={10}
          />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#161618', border: '1px solid #2A2A2E', borderRadius: '12px', fontSize: '11px', fontWeight: 600, color: '#F0F0F0' }}
            itemStyle={{ color: color }}
            cursor={{ stroke: '#2A2A2E', strokeWidth: 1 }}
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

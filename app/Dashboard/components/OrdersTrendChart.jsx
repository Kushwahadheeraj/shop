"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const OrdersTrendChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-yellow-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <p>No data available</p>
        </div>
      </div>
    );
  }

  // Transform data for the chart
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    online: item.online,
    offline: item.offline
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 'dataMax + 50']}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ color: '#374151', fontWeight: '500' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="online" 
            stroke="#fbbf24" 
            strokeWidth={3}
            dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#fbbf24', strokeWidth: 2 }}
            name="Online"
          />
          <Line 
            type="monotone" 
            dataKey="offline" 
            stroke="#1f2937" 
            strokeWidth={3}
            dot={{ fill: '#1f2937', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#1f2937', strokeWidth: 2 }}
            name="Offline"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersTrendChart;

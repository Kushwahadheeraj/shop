"use client";
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CategoriesDonutChart = ({ data = [] }) => {
  const colors = ['#fbbf24', '#1f2937', '#6b7280', '#9ca3af', '#d1d5db'];
  
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

  const chartData = data.map((item, index) => ({
    name: item.name,
    value: item.value,
    color: colors[index % colors.length]
  }));

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`₹${value.toLocaleString()}`, 'Value']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Custom Legend */}
      <div className="mt-4 space-y-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700">{item.name}</span>
            </div>
            <span className="font-medium text-gray-900">
              ₹{item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      
      {/* Total Value */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-lg font-semibold text-gray-900">
            ₹{totalValue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoriesDonutChart;

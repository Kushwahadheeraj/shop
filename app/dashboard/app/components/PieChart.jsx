"use client";
import React, { memo, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#fbbf24', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#ef4444', '#6366f1', '#84cc16'];

const PieChartComponent = memo(({ data = [], dataKey = 'value', nameKey = 'name' }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-yellow-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-sm">No data available</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-2 sm:p-3 border border-gray-200 rounded-lg shadow-lg text-xs sm:text-sm">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-gray-600">
            {dataKey === 'value' ? `${data.value} items` : `${data.value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Responsive outerRadius: smaller on mobile to prevent cutting
  const outerRadius = isMobile ? 55 : 75;
  // Calculate proper margins based on screen size
  const chartMargin = isMobile 
    ? { top: 10, right: 10, bottom: 60, left: 10 }
    : { top: 10, right: 10, bottom: 50, left: 10 };

  return (
    <div className="h-64 sm:h-72 md:h-80 w-full mb-4 sm:mb-6 flex items-center justify-center overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={chartMargin}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => {
              // On mobile, show just percentage to save space and prevent overflow
              if (isMobile) {
                return `${(percent * 100).toFixed(0)}%`;
              }
              // On desktop, show full label but truncate if too long
              const label = name.length > 18 ? name.substring(0, 15) + '...' : name;
              return `${label}: ${(percent * 100).toFixed(0)}%`;
            }}
            outerRadius={outerRadius}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={isMobile ? 50 : 35}
            iconType="circle"
            wrapperStyle={{ 
              paddingTop: isMobile ? '8px' : '12px',
              paddingBottom: '0px',
              fontSize: isMobile ? '10px' : '12px',
              lineHeight: isMobile ? '14px' : '16px'
            }}
            formatter={(value) => {
              // Truncate long labels on mobile to prevent overflow
              if (isMobile && value.length > 18) {
                return value.substring(0, 15) + '...';
              }
              return value;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

PieChartComponent.displayName = 'PieChartComponent';

export default PieChartComponent;


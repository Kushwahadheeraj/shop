"use client";
import React, { memo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MonthlyChart = memo(({ data = [] }) => {
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

  // Responsive margins: reduce left/right on mobile, keep desktop same
  const chartMargin = isMobile 
    ? { top: 5, right: 5, left: 0, bottom: 5 }
    : { top: 5, right: 30, left: 20, bottom: 5 };

  return (
    <div className="h-48 sm:h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={chartMargin}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="day" 
            stroke="#6b7280"
            fontSize={isMobile ? 9 : 11}
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={isMobile ? 70 : 60}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={isMobile ? 10 : 12}
            tickLine={false}
            axisLine={false}
            width={isMobile ? 30 : 40}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontSize: isMobile ? '11px' : '12px'
            }}
            labelStyle={{ color: '#374151', fontWeight: '500', fontSize: isMobile ? '11px' : '12px' }}
            formatter={(value, name) => [
              `${value} orders`, 
              name === 'orders' ? 'Orders' : 'Deliveries'
            ]}
          />
          <Bar 
            dataKey="orders" 
            fill="#fbbf24" 
            radius={[2, 2, 0, 0]}
            name="Orders"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

MonthlyChart.displayName = 'MonthlyChart';

export default MonthlyChart;

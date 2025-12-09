"use client";
import React, { memo, useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AreaChartComponent = memo(({ data = [], type = 'orders' }) => {
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

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 sm:p-3 border border-gray-200 rounded-lg shadow-lg text-xs sm:text-sm">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Responsive margins: reduce left/right on mobile, keep desktop same
  const chartMargin = isMobile 
    ? { top: 20, right: 5, left: 0, bottom: 20 }
    : { top: 20, right: 30, left: 20, bottom: 20 };

  return (
    <div className="h-64 sm:h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data} 
          margin={chartMargin}
        >
          <defs>
            <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="deliveriesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1f2937" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#1f2937" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            stroke="#9ca3af"
            fontSize={isMobile ? 10 : 12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#6b7280' }}
            angle={isMobile ? -45 : 0}
            textAnchor={isMobile ? 'end' : 'middle'}
            height={isMobile ? 60 : 30}
          />
          <YAxis 
            stroke="#9ca3af"
            fontSize={isMobile ? 10 : 12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#6b7280' }}
            width={isMobile ? 30 : 40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={isMobile ? 40 : 36}
            iconType="rect"
            wrapperStyle={{ 
              paddingTop: isMobile ? '10px' : '20px',
              fontSize: isMobile ? '10px' : '12px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="orders" 
            stackId="1"
            stroke="#fbbf24" 
            fill="url(#ordersGradient)"
            strokeWidth={2}
            name="Orders"
          />
          <Area 
            type="monotone" 
            dataKey="deliveries" 
            stackId="1"
            stroke="#1f2937" 
            fill="url(#deliveriesGradient)"
            strokeWidth={2}
            name="Deliveries"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

AreaChartComponent.displayName = 'AreaChartComponent';

export default AreaChartComponent;

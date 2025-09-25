"use client";
import React from 'react';

const OrdersGridChart = ({ data = [] }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
  
  // Create a grid data structure
  const gridData = days.map(day => 
    hours.map(hour => {
      const item = data.find(d => d.day === day && d.hour === hour);
      return {
        day,
        hour,
        orders: item?.orders || 0
      };
    })
  );

  // Calculate max orders for color intensity
  const maxOrders = Math.max(...data.map(d => d.orders), 1);

  const getColorIntensity = (orders) => {
    const intensity = Math.min(orders / maxOrders, 1);
    const opacity = 0.1 + (intensity * 0.9);
    return `rgba(251, 191, 36, ${opacity})`; // Yellow with varying opacity
  };

  return (
    <div className="h-64 w-full">
      <div className="grid grid-cols-7 gap-1 h-full">
        {gridData.map((dayData, dayIndex) => (
          <div key={dayIndex} className="flex flex-col gap-1">
            {dayData.map((item, hourIndex) => (
              <div
                key={`${dayIndex}-${hourIndex}`}
                className="flex-1 rounded-sm border border-gray-200 hover:border-yellow-400 hover:shadow-md transition-all duration-200 cursor-pointer group relative"
                style={{ backgroundColor: getColorIntensity(item.orders) }}
                title={`${item.day} ${item.hour}: ${item.orders} orders`}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-medium text-yellow-800 bg-white px-2 py-1 rounded shadow-sm border border-yellow-200">
                    {item.orders}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0.2, 0.4, 0.6, 0.8, 1].map((intensity, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-sm border border-gray-200"
                style={{ backgroundColor: `rgba(251, 191, 36, ${intensity})` }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default OrdersGridChart;

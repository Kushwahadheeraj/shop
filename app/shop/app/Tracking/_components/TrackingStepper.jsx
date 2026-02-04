import React from 'react';
import { Check, Truck, ChevronRight } from 'lucide-react';

export default function TrackingStepper({ order }) {
  const steps = [
    { key: 'created', label: 'Ordered' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivery' }
  ];

  const currentStatus = order.status;
  const statusOrder = ['created', 'shipped', 'out_for_delivery', 'delivered'];
  let currentStepIndex = statusOrder.indexOf(currentStatus);

  // Handle cancelled or unknown
  if (currentStepIndex === -1) {
    if (currentStatus === 'cancelled') {
        currentStepIndex = 0; 
    } else {
        currentStepIndex = 0;
    }
  }

  const getStepDate = (stepKey) => {
    if (stepKey === 'created') {
       const track = order.tracking?.find(t => t.status === 'created');
       const dateStr = track?.at || order.createdAt;
       return dateStr ? new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '';
    }

    const track = order.tracking?.find(t => t.status === stepKey);
    return track?.at ? new Date(track.at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '';
  };

  // Calculate progress width
  // If current is index 2 (Out for Delivery), we want line to go past index 2 towards index 3
  // 3 intervals for 4 steps: 0-1, 1-2, 2-3. Total width 100%. Each interval ~33.33%
  // If index 0: width 0% (or small start?) -> typically 0% if just ordered.
  // If index 1: width 33%
  // If index 2: width 66% + extra for truck?
  // Let's base it strictly on completed steps for the solid green line.
  // BUT, if we want the truck "on the way", we might extend the green line slightly?
  // The image shows the green line going ALL the way to the truck.
  // Let's assume truck is at (Index + 0.5) if in progress?
  // Actually simpler: 
  // If status is 'delivered', width 100%.
  // If 'out_for_delivery', truck is between out (2) and delivery (3). Position ~ 2.5/3 = 83%.
  // If 'shipped', truck is between shipped (1) and out (2). Position ~ 1.5/3 = 50%.
  // If 'created', truck is... maybe just at 0? Or between 0 and 1? Position ~ 0.5/3 = 16%.

  let progressPercent = 0;
  let truckPositionPercent = 0;
  
  if (currentStatus === 'delivered') {
      progressPercent = 100;
      truckPositionPercent = 100; // Truck at end or hidden?
  } else {
      // Calculate position based on step index
      // We have 3 segments.
      const segmentWidth = 100 / (steps.length - 1); // 33.33%
      
      // Base progress on current completed step
      progressPercent = currentStepIndex * segmentWidth;

      // Add "in transit" simulation
      // If we are at step i, we assume we are moving to i+1
      // So add half a segment
      const halfSegment = segmentWidth / 2;
      
      // Truck position
      truckPositionPercent = progressPercent + halfSegment;
      
      // Update progress bar to reach the truck
      progressPercent = truckPositionPercent;
  }

  return (
    <div className="w-full py-8 px-4">
      <div className="relative mb-12">
        {/* Progress Bar Container */}
        {/* Positioned at top-[14px] (14px) to align perfectly with center of w-8 (32px) circles */}
        <div className="absolute top-[14px] left-0 w-full h-1 bg-gray-200 rounded-full" />
        
        {/* Active Progress Bar */}
        <div 
            className="absolute top-[14px] left-0 h-1 bg-green-600 transition-all duration-1000 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
        />

        {/* Steps */}
        <div className="flex justify-between w-full">
            {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isFuture = index > currentStepIndex;
            const date = getStepDate(step.key);

            return (
                <div key={step.key} className="flex flex-col items-center relative">
                    {/* Circle Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-colors duration-300
                        ${isCompleted ? 'bg-green-600 border-green-600' : 'bg-white border-gray-200'}
                    `}>
                        {isCompleted ? (
                            <Check size={16} className="text-white" strokeWidth={3} />
                        ) : (
                            <Check size={16} className="text-gray-300" strokeWidth={3} />
                        )}
                    </div>

                    {/* Labels */}
                    <div className="absolute top-10 flex flex-col items-center min-w-[100px]">
                        <p className={`text-sm font-bold ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                            {step.label}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                            {date}
                        </p>
                    </div>
                </div>
            );
            })}
        </div>

        {/* Truck & Tooltip - Absolute positioned based on progress */}
        {currentStatus !== 'delivered' && currentStatus !== 'cancelled' && (
            <div 
                className="absolute top-[14px] transform -translate-y-1/2 -translate-x-1/2 z-20 transition-all duration-1000 ease-out"
                style={{ left: `${truckPositionPercent}%` }}
            >
                {/* Tooltip */}
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-max">
                    <div className="bg-slate-900 text-white text-xs py-2 px-3 rounded-lg shadow-lg flex items-center gap-2 relative">
                        <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
                        <span className="font-medium">Agent Nearby</span>
                        <div className="flex items-center text-gray-300 text-[10px] ml-1 cursor-pointer hover:text-white">
                            View Details <ChevronRight size={10} />
                        </div>
                        {/* Tooltip Arrow */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                    </div>
                </div>

                {/* Truck Icon */}
                <div className="bg-white p-1 rounded-full shadow-sm border border-green-100">
                    <Truck className="text-blue-500 fill-blue-100" size={24} />
                </div>
            </div>
        )}
      </div>
      
      {/* Bottom Message Box */}
      {currentStatus !== 'delivered' && currentStatus !== 'cancelled' && (
          <div className="mt-16 bg-orange-50 p-4 rounded-xl border-none text-sm text-gray-800 font-medium">
             We're checking with the delivery partner & the order will be delivered soon.
          </div>
      )}
    </div>
  );
}

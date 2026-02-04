"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import TrackingStepper from "./TrackingStepper";

export default function OrderCard({ order, onSelectOrder }) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'created':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Order Header - Always Visible */}
      <div 
        className="p-6 cursor-pointer flex justify-between items-start"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-800">
              Order #{order._id.slice(-8).toUpperCase()}
            </h3>
            {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
          </div>
          <p className="text-sm text-gray-500">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
            {order.status.toUpperCase()}
          </span>
          <span className="font-bold text-gray-800">
            ₹{order.totals?.grandTotal || 0}
          </span>
        </div>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-4 animation-fade-in">
          {/* Order Items */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Items ({order.items.length})</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">₹{item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Totals Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">₹{order.totals?.subtotal || 0}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-semibold">₹{order.totals?.shipping || 0}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t border-gray-300 pt-2">
              <span>Total:</span>
              <span>₹{order.totals?.grandTotal || 0}</span>
            </div>
          </div>

          {/* Delivery Address */}
          {order.address && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Delivery Address</h4>
              <div className="text-sm text-gray-600">
                <p>{order.address.firstName} {order.address.lastName}</p>
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.state} - {order.address.pin}</p>
                <p>Phone: {order.address.phone}</p>
              </div>
            </div>
          )}

          {/* Tracking Stepper */}
          <div className="mb-6 border-t border-gray-100 pt-6">
             <TrackingStepper order={order} />
          </div>

          {/* Order Actions */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSelectOrder(order);
              }}
            >
              View Details
            </Button>
            {order.status === 'created' && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50"
                onClick={(e) => e.stopPropagation()}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

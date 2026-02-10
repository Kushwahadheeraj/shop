"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Store, MapPin, Phone, Mail, User, Building2, Filter, Sparkles, CreditCard, FileText, Calendar, DollarSign, Info, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const ShopDetailsPage = () => {
  const router = useRouter();
  const { isAuthenticated, isSeller, loading: authLoading } = useAuth();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch Shops
  const fetchShops = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Even if not strictly required by backend anymore, we still need a token for auth middleware
        router.push('/login/seller');
        return;
      }
      
      // We can pass query params if we want server-side filtering
      // But for "simple" usage, fetching all and filtering client-side is robust for small datasets
      const response = await fetch('/api/shops', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        return;
      }
      
      const data = await response.json();
      
      // Handle different response structures
      let shopList = [];
      if (Array.isArray(data)) {
        shopList = data;
      } else if (data?.data && Array.isArray(data.data)) {
        shopList = data.data;
      } else if (data?.data?.shops && Array.isArray(data.data.shops)) {
        shopList = data.data.shops;
      }
      
      setShops(shopList);
    } catch (error) {
      setShops([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!authLoading && isAuthenticated()) {
      fetchShops();
    }
  }, [authLoading, isAuthenticated, fetchShops]);

  if (!isAuthenticated() && !authLoading) {
    return null;
  }

  // Filter shops based on search term and status
  const filteredShops = Array.isArray(shops) ? shops.filter(shop => {
    const matchesSearch = 
      (shop.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (shop.address?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (shop.contact?.ownerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (shop.location?.city?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || shop.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      {/* Header / Hero */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-2xl p-5 sm:p-6 lg:p-7 text-white shadow-xl border border-amber-300/40">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-white/15 p-2.5 rounded-xl">
                <Store className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                Shop Details
              </h1>
            </div>
            <p className="text-sm sm:text-base text-amber-50/90 max-w-2xl">
              View all registered shops. Search by name, address, or owner details.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
              Total Shops: {shops.length}
            </div>
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              Active: {shops.filter(s => s.status === 'active').length}
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              <Search className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
              Search Shops
            </label>
            <input
              type="text"
              placeholder="Search by name, address, city or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          
          <div className="md:w-64">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              <Filter className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shop Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      ) : filteredShops.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Store className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No shops found</h3>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredShops.map((shop) => (
            <Card key={shop._id} className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-amber-500 flex flex-col h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg font-bold text-gray-800 line-clamp-1">
                    {shop.name}
                  </CardTitle>
                  <Badge className={`${getStatusColor(shop.status)} border shadow-sm`}>
                    {shop.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {shop.business?.type || 'Retail'}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-2 flex-grow">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
                  <span className="line-clamp-2">
                    {shop.address}, {shop.location?.city}, {shop.location?.state} {shop.location?.pincode}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-medium">{shop.contact?.ownerName || 'N/A'}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{shop.contact?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{shop.contact?.email || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="w-full bg-amber-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 focus:ring-4 focus:ring-amber-300/40 shadow-md">
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Details
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="overflow-y-auto sm:max-w-2xl w-full">
                    <SheetHeader>
                      <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                        <Store className="w-6 h-6 text-amber-600" />
                        {shop.name}
                      </SheetTitle>
                      <SheetDescription>
                        Complete shop information and status
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="space-y-6 py-6">
                      {/* Basic Info Section */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
                          <Info className="w-5 h-5 text-amber-500" />
                          Basic Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
                          <div>
                            <span className="text-sm text-gray-500 block">Status</span>
                            <Badge className={`${getStatusColor(shop.status)} mt-1`}>{shop.status}</Badge>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 block">Shop ID</span>
                            <span className="font-mono text-sm break-all">{shop._id}</span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-sm text-gray-500 block">Notes</span>
                            <p className="text-sm text-gray-700">{shop.notes || 'No notes available'}</p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Contact & Location Section */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
                          <MapPin className="w-5 h-5 text-amber-500" />
                          Location & Contact
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
                          <div className="sm:col-span-2">
                            <span className="text-sm text-gray-500 block">Address</span>
                            <span className="font-medium text-gray-700">{shop.address}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 block">City / State / Pincode</span>
                            <span className="font-medium text-gray-700">
                              {shop.location?.city}, {shop.location?.state} - {shop.location?.pincode}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 block">Coordinates</span>
                            <span className="font-mono text-sm text-gray-600">
                              {shop.location?.coordinates?.latitude || 'N/A'}, {shop.location?.coordinates?.longitude || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 block">Owner Name</span>
                            <span className="font-medium text-gray-700">{shop.contact?.ownerName}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 block">Phone</span>
                            <span className="font-medium text-gray-700">{shop.contact?.phone}</span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-sm text-gray-500 block">Email</span>
                            <span className="font-medium text-gray-700">{shop.contact?.email}</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Business Details Section */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
                          <FileText className="w-5 h-5 text-amber-500" />
                          Business Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
                          <div>
                            <span className="text-sm text-gray-500 block">Business Type</span>
                            <span className="font-medium text-gray-700 capitalize">{shop.business?.type}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 block">GST Number</span>
                            <span className="font-mono text-sm text-gray-700">{shop.business?.gstNumber || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 block">PAN Number</span>
                            <span className="font-mono text-sm text-gray-700">{shop.business?.panNumber || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500 block">License Number</span>
                            <span className="font-mono text-sm text-gray-700">{shop.business?.licenseNumber || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Financial Section */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
                          <DollarSign className="w-5 h-5 text-amber-500" />
                          Financial Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border">
                          <div className="bg-white p-3 rounded border shadow-sm">
                            <span className="text-xs text-gray-500 uppercase font-semibold">Credit Limit</span>
                            <p className="text-lg font-bold text-green-600">₹{shop.financial?.creditLimit?.toLocaleString() || 0}</p>
                          </div>
                          <div className="bg-white p-3 rounded border shadow-sm">
                            <span className="text-xs text-gray-500 uppercase font-semibold">Current Balance</span>
                            <p className="text-lg font-bold text-blue-600">₹{shop.financial?.currentBalance?.toLocaleString() || 0}</p>
                          </div>
                          <div className="bg-white p-3 rounded border shadow-sm">
                            <span className="text-xs text-gray-500 uppercase font-semibold">Payment Terms</span>
                            <p className="text-lg font-medium text-gray-700 capitalize">
                              {shop.financial?.paymentTerms?.replace(/_/g, ' ') || 'Immediate'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Metadata Section */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
                          <Calendar className="w-5 h-5 text-amber-500" />
                          System Info
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Created At:</span> {new Date(shop.createdAt).toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Last Updated:</span> {new Date(shop.updatedAt).toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Last Transaction:</span> {shop.lastTransactionDate ? new Date(shop.lastTransactionDate).toLocaleString() : 'Never'}
                          </div>
                          <div>
                            <span className="font-medium">Created By (User ID):</span> <span className="font-mono text-xs">{shop.createdBy}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopDetailsPage;
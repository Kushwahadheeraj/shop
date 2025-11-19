"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, RefreshCw, Edit, Trash2, Eye } from "lucide-react";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductList() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter();

  const API_URL = `${API_BASE_URL}/home/tools`;

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL + '/get');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const responseData = await res.json();
      const offersArray = responseData.data || [];
      setOffers(offersArray);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching offers:', err);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (offer) => {
    router.push("/ProductAdd/Home/Tools?id=" + offer._id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(API_URL + '/delete/' + id, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      await fetchOffers();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting offer:', err);
    }
  };

  const handleView = (offer) => {
    router.push(`/ProductView/home/tools/${offer._id}`);
  };

  const handleAddNew = () => {
    router.push("/ProductAdd/Home/Tools");
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      handleDelete(deleteId);
      setDeleteId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter offers based on search term
  const filteredOffers = offers.filter(offer =>
    offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.offer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && offers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Loading offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle>Home Offers</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={fetchOffers}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={handleAddNew}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Offer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">Error loading products: {error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchOffers}
                className="mt-2"
              >
                Retry Loading
              </Button>
            </div>
          )}

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search offers by title or offer type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Offers Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left">Image</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Title</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Offer Type</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Created Date</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="border border-gray-200 px-4 py-8 text-center text-gray-500">
                      {searchTerm ? 'No offers found matching your search.' : 'No offers found.'}
                    </td>
                  </tr>
                ) : (
                  filteredOffers.map((offer) => (
                    <tr key={offer._id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">
                        {offer.image && (
                          <img 
                            src={offer.image} 
                            alt={offer.title} 
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 font-medium">
                        {offer.title}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {offer.offer}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                        {formatDate(offer.createdAt)}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(offer)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(offer)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClick(offer._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this offer? This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteId(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
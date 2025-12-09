"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import API_BASE_URL from "@/lib/apiConfig";

const datePresetToRange = (preset) => {
  const now = new Date();
  const start = new Date(now);
  switch (preset) {
    case "1d":
      start.setDate(now.getDate() - 1); break;
    case "3d":
      start.setDate(now.getDate() - 3); break;
    case "1w":
      start.setDate(now.getDate() - 7); break;
    case "15d":
      start.setDate(now.getDate() - 15); break;
    case "30d":
      start.setDate(now.getDate() - 30); break;
    case "6m":
      start.setMonth(now.getMonth() - 6); break;
    case "1y":
      start.setFullYear(now.getFullYear() - 1); break;
    default:
      return { from: "", to: "" };
  }
  return { from: start.toISOString(), to: now.toISOString() };
};

export default function EUserListPage() {
  const [q, setQ] = useState("");
  const [preset, setPreset] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);

  const params = useMemo(() => {
    const url = new URLSearchParams();
    if (q) url.set("q", q);
    if (preset) {
      const { from, to } = datePresetToRange(preset);
      if (from) url.set("from", from);
      if (to) url.set("to", to);
    }
    url.set("limit", "200");
    return url.toString();
  }, [q, preset]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/euser/list?${params}`);
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(data.users || []);
      setError("");
    } catch (e) {
      setError(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/euser/stats`);
      if (!res.ok) throw new Error("Failed to load stats");
      const data = await res.json();
      setStats(data);
    } catch (e) {
      // ignore silently for stats
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Hero Header */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-lg p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">E-Users</h1>
        </div>
        <p className="text-xs sm:text-sm text-amber-50">Readonly list of registered users</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Stat label="Total" value={stats.total} />
          <Stat label="1d" value={stats["1d"]} />
          <Stat label="3d" value={stats["3d"]} />
          <Stat label="1w" value={stats["1w"]} />
          <Stat label="15d" value={stats["15d"]} />
          <Stat label="30d" value={stats["30d"]} />
          <Stat label="6m" value={stats["6m"]} />
          <Stat label="1y" value={stats["1y"]} />
        </div>
      )}

      <div className="bg-white p-3 sm:p-4 rounded-lg shadow mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Name, email or phone"
              className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date range</label>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500"
            >
              <option value="">All time</option>
              <option value="1d">Last 1 day</option>
              <option value="3d">Last 3 days</option>
              <option value="1w">Last 1 week</option>
              <option value="15d">Last 15 days</option>
              <option value="30d">Last 30 days</option>
              <option value="6m">Last 6 months</option>
              <option value="1y">Last 1 year</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={fetchUsers} className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg font-medium">Refresh</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={4} className="px-3 sm:px-6 py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="px-3 sm:px-6 py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500">No users found</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <img
                          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover flex-shrink-0"
                          src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || u.username || u.email || 'U')}&background=3B82F6&color=ffffff&size=40`}
                          alt={u.name || u.username || 'User'}
                          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || u.username || u.email || 'U')}&background=3B82F6&color=ffffff&size=40`; }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-medium text-gray-900 break-words">{u.name || u.username || 'No name'}</div>
                          <div className="text-xs text-gray-500 break-words">ID: {u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 break-words">{u.email || '-'}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 break-words">{u.phone || '-'}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 whitespace-nowrap">{u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {error && <div className="p-3 text-xs sm:text-sm text-red-600">{error}</div>}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white p-2 sm:p-3 rounded-md shadow border border-gray-100">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-base sm:text-lg font-semibold text-gray-900">{value ?? '-'}</div>
    </div>
  );
}



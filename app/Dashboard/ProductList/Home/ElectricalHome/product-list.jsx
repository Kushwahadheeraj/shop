"use client";
import { useEffect, useMemo, useState } from "react";
import API_BASE_URL from "@/lib/apiConfig";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";

export default function ProductList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const STORAGE_KEY = 'electricalHomeSelectedCategories';
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      // Load once to derive categories and fallback; prefer server-side first-per-category on selection
      const res = await fetch(`${API_BASE_URL}/home/electrical/get`);
      const json = await res.json();
      const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
      setAllProducts(list);
    } catch (e) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // fetch categories from main ElectricalModels and seed selection from query/localStorage or select all
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/electrical/categories`);
        const json = await res.json();
        const cats = Array.isArray(json?.data) ? json.data : [];
        setCategories(cats);

        const qp = searchParams.get("categories");
        if (qp) {
          try {
            const arr = JSON.parse(qp);
            if (Array.isArray(arr) && arr.length > 0) {
              setSelected(arr.filter((c) => cats.includes(c)));
              return;
            }
          } catch {
            // ignore
          }
        }
        // localStorage fallback
        try {
          const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          if (Array.isArray(saved) && saved.length > 0) {
            setSelected(saved.filter((c) => cats.includes(c)));
            return;
          }
        } catch {}
        if (cats.length > 0 && selected.length === 0) setSelected(cats);
      } catch (e) {
        // ignore; categories will remain empty
      }
    };
    fetchCategories();
  }, [searchParams]);

  const toggle = (cat) => {
    setSelected((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  // load first product per selected category via ElectricalModels backend (fallback to local if fails)
  useEffect(() => {
    const run = async () => {
      if (!selected || selected.length === 0) {
        setRows([]);
        return;
      }
      setLoading(true);
      setError("");
      try {
        // Now persisted into HomeElectricalModel; fetch all and compute first per selected categories
        const res = await fetch(`${API_BASE_URL}/home/electrical/get`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data?.data) ? data.data : [];
        const byCategory = selected
          .map((cat) => {
            const items = list.filter((p) => (p?.category || 'Uncategorized') === cat);
            if (items.length === 0) return { category: cat, product: null };
            return { category: cat, product: items[0] };
          })
          .filter((x) => x.product);
        setRows(byCategory);
      } catch (e) {
        // Fallback to local allProducts cache
        const byCategory = selected
          .map((cat) => {
            const items = (allProducts || []).filter((p) => (p?.category || 'Uncategorized') === cat);
            if (items.length === 0) return { category: cat, product: null };
            return { category: cat, product: items[0] };
          })
          .filter((x) => x.product);
        setRows(byCategory);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [selected, allProducts, refreshCounter]);

  const handleView = (product) => {
    router.push(`/Dashboard/ProductView/home/electrical/${product._id}`);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    const ok = window.confirm('Are you sure you want to delete this item?');
    if (!ok) return;
    try {
      const res = await fetch(`${API_BASE_URL}/home/electrical/delete/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setRefreshCounter((n) => n + 1);
      alert('Deleted successfully');
    } catch (e) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Electrical Home - First Products by Category</h2>
        <button onClick={fetchAll} className="px-3 py-1 border rounded">Refresh</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => toggle(cat)}
            className={`px-2 py-1 border rounded ${selected.includes(cat) ? "bg-black text-white" : "bg-white"}`}
          >
            {cat || "Uncategorized"}
          </button>
        ))}
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : rows.length === 0 ? (
        <div className="text-gray-500">No products found for selected categories.</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const p = row.product || {};
                return (
                  <TableRow key={`${row.category}-${p._id}`}>
                    <TableCell className="font-medium">{p.name || "-"}</TableCell>
                    <TableCell>{row.category || p.category || "-"}</TableCell>
                    <TableCell>{p.brand || "-"}</TableCell>
                    <TableCell>{p.price != null ? `₹${Number(p.price).toFixed(2)}` : "-"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(p.tag || p.tags || []).slice(0, 3).map((t, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{t}</Badge>
                        ))}
                        {(p.tag || p.tags || []).length > 3 && (
                          <Badge variant="secondary" className="text-xs">+{(p.tag || p.tags || []).length - 3}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleView(p)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(p._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}



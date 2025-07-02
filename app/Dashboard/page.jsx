"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, ChevronRight, ArrowUpRight, MessageCircle, Phone, User, BriefcaseMedical, Store, Truck, Package, RefreshCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const performanceData = [
  { month: "Jan", transaction: 6, revenue: 2000 },
  { month: "Mar", transaction: 2, revenue: 800 },
  { month: "May", transaction: 3, revenue: 1200 },
  { month: "Jul", transaction: 8, revenue: 3400 },
  { month: "Sep", transaction: 4, revenue: 1500 },
  { month: "Nov", transaction: 5, revenue: 1800 },
];

const countries = [
  { flag: "🇩🇪", name: "Germany", value: "4.4k" },
  { flag: "🇫🇷", name: "France", value: "3.6k" },
  { flag: "🇮🇹", name: "Italy", value: "3.1k" },
  { flag: "🇦🇹", name: "Austria", value: "2.9k" },
  { flag: "🇨🇭", name: "Switzerland", value: "2.7k" },
  { flag: "🇪🇸", name: "Spain", value: "1.2k" },
];

const products = [
  { icon: "🍊", name: "Vitamin Boost", sku: "SPO0910SK", price: "$8/item", sold: "2.3k" },
  { icon: "🍫", name: "Organic Protein Bar", sku: "SPO0910SK", price: "$3/item", sold: "1.2k" },
  { icon: "💊", name: "Pain Relief Cream", sku: "SPO0910SK", price: "$5/item", sold: "1.1k" },
];

const team = [
  { name: "John Smith", role: "Manager", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Anastasiya Primo", role: "Digital Marketing", img: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Colt Heist", role: "Digital Marketing", img: "https://randomuser.me/api/portraits/men/45.jpg" },
];

export default function DashboardPage() {
  const [updateTime, setUpdateTime] = useState("");
  const router = useRouter();

  useEffect(() => {
    const now = new Date();
    setUpdateTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, []);

  return (
    <div className="min-h-screen w-full bg-zinc-50 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-7xl flex flex-col gap-8">
      

        {/* HealthMart Card & Stats */}
        <div className="flex items-center justify-between w-full mb-4">
          {/* Left: HealthMart */}
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-xl">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#fff"/><rect x="7" y="11" width="10" height="2" rx="1" fill="#FF5A5F"/><rect x="11" y="7" width="2" height="10" rx="1" fill="#FF5A5F"/></svg>
            </div>
            <div>
              <div className="text-xl font-bold">STORE</div>
              <div className="text-zinc-400 text-sm">24 members</div>
            </div>
          </div>
          {/* Right: Overview and update time */}
          <div className="flex items-center gap-4 text-zinc-400 text-sm">
            <span className="uppercase tracking-wide font-semibold">#STORE-OVERVIEW</span>
            <span className="mx-2">·</span>
            <span>
              Updated: <span className="text-zinc-900 font-semibold">{updateTime}</span>
            </span>
            <button
              className="ml-2 p-1 rounded hover:bg-zinc-100 transition"
              onClick={() => {
                const now = new Date();
                setUpdateTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
                router.refresh();
              }}
              aria-label="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>
        <div className="gap-6 items-start">
          {/* Stats Cards */}
          <div className="flex flex-row gap-4 flex-1">
            {/* Orders Provided */}
            <Card className="bg-white rounded-2xl shadow border border-zinc-100 px-8 py-6 flex flex-col items-start min-w-[220px]">
              <CardContent className="p-0 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <Package className="text-gray-500 w-5 h-5" />
                  </div>
                  <span className="font-semibold text-base">Orders Provided</span>
                </div>
                <div className="flex gap-8">
                  <div>
                    <div className="font-bold text-2xl">210</div>
                    <div className="text-xs text-zinc-400">Processing</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl">109</div>
                    <div className="text-xs text-zinc-400">Processed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Store Product */}
            <Card className="bg-white rounded-2xl shadow border border-zinc-100 px-8 py-6 flex flex-col items-start min-w-[220px]">
              <CardContent className="p-0 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Store className="text-blue-500 w-5 h-5" />
                  </div>
                  <span className="font-semibold text-base">Store Product</span>
                </div>
                <div className="flex gap-8">
                  <div>
                    <div className="font-bold text-2xl">3.4k</div>
                    <div className="text-xs text-zinc-400">Total</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl">352</div>
                    <div className="text-xs text-zinc-400">Sold out</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Orders Imported */}
            <Card className="bg-white rounded-2xl shadow border border-zinc-100 px-8 py-6 flex flex-col items-start min-w-[220px]">
              <CardContent className="p-0 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <Truck className="text-gray-500 w-5 h-5" />
                  </div>
                  <span className="font-semibold text-base">Orders Imported</span>
                </div>
                <div className="flex gap-8">
                  <div>
                    <div className="font-bold text-2xl">176</div>
                    <div className="text-xs text-zinc-400">New</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl">315</div>
                    <div className="text-xs text-zinc-400">Total</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Orders Dispatched */}
            <Card className="bg-white rounded-2xl shadow border border-zinc-100 px-8 py-6 flex flex-col items-start min-w-[220px]">
              <CardContent className="p-0 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <Truck className="text-gray-500 w-5 h-5" />
                  </div>
                  <span className="font-semibold text-base">Orders Dispatched</span>
                </div>
                <div className="flex gap-8">
                  <div>
                    <div className="font-bold text-2xl">256</div>
                    <div className="text-xs text-zinc-400">Total</div>
                  </div>
                  <div>
                    <div className="font-bold text-2xl">49</div>
                    <div className="text-xs text-zinc-400">Return</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sales by Country & Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white rounded-2xl shadow border border-zinc-100">
            <CardContent className="p-6">
              <div className="font-semibold mb-4 flex items-center justify-between">
                Sales by Country
                <Button variant="ghost" size="sm" className="text-zinc-400">View All</Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {countries.map((c, i) => (
                  <div key={i} className="bg-zinc-50 rounded-xl p-3 flex flex-col items-center border border-zinc-100">
                    <span className="text-2xl mb-1">{c.flag}</span>
                    <span className="font-bold">{c.value} <span className="text-xs text-zinc-400">products</span></span>
                    <span className="text-xs text-zinc-400">{c.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Performance Overview */}
          <Card className="bg-white rounded-2xl shadow border border-zinc-100">
            <CardContent className="p-6">
              <div className="font-semibold mb-4 flex items-center justify-between">
                Performance Overview
                <Button variant="ghost" size="sm" className="text-zinc-400">View All</Button>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={performanceData} barCategoryGap={30}>
                  <XAxis dataKey="month" tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#fff", border: "none", color: "#18181b" }} />
                  <Bar dataKey="transaction" fill="#7B61FF" radius={[8, 8, 0, 0]} barSize={24} />
                  <Bar dataKey="revenue" fill="#4F8CFF" radius={[8, 8, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row: Top Product Sales & Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white rounded-2xl shadow border border-zinc-100">
            <CardContent className="p-6">
              <div className="font-semibold mb-4 flex items-center justify-between">
                Top Product Sales
                <Button variant="ghost" size="sm" className="text-zinc-400">View All</Button>
              </div>
              <div className="space-y-3">
                {products.map((p, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{p.icon}</span>
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs text-zinc-400">SKU: {p.sku}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-xs text-zinc-400">{p.price}</div>
                      <div className="font-bold">{p.sold} <span className="text-xs text-zinc-400">sold</span></div>
                      <ArrowUpRight className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white rounded-2xl shadow border border-zinc-100">
            <CardContent className="p-6">
              <div className="font-semibold mb-4">Team Members</div>
              <div className="space-y-3">
                {team.map((member, i) => (
                  <div key={i} className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={member.img} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold">{member.name}</div>
                        <div className="text-xs text-zinc-400">{member.role}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" className="text-zinc-400"><MessageCircle className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-zinc-400"><Phone className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
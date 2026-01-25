"use client";
import { useEffect, useRef, useState } from "react";
import API_BASE_URL from "@/lib/apiConfig";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CouponsSection() {
  const [coupons, setCoupons] = useState([]);
  const [copied, setCopied] = useState(null);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const gradients = [
    "from-rose-400 to-pink-500",
    "from-amber-400 to-yellow-500",
    "from-emerald-400 to-teal-500",
    "from-sky-400 to-blue-500",
    "from-violet-400 to-fuchsia-500",
    "from-lime-400 to-green-500",
    "from-orange-400 to-red-500",
    "from-cyan-400 to-teal-500",
    "from-indigo-400 to-purple-500",
    "from-stone-400 to-zinc-500",
    "from-blue-400 to-indigo-500",
    "from-teal-400 to-emerald-500",
  ];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/coupons`);
        const json = await res.json();
        const raw = Array.isArray(json) ? json : (json.data || []);
        const now = Date.now();
        const filtered = raw.filter(c => {
          const startsOk = !c.startsAt || new Date(c.startsAt).getTime() <= now;
          const endsOk = !c.endsAt || new Date(c.endsAt).getTime() >= now;
          const usageOk = !c.usageLimit || c.usageLimit === 0 || (c.usageCount || 0) < c.usageLimit;
          const activeOk = c.active === undefined ? true : !!c.active;
          return startsOk && endsOk && usageOk && activeOk;
        });
        const mapped = filtered.map((c, i) => {
          let text = "";
          if (c.caption) {
            text = c.caption;
          } else if (c.discountType === "percent") {
            text = `${c.discountValue}% OFF`;
          } else if (c.discountType === "flat") {
            text = `₹${c.discountValue} OFF`;
          } else if (c.discountType === "random_upto") {
            text = `Up to ₹${c.discountValue} OFF`;
          } else {
            text = "Special Offer";
          }
          const styles = ["gradient", "dashed", "modern", "badge"];
          return { code: c.code, text, type: styles[i % styles.length] };
        });
        setCoupons(mapped);
      } catch {
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  const scrollLeft = () => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: -Math.max(320, el.clientWidth * 0.8), behavior: "smooth" });
  };
  const scrollRight = () => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: Math.max(320, el.clientWidth * 0.8), behavior: "smooth" });
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el || coupons.length === 0) return;
    const step = Math.max(320, el.clientWidth * 0.8);
    const id = setInterval(() => {
      const max = el.scrollWidth - el.clientWidth;
      const next = el.scrollLeft + step;
      if (next >= max - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 3500);
    return () => clearInterval(id);
  }, [coupons]);

  if (!loading && coupons.length === 0) return null;

  return (
    <section className="py-10 bg-gray-50">
      <div className="flex items-center justify-between px-6 mb-4">
        <h2 className="text-2xl font-bold">🎉 Available Coupons</h2>
        <div className="flex gap-2">
          <button onClick={scrollLeft} className="p-2 rounded bg-white border hover:bg-gray-50">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={scrollRight} className="p-2 rounded bg-white border hover:bg-gray-50">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      {loading ? (
        <div className="px-6 text-center text-sm text-gray-500">Loading...</div>
      ) : (
        <div
          ref={sliderRef}
          className="flex gap-4 px-6 overflow-x-auto no-scrollbar"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {coupons.map((c, i) => (
            <div
              key={c.code + "-" + i}
              className="min-w-[260px] snap-start"
            >
              <CouponCard
                coupon={c}
                copied={copied}
                copyCode={copyCode}
                gradient={gradients[i % gradients.length]}
              />
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

function CouponCard({ coupon, copied, copyCode, gradient }) {
  const base = "rounded-xl p-5 flex flex-col justify-between shadow-md transition hover:scale-105";
  const styleClass = `bg-gradient-to-br ${gradient} text-white`;
  return (
    <div className={`${base} ${styleClass}`}>
      <div>
        <p className="text-lg font-semibold">{coupon.text}</p>
        <p className="mt-2 text-sm opacity-80">Use code below</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-mono text-lg font-bold bg-white/20 px-2 py-1 rounded">{coupon.code}</span>
        <button
          onClick={() => copyCode(coupon.code)}
          className="text-sm px-3 py-1 rounded bg-white text-black hover:bg-white/90"
        >
          {copied === coupon.code ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sun, Moon, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User&background=random";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [date, setDate] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "User",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch user from backend
  useEffect(() => {
    fetch("/api/seller/me")
      .then(res => res.json())
      .then(data => {
        setUser({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "User",
          avatar: data.avatar || "",
        });
      })
      .catch(() => {
        setUser({
          name: "",
          email: "",
          role: "User",
          avatar: "",
        });
      });
  }, []);

  // Dynamic date
  useEffect(() => {
    const today = new Date();
    setDate(today.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    }));
  }, []);

  // Theme toggle
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Dynamic breadcrumbs from path
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [
    { label: "Home", href: "/" },
    ...pathSegments.map((seg, idx) => {
      const href = "/" + pathSegments.slice(0, idx + 1).join("/");
      let label = seg.replace(/[-_]/g, " ");
      label = label.charAt(0).toUpperCase() + label.slice(1);
      return { label, href };
    }),
  ];

  // Logout handler
  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/seller/logout", { method: "POST", credentials: "include" });
      setLoading(false);
      router.push("/login/seller");
    } catch (err) {
      setLoading(false);
      alert("Logout failed");
    }
  };

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-white border-b border-zinc-100">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-zinc-400 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className={i === breadcrumbs.length - 1 ? "text-zinc-900 font-semibold flex items-center" : "flex items-center"}>
            {i > 0 && <ChevronRight className="w-4 h-4 mx-1" />}
            {i < breadcrumbs.length - 1 ? (
              <Link href={crumb.href} className="hover:underline">{crumb.label}</Link>
            ) : (
              crumb.label
            )}
          </span>
        ))}
      </div>
      {/* Date, User, Theme Toggle */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-zinc-400">
          <Calendar className="w-5 h-5" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.avatar || DEFAULT_AVATAR} />
            <AvatarFallback>{(user.name || user.email || "U").charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-zinc-900 text-sm">{user.name || user.email || "User"}</span>
            <span className="text-xs text-zinc-400">{user.role}</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="ml-2"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </nav>
  );
} 
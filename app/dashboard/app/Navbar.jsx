"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useMemo, memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sun, Moon, Calendar, ChevronRight, LogOut, User, Settings as SettingsIcon, Menu } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import API_BASE_URL from "@/lib/apiConfig";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User&background=3B82F6&color=ffffff&size=200&bold=true";

// OPTIMIZED: Memoize date formatter
const formatDate = (date) => {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const Navbar = memo(function Navbar({ onMenuClick }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user: authUser, logout } = useAuth();
  const [theme, setTheme] = useState("light");
  const [date, setDate] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "User",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);

  // Use auth user data
  useEffect(() => {
    if (authUser) {
      setUser({
        name: authUser.username || authUser.name || "",
        email: authUser.email || "",
        role: authUser.role || "User",
        avatar: authUser.avatar || "",
      });
    }
  }, [authUser]);

  // OPTIMIZED: Dynamic date - only update once per day
  useEffect(() => {
    const updateDate = () => {
      setDate(formatDate(new Date()));
    };
    updateDate();
    // Update at midnight
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    const timeout = setTimeout(updateDate, msUntilMidnight);
    return () => clearTimeout(timeout);
  }, []);

  // OPTIMIZED: Theme toggle - memoized
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem("theme");
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);
  
  const toggleTheme = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  }, [theme]);

  // OPTIMIZED: Memoize breadcrumbs calculation
  const breadcrumbs = useMemo(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    return [
      { label: "Home", href: "/" },
      ...pathSegments.map((seg, idx) => {
        const href = "/" + pathSegments.slice(0, idx + 1).join("/");
        let label = seg.replace(/[-_]/g, " ");
        label = label.charAt(0).toUpperCase() + label.slice(1);
        return { label, href };
      }),
    ];
  }, [pathname]);

  // OPTIMIZED: Memoize handlers
  const handleLogout = useCallback(() => {
    setLoading(true);
    logout('/login/seller');
    setLoading(false);
  }, [logout]);

  // OPTIMIZED: Memoize avatar URL
  const avatarUrl = useMemo(() => {
    if (user.avatar) {
      return user.avatar;
    }
    const name = user.name || user.email || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=ffffff&size=200&bold=true`;
  }, [user.avatar, user.name, user.email]);

  // OPTIMIZED: Memoize image error handler
  const handleImageError = useCallback((e) => {
    const name = user.name || user.email || 'User';
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=ffffff&size=200&bold=true`;
  }, [user.name, user.email]);

  return (
    <nav className="w-full px-4 md:px-8 py-4 bg-white border-b border-zinc-100 flex items-center justify-between gap-3">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-zinc-400 text-xs md:text-sm min-w-0 whitespace-nowrap overflow-hidden">
        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={onMenuClick}
          className="lg:hidden mr-2 inline-flex items-center justify-center rounded-md border border-zinc-200 w-9 h-9 text-zinc-700 hover:bg-zinc-50"
        >
          <Menu className="w-5 h-5" />
        </button>
        {breadcrumbs.map((crumb, i) => {
          const isLast = i === breadcrumbs.length - 1;
          return (
            <span
              key={i}
              className={
                isLast
                  ? "text-zinc-900 font-semibold flex items-center truncate max-w-[55vw] md:max-w-none"
                  : "flex items-center truncate max-w-[24vw] md:max-w-none"
              }
            >
              {i > 0 && <ChevronRight className="w-4 h-4 mx-1 flex-shrink-0" />}
              {i < breadcrumbs.length - 1 ? (
                <Link href={crumb.href} className="hover:underline truncate">
                  {crumb.label}
                </Link>
              ) : (
                <span className="truncate">{crumb.label}</span>
              )}
            </span>
          );
        })}
      </div>
      {/* Date, User, Theme Toggle, Avatar Dropdown */}
      <div className="flex items-center gap-4 md:gap-6 min-w-0">
        <div className="hidden xs:flex items-center gap-2 text-zinc-400 flex-shrink-0">
          <Calendar className="w-5 h-5" />
          <span>{date}</span>
        </div>
        
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                <AvatarImage src={avatarUrl} onError={handleImageError} />
                <AvatarFallback>{(user.name || user.email || "U").charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => router.push("/Profile")}>
                <User className="w-4 h-4 mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/Settings")}>
                <SettingsIcon className="w-4 h-4 mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
});

Navbar.displayName = 'Navbar';

export default Navbar; 
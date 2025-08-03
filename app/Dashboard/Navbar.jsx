"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sun, Moon, Calendar, ChevronRight, LogOut, User, Settings as SettingsIcon } from "lucide-react";
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

export default function Navbar() {
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
  const handleLogout = () => {
    setLoading(true);
    logout();
    setLoading(false);
  };

  // Get avatar URL with fallback
  const getAvatarUrl = () => {
    if (user.avatar) {
      return user.avatar;
    }
    const name = user.name || user.email || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=ffffff&size=200&bold=true`;
  };

  // Handle image error
  const handleImageError = (e) => {
    const name = user.name || user.email || 'User';
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=ffffff&size=200&bold=true`;
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
      {/* Date, User, Theme Toggle, Avatar Dropdown */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-zinc-400">
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
                <AvatarImage src={getAvatarUrl()} onError={handleImageError} />
                <AvatarFallback>{(user.name || user.email || "U").charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => router.push("/Dashboard/Profile")}>
                <User className="w-4 h-4 mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/Dashboard/Settings")}>
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
} 
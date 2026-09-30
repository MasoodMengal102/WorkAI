"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BRAND } from "@/config/brand";
import {
  Search,
  Sparkles,
  Compass,
  Layers,
  Wrench,
  BookOpen,
  GitCompare,
  Briefcase,
  Menu,
  X,
  User,
  Moon,
  Sun,
  ShieldCheck,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { UserSession } from "@/types";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [session, setSession] = useState<UserSession | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    // Check initial dark mode preference
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }

    // Fetch user session
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.session) {
          setSession(data.session);
        } else {
          setSession(null);
        }
      })
      .catch(() => {
        setSession(null);
      })
      .finally(() => {
        setAuthLoaded(true);
      });
  }, [pathname]);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setIsDarkMode(true);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setSession(null);
    router.push("/");
    router.refresh();
  };

  const navItems = [
    { label: "AI Finder", href: "/ai-finder", icon: Compass },
    { label: "AI Tools", href: "/tools", icon: Wrench },
    { label: "Workflows", href: "/workflows", icon: Layers },
    { label: "Use Cases", href: "/use-cases", icon: Briefcase },
    { label: "AI Services", href: "/ai-services", icon: Sparkles },
    { label: "Compare", href: "/compare", icon: GitCompare },
    { label: "Guides", href: "/guides", icon: BookOpen },
  ];

  const isStaff =
    session &&
    (session.role === "REVIEWER" ||
      session.role === "EDITOR" ||
      session.role === "ADMIN" ||
      session.role === "SUPER_ADMIN");
  const isSuperAdmin = session?.role === "SUPER_ADMIN";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight leading-none">
                  {BRAND.name}
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 mt-0.5">
                  Verified AI Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions: Search, Theme Toggle, Dynamic Auth */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/search"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition mr-1"
              aria-label="Search tools and workflows"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                /
              </kbd>
            </Link>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              aria-label="Toggle Dark Mode"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* DYNAMIC AUTH CONTROLS */}
            {authLoaded && (
              <>
                {session ? (
                  // Logged-in state
                  <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
                    {/* Admin Link ONLY for authorized roles */}
                    {isStaff && (
                      <Link
                        href="/admin"
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          isSuperAdmin
                            ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100"
                            : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100"
                        }`}
                        title={isSuperAdmin ? "Super Admin Portal" : "Admin Operations"}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin</span>
                        {isSuperAdmin && (
                          <span className="text-[9px] uppercase px-1 rounded bg-amber-500 text-white">
                            Super
                          </span>
                        )}
                      </Link>
                    )}

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition"
                    >
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                        {session.name ? session.name.charAt(0).toUpperCase() : session.email.charAt(0).toUpperCase()}
                      </div>
                      <span>Dashboard</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Log Out"
                      aria-label="Log Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  // Visitor state (Not logged in)
                  <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
                    <Link
                      href="/login"
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition flex items-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </Link>

                    <Link
                      href="/register"
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Register</span>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/search"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard ({session.name || session.email})</span>
                </Link>

                {isStaff && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Admin Operations {isSuperAdmin ? "(Super)" : ""}</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-semibold text-xs text-center"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 text-white font-bold text-xs text-center"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Settings, LogOut, Activity, LayoutDashboard, Dumbbell } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Trainer", href: "/ai-coach", icon: MessageSquare },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="relative z-20 w-20 sm:w-64 flex flex-col justify-between border-r border-white/5 bg-white/[0.02] backdrop-blur-xl transition-all duration-300">
      
      {/* App Logo/Brand */}
      <Link href="/">
      <div className="h-20 flex items-center justify-center sm:justify-start sm:px-8 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <Dumbbell className="w-6 h-6 text-zinc-950" strokeWidth={2.5} />
        </div>
        <span className="hidden sm:block ml-3 font-bold text-lg tracking-wide text-zinc-100">
          AI<span className="text-emerald-500">thlete</span>
        </span>
      </div>
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center justify-center sm:justify-start px-3 sm:px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm" 
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-200"}`} />
              <span className="hidden sm:block ml-3 font-medium text-sm">
                {link.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile / Logout */}
      <div className="p-4 border-t border-white/5 relative z-50">
        <button
          onClick={() => signOut({ callbackUrl: "/" })} 
          style={{ cursor: "pointer" }}
          className="w-full flex items-center justify-center sm:justify-start px-3 sm:px-4 py-3 rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 group-hover:text-red-400" />
          <span className="hidden sm:block ml-3 font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
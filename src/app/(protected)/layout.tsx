// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { MessageSquare, Settings, LogOut, LayoutDashboard, Dumbbell } from "lucide-react";
// import { signOut } from "next-auth/react"; 

// export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();

//   const navLinks = [
//     { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//     { name: "AI Trainer", href: "/ai-coach", icon: MessageSquare },
//     { name: "Settings", href: "/settings", icon: Settings },
//   ];

//   return (
//     <div className="flex h-screen bg-zinc-950 overflow-hidden text-zinc-100 font-sans selection:bg-emerald-500/30">
      
//       {/* 1. Sleek Glassmorphism Sidebar */}
//       <aside className="w-20 sm:w-64 flex flex-col justify-between border-r border-white/5 bg-white/[0.02] backdrop-blur-xl transition-all duration-300">
        
//         {/* App Logo/Brand */}
//         <Link href="/">
//         <div className="h-20 flex items-center justify-center sm:justify-start sm:px-8 border-b border-white/5">
//           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
//             <Dumbbell className="w-6 h-6 text-zinc-950" strokeWidth={2.5} />
//           </div>
//           <span className="hidden sm:block ml-3 font-bold text-lg tracking-wide text-zinc-100">
//             AI<span className="text-emerald-500">thlete</span>
//           </span>
//         </div>
//         </Link>
        
//         {/* Navigation Links */}
//         <nav className="flex-1 px-3 py-6 space-y-2">
//           {navLinks.map((link) => {
//             const isActive = pathname === link.href;
//             const Icon = link.icon;
//             return (
//               <Link
//                 key={link.name}
//                 href={link.href}
//                 className={`flex items-center justify-center sm:justify-start px-3 sm:px-4 py-3 rounded-xl transition-all duration-200 group ${
//                   isActive 
//                     ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm" 
//                     : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
//                 }`}
//               >
//                 <Icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-200"}`} />
//                 <span className="hidden sm:block ml-3 font-medium text-sm">
//                   {link.name}
//                 </span>
//               </Link>
//             );
//           })}
//         </nav>

//         {/* User Profile / Logout */}
//         <div className="p-4 border-t border-white/5">
//           {/* FIX: Changed Link to an interactive button that triggers signOut */}
//           <button
//             onClick={() => signOut({ callbackUrl: "/" })} 
//             className="cursor-pointer w-full flex items-center justify-center sm:justify-start px-3 sm:px-4 py-3 rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
//           >
//             <LogOut className="w-5 h-5 group-hover:text-red-400" />
//             <span className="hidden sm:block ml-3 font-medium text-sm">Sign Out</span>
//           </button>
//         </div>
//       </aside>

//       {/* 2. Main Content Area with Ambient Gradient */}
//       <main className="flex-1 relative flex flex-col h-screen overflow-hidden">
//         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/20 blur-[120px] rounded-full pointer-events-none" />
        
//         <div className="relative z-10 flex-1 h-full w-full overflow-y-auto pb-10">
//           {children}
//         </div>
//       </main>

//     </div>
//   );
// }

import Sidebar from "@/components/shared/sidebar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden text-zinc-100 font-sans selection:bg-emerald-500/30">
      
      {/* 1. We just import the sleek component we made! */}
      <Sidebar />

      {/* 2. Main Content Area with Ambient Gradient */}
      <main className="flex-1 relative flex flex-col h-screen overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex-1 h-full w-full overflow-y-auto pb-10">
          {children}
        </div>
      </main>

    </div>
  );
}
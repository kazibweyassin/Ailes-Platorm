"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Award,
  BookOpen,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/university-matcher",
      label: "Find",
      icon: Search,
    },
    {
      href: "/scholarships",
      label: "Scholarships",
      icon: Award,
    },
    {
      href: "/blog",
      label: "Resources",
      icon: BookOpen,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden pb-safe shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "mobile-nav-item flex flex-col items-center justify-center flex-1 h-full transition-all relative",
                isActive
                  ? "text-primary"
                  : "text-gray-soft active:scale-95"
              )}
            >
              <div className={cn(
                "p-2 rounded-full transition-all",
                isActive && "bg-primary/10"
              )}>
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive && "scale-110"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium mt-0.5",
                  isActive && "font-semibold"
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export { MobileBottomNav };
export default MobileBottomNav;

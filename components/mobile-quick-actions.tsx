"use client";

import Link from "next/link";
import {
  Search,
  Award,
  GraduationCap,
  Calculator,
  MessageCircle,
  MapPin,
  FileText,
  Plane,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function MobileQuickActions() {
  const quickActions = [
    {
      href: "/university-matcher",
      icon: Search,
      label: "Find University",
      color: "bg-blue-100 text-blue-600",
    },
    {
      href: "/scholarships",
      icon: Award,
      label: "Scholarships",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      href: "/services",
      icon: GraduationCap,
      label: "Services",
      color: "bg-green-100 text-green-600",
    },
    {
      href: "/financial-planning",
      icon: Calculator,
      label: "Cost Calculator",
      color: "bg-purple-100 text-purple-600",
    },
    {
      href: "/ai-assistant",
      icon: MessageCircle,
      label: "AI Assistant",
      color: "bg-pink-100 text-pink-600",
    },
    {
      href: "/destinations",
      icon: MapPin,
      label: "Destinations",
      color: "bg-red-100 text-red-600",
    },
    {
      href: "/blog",
      icon: FileText,
      label: "Resources",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      href: "/services",
      icon: Plane,
      label: "Visa Help",
      color: "bg-teal-100 text-teal-600",
    },
  ];

  return (
    <div className="md:hidden px-4 py-6 bg-gray-light">
      <h2 className="text-lg font-bold text-gray-dark mb-4 px-2">Quick Actions</h2>
      <div className="grid grid-cols-4 gap-2">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link key={index} href={action.href} className="active:scale-95 transition-transform">
              <Card className="border-0 shadow-sm active:shadow-md transition-all bg-white">
                <CardContent className="p-3 flex flex-col items-center justify-center min-h-[90px]">
                  <div className={`${action.color} p-2.5 rounded-xl mb-2 w-12 h-12 flex items-center justify-center`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-medium text-center text-gray-dark leading-tight px-1">
                    {action.label}
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export { MobileQuickActions };
export default MobileQuickActions;

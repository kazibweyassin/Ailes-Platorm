"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Heart, LayoutDashboard, User, Shield, LogIn, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/scholarships", label: "Scholarships" },
    { href: "/university-matcher", label: "Find University" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Image 
              src="/Logo.png" 
              alt="Ailes Global" 
              width={150} 
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-dark hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/find-scholarships">
              <Button>
                <Sparkles className="mr-2 h-4 w-4" />
                Find My Scholarships
              </Button>
            </Link>
            <Link href="/sponsor">
              <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
                <Heart className="mr-2 h-4 w-4" />
                Sponsor a Scholar
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}
            {isLoggedIn && (
              <Link href="/dashboard">
                <Button variant="outline">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            )}
            {isLoggedIn ? (
              <Button 
                variant="ghost" 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-gray-dark hover:text-primary"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Link href="/auth/signin">
                <Button variant="ghost" className="text-gray-dark hover:text-primary">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-dark"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-gray-dark hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/find-scholarships" onClick={() => setIsOpen(false)}>
              <Button className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                Find My Scholarships
              </Button>
            </Link>
            <Link href="/sponsor" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full border-pink-600 text-pink-600 hover:bg-pink-50">
                <Heart className="mr-2 h-4 w-4" />
                Sponsor a Scholar
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/admin" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
            )}
            {isLoggedIn && (
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            )}
            {isLoggedIn ? (
              <Button 
                variant="outline" 
                className="w-full text-gray-dark hover:text-primary"
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full text-gray-dark hover:text-primary">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

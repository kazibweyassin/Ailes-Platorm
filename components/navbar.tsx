"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Heart, LayoutDashboard, User, Shield, LogIn, LogOut, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/scholarships", label: "Scholarships" },
    { href: "/university-matcher", label: "Study Abroad" },
    { href: "/about", label: "About" },
  ];

  const servicesDropdown = [
    { href: "/services", label: "All Services" },
    { href: "/pricing", label: "Packages & Pricing" },
    { href: "/university-matcher", label: "University Matching" },
    { href: "/find-scholarships", label: "Scholarship Search" },
    { href: "/copilot/activate", label: "AI Copilot" },
    { href: "/consulting", label: "Expert Consulting" },
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
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-dark hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
            
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="flex items-center text-gray-dark hover:text-primary transition-colors font-medium">
                Services
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {servicesDropdown.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-dark hover:bg-primary-light hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {/* Primary CTA */}
            <Link href="/find-scholarships">
              <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2">
                <Sparkles className="mr-2 h-4 w-4" />
                Find Scholarships
              </Button>
            </Link>
            
            {/* Secondary Actions */}
            <Link href="/sponsor">
              <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50 px-4 py-2">
                <Heart className="mr-2 h-4 w-4" />
                Sponsor
              </Button>
            </Link>
            
            {/* Admin & Dashboard */}
            {isAdmin && (
              <Link href="/admin">
                <Button variant="ghost" className="text-gray-dark hover:text-primary px-3 py-2">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}
            {isLoggedIn && (
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-dark hover:text-primary px-3 py-2">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            )}
            
            {/* Auth */}
            {isLoggedIn ? (
              <Button 
                variant="ghost" 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-gray-dark hover:text-primary px-3 py-2"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <>
                <Link href="/auth/signup">
                  <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2">
                    Get Started
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button variant="ghost" className="text-gray-dark hover:text-primary px-3 py-2">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              </>
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
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 px-2 text-gray-dark hover:text-primary hover:bg-primary/5 transition-colors rounded-md font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Services Dropdown (Mobile) */}
            <div>
              <button 
                className="flex items-center justify-between w-full py-3 px-2 text-gray-dark hover:text-primary hover:bg-primary/5 transition-colors rounded-md font-medium"
                onClick={() => setServicesOpen(!servicesOpen)}
              >
                Services
                <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {servicesOpen && (
                <div className="pl-4 space-y-1 mt-1">
                  {servicesDropdown.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block py-2 px-2 text-sm text-gray-dark hover:text-primary hover:bg-primary/5 transition-colors rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <div className="pt-2 space-y-2 border-t border-gray-200">
              {/* Primary CTA */}
              <Link href="/find-scholarships" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Find Scholarships
                </Button>
              </Link>
              
              {/* Secondary Actions */}
              <Link href="/sponsor" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full border-pink-600 text-pink-600 hover:bg-pink-50 py-3">
                  <Heart className="mr-2 h-4 w-4" />
                  Sponsor a Scholar
                </Button>
              </Link>
              
              {/* Admin & Dashboard */}
              {isAdmin && (
                <Link href="/admin" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full text-gray-dark hover:text-primary hover:bg-primary/5 py-3">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              {isLoggedIn && (
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full text-gray-dark hover:text-primary hover:bg-primary/5 py-3">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              )}
              
              {/* Auth */}
              {isLoggedIn ? (
                <Button 
                  variant="ghost" 
                  className="w-full text-gray-dark hover:text-primary hover:bg-primary/5 py-3"
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <>
                  <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full text-gray-dark hover:text-primary hover:bg-primary/5 py-3">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

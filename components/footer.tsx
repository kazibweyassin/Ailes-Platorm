import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Image 
              src="/Logo.png" 
              alt="Ailes Global" 
              width={150} 
              height={40}
              className="h-10 w-auto"
            />
            <p className="text-gray-300 text-sm">
              Empowering African students to access world-class education opportunities globally.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-300 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/scholarships" className="text-gray-300 hover:text-primary transition-colors">Scholarships</Link></li>
              <li><Link href="/success-stories" className="text-gray-300 hover:text-primary transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/university-matcher" className="text-gray-300 hover:text-primary transition-colors">University Matching</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-primary transition-colors">Application Support</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-primary transition-colors">Visa Assistance</Link></li>
              <li><Link href="/services" className="text-gray-300 hover:text-primary transition-colors">Test Preparation</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">info@ailesglobal.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">+256 786 367460</span>
                <span className="text-gray-300">+256 704 833021</span>


              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Access Building Rubaga Road Kampala Uganda</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; {currentYear} Ailes Global. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

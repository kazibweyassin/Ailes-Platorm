import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Offerings */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Offerings</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/university-matcher" className="hover:text-primary transition-colors">AI University Course Finder</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Study Abroad Consulting</Link></li>
              <li><Link href="/find-scholarships" className="hover:text-primary transition-colors">Scholarship Hub</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Visa & Immigration Support</Link></li>
            </ul>
          </div>

          {/* Study Abroad */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Study Abroad</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/destinations/uk" className="hover:text-primary transition-colors">Study in UK</Link></li>
              <li><Link href="/destinations/usa" className="hover:text-primary transition-colors">Study in USA</Link></li>
              <li><Link href="/destinations/ireland" className="hover:text-primary transition-colors">Study in Ireland</Link></li>
              <li><Link href="/destinations/canada" className="hover:text-primary transition-colors">Study in Canada</Link></li>
              <li><Link href="/destinations/germany" className="hover:text-primary transition-colors">Study in Germany</Link></li>
              <li><Link href="/destinations/france" className="hover:text-primary transition-colors">Study in France</Link></li>
              <li><Link href="/destinations/europe" className="hover:text-primary transition-colors">Study in Europe</Link></li>
              <li><Link href="/destinations/australia" className="hover:text-primary transition-colors">Study in Australia</Link></li>
              <li><Link href="/destinations/new-zealand" className="hover:text-primary transition-colors">Study in New Zealand</Link></li>
            </ul>
          </div>

          {/* Test Prep */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Test Prep</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-primary transition-colors">IELTS</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">GMAT</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">GRE</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">SAT</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">TOEFL</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">PTE</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/success-stories" className="hover:text-primary transition-colors">Success Stories</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Work with Us</Link></li>
              <li><Link href="/sponsor" className="hover:text-primary transition-colors">For Universities</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-primary transition-colors">LOR</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">SOP</Link></li>
            </ul>
          </div>

          {/* Other Links */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Other Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/refund-policy" className="hover:text-primary transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Image 
              src="/Logo.png" 
              alt="Ailes Global" 
              width={120} 
              height={32}
              className="h-8 w-auto"
            />
            <p className="text-xs text-gray-500 mt-2">Empowering African students globally</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-primary" />
              <span>info@ailesglobal.com</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-primary" />
              <span>+256 786 367460</span>
            </div>
          </div>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 mt-8">
          <p>&copy; {currentYear} Ailes Global. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

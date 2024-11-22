import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  Clock,
  ExternalLink
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kontakt */}
          <div className="space-y-4">
            <h3 className="text-gray-900 font-semibold">Kontakt</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p className="font-medium">Armann Systems GmbH</p>
              <div className="flex items-center">
                <Phone size={16} className="mr-2" />
                <a href="tel:+4994019179110" className="hover:text-blue-600">
                  +49 9401 91791 0
                </a>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2" />
                <a href="mailto:kontakt@armann-systems.com" className="hover:text-blue-600">
                  kontakt@armann-systems.com
                </a>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                <span>Mo-Fr 08:00 – 17:00 Uhr</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Social Media</h4>
              <div className="flex space-x-4">
                <a href="https://fb.me/armannsystems" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="https://linkedin.com/company/armann-systems-gmbh" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="https://instagram.com/armannsystems" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="https://twitter.com/armannsystems" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="https://www.youtube.com/channel/UCS3zxB3up1OfPu8wnJminIA" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Service & Support */}
          <div className="space-y-4">
            <h3 className="text-gray-900 font-semibold">Service & Support</h3>
            <div className="space-y-3 text-sm">
              <div className="space-y-2">
                <Link to="/dns" className="flex items-center text-gray-600 hover:text-blue-600">
                  DNS Analyse
                </Link>
                <Link to="/blacklist" className="flex items-center text-gray-600 hover:text-blue-600">
                  Blacklist Prüfung
                </Link>
                <Link to="/smtp" className="flex items-center text-gray-600 hover:text-blue-600">
                  SMTP Diagnose
                </Link>
                <Link to="/ssl" className="flex items-center text-gray-600 hover:text-blue-600">
                  SSL Zertifikat Check
                </Link>
              </div>
              <div className="pt-2 space-y-1">
                <div className="flex items-center text-gray-600">
                  <Mail size={16} className="mr-2" />
                  <span>support@armann-systems.com</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone size={16} className="mr-2" />
                  <span>+49 9401 91791 500</span>
                </div>
              </div>
            </div>
          </div>

          {/* Unternehmen */}
          <div className="space-y-4">
            <h3 className="text-gray-900 font-semibold">Unternehmen</h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <a href="https://armann-systems.com/unternehmen/" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-blue-600">
                Über uns
                <ExternalLink size={14} className="ml-1" />
              </a>
              <a href="https://armann-systems.com/karriere/" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-blue-600">
                Karriere
                <ExternalLink size={14} className="ml-1" />
              </a>
              <a href="https://armann-systems.com/impressum/" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-blue-600">
                Impressum
                <ExternalLink size={14} className="ml-1" />
              </a>
              <a href="https://armann-systems.com/datenschutz/" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-blue-600">
                Datenschutz
                <ExternalLink size={14} className="ml-1" />
              </a>
              <a href="https://armann-systems.com/agb/" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-blue-600">
                AGB
                <ExternalLink size={14} className="ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            <p>Unser Angebot gilt ausschließlich für gewerbliche Endkunden oder öffentliche Auftragnehmer.</p>
            <p>Alle Preise in EUR zuzüglich gesetzlicher MwSt. Alle Angaben ohne Gewähr. Abbildungs- und Textfehler vorbehalten.</p>
            <p className="mt-4">Copyright © 2019-{currentYear} Armann Systems GmbH. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

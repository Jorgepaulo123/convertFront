import React from 'react';
import { Link } from 'react-router-dom';
import { FileType2, Mail, MapPin, Github, Twitter as TwitterIcon, Facebook as FacebookIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <FileType2 className="h-8 w-8" />
              <span className="ml-2 text-2xl font-bold text-primary-light dark:text-primary-dark">
                FileConverter
              </span>
            </Link>
            <p className="text-indigo-200">
              The most powerful file conversion tool on the web. Convert any file format with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tools" className="text-indigo-200 hover:text-white transition-colors">
                  Tools
                </Link>
              </li>
              <li>
                <Link to="/media" className="text-indigo-200 hover:text-white transition-colors">
                  Media Tools
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-indigo-200 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-indigo-200 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-indigo-200 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li className="text-indigo-200">PDF to Excel</li>
              <li className="text-indigo-200">Background Removal</li>
              <li className="text-indigo-200">Audio Transcription</li>
              <li className="text-indigo-200">Batch Processing</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-indigo-200">
                <Mail className="h-5 w-5 mr-2" />
                jorgesebastiaopaulo@gmail.com
              </li>
              <li className="flex items-center text-indigo-200">
                <MapPin className="h-5 w-5 mr-2" />
                123 Conversion St, Digital City
              </li>
              <li className="mt-4">
                <div className="flex space-x-4">
                  <a href="https://x.com/jorge832924501" target="_blank" rel="noopener noreferrer" className="text-indigo-200 hover:text-white transition-colors">
                    <TwitterIcon className="h-6 w-6" />
                  </a>
                  <a href="https://www.facebook.com/JorgeS.paulomepia/" target="_blank" rel="noopener noreferrer" className="text-indigo-200 hover:text-white transition-colors">
                    <FacebookIcon className="h-6 w-6" />
                  </a>
                  <a href="https://github.com/Jorgepaulo123/" target="_blank" rel="noopener noreferrer" className="text-indigo-200 hover:text-white transition-colors">
                    <Github className="h-6 w-6" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-indigo-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-indigo-200 text-sm">
              &copy; {new Date().getFullYear()} FileConverter. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-indigo-200 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-indigo-200 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-indigo-200 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
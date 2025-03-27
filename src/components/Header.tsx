import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileType2, Menu, Moon, Sun } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newDarkMode = !prev;
      localStorage.setItem('darkMode', newDarkMode ? 'dark' : 'light');
      return newDarkMode;
    });
  };

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FileType2 className="h-8 w-8 text-primary-light dark:text-primary-dark" />
              <span className="ml-2 text-2xl font-bold text-primary-light dark:text-primary-dark">
                FileConverter
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/tools" className="text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark font-medium">
              Tools
            </Link>
            <Link to="/media" className="text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark font-medium">
              Media Tools
            </Link>
            <Link to="/features" className="text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark font-medium">
              Features
            </Link>
            <Link to="/about" className="text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark font-medium">
              About
            </Link>
            <Link to="/contact" className="text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark font-medium">
              Contact
            </Link>
            <button
              onClick={toggleDarkMode}
              className="p-2 text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 bg-white dark:bg-gray-800 absolute top-16 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="px-4">
              <div className="space-y-1">
                <Link 
                  to="/tools" 
                  className="block py-2 text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tools
                </Link>
                <Link 
                  to="/media" 
                  className="block py-2 text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Media Tools
                </Link>
                <Link 
                  to="/features" 
                  className="block py-2 text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  to="/about" 
                  className="block py-2 text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className="block py-2 text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileSpreadsheet, FileText, FileEdit, ImageIcon, ArrowRight, FileType2 } from 'lucide-react';

const Home = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  
  const backgroundImages = [
    'https://articles-images.sftcdn.net/wp-content/uploads/sites/3/2018/07/Convert-to-pdf.jpg',
    'https://getlua.com/assets/assets/images/ConvertPDFToWord.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const featuredTools = [
    {
      id: 'pdf-to-excel',
      title: 'PDF to Excel',
      icon: <FileSpreadsheet className="h-6 w-6" />,
      description: 'Convert PDF documents to Excel spreadsheets with high accuracy',
      link: '/tools'
    },
    {
      id: 'remove-background',
      title: 'Remove Background',
      icon: <ImageIcon className="h-6 w-6" />,
      description: 'Remove background from images automatically',
      link: '/media'
    },
    {
      id: 'audio-transcription',
      title: 'Audio Transcription',
      icon: <FileEdit className="h-6 w-6" />,
      description: 'Convert speech to text with high accuracy',
      link: '/media'
    },
    {
      id: 'word-to-pdf',
      title: 'Word to PDF',
      icon: <FileType2 className="h-6 w-6" />,
      description: 'Convert Word documents to PDF with perfect formatting preservation',
      link: '/tools'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-blue-600 py-20 text-white overflow-hidden">
        <div 
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Convert Your Files with Ease
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Free online file converter - Fast, Secure, and High Quality. Convert PDF, Excel, Word, and Images in seconds.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                to="/tools"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 hover:bg-indigo-600"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Tools</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Discover our most popular conversion tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredTools.map((tool) => (
              <Link 
                key={tool.id}
                to={tool.link}
                className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-light dark:hover:border-primary-dark transition-all hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-indigo-100 dark:bg-gray-600 text-primary-light dark:text-primary-dark">
                    {tool.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tool.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{tool.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link
              to="/tools"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark"
            >
              View All Tools
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 
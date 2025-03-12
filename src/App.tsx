import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { 
  FileUp, 
  Download, 
  FileType2, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  FileEdit,
  Mail,
  Github,
  Facebook,
  Twitter,
  Shield,
  Zap,
  Globe,
  Menu,
  Trash2
} from 'lucide-react';

type ConversionType = 'pdf-to-excel' | 'txt-to-pdf' | 'excel-to-pdf' | 'images-to-pdf' | 'pdf-to-docx' | 'word-to-pdf';

interface ConversionOption {
  id: ConversionType;
  title: string;
  accept: Record<string, string[]>;
  icon: React.ReactNode;
  maxFiles?: number;
  description: string;
}

const conversionOptions: ConversionOption[] = [
  {
    id: 'pdf-to-excel',
    title: 'PDF to Excel',
    accept: { 'application/pdf': ['.pdf'] },
    icon: <FileSpreadsheet className="h-6 w-6" />,
    description: 'Convert PDF documents to Excel spreadsheets with high accuracy'
  },
  {
    id: 'txt-to-pdf',
    title: 'Text to PDF',
    accept: { 'text/plain': ['.txt'] },
    icon: <FileText className="h-6 w-6" />,
    description: 'Transform plain text files into professional PDF documents'
  },
  {
    id: 'excel-to-pdf',
    title: 'Excel to PDF',
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    icon: <FileType2 className="h-6 w-6" />,
    description: 'Convert Excel spreadsheets to PDF with perfect formatting'
  },
  {
    id: 'images-to-pdf',
    title: 'Images to PDF',
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    icon: <ImageIcon className="h-6 w-6" />,
    maxFiles: 6,
    description: 'Combine up to 6 images into a single professional PDF document'
  },
  {
    id: 'pdf-to-docx',
    title: 'PDF to Word',
    accept: { 'application/pdf': ['.pdf'] },
    icon: <FileEdit className="h-6 w-6" />,
    description: 'Convert PDF files to editable Word documents with formatting preserved'
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    accept: { 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'] 
    },
    icon: <FileType2 className="h-6 w-6" />,
    description: 'Convert Word documents to PDF with perfect formatting preservation'
  }
];

function App() {
  const [selectedConversion, setSelectedConversion] = useState<ConversionType>('pdf-to-excel');
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const currentOption = conversionOptions.find(opt => opt.id === selectedConversion)!;

  const onDrop = (acceptedFiles: File[]) => {
    if (currentOption.maxFiles && acceptedFiles.length > currentOption.maxFiles) {
      setError(`Maximum ${currentOption.maxFiles} files allowed`);
      return;
    }
    setFiles(prev => [...prev, ...acceptedFiles].slice(0, currentOption.maxFiles || 1));
    setError('');
    setDownloadUrl('');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: currentOption.accept,
    maxFiles: currentOption.maxFiles || 1,
    multiple: selectedConversion === 'images-to-pdf'
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setConverting(true);
    setError('');
    
    const formData = new FormData();
    
    if (selectedConversion === 'images-to-pdf') {
      files.forEach(file => formData.append('files', file));
    } else {
      formData.append('file', files[0]);
    }

    try {
      const response = await axios.post(
        `https://converter-production-e953.up.railway.app/${selectedConversion}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      const baseUrl = 'https://converter-production-e953.up.railway.app';
      setDownloadUrl(`${baseUrl}${response.data.download_url}`);
    } catch (err) {
      setError('Error converting file. Please try again.');
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <FileType2 className="h-8 w-8" />
              <span className="ml-2 text-2xl font-bold">FileConverter</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white hover:text-indigo-200">Features</a>
              <a href="#tools" className="text-white hover:text-indigo-200">Tools</a>
              <a href="#about" className="text-white hover:text-indigo-200">About</a>
              <a href="#contact" className="text-white hover:text-indigo-200">Contact</a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 bg-indigo-700 absolute top-16 left-0 right-0 z-50">
              <div className="px-4">
                <div className="space-y-1">
                  <a href="#features" className="block py-2 text-white hover:text-indigo-200">Features</a>
                  <a href="#tools" className="block py-2 text-white hover:text-indigo-200">Tools</a>
                  <a href="#about" className="block py-2 text-white hover:text-indigo-200">About</a>
                  <a href="#contact" className="block py-2 text-white hover:text-indigo-200">Contact</a>
                </div>
                
                <div className="mt-4 pt-4 border-t border-indigo-600">
                  <h3 className="text-sm font-semibold text-indigo-200 uppercase tracking-wider">Conversion Tools</h3>
                  <div className="mt-2 space-y-1">
                    {conversionOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSelectedConversion(option.id);
                          setMobileMenuOpen(false);
                          const toolsSection = document.getElementById('tools');
                          toolsSection?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`w-full text-left flex items-center space-x-2 py-2 px-3 rounded-md ${
                          selectedConversion === option.id
                            ? 'bg-indigo-800 text-white'
                            : 'text-indigo-100 hover:bg-indigo-800'
                        }`}
                      >
                        {option.icon}
                        <span>{option.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

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
          </div>
        </div>
      </section>

      {/* Conversion Tools Section */}
      <section id="tools" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-indigo-900">Choose Your Conversion Tool</h2>
            <p className="mt-4 text-indigo-600">Select from our wide range of conversion options</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {conversionOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedConversion(option.id)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedConversion === option.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-400'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-indigo-600">{option.icon}</div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">{option.title}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Converter Interface */}
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-indigo-900 mb-6">{currentOption.title}</h3>
            
            <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}>
              <input {...getInputProps()} />
              <FileUp className="h-12 w-12 mx-auto text-indigo-400 mb-4" />
              <p className="text-gray-600">Drag & drop your files here, or click to select files</p>
              <p className="text-sm text-gray-500 mt-2">
                {currentOption.maxFiles 
                  ? `Up to ${currentOption.maxFiles} files allowed` 
                  : 'Single file upload'}
              </p>
            </div>

            {files.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3">Selected Files</h4>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-indigo-50 p-3 rounded">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-indigo-400" />
                        <span className="text-sm text-gray-600">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {downloadUrl && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span>Conversion completed!</span>
                  </div>
                  <a
                    href={downloadUrl}
                    download
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            )}

            <button
              onClick={handleConvert}
              disabled={files.length === 0 || converting}
              className={`mt-6 w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg text-white font-medium
                ${files.length === 0 || converting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
            >
              {converting ? (
                <>
                  <span className="animate-spin">⌛</span>
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <ArrowRight className="h-5 w-5" />
                  <span>Convert Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-indigo-900">Why Choose Our Converter</h2>
            <p className="mt-4 text-indigo-600">Experience the best file conversion service online</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Shield className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">100% Secure</h3>
              <p className="text-gray-600">Your files are encrypted and automatically deleted after conversion</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Zap className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Convert your files in seconds with our optimized algorithms</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Globe className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
              <p className="text-gray-600">No registration required. Convert files from any device, anywhere</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-indigo-900 mb-6">About FileConverter</h2>
            <p className="text-gray-600 mb-8">
              FileConverter is your trusted online file conversion tool. We provide fast, secure, and high-quality 
              conversion services for all your document needs. Our mission is to make file conversion accessible 
              to everyone, everywhere.
            </p>
            <div className="flex justify-center space-x-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600">1M+</div>
                <div className="text-gray-600">Files Converted</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600">100K+</div>
                <div className="text-gray-600">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600">99.9%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-indigo-900 mb-6">Contact Us</h2>
            <p className="text-gray-600 mb-8">
              Have questions? We're here to help. Reach out to our support team.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="mailto:support@fileconverter.com" className="text-indigo-600 hover:text-indigo-700">
                <Mail className="h-6 w-6" />
              </a>
              <a href="https://twitter.com/fileconverter" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://facebook.com/fileconverter" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">FileConverter</h3>
              <p className="text-indigo-200">
                The most trusted file conversion platform online.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-indigo-200 hover:text-white">Features</a></li>
                <li><a href="#tools" className="text-indigo-200 hover:text-white">Tools</a></li>
                <li><a href="#about" className="text-indigo-200 hover:text-white">About</a></li>
                <li><a href="#contact" className="text-indigo-200 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-indigo-200 hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="text-indigo-200 hover:text-white">Terms of Service</a></li>
                <li><a href="/cookies" className="text-indigo-200 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="https://twitter.com/fileconverter" target="_blank" rel="noopener noreferrer" className="text-indigo-200 hover:text-white">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="https://facebook.com/fileconverter" target="_blank" rel="noopener noreferrer" className="text-indigo-200 hover:text-white">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="https://github.com/fileconverter" target="_blank" rel="noopener noreferrer" className="text-indigo-200 hover:text-white">
                  <Github className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-indigo-800 text-center text-indigo-200">
            <p>&copy; {new Date().getFullYear()} FileConverter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
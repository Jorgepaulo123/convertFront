import React, { useState } from 'react';
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
  Phone,
  MapPin,
  Github,
  Facebook,
  Twitter,
  MessageCircle,
  Shield,
  Zap,
  Clock,
  Globe,
  Users,
  Menu,
  X,
  Trash2,
  Plus
} from 'lucide-react';

type ConversionType = 'pdf-to-excel' | 'txt-to-pdf' | 'excel-to-pdf' | 'images-to-pdf' | 'pdf-to-docx';

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
  }
];

function App() {
  const [selectedConversion, setSelectedConversion] = useState<ConversionType>('pdf-to-excel');
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const currentOption = conversionOptions.find(opt => opt.id === selectedConversion)!;

  const onDrop = (acceptedFiles: File[]) => {
    if (currentOption.maxFiles && acceptedFiles.length > currentOption.maxFiles) {
      setError(`Maximum ${currentOption.maxFiles} files allowed`);
      return;
    }
    setFiles(prev => [...prev, ...acceptedFiles].slice(0, currentOption.maxFiles || 1));
    setError('');
    setDownloadUrl('');
    setIsPreviewModalOpen(true);
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

  const previewFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // For non-image files, show basic info
      setFilePreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 flex flex-col">
      {/* App Bar */}
      <header className="bg-blue-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <FileType2 className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">File Converter</h1>
            </div>
            
            {/* Mobile menu button */}
            <button
              className="lg:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex space-x-1">
              {conversionOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedConversion(option.id);
                    setFiles([]);
                    setDownloadUrl('');
                    setError('');
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${selectedConversion === option.id
                      ? 'bg-white text-blue-600'
                      : 'text-white hover:bg-blue-500'
                    }`}
                >
                  <div className="flex items-center space-x-1">
                    {option.icon}
                    <span>{option.title}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {conversionOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedConversion(option.id);
                    setFiles([]);
                    setDownloadUrl('');
                    setError('');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium
                    ${selectedConversion === option.id
                      ? 'bg-white text-blue-600'
                      : 'text-white hover:bg-blue-500'
                    }`}
                >
                  {option.icon}
                  <span>{option.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-blue-900 mb-4">
            {currentOption.title}
          </h2>
          <p className="text-xl text-blue-700 max-w-2xl mx-auto">
            {currentOption.description}
          </p>
        </div>

        {/* Converter Section */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8">
            {/* Drop Zone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
            >
              <input {...getInputProps()} />
              <FileUp className="mx-auto h-12 w-12 text-blue-400 mb-4" />
              <p className="text-lg text-gray-600 mb-2">
                {isDragActive
                  ? 'Drop your files here'
                  : `Drag & drop your ${selectedConversion === 'images-to-pdf' ? 'images' : 'file'} here, or click to select`}
              </p>
              <p className="text-sm text-gray-500">
                {selectedConversion === 'images-to-pdf'
                  ? 'Maximum 6 images allowed'
                  : 'Maximum file size: 10MB'}
              </p>
            </div>

            {/* File Preview Modal */}
            {isPreviewModalOpen && files.length > 0 && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Selected Files</h3>
                    <button
                      onClick={() => setIsPreviewModalOpen(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-4">
                          {file.type.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="h-16 w-16 object-cover rounded"
                            />
                          ) : (
                            <div className="h-16 w-16 flex items-center justify-center bg-blue-100 rounded">
                              <FileType2 className="h-8 w-8 text-blue-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
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

                  {selectedConversion === 'images-to-pdf' && files.length < 6 && (
                    <button
                      onClick={() => document.querySelector('input[type="file"]')?.click()}
                      className="mt-4 flex items-center justify-center space-x-2 w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Add More Images</span>
                    </button>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setIsPreviewModalOpen(false)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {/* Selected Files Preview (outside modal) */}
            {files.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2"
                >
                  <FileType2 className="h-5 w-5" />
                  <span>{files.length} file{files.length > 1 ? 's' : ''} selected - Click to review</span>
                </button>
              </div>
            )}

            {/* Convert Button */}
            <button
              onClick={handleConvert}
              disabled={files.length === 0 || converting}
              className={`mt-6 w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg text-white font-medium
                ${files.length === 0 || converting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {converting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <ArrowRight className="h-5 w-5" />
                  <span>Convert Now</span>
                </>
              )}
            </button>

            {/* Download Section */}
            {downloadUrl && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-700 font-medium">Conversion successful!</span>
                </div>
                <a
                  href={downloadUrl}
                  download
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  <Download className="h-5 w-5" />
                  <span>Download Converted File</span>
                </a>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-md transform hover:scale-105 transition-transform">
              <Shield className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Processing</h3>
              <p className="text-gray-600">Your files are encrypted and automatically deleted after conversion.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md transform hover:scale-105 transition-transform">
              <Zap className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Advanced algorithms ensure quick conversion without compromising quality.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md transform hover:scale-105 transition-transform">
              <Clock className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Available</h3>
              <p className="text-gray-600">Convert your files anytime, anywhere, with our always-on service.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md transform hover:scale-105 transition-transform">
              <Globe className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cloud-Based</h3>
              <p className="text-gray-600">No software installation needed. Convert directly in your browser.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md transform hover:scale-105 transition-transform">
              <Users className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trusted by Millions</h3>
              <p className="text-gray-600">Join our growing community of satisfied users worldwide.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md transform hover:scale-105 transition-transform">
              <Shield className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">High Quality</h3>
              <p className="text-gray-600">Maintain the original quality and formatting of your files.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Contact Information */}
      <footer className="bg-blue-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-blue-200">
                We provide fast, secure, and accurate file conversion services for all your document needs. Our mission is to make file conversion simple and accessible to everyone.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-blue-200">
                  <Mail className="h-5 w-5" />
                  <span>contact@fileconverter.com</span>
                </div>
                <a 
                  href="https://wa.me/258860289475"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>+258 86 028 9475</span>
                </a>
                <div className="flex items-center space-x-2 text-blue-200">
                  <MapPin className="h-5 w-5" />
                  <span>123 Converter Street, Digital City</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a 
                  href="https://wa.me/258860289475" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  <MessageCircle className="h-6 w-6" />
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  <Github className="h-6 w-6" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-blue-800">
            <p className="text-center text-blue-200">
              © {new Date().getFullYear()} File Converter. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
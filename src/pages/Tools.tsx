import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
  FileSpreadsheet,
  FileText,
  FileEdit,
  FileType2,
  FileUp,
  Download,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Trash2
} from 'lucide-react';

type ConversionType = 'pdf-to-excel' | 'txt-to-pdf' | 'excel-to-pdf' | 'images-to-pdf' | 'pdf-to-docx' | 'word-to-pdf';

interface ConversionOption {
  id: ConversionType;
  title: string;
  accept: { [key: string]: string[] };
  icon: React.ReactNode;
  description: string;
  maxFiles?: number;
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
    icon: <FileType2 className="h-6 w-6" />,
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

const Tools = () => {
  const [selectedConversion, setSelectedConversion] = useState<ConversionType>('pdf-to-excel');
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

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
    maxFiles: currentOption.maxFiles || 1
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setConverting(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('file', file);
      });

      const response = await axios.post(`https://converter-e63j.onrender.com/${selectedConversion}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.download_url) {
        setDownloadUrl(`https://converter-e63j.onrender.com${response.data.download_url}`);
      } else {
        throw new Error('No download URL received');
      }
    } catch (err) {
      console.error('Conversion error:', err);
      setError('Error during conversion. Please try again.');
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Document Conversion Tools</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Convert your documents between different formats with high precision</p>
        </div>

        {/* Tools Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {conversionOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedConversion(option.id)}
                className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                  selectedConversion === option.id
                    ? 'border-primary-light dark:border-primary-dark bg-indigo-50 dark:bg-gray-700'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-light dark:hover:border-primary-dark'
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-3 rounded-full ${
                    selectedConversion === option.id
                      ? 'bg-primary-light dark:bg-primary-dark text-white dark:text-gray-800'
                      : 'bg-indigo-100 dark:bg-gray-600 text-primary-light dark:text-primary-dark'
                  }`}>
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{option.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Converter Interface */}
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-indigo-900 dark:text-white mb-6">{currentOption.title}</h3>
          
          <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-primary-light dark:border-primary-dark bg-indigo-50 dark:bg-gray-700' 
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-light dark:hover:border-primary-dark'}
          `}>
            <input {...getInputProps()} />
            <FileUp className="h-12 w-12 mx-auto text-primary-light dark:text-primary-dark mb-4" />
            <p className="text-primary-light dark:text-primary-dark">Drag & drop your files here, or click to select files</p>
            <p className="text-sm text-primary-light/70 dark:text-primary-dark/70 mt-2">
              {currentOption.maxFiles 
                ? `Up to ${currentOption.maxFiles} files allowed` 
                : 'Single file upload'}
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Selected Files</h4>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-indigo-50 dark:bg-gray-700 p-3 rounded">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-primary-light dark:text-primary-dark" />
                      <span className="text-sm text-primary-light dark:text-primary-dark">{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {downloadUrl && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span>Conversion completed!</span>
                </div>
                <a
                  href={downloadUrl}
                  download
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white dark:text-gray-800 rounded-lg hover:bg-secondary-light dark:hover:bg-secondary-dark"
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
                : 'bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white dark:text-gray-800'
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
    </div>
  );
};

export default Tools; 

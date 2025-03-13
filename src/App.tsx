import React, { useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
  FileSpreadsheet,
  FileText,
  FileEdit,
  ImageIcon,
  FileUp,
  Download,
  CheckCircle,
  AlertCircle,
  Shield,
  Zap,
  Globe,
  Menu,
  MapPin,
  Mail,
  FileType2,
  ArrowRight,
  Mic,
  Copy,
  StopCircle,
  Trash2,
  Github,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon
} from 'lucide-react';

type ConversionType = 'pdf-to-excel' | 'txt-to-pdf' | 'excel-to-pdf' | 'images-to-pdf' | 'pdf-to-docx' | 'word-to-pdf' | 'remove-background' | 'audio-transcription';

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
    id: 'remove-background',
    title: 'Remove Background',
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    icon: <ImageIcon className="h-6 w-6" />,
    description: 'Remove background from images automatically'
  },
  {
    id: 'audio-transcription',
    title: 'Audio Transcription',
    accept: { 'audio/*': ['.mp3', '.m4a', '.wav'] },
    icon: <FileEdit className="h-6 w-6" />,
    description: 'Convert speech to text with high accuracy'
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

export default function App() {
  const [selectedConversion, setSelectedConversion] = useState<ConversionType>('pdf-to-excel');
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaConversionResult, setMediaConversionResult] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [copied, setCopied] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcriptionResult, setTranscriptionResult] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const backgroundImages = [
    'https://articles-images.sftcdn.net/wp-content/uploads/sites/3/2018/07/Convert-to-pdf.jpg',
    'https://getlua.com/assets/assets/images/ConvertPDFToWord.png'
  ];

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        setAudioFile(audioFile);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('Error accessing microphone');
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscription = async () => {
    if (!audioFile) return;

    try {
      setIsTranscribing(true);
      setError(null);
      setTranscriptionResult('');

      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('model', 'whisper-large-v3');
      formData.append('response_format', 'verbose_json');

      const response = await axios.post('https://api.groq.com/openai/v1/audio/transcriptions', formData, {
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.text) {
        setTranscriptionResult(response.data.text);
        setError(null);
      } else {
        throw new Error('No transcription received');
      }
    } catch (err: any) {
      console.error('Transcription error:', err);
      const errorMessage = err.response?.data?.error?.message || 'Error during transcription. Please try again.';
      setError(errorMessage);
      setTranscriptionResult('');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleMediaConversion = async () => {
    if (!mediaFile) return;

    try {
      const formData = new FormData();
      formData.append('file', mediaFile);

      const response = await axios.post('https://converter-production-e953.up.railway.app/remove-background', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.download_url) {
        setMediaConversionResult(`https://converter-production-e953.up.railway.app${response.data.download_url}`);
      } else {
        throw new Error('No download URL received');
      }
      setError(null);
    } catch (err) {
      console.error('Background removal error:', err);
      setError('Error removing background. Please try again.');
    }
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

      const response = await axios.post(`https://converter-production-e953.up.railway.app/${selectedConversion}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.download_url) {
        setDownloadUrl(`https://converter-production-e953.up.railway.app${response.data.download_url}`);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => file.type.startsWith('audio/'));
    
    if (audioFile) {
      setAudioFile(audioFile);
      setError(null);
    } else {
      setError('Please drop an audio file (MP3, WAV, or M4A)');
    }
  };

  const handleImageDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(true);
  };

  const handleImageDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
  };

  const handleImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      setMediaFile(imageFile);
      setError(null);
    } else {
      setError('Please drop an image file (PNG, JPG, or JPEG)');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white font-['Inter']">
      {/* Header */}
      <header className="bg-white border-b border-indigo-100 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <FileType2 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                FileConverter
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#tools" className="text-gray-600 hover:text-indigo-600 font-medium">Tools</a>
              <a href="#features" className="text-gray-600 hover:text-indigo-600 font-medium">Features</a>
              <a href="#about" className="text-gray-600 hover:text-indigo-600 font-medium">About</a>
              <a href="#contact" className="text-gray-600 hover:text-indigo-600 font-medium">Contact</a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-indigo-600"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 bg-white absolute top-16 left-0 right-0 z-50 border-b border-indigo-100">
              <div className="px-4">
                <div className="space-y-1">
                  <a href="#tools" className="block py-2 text-gray-600 hover:text-indigo-600">Tools</a>
                  <a href="#features" className="block py-2 text-gray-600 hover:text-indigo-600">Features</a>
                  <a href="#about" className="block py-2 text-gray-600 hover:text-indigo-600">About</a>
                  <a href="#contact" className="block py-2 text-gray-600 hover:text-indigo-600">Contact</a>
                </div>
                
                <div className="mt-4 pt-4 border-t border-indigo-100">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Conversion Tools</h3>
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
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-gray-600 hover:bg-gray-50'
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

      {/* Tools Grid */}
      <section id="tools" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Tool</h2>
            <p className="mt-4 text-gray-600">Select from our wide range of conversion options</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {conversionOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedConversion(option.id)}
                className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                  selectedConversion === option.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-400'
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-3 rounded-full ${
                    selectedConversion === option.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{option.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

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

      {/* Media Conversion Section */}
      <section id="media-conversion" className="py-16 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Media Tools</h2>
            <p className="mt-4 text-gray-600">Advanced tools for image and audio processing</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Background Removal Tool */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <h3 className="ml-3 text-xl font-semibold text-gray-800">Remove Background</h3>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setMediaFile(file);
                        setError(null);
                      }
                    }}
                    className="hidden"
                    id="image-file"
                  />
                  <label
                    htmlFor="image-file"
                    onDragEnter={handleImageDragEnter}
                    onDragOver={handleImageDragOver}
                    onDragLeave={handleImageDragLeave}
                    onDrop={handleImageDrop}
                    className={`flex flex-col items-center justify-center w-full h-40 px-4 transition-all duration-300 
                      border-2 border-dashed rounded-xl
                      ${isDraggingImage 
                        ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
                        : 'border-gray-300 bg-gradient-to-br from-white to-gray-50 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-white hover:border-indigo-300'
                      }
                      hover:shadow-lg cursor-pointer group relative overflow-hidden`}
                  >
                    {isDraggingImage && (
                      <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
                    )}
                    {mediaFile ? (
                      <div className="flex flex-col items-center space-y-3">
                        <div className={`relative w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                          isDraggingImage ? 'scale-110' : ''
                        }`}>
                          <img
                            src={URL.createObjectURL(mediaFile)}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 text-center">
                          {mediaFile.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {isDraggingImage ? 'Drop to replace image' : 'Click to change image'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-3">
                        <div className={`p-3 rounded-full transition-all duration-300 ${
                          isDraggingImage 
                            ? 'bg-indigo-200 text-indigo-600 scale-110' 
                            : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                        }`}>
                          <ImageIcon className="h-8 w-8" />
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium text-gray-700 text-center">
                            {isDraggingImage 
                              ? 'Drop your image here' 
                              : <>Drop your image here, or <span className="text-indigo-600 group-hover:text-indigo-700">browse</span></>
                            }
                          </span>
                          <span className="text-xs text-gray-500">
                            PNG, JPG, or JPEG up to 10MB
                          </span>
                        </div>
                      </div>
                    )}
                  </label>
                  {mediaFile && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setMediaFile(null);
                        setMediaConversionResult(null);
                      }}
                      className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:scale-110 transition-all duration-200"
                      title="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {mediaFile && !mediaConversionResult && (
                  <button
                    onClick={handleMediaConversion}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg text-white font-medium bg-indigo-600 hover:bg-indigo-700 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <ImageIcon className="h-5 w-5" />
                    <span>Remove Background</span>
                  </button>
                )}

                {mediaConversionResult && (
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={mediaConversionResult}
                        alt="Result"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <a
                      href={mediaConversionResult}
                      download="image-no-background.png"
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Download className="h-5 w-5" />
                      <span>Download Result</span>
                    </a>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 rounded-lg flex items-center space-x-2 text-red-600">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Audio Transcription Tool */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <FileEdit className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 ml-4">Audio Transcription</h3>
              </div>

              <div className="space-y-6">
                {/* Recording Controls */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase mb-3">Record Audio</h4>
                  <div className="flex flex-col items-center">
                    <button
                      onClick={!isRecording ? startRecording : stopRecording}
                      className={`relative w-20 h-20 rounded-full transition-all duration-500 transform hover:scale-105 ${
                        isRecording 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <StopCircle className="h-8 w-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10" />
                          <div className="absolute inset-0 rounded-full">
                            <div className="absolute inset-0 rounded-full border-4 border-white animate-ping opacity-75"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-white animate-pulse"></div>
                          </div>
                        </>
                      ) : (
                        <Mic className="h-8 w-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      )}
                    </button>
                    {isRecording && (
                      <div className="mt-4 flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                        <span className="font-mono text-lg text-red-600">{formatTime(recordingTime)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase mb-3">Or Upload Audio File</h4>
                  <div className="relative group">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAudioFile(file);
                          setError(null);
                        }
                      }}
                      className="hidden"
                      id="audio-file"
                    />
                    <label
                      htmlFor="audio-file"
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`flex flex-col items-center justify-center w-full h-32 px-4 transition-all duration-300 
                        border-2 border-dashed rounded-xl
                        ${isDragging 
                          ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
                          : 'border-gray-300 bg-gradient-to-br from-white to-gray-50 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-white hover:border-indigo-300'
                        }
                        hover:shadow-lg cursor-pointer group relative overflow-hidden`}
                    >
                      {isDragging && (
                        <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
                      )}
                      {audioFile ? (
                        <div className="flex flex-col items-center space-y-2">
                          <div className={`p-2 rounded-full transition-all duration-300 ${
                            isDragging ? 'bg-indigo-200 scale-110' : 'bg-indigo-100'
                          } text-indigo-600`}>
                            <FileText className="h-6 w-6" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 text-center">
                            {audioFile.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {isDragging ? 'Drop to replace file' : 'Click to change file'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2">
                          <div className={`p-2 rounded-full transition-all duration-300 ${
                            isDragging 
                              ? 'bg-indigo-200 text-indigo-600 scale-110' 
                              : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                          }`}>
                            <FileUp className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium text-gray-700">
                              {isDragging 
                                ? 'Drop your file here' 
                                : <>Drop your audio file here, or <span className="text-indigo-600 group-hover:text-indigo-700">browse</span></>
                              }
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              MP3, WAV, or M4A up to 10MB
                            </span>
                          </div>
                        </div>
                      )}
                    </label>
                    {audioFile && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setAudioFile(null);
                        }}
                        className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:scale-110 transition-all duration-200"
                        title="Remove file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Transcribe Button */}
                {audioFile && (
                  <button
                    onClick={handleTranscription}
                    disabled={isTranscribing}
                    className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg text-white font-medium ${
                      isTranscribing 
                        ? 'bg-indigo-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {isTranscribing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Transcribing...</span>
                      </>
                    ) : (
                      <>
                        <FileEdit className="h-5 w-5" />
                        <span>Transcribe Audio</span>
                      </>
                    )}
                  </button>
                )}

                {/* Results */}
                {transcriptionResult && (
                  <div className="relative">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase mb-2">Transcription Result:</h4>
                    <div className="p-4 bg-gray-50 rounded-lg relative group">
                      <button
                        onClick={() => handleCopyText(transcriptionResult)}
                        className={`absolute top-2 right-2 p-2 rounded-lg transition-all duration-200 ${
                          copied 
                            ? 'bg-green-100 text-green-600' 
                            : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                        }`}
                        title="Copy to clipboard"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                      {copied && (
                        <div className="absolute top-2 right-12 bg-green-600 text-white text-xs px-2 py-1 rounded transform -translate-y-1/2 transition-opacity duration-200">
                          Copied!
                        </div>
                      )}
                      <p className="text-gray-700 whitespace-pre-wrap pr-12 leading-relaxed">{transcriptionResult}</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 rounded-lg flex items-center space-x-2 text-red-600">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Our Converter</h2>
            <p className="mt-4 text-gray-600">Experience the best file conversion service online</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
              <Shield className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">100% Secure</h3>
              <p className="text-gray-600">Your files are encrypted and automatically deleted after conversion</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
              <Zap className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Convert your files in seconds with our optimized algorithms</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
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
              <a href="mailto:jorgesebastiaopaulo@gmail.com" className="text-indigo-600 hover:text-indigo-700">
                <Mail className="h-6 w-6" />
              </a>
              <a href="https://x.com/jorge832924501" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                <TwitterIcon className="h-6 w-6" />
              </a>
              <a href="https://www.facebook.com/JorgeS.paulomepia/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                <FacebookIcon className="h-6 w-6" />
              </a>
              <a href="https://github.com/Jorgepaulo123/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center">
                <FileType2 className="h-8 w-8" />
                <span className="ml-2 text-2xl font-bold">FileConverter</span>
              </div>
              <p className="text-indigo-200">
                The most powerful file conversion tool on the web. Convert any file format with ease.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#tools" className="text-indigo-200 hover:text-white transition-colors">
                    Tools
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-indigo-200 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-indigo-200 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-indigo-200 hover:text-white transition-colors">
                    Contact
                  </a>
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
                <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
  ImageIcon,
  FileUp,
  Mic,
  Copy,
  StopCircle,
  AlertCircle
} from 'lucide-react';

const MediaTools = () => {
  const [selectedTool, setSelectedTool] = useState('background');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaConversionResult, setMediaConversionResult] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [copied, setCopied] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcriptionResult, setTranscriptionResult] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Background Removal
  const onImageDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setMediaFile(acceptedFiles[0]);
      setError(null);
      setMediaConversionResult(null);
    }
  };

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    onDrop: onImageDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1
  });

  // Audio Transcription
  const onAudioDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setAudioFile(acceptedFiles[0]);
      setError(null);
      setTranscriptionResult('');
    }
  };

  const { getRootProps: getAudioRootProps, getInputProps: getAudioInputProps } = useDropzone({
    onDrop: onAudioDrop,
    accept: { 'audio/*': ['.mp3', '.m4a', '.wav'] },
    maxFiles: 1
  });

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

      // Start timer
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Cleanup function
      return () => clearInterval(interval);
    } catch (err) {
      setError('Error accessing microphone');
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
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

      const response = await axios.post('https://converter-e63j.onrender.com/remove-background', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.download_url) {
        setMediaConversionResult(`https://converter-e63j.onrender.com${response.data.download_url}`);
      } else {
        throw new Error('No download URL received');
      }
      setError(null);
    } catch (err) {
      console.error('Background removal error:', err);
      setError('Error removing background. Please try again.');
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

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Media Tools</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Advanced tools for image and audio processing</p>
        </div>

        {/* Tool Selection */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedTool('background')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap
                ${selectedTool === 'background' 
                  ? 'bg-primary-light dark:bg-primary-dark text-white dark:text-gray-800' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
            >
              Background Removal
            </button>
            <button
              onClick={() => setSelectedTool('audio')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap
                ${selectedTool === 'audio' 
                  ? 'bg-primary-light dark:bg-primary-dark text-white dark:text-gray-800' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}
            >
              Audio Transcription
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {selectedTool === 'background' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-primary-light dark:bg-primary-dark text-white dark:text-gray-800">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <h3 className="ml-3 text-lg font-medium text-primary-light dark:text-primary-dark">Background Removal</h3>
              </div>

              <div 
                {...getImageRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDraggingImage 
                    ? 'border-primary-light dark:border-primary-dark bg-indigo-50 dark:bg-gray-700' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-light dark:hover:border-primary-dark'
                  }`}
                onDragEnter={handleImageDragEnter}
                onDragLeave={handleImageDragLeave}
                onDragOver={handleImageDragOver}
                onDrop={handleImageDrop}
              >
                <input {...getImageInputProps()} />
                <FileUp className="h-12 w-12 mx-auto text-primary-light dark:text-primary-dark mb-4" />
                <p className="text-primary-light dark:text-primary-dark">
                  Drag & drop your image here, or click to select
                </p>
                <p className="text-sm text-primary-light/70 dark:text-primary-dark/70 mt-2">
                  PNG, JPG or JPEG
                </p>
              </div>

              {mediaFile && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Selected: {mediaFile.name}
                  </p>
                </div>
              )}

              {mediaConversionResult && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Result</h4>
                  <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg">
                    <img 
                      src={mediaConversionResult} 
                      alt="Background removed" 
                      className="max-w-full h-auto mx-auto rounded"
                    />
                    <div className="mt-4 text-center">
                      <a
                        href={mediaConversionResult}
                        download="background-removed.png"
                        className="inline-flex items-center px-4 py-2 bg-primary-light dark:bg-primary-dark text-white dark:text-gray-800 rounded-lg hover:bg-secondary-light dark:hover:bg-secondary-dark"
                      >
                        Download Image
                      </a>
                    </div>
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

              <button
                onClick={handleMediaConversion}
                disabled={!mediaFile}
                className={`mt-6 w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium
                  ${!mediaFile
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white dark:text-gray-800'
                  }`}
              >
                <span>Remove Background</span>
              </button>
            </div>
          )}

          {selectedTool === 'audio' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-full bg-primary-light dark:bg-primary-dark text-white dark:text-gray-800">
                  <Mic className="h-6 w-6" />
                </div>
                <h3 className="ml-3 text-lg font-medium text-primary-light dark:text-primary-dark">Audio Transcription</h3>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-4 rounded-full transition-colors ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-primary-light dark:bg-primary-dark text-white dark:text-gray-800'
                    }`}
                  >
                    {isRecording ? <StopCircle className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                  </button>
                  <p className="mt-2 text-sm text-primary-light dark:text-primary-dark">
                    {isRecording ? `Recording... ${formatTime(recordingTime)}` : 'Click to record'}
                  </p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <p className="text-center text-sm text-primary-light dark:text-primary-dark mb-4">
                    OR UPLOAD AUDIO FILE
                  </p>
                  <div 
                    {...getAudioRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                      ${isDragging 
                        ? 'border-primary-light dark:border-primary-dark bg-indigo-50 dark:bg-gray-700' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-light dark:hover:border-primary-dark'
                      }`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <input {...getAudioInputProps()} />
                    <FileUp className="h-12 w-12 mx-auto text-primary-light dark:text-primary-dark mb-4" />
                    <p className="text-primary-light dark:text-primary-dark">
                      Drag & drop your audio file here, or click to select
                    </p>
                    <p className="text-sm text-primary-light/70 dark:text-primary-dark/70 mt-2">
                      MP3, WAV or M4A
                    </p>
                  </div>
                </div>

                {audioFile && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Selected: {audioFile.name}
                    </p>
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

                <button
                  onClick={handleTranscription}
                  disabled={!audioFile || isTranscribing}
                  className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium
                    ${!audioFile || isTranscribing
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white dark:text-gray-800'
                    }`}
                >
                  <span>{isTranscribing ? 'Transcribing...' : 'Transcribe Audio'}</span>
                </button>

                {transcriptionResult && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Transcription Result</h4>
                      <button
                        onClick={() => handleCopyText(transcriptionResult)}
                        className="text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark"
                        title="Copy to clipboard"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="mt-2 p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg relative">
                      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                        {transcriptionResult}
                      </p>
                      {copied && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                          Copied!
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaTools; 

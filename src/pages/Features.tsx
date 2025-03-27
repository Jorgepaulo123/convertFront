import React from 'react';
import { Shield, Zap, Globe, CheckCircle } from 'lucide-react';

const Features = () => {
  const featuresList = [
    {
      icon: <Shield className="h-12 w-12 text-primary-light dark:text-primary-dark mb-4" />,
      title: '100% Secure',
      description: 'Your files are encrypted and automatically deleted after conversion. We prioritize your privacy and data security at all times.'
    },
    {
      icon: <Zap className="h-12 w-12 text-primary-light dark:text-primary-dark mb-4" />,
      title: 'Lightning Fast',
      description: 'Convert your files in seconds with our optimized algorithms. Our cloud-based service ensures quick processing regardless of your device.'
    },
    {
      icon: <Globe className="h-12 w-12 text-primary-light dark:text-primary-dark mb-4" />,
      title: 'Easy to Use',
      description: 'No registration required. Convert files from any device, anywhere. Our intuitive interface makes file conversion accessible to everyone.'
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-primary-light dark:text-primary-dark mb-4" />,
      title: 'High Quality Results',
      description: 'Our advanced conversion technology ensures that your output files maintain the highest quality and formatting accuracy.'
    }
  ];

  const comparisonFeatures = [
    'High quality conversion',
    'Multiple file formats',
    'Fast processing',
    'No software installation',
    'Secure file handling',
    'Background removal',
    'Audio transcription',
    'Batch processing',
    'Free plan available',
    'User-friendly interface'
  ];

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Features</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover why FileConverter is the best choice for all your file conversion needs
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {featuresList.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-16">
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How We Compare</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              See how FileConverter stacks up against the competition
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    FileConverter
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Competitor A
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Competitor B
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {feature}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      {index < 6 ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">✕</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      {index < 4 ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">✕</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-gray-700 flex items-center justify-center text-primary-light dark:text-primary-dark font-bold">
                  JD
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">John Doe</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Marketing Manager</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "This tool has saved me countless hours of work. The PDF to Excel conversion is spot-on!"
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-gray-700 flex items-center justify-center text-primary-light dark:text-primary-dark font-bold">
                  AS
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Alice Smith</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Graphic Designer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "The background removal tool is amazing. Clean edges and perfect results every time!"
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-gray-700 flex items-center justify-center text-primary-light dark:text-primary-dark font-bold">
                  RJ
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Robert Johnson</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Content Creator</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "Audio transcription is extremely accurate. It saves me so much time with my podcast production!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features; 
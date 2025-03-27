import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, Heart, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">About FileConverter</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Learn about our mission, our team, and why we built the best file conversion service
          </p>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img
                  className="h-full w-full object-cover md:w-48"
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Team working on laptops"
                />
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  FileConverter was founded in 2020 with a simple mission: to make file conversion accessible, 
                  fast, and reliable for everyone. We noticed a gap in the market for a user-friendly file conversion 
                  service that didn't compromise on quality or security.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Since our launch, we've helped over 1 million users convert their files with ease. 
                  Our team continues to work on expanding our file format support and improving our 
                  conversion algorithms to ensure the highest quality results.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
              <div className="text-4xl font-bold text-primary-light dark:text-primary-dark">1M+</div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">Files Converted</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
              <div className="text-4xl font-bold text-primary-light dark:text-primary-dark">100K+</div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">Happy Users</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md text-center">
              <div className="text-4xl font-bold text-primary-light dark:text-primary-dark">99.9%</div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
              <Users className="h-12 w-12 text-primary-light dark:text-primary-dark mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">User First</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We put our users at the center of everything we do. Our products are designed 
                to be intuitive, accessible, and solve real problems.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
              <Award className="h-12 w-12 text-primary-light dark:text-primary-dark mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Quality</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We never compromise on quality. Our conversion algorithms are constantly 
                refined to ensure the highest fidelity results.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
              <Heart className="h-12 w-12 text-primary-light dark:text-primary-dark mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Passion</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We're passionate about solving complex technical challenges and making 
                advanced technology accessible to everyone.
              </p>
            </div>
          </div>
        </div>

        {/* BlueSpark Image instead of Our Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Our Team</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 flex justify-center">
            <img 
              src="https://scontent-jnb2-1.xx.fbcdn.net/v/t39.30808-6/438146437_122144946626147234_8142104560906863668_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeE0O7YRPMQf7MHxj5eRBVNCC08CaFUnrRULTwJoVSetFbE4iQNEt58RTnAGiryJZbEa_WJcWgLdhhksWNhl5afE&_nc_ohc=1Bred_vhssoQ7kNvgEs7zKk&_nc_zt=23&_nc_ht=scontent-jnb2-1.xx&_nc_gid=aASFCe0P__8ZMIbexBmQ1Q&oh=00_AYFajKKBUcQ05cTKNHs0XXG98rDwlL1_YwTSW8nD_mMdhQ&oe=67EAE720" 
              alt="BlueSpark Team" 
              className="max-w-lg w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to convert your files?</h2>
          <p className="mb-6 text-indigo-100">
            Experience the fastest, most accurate file conversion service available today.
          </p>
          <Link
            to="/tools"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About; 
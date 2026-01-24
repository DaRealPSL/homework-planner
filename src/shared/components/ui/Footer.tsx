import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ✨ Made by PSL for students ✨
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              © {new Date().getFullYear()} Studiflow. All rights reserved.
            </p>
          </div>
          
          <div className="flex gap-6">
            <a 
              href="/legal/privacy-policy" 
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="/legal/terms-of-service" 
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="mailto:pepijnl.snoeren0@gmail.com" 
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

//export default Footer;
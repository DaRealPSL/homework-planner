import React from 'react';
import { Footer } from '@/shared/index';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: January 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              1. Acceptance
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              By accessing or using Studiflow, you agree to these Terms of Service and the Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              2. Description of the Service
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Studiflow is a homework planning application designed to help students organize schoolwork. The service is provided for personal, non-commercial use.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              3. Eligibility
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              You must be at least <strong>13 years old</strong> to use Studiflow.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              4. User Accounts
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              5. Acceptable Use
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
              <li>Use Studiflow for illegal purposes</li>
              <li>Attempt to disrupt or damage the service</li>
              <li>Reverse-engineer, exploit, or abuse the app or its infrastructure</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              6. Availability
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We aim to keep Studiflow available and reliable, but uninterrupted access is not guaranteed.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              All software, code, design, and branding related to Studiflow are the property of the developer unless stated otherwise.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              8. Disclaimer
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Studiflow is provided "as is" without warranties of any kind. Use of the app is at your own risk.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              The developer is not liable for data loss, missed deadlines, or damages resulting from the use or inability to use Studiflow.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              10. Governing Law
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              These Terms are governed by the laws of <strong>The Netherlands</strong>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              11. Changes to the Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              These Terms may be updated from time to time. Continued use of Studiflow means acceptance of the updated Terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              12. Contact
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              For questions about these Terms, contact:{' '}
              <a 
                href="mailto:pepijnl.snoeren0@gmail.com" 
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                pepijnl.snoeren0@gmail.com
              </a>
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default TermsOfService;
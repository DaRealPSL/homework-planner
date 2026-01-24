import React from 'react';
import { Footer } from '@/shared/index';

const PrivacyPolicy: React.FC = () => {
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
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: January 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Studiflow is a non-commercial homework planning app created for students. We value your privacy and only collect the minimum data required for the app to function.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We collect only information necessary to provide the service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
              <li>Name or username</li>
              <li>Email address (used for account access)</li>
              <li>Homework-related data you create (subjects, tasks, deadlines)</li>
              <li>Basic technical data such as error logs for app stability</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We do <strong>not</strong> collect location data, contact lists, advertising data, or tracking identifiers.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              2. How We Use Your Data
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Your data is used solely to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
              <li>Provide and operate the Studiflow app</li>
              <li>Store and sync your homework data</li>
              <li>Improve reliability and fix bugs</li>
              <li>Ensure account security</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              3. Data Storage
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              All data is securely stored using <strong>Supabase</strong>, with servers located within the <strong>European Union</strong>. This complies with the General Data Protection Regulation (GDPR).
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              4. Data Sharing
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We do <strong>not</strong> sell or share your personal data with third parties. Data is only accessed when required for technical maintenance or legal obligations.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              5. Data Retention
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Your data is retained only while your account exists. You may request deletion of your account and all associated data at any time.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              6. Your Rights (GDPR)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Under GDPR, you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              To exercise these rights, please contact us.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              7. Children's Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Studiflow is intended for users aged <strong>13 and older</strong>. We do not knowingly collect personal data from children under 13.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              8. Changes to This Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              This Privacy Policy may be updated occasionally. Any changes will be published on this page.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              9. Contact
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              If you have questions about this Privacy Policy, contact:{' '}
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

export default PrivacyPolicy;
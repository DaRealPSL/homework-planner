import React from 'react';
import { useNavigate } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate(); //

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Last updated: 05/01/2026 (DD/MM/YYYY)</p>

        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p className="mb-2">We collect information you provide directly to us:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Account information:</strong> Email address, display name, class code</li>
              <li><strong>Content:</strong> Homework assignments, descriptions, attachments</li>
              <li><strong>Usage data:</strong> How you interact with the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Provide, maintain, and improve our service</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Information Sharing</h2>
            <p className="mb-2">We share information as follows:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>With classmates:</strong> Homework you create is visible to your class</li>
              <li><strong>With your consent:</strong> We may share information with your explicit permission</li>
              <li><strong>For legal reasons:</strong> If required by law or to protect our rights</li>
            </ul>
            <p className="mt-2 font-semibold">We DO NOT sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Data Security</h2>
            <p>We use industry-standard security measures to protect your information. However, no method of transmission over the Internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Data Retention</h2>
            <p>We retain your information for as long as your account is active or as needed to provide services. You can request deletion of your data at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Cookies</h2>
            <p>We use essential cookies to maintain your session. We do not use tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Children's Privacy</h2>
            <p>Users under 13 are not permitted. If we learn we've collected information from a child under 13, we will delete it immediately.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Changes to This Policy</h2>
            <p>We may update this policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contact Us</h2>
            <p>For questions about this Privacy Policy, please contact: <a href="mailto:privacy@example.com" className="text-primary-400 hover:text-primary-300">privacy@example.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
};
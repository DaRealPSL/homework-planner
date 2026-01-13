import React from 'react';
import { useNavigate } from 'react-router-dom';

export const TermsOfService: React.FC = () => {
  const navigate = useNavigate();

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

        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()} (MM/DD/YYYY)</p>

        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using Student Homework Planner, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Use License</h2>
            <p>Permission is granted to temporarily use this service for personal, non-commercial educational purposes only. This is the grant of a license, not a transfer of title.</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>You must not modify or copy the materials</li>
              <li>You must not use the materials for any commercial purpose</li>
              <li>You must not attempt to decompile or reverse engineer any software</li>
              <li>You must not remove any copyright or other proprietary notations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. User Responsibilities</h2>
            <p>You are responsible for:</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Maintaining the confidentiality of your account</li>
              <li>All activities that occur under your account</li>
              <li>Not sharing inappropriate content</li>
              <li>Not harassing or bullying other users</li>
              <li>Respecting the intellectual property of others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Age Restrictions</h2>
            <p>This service is intended for students aged 13 and older. Users under 18 should have parental consent.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Content</h2>
            <p>You retain all rights to content you upload. By uploading content, you grant us a license to display and share it with your classmates.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Termination</h2>
            <p>We may terminate or suspend your account immediately, without prior notice, for any violation of these Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Disclaimer</h2>
            <p>This service is provided "as is" without any warranties. We do not guarantee the service will be uninterrupted or error-free.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Contact</h2>
            <p>For questions about these Terms, please contact us at: <a href="mailto:support@example.com" className="text-primary-400 hover:text-primary-300">support@example.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
};
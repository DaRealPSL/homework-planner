import React, { useState } from 'react';
import { Footer } from '@/shared/index';
import { supabase } from '@/core/lib/supabase';

interface ClassCodeEntryProps {
  onClassCodeValidated: (classId: string) => void;
}

export const ClassCodeEntry: React.FC<ClassCodeEntryProps> = ({ onClassCodeValidated }) => {
  const [classCode, setClassCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateClassCode = async (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    const regex = /^[0-9]{1,2}[A-Z]{2,3}[0-9]{1,2}$/;

    if (!code) {
      return { valid: false, error: 'Please enter your class code.' };
    }

    if (!regex.test(code)) {
      return { valid: false, error: 'Invalid class code format. Example: 1HAT2' };
    }

    try {
      // Call the safe RPC instead of selecting the classes table
      const resp = (await supabase.rpc('get_class_by_code', { p_code: code })) as any;

      // handle network / rpc errors
      if (resp.error) {
        // 406-like or other server errors
        // Provide a helpful, non-leaky message
        if (resp.error.code === 'PGRST116' || resp.status === 406) {
          return { valid: false, error: 'Class code not found. Please check your code.' };
        }
        return { valid: false, error: `Server error: ${resp.error.message}` };
      }

      // RPC returning a TABLE will usually return an array of rows
      const data = resp.data;
      if (Array.isArray(data)) {
        if (data.length === 0) return { valid: false, error: 'Class code not found. Please check your code.' };
        return { valid: true, classId: data[0].class_id || data[0].id };
      }

      // RPC might return a single object depending on function definition
      if (data && (data.class_id || data.id)) {
        return { valid: true, classId: data.class_id || data.id };
      }

      return { valid: false, error: 'Class code not found. Please check your code.' };
    } catch (err: any) {
      // Unexpected exception (network, runtime, etc.)
      return { valid: false, error: `Unexpected error: ${err?.message ?? String(err)}` };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await validateClassCode(classCode);

      if (result.valid && result.classId) {
        localStorage.setItem('classId', result.classId);
        onClassCodeValidated(result.classId);
      } else {
        setError(result.error || 'Invalid class code');
      }
    } catch (err: any) {
      setError(`An error occurred: ${err?.message ?? String(err)}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('classId');
      window.location.reload();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 transition-colors">
      {/* Top Bar */}
      <div className="fixed top-4 right-4 flex items-center gap-3 z-10">
        {/*<DarkModeToggle />*/}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 transition-colors">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Student Homework Planner
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your class code to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="classCode" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Class Code
              </label>
              <input
                id="classCode"
                type="text"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                placeholder="e.g., 2HT2"
                className="w-full px-4 py-3 text-center text-lg tracking-wider font-semibold border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                maxLength={6}
                pattern="[0-9]{1,2}[A-Z]{2,3}[0-9]{1,2}"
                required
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                Format: Grade (1-2) + Class (2-3 letters) + Group (1-2)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !classCode}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Validating...
                </span>
              ) : (
                'Continue →'
              )}
            </button>
          </form>

          {/* Examples */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-3">
              📚 Example Codes
            </h3>
            <div className="space-y-2">
              {[
                { code: '3HT1', desc: 'Grade 3, HAVO Tweetalig, Class 1' },
                { code: '2AT3', desc: 'Grade 2, VWO Tweetalig, Class 3' },
                { code: '3GT1', desc: 'Grade 3, Gynasium Tweetalig, Class 1' },
              ].map(({ code, desc }) => (
                <div key={code} className="flex items-center gap-2 text-sm">
                  <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded font-mono font-semibold">
                    {code}
                  </code>
                  <span className="text-blue-700 dark:text-blue-300 text-xs">
                    {desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* Footer */}
      <Footer />
      </div>
    </div>
  );
};

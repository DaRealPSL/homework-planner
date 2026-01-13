import React, { useState, useEffect } from 'react';
import { supabase } from '@/core/lib/supabase';
import { useAttachments } from '@/features/attachments';

interface HomeworkFormProps {
  classId: string;
  homework?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const HomeworkForm: React.FC<HomeworkFormProps> = ({
  classId,
  homework,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    due_date: '',
    due_time: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { uploadAttachment, uploading, error: uploadError } = useAttachments();

  useEffect(() => {
    if (homework) {
      const dueDate = new Date(homework.due_date);
      setFormData({
        title: homework.title,
        description: homework.description || '',
        subject: homework.subject || '',
        due_date: dueDate.toISOString().split('T')[0],
        due_time: dueDate.toTimeString().slice(0, 5),
      });
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData({
        title: '',
        description: '',
        subject: '',
        due_date: tomorrow.toISOString().split('T')[0],
        due_time: '23:59',
      });
    }
  }, [homework]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      const dueDateTime = new Date(`${formData.due_date}T${formData.due_time}`);
      let homeworkId: string;

      if (homework) {
        const { error } = await supabase
          .from('homework')
          .update({
            title: formData.title,
            description: formData.description,
            subject: formData.subject,
            due_date: dueDateTime.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', homework.id);

        if (error) throw error;
        homeworkId = homework.id;
      } else {
        const { data, error } = await supabase
          .from('homework')
          .insert({
            class_id: classId,
            title: formData.title,
            description: formData.description,
            subject: formData.subject,
            due_date: dueDateTime.toISOString(),
            created_by: user.data.user.id,
          })
          .select()
          .single();

        if (error) throw error;
        homeworkId = data.id;
      }

      // Upload attachments (skip for now due to RLS issue)
      // if (files.length > 0) {
      //   for (const file of files) {
      //     await uploadAttachment({ homeworkId, file });
      //   }
      // }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      const maxSize = 10 * 1024 * 1024;

      const validFiles = fileList.filter(file => {
        if (!allowedTypes.includes(file.type)) {
          setError(`Invalid file type: ${file.name}. Only images and PDFs are allowed.`);
          return false;
        }
        if (file.size > maxSize) {
          setError(`File too large: ${file.name}. Maximum size is 10MB.`);
          return false;
        }
        return true;
      });

      setFiles(validFiles);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden transition-colors">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {homework ? 'Edit Homework' : 'Add New Homework'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-80px)]">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="e.g., Math Assignment Chapter 5"
              required
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="e.g., Mathematics"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
              rows={4}
              placeholder="Add any additional details about the assignment..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="due_date" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="due_time" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Due Time <span className="text-red-500">*</span>
              </label>
              <input
                id="due_time"
                type="time"
                value={formData.due_time}
                onChange={(e) => setFormData({ ...formData, due_time: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Attachments disabled for now */}
          {/* <div>
            <label htmlFor="attachments" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Attachments (Coming Soon)
            </label>
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm">File uploads coming soon!</p>
            </div>
          </div> */}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {loading || uploading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  {homework ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                homework ? 'Update Homework' : 'Create Homework'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

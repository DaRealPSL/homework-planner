import React, { useState } from 'react';

interface HomeworkItem {
  id: string;
  class_id: string;
  title: string;
  description: string | null;
  subject: string | null;
  due_date: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  creator?: {
    display_name: string;
    avatar_url: string | null;
  };
  // some payloads may use homework_attachments / homework_completion names from supabase
  attachments?: Array<{
    id: string;
    storage_path: string;
    filename: string;
    mime_type: string;
  }>;
  completion?: Array<{
    done: boolean;
    user_id: string;
  }>;
  // fallback names Supabase might return
  homework_attachments?: unknown;
  homework_completion?: unknown;
}

interface DaySidebarProps {
  isOpen: boolean;
  date: Date | null;
  homework: HomeworkItem[];
  onClose: () => void;
  onEditHomework: (homework: HomeworkItem) => void;
  onToggleCompletion: (homeworkId: string, done: boolean) => void;
  currentUserId?: string | null;
}

export const DaySidebar: React.FC<DaySidebarProps> = ({
  isOpen,
  date,
  homework,
  onClose,
  onEditHomework,
  onToggleCompletion,
  currentUserId = null,
}) => {
  const [selectedHomework, setSelectedHomework] = useState<string | null>(null);

  if (!isOpen || !date) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getPriorityColor = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'border-red-500/50 bg-red-900/20';
    if (diffDays === 0) return 'border-orange-500/50 bg-orange-900/20';
    if (diffDays <= 3) return 'border-yellow-500/50 bg-yellow-900/20';
    return 'border-gray-700 bg-gray-800/50';
  };

  // normalize relation names
  const getCompletionArray = (hw: HomeworkItem) =>
    (hw.completion as any) ?? (hw.homework_completion as any) ?? [];

  const getAttachmentsArray = (hw: HomeworkItem) =>
    (hw.attachments as any) ?? (hw.homework_attachments as any) ?? [];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 border-l border-gray-700 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800/95 backdrop-blur-sm">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {formatDate(date)}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {homework.length} assignment{homework.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-900">
            {homework.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-medium text-gray-300">No assignments</h3>
                <p className="mt-2 text-sm text-gray-500">
                  No homework due on this date
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {homework.map((hw) => {
                  const completionArr = getCompletionArray(hw);
                  const attachmentsArr = getAttachmentsArray(hw);
                  const isDone =
                    currentUserId != null &&
                    completionArr.some((c: any) => c.user_id === currentUserId && !!c.done);

                  return (
                    <div
                      key={hw.id}
                      className={`border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-lg ${
                        getPriorityColor(hw.due_date)
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-white flex-1 text-base">{hw.title}</h3>
                        <div className="flex items-center gap-2 ml-2">
                          <button
                            onClick={() => onToggleCompletion(hw.id, !isDone)}
                            className={`p-2 rounded-lg transition-all ${
                              isDone
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                            }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => onEditHomework(hw)}
                            className="p-2 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {hw.subject && (
                        <div className="mb-3">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary-500/20 text-primary-300 border border-primary-500/30">
                            {hw.subject}
                          </span>
                        </div>
                      )}

                      {hw.description && (
                        <p className="text-sm text-gray-400 mb-3 line-clamp-3">
                          {hw.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-700">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatTime(hw.due_date)}
                        </span>
                        {hw.creator?.display_name && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {hw.creator.display_name}
                          </span>
                        )}
                      </div>

                      {attachmentsArr && attachmentsArr.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <button
                            onClick={() => setSelectedHomework(selectedHomework === hw.id ? null : hw.id)}
                            className="text-xs text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            {selectedHomework === hw.id ? 'Hide' : 'View'} {attachmentsArr.length} attachment{attachmentsArr.length !== 1 ? 's' : ''}
                          </button>
                          
                          {selectedHomework === hw.id && (
                            <div className="mt-3 space-y-2">
                              {attachmentsArr.map((att: any) => (
                                <div key={att.id} className="p-2 bg-gray-700 rounded-lg text-sm text-gray-300">
                                  📎 {att.filename}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {isDone && (
                        <div className="mt-3 pt-3 border-t border-gray-700 flex items-center text-green-400">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs font-medium">Completed</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
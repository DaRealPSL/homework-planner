import React from 'react';

interface HomeworkItem {
  id: string;
  title: string;
  subject: string | null;
  description: string | null;
  due_date: string;
  completion?: Array<{ done: boolean }>;
}

interface TodayViewProps {
  homework: HomeworkItem[];
  onToggleCompletion: (homeworkId: string, done: boolean) => void;
  onEditHomework: (homework: HomeworkItem) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  homework,
  onToggleCompletion,
  onEditHomework,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayHomework = homework.filter((hw) => {
    const dueDate = new Date(hw.due_date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  });

  const overdueHomework = homework.filter((hw) => {
    const dueDate = new Date(hw.due_date);
    return dueDate < today && !hw.completion?.[0]?.done;
  });

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Today's Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            Today's Homework
          </h2>
          <p className="text-gray-400 mt-1">
            {today.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Overdue Section */}
      {overdueHomework.length > 0 && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-400">
              Overdue ({overdueHomework.length})
            </h3>
          </div>

          <div className="space-y-3">
            {overdueHomework.map((hw) => (
              <HomeworkCard
                key={hw.id}
                homework={hw}
                onToggleCompletion={onToggleCompletion}
                onEditHomework={onEditHomework}
                isOverdue
              />
            ))}
          </div>
        </div>
      )}

      {/* Today's Homework */}
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
        {todayHomework.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">All caught up! 🎉</h3>
            <p className="text-gray-400">No homework due today</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white mb-4">
              Due Today ({todayHomework.length})
            </h3>
            {todayHomework.map((hw) => (
              <HomeworkCard
                key={hw.id}
                homework={hw}
                onToggleCompletion={onToggleCompletion}
                onEditHomework={onEditHomework}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface HomeworkCardProps {
  homework: HomeworkItem;
  onToggleCompletion: (homeworkId: string, done: boolean) => void;
  onEditHomework: (homework: HomeworkItem) => void;
  isOverdue?: boolean;
}

const HomeworkCard: React.FC<HomeworkCardProps> = ({
  homework,
  onToggleCompletion,
  onEditHomework,
  isOverdue = false,
}) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div
      className={`p-4 rounded-xl border-2 transition-all ${
        homework.completion?.[0]?.done
          ? 'bg-green-900/10 border-green-500/30'
          : isOverdue
          ? 'bg-red-900/10 border-red-500/30'
          : 'bg-gray-700/50 border-gray-600'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className={`font-semibold ${homework.completion?.[0]?.done ? 'line-through text-gray-400' : 'text-white'}`}>
              {homework.title}
            </h4>
            {homework.subject && (
              <span className="px-2 py-1 bg-primary-500/20 text-primary-300 text-xs rounded-md">
                {homework.subject}
              </span>
            )}
          </div>

          {homework.description && (
            <p className="text-sm text-gray-400 mb-2 line-clamp-2">
              {homework.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatTime(homework.due_date)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onToggleCompletion(homework.id, !homework.completion?.[0]?.done)}
            className={`p-2 rounded-lg transition-all ${
              homework.completion?.[0]?.done
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>

          <button
            onClick={() => onEditHomework(homework)}
            className="p-2 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
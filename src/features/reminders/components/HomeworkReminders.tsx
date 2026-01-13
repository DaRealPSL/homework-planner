import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { sendBrowserNotification } from '../../notifications/components/NotificationsSystem';

// Check for homework due soon
export const checkHomeworkDueSoon = async (classId: string) => {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    const { data: homework, error } = await supabase
      .from('homework')
      .select(`
        *,
        completion:homework_completion(done, user_id)
      `)
      .eq('class_id', classId)
      .lte('due_date', tomorrow.toISOString())
      .gte('due_date', now.toISOString());

    if (error) throw error;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Filter to incomplete homework
    const dueSoon = homework?.filter(hw => {
      const completion = hw.completion?.find((c: any) => c.user_id === user.id);
      return !completion?.done;
    }) || [];

    return dueSoon;
  } catch (err) {
    console.error('Error checking homework due soon:', err);
    return [];
  }
};

// Homework Reminders Component
interface HomeworkRemindersProps {
  classId: string;
}

export const HomeworkReminders: React.FC<HomeworkRemindersProps> = ({ classId }) => {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReminders();
    
    // Check every 30 minutes
    const interval = setInterval(loadReminders, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [classId]);

  const loadReminders = async () => {
    try {
      const dueSoon = await checkHomeworkDueSoon(classId);
      
      // Send browser notification if there's new homework due soon
      if (dueSoon.length > reminders.length && reminders.length > 0) {
        sendBrowserNotification('Homework Reminder', {
          body: `You have ${dueSoon.length} assignment${dueSoon.length > 1 ? 's' : ''} due soon!`,
          tag: 'homework-reminder',
        });
      }
      
      setReminders(dueSoon);
    } catch (err) {
      console.error('Error loading reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours < 1) {
      return `${diffMins} minutes`;
    } else if (diffHours < 24) {
      return `${diffHours} hours`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
  };

  const getUrgencyColor = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 6) return 'border-red-500 bg-red-900/20';
    if (diffHours < 12) return 'border-orange-500 bg-orange-900/20';
    return 'border-yellow-500 bg-yellow-900/20';
  };

  if (loading) return null;
  if (reminders.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border-l-4 border-orange-500 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-orange-400 mb-2">
            ⏰ {reminders.length} Assignment{reminders.length > 1 ? 's' : ''} Due Soon!
          </h3>
          <div className="space-y-2">
            {reminders.slice(0, 3).map((hw) => (
              <div key={hw.id} className={`p-3 border-l-2 rounded-lg ${getUrgencyColor(hw.due_date)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{hw.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Due in {getTimeRemaining(hw.due_date)}
                    </p>
                  </div>
                  {hw.subject && (
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded ml-2">
                      {hw.subject}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {reminders.length > 3 && (
              <p className="text-xs text-gray-400 text-center pt-2">
                + {reminders.length - 3} more
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Daily Digest Component
export const DailyDigest: React.FC<{ classId: string }> = ({ classId }) => {
  const [digest, setDigest] = useState<{
    dueToday: number;
    dueTomorrow: number;
    overdue: number;
    completed: number;
  } | null>(null);

  useEffect(() => {
    loadDigest();
  }, [classId]);

  const loadDigest = async () => {
    try {
      const now = new Date();
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date(tomorrow);
      dayAfter.setDate(dayAfter.getDate() + 1);

      const { data: homework, error } = await supabase
        .from('homework')
        .select(`
          *,
          completion:homework_completion(done, user_id)
        `)
        .eq('class_id', classId);

      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const stats = {
        dueToday: 0,
        dueTomorrow: 0,
        overdue: 0,
        completed: 0,
      };

      homework?.forEach(hw => {
        const dueDate = new Date(hw.due_date);
        const completion = hw.completion?.find((c: any) => c.user_id === user.id);
        const isCompleted = completion?.done;

        if (isCompleted) {
          stats.completed++;
        } else {
          if (dueDate >= today && dueDate < tomorrow) {
            stats.dueToday++;
          } else if (dueDate >= tomorrow && dueDate < dayAfter) {
            stats.dueTomorrow++;
          } else if (dueDate < today) {
            stats.overdue++;
          }
        }
      });

      setDigest(stats);
    } catch (err) {
      console.error('Error loading digest:', err);
    }
  };

  if (!digest) return null;

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Daily Summary</h3>
          <p className="text-sm text-gray-400">Your homework at a glance</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
          <p className="text-2xl font-bold text-orange-400">{digest.dueToday}</p>
          <p className="text-sm text-gray-400 mt-1">Due Today</p>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-2xl font-bold text-yellow-400">{digest.dueTomorrow}</p>
          <p className="text-sm text-gray-400 mt-1">Due Tomorrow</p>
        </div>

        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-2xl font-bold text-red-400">{digest.overdue}</p>
          <p className="text-sm text-gray-400 mt-1">Overdue</p>
        </div>

        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <p className="text-2xl font-bold text-green-400">{digest.completed}</p>
          <p className="text-sm text-gray-400 mt-1">Completed</p>
        </div>
      </div>
    </div>
  );
};
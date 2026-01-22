//src/shared/components/layout/MainApp.tsx
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { signOut, getCurrentUser } from '@/core/lib/supabase';
import { useRealtimeHomework } from '@/hooks/useRealtimeHomework';
import { CalendarView } from '@/features/calendar';
import { DaySidebar } from '@/features/calendar';
import { HomeworkForm } from '@/features/homework';
import { SearchFilterBar } from '@/features/search';
import type { FilterOptions } from '@/features/search';
import { TodayView } from '@/features/calendar';
import { CalendarSkeleton, StatCardSkeleton } from '@/shared';
import { useKeyboardShortcuts, KeyboardShortcutsHelp } from '@/shared';

interface MainAppProps {
  classId: string;
}

type ViewMode = 'calendar' | 'today';

export const MainApp: React.FC<MainAppProps> = ({ classId }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showHomeworkForm, setShowHomeworkForm] = useState(false);
  const [editingHomework, setEditingHomework] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { homework, loading, error, toggleCompletion } = useRealtimeHomework(classId);

  // fetch current user on mount (can't use top-level await in component)
  useEffect(() => {
    let mounted = true;
    getCurrentUser()
      .then((u) => {
        if (!mounted) return;
        setUser(u ?? null);
      })
      .catch((err) => {
        console.error('Failed to get current user:', err);
        if (mounted) setUser(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    subject: '',
    status: 'all',
    sortBy: 'due_date',
    sortOrder: 'asc',
  });

  // helper: normalize completion relation name
  const getCompletionArray = useCallback((hw: any) => {
    return (hw.completion ?? hw.homework_completion ?? []) as any[];
  }, []);

  // stable helper that depends only on `user`
  const isDoneForUser = useCallback(
    (hw: any) => {
      const arr = getCompletionArray(hw);
      if (!user?.id) return false;
      return arr.some((c: any) => c.user_id === user.id && !!c.done);
    },
    [user, getCompletionArray]
  );

  // Get unique subjects for filter
  const subjects = useMemo(() => {
    const subjectSet = new Set(
      homework.map((hw) => hw.subject).filter((s): s is string => !!s)
    );
    return Array.from(subjectSet).sort();
  }, [homework]);

  // Filter and sort homework (uses isDoneForUser which is stable via useCallback)
  const filteredHomework = useMemo(() => {
    let filtered = [...homework];

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (hw) =>
          hw.title?.toLowerCase().includes(query) ||
          hw.description?.toLowerCase().includes(query) ||
          hw.subject?.toLowerCase().includes(query)
      );
    }

    // Subject filter
    if (filters.subject) {
      filtered = filtered.filter((hw) => hw.subject === filters.subject);
    }

    // Status filter
    if (filters.status === 'completed') {
      filtered = filtered.filter((hw) => isDoneForUser(hw));
    } else if (filters.status === 'pending') {
      filtered = filtered.filter((hw) => !isDoneForUser(hw));
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'due_date':
          //comparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
          comparison = new Date(a.due_date || 0).getTime() - new Date(b.due_date || 0).getTime();
          break;
        case 'created_at':
          comparison = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
          break;
        case 'subject':
          comparison = (a.subject || '').localeCompare(b.subject || '');
          break;
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [homework, filters, isDoneForUser]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onEscape: () => {
      if (showHomeworkForm) setShowHomeworkForm(false);
      else if (selectedDate) setSelectedDate(null);
      else if (showShortcuts) setShowShortcuts(false);
    },
    onNew: () => {
      if (!showHomeworkForm) {
        setEditingHomework(null);
        setShowHomeworkForm(true);
      }
    },
    onSearch: () => {
      searchInputRef.current?.focus();
    },
    onToday: () => {
      setViewMode('today');
    },
  });

  // Listen for ? key to show shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && !showHomeworkForm) {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [showHomeworkForm]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const handleAddHomework = () => {
    setEditingHomework(null);
    setShowHomeworkForm(true);
  };

  const handleEditHomework = (hw: typeof homework[0]) => {
    setEditingHomework(hw);
    setShowHomeworkForm(true);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center max-w-md">
          <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-400 mb-2">Error</h2>
          <p className="text-gray-400 mb-6">{error.message}</p>
          <button onClick={handleSignOut} className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-900">
    {/* Header */}
    <header className="bg-gray-800 shadow-lg border-b border-gray-700 top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Logo container */}
              <div className="flex items-center justify-center">
                <LazyLoadImage
                  alt="Logo"
                  src="/studiflow_badge_transparent.png"
                  className="h-16 w-auto select-none"
                  draggable={false}
                />
              </div>

              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold text-white">Homework Planner</h1>
                <p className="text-sm text-gray-400">Press ? for shortcuts</p>
              </div>
            </div>

              {/* View Toggle */}
              <div className="ml-6 flex items-center gap-2 bg-gray-700/50 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'calendar'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => setViewMode('today')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'today'
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Today
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAddHomework}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="hidden sm:inline">Add</span>
              </button>

              <button
                onClick={() => navigate('/settings')}
                className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all"
                title="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              <button
                onClick={handleSignOut}
                className="p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all"
                title="Sign Out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <SearchFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          subjects={subjects}
        />

        {viewMode === 'today' ? (
          <TodayView
            homework={filteredHomework as any}
            onToggleCompletion={toggleCompletion}

          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              {loading ? (
                <CalendarSkeleton />
              ) : (
                <CalendarView
                  homework={filteredHomework as any}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              )}
            </div>

            {/* Stats */}
            <div className="space-y-6">
              {loading ? (
                <>
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                </>
              ) : (
                <>
                  <StatsCard homework={homework} currentUserId={user?.id} />
                  <RecentActivity homework={homework} />
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Day Sidebar */}
      <DaySidebar
        isOpen={!!selectedDate}
        date={selectedDate}
        homework={filteredHomework.filter((hw) => {
          if (!selectedDate) return false;
          if (!hw.due_date) return false;
          const dueDate = new Date(hw.due_date);
          return dueDate.toDateString() === selectedDate.toDateString();
        }) as any}
        onClose={() => setSelectedDate(null)}
        //onEditHomework={handleEditHomework}
        onEditHomework={handleEditHomework as any}
        onToggleCompletion={toggleCompletion}
        currentUserId={user?.id}
      />

      {/* Homework Form Modal */}
      {showHomeworkForm && (
        <HomeworkForm
          classId={classId}
          homework={editingHomework}
          onClose={() => setShowHomeworkForm(false)}
          onSuccess={() => {
            setShowHomeworkForm(false);
            setEditingHomework(null);
          }}
        />
      )}

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  );
};

// Stats Card Component
export const StatsCard: React.FC<{ homework: any[]; currentUserId?: string | null }> = ({ homework, currentUserId }) => {
  const getCompletionArray = (hw: any) => (hw.completion ?? hw.homework_completion ?? []);
  const isDoneForUser = (hw: any) => {
    if (!currentUserId) return false;
    return getCompletionArray(hw).some((c: any) => c.user_id === currentUserId && !!c.done);
  };

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      total: homework.length,
      dueToday: homework.filter((hw) => {
        const dueDate = new Date(hw.due_date);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime();
      }).length,
      overdue: homework.filter((hw) => {
        const dueDate = new Date(hw.due_date);
        return dueDate < today && !isDoneForUser(hw);
      }).length,
      completed: homework.filter((hw) => isDoneForUser(hw)).length,
    };
  }, [homework, currentUserId,]);

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">Quick Stats</h3>
      </div>
      <div className="space-y-3">
        <StatItem label="Total" value={stats.total} color="gray" />
        <StatItem label="Due Today" value={stats.dueToday} color="orange" />
        <StatItem label="Overdue" value={stats.overdue} color="red" />
        <StatItem label="Completed" value={stats.completed} color="green" />
      </div>
    </div>
  );
};

export const StatItem: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
  const colorClasses = {
    gray: 'bg-gray-700/50',
    orange: 'bg-orange-900/20 border border-orange-500/30',
    red: 'bg-red-900/20 border border-red-500/30',
    green: 'bg-green-900/20 border border-green-500/30',
  };

  const textColors = {
    gray: 'text-white',
    orange: 'text-orange-400',
    red: 'text-red-400',
    green: 'text-green-400',
  };

  return (
    <div className={`flex justify-between items-center p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
      <span className="text-gray-300">{label}</span>
      <span className={`font-bold text-lg ${textColors[color as keyof typeof textColors]}`}>{value}</span>
    </div>
  );
};

// Recent Activity Component
export const RecentActivity: React.FC<{ homework: any[] }> = ({ homework }) => {
  const recent = useMemo(() => {
    return [...homework]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [homework]);

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">Recent</h3>
      </div>
      <div className="space-y-3">
        {recent.length === 0 ? (
          <p className="text-center py-4 text-gray-400 text-sm">No recent activity</p>
        ) : (
          recent.map((hw) => (
            <div key={hw.id} className="p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
              <p className="font-medium text-sm text-white truncate">{hw.title}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-400">
                  {new Date(hw.created_at).toLocaleDateString()}
                </span>
                {hw.subject && (
                  <span className="text-xs px-2 py-0.5 bg-gray-600 text-gray-300 rounded">
                    {hw.subject}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

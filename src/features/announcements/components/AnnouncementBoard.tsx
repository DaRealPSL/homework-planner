//src/features/announcements/components/AnnouncementBoard.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../core/lib/supabase';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  pinned: boolean;
  created_at: string;
  created_by: string;
  creator?: {
    display_name: string;
  };
}

interface AnnouncementBoardProps {
  classId: string;
}

export const AnnouncementBoard: React.FC<AnnouncementBoardProps> = ({ classId }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
    subscribeToAnnouncements();
  }, [classId]);

  const loadAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          *,
          creator:profiles!announcements_created_by_fkey(display_name)
        `)
        .eq('class_id', classId)
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements((data || []) as Announcement[]);
    } catch (err) {
      console.error('Error loading announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToAnnouncements = () => {
    const channel = supabase
      .channel(`announcements-${classId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcements',
          filter: `class_id=eq.${classId}`,
        },
        () => {
          loadAnnouncements();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting announcement:', err);
    }
  };

  const togglePin = async (id: string, currentlyPinned: boolean) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ pinned: !currentlyPinned })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Error toggling pin:', err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-red-500 bg-red-900/20';
      case 'high':
        return 'border-orange-500 bg-orange-900/20';
      case 'normal':
        return 'border-blue-500 bg-blue-900/20';
      case 'low':
        return 'border-gray-500 bg-gray-700/20';
      default:
        return 'border-gray-500 bg-gray-700/20';
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 animate-pulse">
        <div className="h-8 w-48 bg-gray-700 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Class Announcements</h2>
            <p className="text-sm text-gray-400">{announcements.length} announcements</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New
        </button>
      </div>

      {/* Announcements List */}
      <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">No announcements yet</h3>
            <p className="text-gray-500 text-sm">Be the first to post an announcement!</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`p-4 border-l-4 rounded-lg transition-all ${getPriorityColor(
                announcement.priority
              )}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {announcement.pinned && (
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1h-2zM5 12a1 1 0 011-1h1a1 1 0 011 1v4a1 1 0 01-1 1H6a1 1 0 01-1-1v-4z" />
                      </svg>
                    )}
                    <h3 className="text-lg font-semibold text-white">{announcement.title}</h3>
                    <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded capitalize">
                      {announcement.priority}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap mb-3">
                    {announcement.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {announcement.creator?.display_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {formatTime(announcement.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => togglePin(announcement.id, announcement.pinned)}
                    className="p-2 text-gray-400 hover:text-yellow-400 rounded-lg hover:bg-gray-700/50 transition-colors"
                    title={announcement.pinned ? 'Unpin' : 'Pin'}
                  >
                    <svg className="w-4 h-4" fill={announcement.pinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(announcement.id)}
                    className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-700/50 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Announcement Modal */}
      {showForm && (
        <AnnouncementForm
          classId={classId}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadAnnouncements();
          }}
        />
      )}
    </div>
  );
};

// Announcement Form Component
interface AnnouncementFormProps {
  classId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ classId, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [pinned, setPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: insertError } = await supabase.from('announcements').insert(
        {
          class_id: classId,
          created_by: user.id,
          title,
          content,
          priority,
          pinned,
        } as any
    );

      if (insertError) throw insertError;
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">New Announcement</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Announcement title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={6}
              placeholder="What would you like to announce?"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Options</label>
              <label className="flex items-center gap-2 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="w-4 h-4 text-primary-500 bg-gray-600 border-gray-500 rounded focus:ring-primary-500"
                />
                <span className="text-white text-sm">Pin to top</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors font-medium"
            >
              {loading ? 'Posting...' : 'Post Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
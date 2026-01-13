import React, { useState, useEffect } from 'react';
import { supabase } from '@/core/lib/supabase';

// Audit log helper
export const logAuditEvent = async (
  action: string,
  resourceType?: string,
  resourceId?: string,
  details?: Record<string, any>
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      ip_address: null, // Would need backend to get real IP
      user_agent: navigator.userAgent,
    });
  } catch (err) {
    console.error('Failed to log audit event:', err);
  }
};

// Session info interface
interface SessionInfo {
  id: string;
  user: {
    id: string;
    email: string;
  };
  expires_at: number;
  refresh_token?: string;
}

// Session management component
export const SessionManagement: React.FC = () => {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // In a real app, you'd fetch all sessions from a sessions table
        // For now, we show the current session
        setSessions([
          {
            id: 'current',
            user: {
              id: session.user.id,
              email: session.user.email || '',
            },
            expires_at: session.expires_at || 0,
          },
        ]);
      }
    } catch (err) {
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    try {
      if (sessionId === 'current') {
        await supabase.auth.signOut();
        await logAuditEvent('session_revoked', 'session', sessionId);
      }
    } catch (err) {
      console.error('Error revoking session:', err);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 animate-pulse">
        <div className="h-6 w-32 bg-gray-700 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        Active Sessions
      </h2>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div key={session.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium flex items-center gap-2">
                    Current Session
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                      Active
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">{session.user.email}</p>
                </div>
              </div>

              <button
                onClick={() => revokeSession(session.id)}
                className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm font-medium"
              >
                Sign Out
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Expires: {formatDate(session.expires_at)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <p className="text-xs text-blue-400">
          💡 Tip: Always sign out when using a shared or public computer
        </p>
      </div>
    </div>
  );
};

// Audit log viewer component
export const AuditLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error('Error loading audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('create')) return '➕';
    if (action.includes('update')) return '✏️';
    if (action.includes('delete')) return '🗑️';
    if (action.includes('login') || action.includes('sign')) return '🔐';
    return '📝';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 animate-pulse">
        <div className="h-6 w-32 bg-gray-700 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Recent Activity
      </h2>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-center py-8 text-gray-400">No activity yet</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
              <div className="flex items-start gap-3">
                <span className="text-xl">{getActionIcon(log.action)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{log.action.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-gray-400 truncate">{formatDate(log.created_at)}</p>
                  {log.resource_type && (
                    <p className="text-xs text-gray-500 mt-1">
                      {log.resource_type}: {log.resource_id}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
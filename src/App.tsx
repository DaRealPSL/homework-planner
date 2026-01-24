import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, ClassCodeEntry, AuthGate } from '@/features/auth';
import { MainApp } from '@/shared';
import { LoadingSpinner } from '@/shared';
import { SettingsPage } from '@/features/settings';
import { TermsOfService } from '@/features/settings';
import { PrivacyPolicy } from '@/features/settings';
import { AnnouncementBoard } from '@/features/announcements';

function App() {
  const { user, loading } = useAuth();
  const [classId, setClassId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check for stored class ID on mount and whenever localStorage might change
    const storedClassId = localStorage.getItem('classId');
    setClassId(storedClassId);
    setAuthChecked(true);
  }, []);

  // Sync classId state with localStorage when user logs out
  useEffect(() => {
    if (!user) {
      const storedClassId = localStorage.getItem('classId');
      if (!storedClassId && classId) {
        // User logged out and localStorage was cleared
        setClassId(null);
      }
    }
  }, [user, classId]);

  const handleClassCodeValidated = (validatedClassId: string) => {
    setClassId(validatedClassId);
  };

  if (loading || !authChecked) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/" 
            element={
              !classId ? (
                <ClassCodeEntry onClassCodeValidated={handleClassCodeValidated} />
              ) : !user ? (
                <Navigate to="/auth" replace />
              ) : (
                <Navigate to="/app" replace />
              )
            } 
          />
          <Route 
            path="/auth" 
            element={
              !classId ? (
                <Navigate to="/" replace />
              ) : user ? (
                <Navigate to="/app" replace />
              ) : (
                <AuthGate classId={classId} />
              )
            } 
          />
          <Route 
            path="/app" 
            element={
              !classId ? (
                <Navigate to="/" replace />
              ) : !user ? (
                <Navigate to="/auth" replace />
              ) : (
                <MainApp classId={classId} />
              )
            } 
          />

          <Route 
            path='/settings'
            element={
              !classId ? (
                <Navigate to="/" replace />
              ) : !user ? (
                <Navigate to="/auth" replace />
              ) : (
                <SettingsPage />
              )
            }
          />

          <Route 
            path='/terms'
            element={
              !classId ? (
                <Navigate to="/" replace />
              ) : !user ? (
                <Navigate to="/auth" replace />
              ) : (
                <TermsOfService />
              )
            }
          />

          <Route 
            path='/privacy'
            element={
              !classId ? (
                <Navigate to="/" replace />
              ) : !user ? (
                <Navigate to="/auth" replace />
              ) : (
                <PrivacyPolicy />
              )
            }
          />

          <Route 
            path='/announcements'
            element={
              !classId ? (
                <Navigate to="/" replace />
              ) : !user ? (
                <Navigate to='/auth' replace />
              ) : (
                <AnnouncementBoard classId={classId} />
              )
            }
          />

          <Route 
            path='/legal/privacy-policy'
            element={
              <PrivacyPolicy />
            }
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
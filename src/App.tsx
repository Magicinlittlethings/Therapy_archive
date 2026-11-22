import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { GTMacMenuBar } from './components/system/GTMacMenuBar';
import { GTDesktopWorkstation } from './components/system/GTDesktopWorkstation';
import { GTMobilePhoneOS } from './components/system/GTMobilePhoneOS';
import { TourGuide } from './components/onboarding/TourGuide';
import { LandingPage } from './pages/LandingPage';
import { ArchivePage } from './pages/ArchivePage';
import { SessionRecordPage } from './pages/SessionRecordPage';
import { MySessionsPage } from './pages/MySessionsPage';
import { TherapyNotesPage } from './pages/TherapyNotesPage';
import { FollowedPage } from './pages/FollowedPage';
import { AdminPage } from './pages/AdminPage';
import { NotesFeedPage } from './pages/NotesFeedPage';
import { NotesBrowserWindow } from './components/social/NotesBrowserWindow';
import { GTSystemNotificationsDrawer } from './components/system/GTSystemNotificationsDrawer';
import './styles/global.css';

// Context Scanner Overlay Component for Role Switching
function RoleTransitionScanner() {
  const { isReloadingRole, reloadingRoleName } = useStore();

  if (!isReloadingRole) return null;

  return (
    <div className="role-scan-overlay">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-md)',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-xs)',
            border: '2px solid var(--gt-acid)',
            boxShadow: '0 0 35px rgba(4, 229, 57, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#030303'
          }}
        >
          <span className="eq-bars" style={{ height: '24px' }}>
            <span className="eq-bar" style={{ width: '4px' }}></span>
            <span className="eq-bar" style={{ width: '4px' }}></span>
            <span className="eq-bar" style={{ width: '4px' }}></span>
            <span className="eq-bar" style={{ width: '4px' }}></span>
            <span className="eq-bar" style={{ width: '4px' }}></span>
          </span>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--gt-acid)', letterSpacing: '0.08em', marginBottom: '6px' }}>
            GROUP THERAPY ARCHIVE
          </div>
          <h2 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', color: 'var(--gt-cream)' }}>
            Switching Profile View
          </h2>
          <div style={{ color: 'var(--gt-muted)', fontFamily: 'var(--font-metadata)', fontSize: '0.82rem', marginTop: '4px' }}>
            {reloadingRoleName || 'Loading...'}
          </div>
        </div>
      </div>
    </div>
  );
}

function MainLayout() {
  const { deviceMode } = useStore();

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Role Transition Scanner Overlay */}
      <RoleTransitionScanner />

      {/* Interactive Onboarding Tour Guide */}
      <TourGuide />

      {/* In-System Web Browser Window for notes.html */}
      <NotesBrowserWindow />

      {/* System Notifications Drawer */}
      <GTSystemNotificationsDrawer />

      {/* Authentic Top Menu Bar (Auto-responsive) */}
      <GTMacMenuBar />

      {/* Authentic OS Workstation (Landing Wallpaper, Neat Music Player, Fullscreen Windows, Centered Dock) */}
      <GTDesktopWorkstation>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sessions" element={<ArchivePage />} />
          <Route path="/sessions/:id" element={<SessionRecordPage />} />
          <Route path="/my-sessions" element={<MySessionsPage />} />
          <Route path="/my-sessions/:sessionId/notes" element={<TherapyNotesPage />} />
          <Route path="/followed" element={<FollowedPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/notes.html" element={<NotesFeedPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </GTDesktopWorkstation>
    </div>
  );
}

export function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;

import React from 'react';
import { useStore } from '../../context/StoreContext';
import { GTFileExplorer } from '../files/GTFileExplorer';
import { TherapyNotesPage } from '../../pages/TherapyNotesPage';
import { AdminPage } from '../../pages/AdminPage';
import {
  Folder,
  Globe,
  FileText,
  Bell,
  Disc3,
  Shield,
  Settings,
  ChevronLeft,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Wifi,
  Battery,
  RotateCcw,
  UserCheck,
  Check
} from 'lucide-react';
import { DemoPersona } from '../../types';

export const GTMobilePhoneOS: React.FC = () => {
  const {
    mobileApp,
    setMobileApp,
    openBrowser,
    persona,
    setPersona,
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
    resetDemoData,
    isSoundboardPlaying,
    toggleSoundboardPlay,
    notes,
    saveNote
  } = useStore();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const roleLabels: Record<DemoPersona, string> = {
    patient: 'Patient',
    visitor: 'Public Visitor',
    dj: 'Resident DJ (Aniko)',
    admin: 'GT Curator (Staff)'
  };

  const renderCurrentApp = () => {
    switch (mobileApp) {
      case 'files':
        return (
          <div style={{ padding: '8px', height: '100%', overflowY: 'auto' }}>
            <GTFileExplorer initialPath="/sessions" />
          </div>
        );

      case 'alerts':
        return (
          <div style={{ padding: '16px', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--gt-acid)' }}>
                {unreadCount} UNREAD UPDATES
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--gt-acid)',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-metadata)',
                    cursor: 'pointer'
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  style={{
                    backgroundColor: n.isRead ? 'rgba(26, 26, 26, 0.5)' : 'rgba(32, 32, 32, 0.95)',
                    border: n.isRead ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--border-accent)',
                    borderRadius: '10px',
                    padding: '12px',
                    position: 'relative'
                  }}
                >
                  {!n.isRead && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--gt-acid)'
                      }}
                    />
                  )}
                  <div style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.65rem', color: 'var(--gt-acid)', marginBottom: '2px' }}>
                    {n.sessionId.toUpperCase()} UPDATE
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--gt-cream)', marginBottom: '4px' }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gt-muted)', lineHeight: 1.4 }}>
                    {n.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div style={{ padding: '16px', height: '100%', overflowY: 'auto' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--gt-acid)', marginBottom: '8px' }}>
                SWITCH USER ACCOUNT
              </div>
              <div style={{ backgroundColor: 'rgba(26, 26, 26, 0.8)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                {(['patient', 'visitor', 'dj', 'admin'] as DemoPersona[]).map((r, i) => (
                  <button
                    key={r}
                    onClick={() => setPersona(r)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: i < 4 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                      color: persona === r ? 'var(--gt-acid)' : 'var(--gt-cream)',
                      fontSize: '0.85rem',
                      fontWeight: persona === r ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{roleLabels[r]}</span>
                    {persona === r && <Check size={16} color="var(--gt-acid)" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--gt-acid)', marginBottom: '8px' }}>
                SYSTEM UTILITIES
              </div>
              <button
                onClick={() => {
                  if (confirm('Reset prototype storage to initial pristine state?')) {
                    resetDemoData();
                  }
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 14px',
                  backgroundColor: 'rgba(228, 35, 53, 0.12)',
                  border: '1px solid rgba(228, 35, 53, 0.3)',
                  borderRadius: '10px',
                  color: 'var(--gt-red)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={15} />
                <span>Reset Prototype Data</span>
              </button>
            </div>
          </div>
        );

      case 'notes':
        return (
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <TherapyNotesPage />
          </div>
        );

      case 'deck':
        return (
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <AdminPage />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mobile-phone-screen">
      {/* Phone Status Bar */}
      <div className="phone-status-bar">
        <span className="phone-time">9:41</span>
        <div className="phone-dynamic-island">
          <span className="island-pill-dot" />
          <span className="island-pill-text">GT-OS</span>
        </div>
        <div className="phone-status-icons">
          <span style={{ fontSize: '0.62rem', fontWeight: 600 }}>5G</span>
          <Wifi size={13} />
          <Battery size={14} />
        </div>
      </div>

      {/* Main Screen Body: Home Screen vs. Open App */}
      <div className="phone-screen-body">
        {mobileApp === 'home' ? (
          /* Springboard / Home Screen */
          <div className="phone-home-screen">
            {/* Clock & Date Header Widget */}
            <div className="phone-widget-clock">
              <div className="phone-clock-time">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="phone-clock-date">
                {new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </div>

            {/* Soundboard Audio Card Widget */}
            <div className="phone-soundboard-widget" onClick={toggleSoundboardPlay}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className={`soundboard-play-icon ${isSoundboardPlaying ? 'playing' : ''}`}>
                  {isSoundboardPlaying ? <Pause size={16} /> : <Play size={16} />}
                </div>
                <div>
                  <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-acid)' }}>
                    {isSoundboardPlaying ? 'NOW PLAYING // 48kHz' : 'SOUNDBOARD STANDBY'}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gt-cream)' }}>
                    Aniko Live Excerpt // GT-XII
                  </div>
                </div>
              </div>
              <Volume2 size={16} color={isSoundboardPlaying ? 'var(--gt-acid)' : 'var(--gt-muted)'} />
            </div>

            {/* App Grid */}
            <div className="phone-app-grid">
              {/* App 1: Files */}
              <div className="phone-app-item" onClick={() => setMobileApp('files')}>
                <div className="phone-app-icon icon-files">
                  <Folder size={30} color="#f8f8f4" />
                </div>
                <span className="phone-app-label">Files</span>
              </div>

              {/* App 2: notes.html */}
              <div
                className="phone-app-item"
                onClick={() => {
                  openBrowser('gt://notes.html');
                }}
              >
                <div className="phone-app-icon icon-browser" style={{ position: 'relative' }}>
                  <span className="phone-app-badge">FEED</span>
                  <Globe size={30} color="#04e539" />
                </div>
                <span className="phone-app-label">notes.html</span>
              </div>

              {/* App 3: Therapy Notes */}
              <div
                className="phone-app-item"
                onClick={() => setMobileApp('notes')}
              >
                <div className="phone-app-icon icon-notes">
                  <FileText size={30} color="#ffd60a" />
                </div>
                <span className="phone-app-label">Notes</span>
              </div>

              {/* App 4: Alerts */}
              <div className="phone-app-item" onClick={() => setMobileApp('alerts')}>
                <div className="phone-app-icon icon-alerts" style={{ position: 'relative' }}>
                  {unreadCount > 0 && <span className="phone-notif-count">{unreadCount}</span>}
                  <Bell size={30} color="#ff3b30" />
                </div>
                <span className="phone-app-label">Alerts</span>
              </div>

              {/* App 5: DJ Deck / Desk */}
              <div
                className="phone-app-item"
                onClick={() => setMobileApp('deck')}
              >
                <div className="phone-app-icon icon-deck">
                  {persona === 'dj' ? <Disc3 size={30} color="#ff9500" /> : <Shield size={30} color="#04e539" />}
                </div>
                <span className="phone-app-label">{persona === 'dj' ? 'DJ Deck' : 'Curator'}</span>
              </div>

              {/* App 6: Settings */}
              <div className="phone-app-item" onClick={() => setMobileApp('settings')}>
                <div className="phone-app-icon icon-settings">
                  <Settings size={30} color="#8e8e93" />
                </div>
                <span className="phone-app-label">Settings</span>
              </div>
            </div>

            {/* Bottom Phone Dock */}
            <div className="phone-dock">
              <div className="phone-dock-item" onClick={() => setMobileApp('files')}>
                <div className="phone-dock-icon icon-files">
                  <Folder size={26} color="#f8f8f4" />
                </div>
              </div>
              <div className="phone-dock-item" onClick={() => openBrowser('gt://notes.html')}>
                <div className="phone-dock-icon icon-browser">
                  <Globe size={26} color="#04e539" />
                </div>
              </div>
              <div className="phone-dock-item" onClick={() => setMobileApp('notes')}>
                <div className="phone-dock-icon icon-notes">
                  <FileText size={26} color="#ffd60a" />
                </div>
              </div>
              <div className="phone-dock-item" onClick={() => setMobileApp('alerts')}>
                <div className="phone-dock-icon icon-alerts" style={{ position: 'relative' }}>
                  {unreadCount > 0 && <span className="phone-notif-count-small">{unreadCount}</span>}
                  <Bell size={26} color="#ff3b30" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Inside an open Mobile App */
          <div className="phone-app-container">
            {/* Native App Top Navigation Bar */}
            <div className="phone-app-navbar">
              <button className="phone-back-btn" onClick={() => setMobileApp('home')}>
                <ChevronLeft size={20} />
                <span>Home</span>
              </button>
              <div className="phone-app-title">
                {mobileApp === 'files'
                  ? 'Files'
                  : mobileApp === 'notes'
                  ? 'Therapy Notes'
                  : mobileApp === 'alerts'
                  ? 'Alerts'
                  : mobileApp === 'deck'
                  ? persona === 'dj'
                    ? 'Aniko DJ Deck'
                    : 'Curator Desk'
                  : 'Settings'}
              </div>
              <div style={{ width: '48px' }} />
            </div>

            {/* App View */}
            <div className="phone-app-content">
              {renderCurrentApp()}
            </div>
          </div>
        )}
      </div>

      {/* Home Swipe Indicator Bar */}
      <div className="phone-home-indicator-container" onClick={() => setMobileApp('home')}>
        <div className="phone-home-indicator" />
      </div>

      <style>{`
        .mobile-phone-screen {
          width: 100%;
          height: 100%;
          max-height: 100%;
          background: radial-gradient(circle at 50% 20%, rgba(4, 229, 57, 0.1) 0%, transparent 60%), #000000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          color: var(--gt-cream);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .phone-status-bar {
          height: 44px;
          padding: 8px 18px 0;
          display: flex;
          align-items: center;
          justifyContent: space-between;
          font-size: 0.85rem;
          font-weight: 600;
          z-index: 50;
        }

        .phone-dynamic-island {
          background-color: #000000;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          padding: 3px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .island-pill-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--gt-acid);
          box-shadow: 0 0 6px var(--gt-acid);
        }

        .island-pill-text {
          font-size: 0.65rem;
          font-family: var(--font-metadata);
          color: var(--gt-cream);
          letter-spacing: 0.04em;
        }

        .phone-status-icons {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .phone-screen-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        .phone-home-screen {
          flex: 1;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
        }

        .phone-widget-clock {
          text-align: center;
          margin-top: 10px;
        }

        .phone-clock-time {
          font-size: 3.2rem;
          font-weight: 200;
          letter-spacing: -0.03em;
          line-height: 1;
          color: #ffffff;
        }

        .phone-clock-date {
          font-size: 0.95rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 4px;
        }

        .phone-soundboard-widget {
          background-color: rgba(20, 20, 20, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justifyContent: space-between;
          cursor: pointer;
          margin: 16px 0;
          transition: transform 0.15s ease;
        }

        .phone-soundboard-widget:active {
          transform: scale(0.98);
        }

        .soundboard-play-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justifyContent: center;
          color: var(--gt-cream);
        }

        .soundboard-play-icon.playing {
          background-color: var(--gt-acid);
          color: #030303;
        }

        .phone-app-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px 12px;
          padding: 10px 4px;
        }

        .phone-app-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .phone-app-icon {
          width: 60px;
          height: 60px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justifyContent: center;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
          transition: transform 0.15s ease;
        }

        .phone-app-item:active .phone-app-icon {
          transform: scale(0.9);
        }

        .icon-files { background: linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%); border: 1px solid rgba(255, 255, 255, 0.15); }
        .icon-browser { background: linear-gradient(135deg, #051a08 0%, #0d3814 100%); border: 1px solid var(--border-accent); }
        .icon-notes { background: linear-gradient(135deg, #2b2505 0%, #4a3e08 100%); border: 1px solid rgba(255, 214, 10, 0.3); }
        .icon-alerts { background: linear-gradient(135deg, #280a0a 0%, #481212 100%); border: 1px solid rgba(255, 59, 48, 0.3); }
        .icon-deck { background: linear-gradient(135deg, #261605 0%, #4a2b08 100%); border: 1px solid rgba(255, 149, 0, 0.3); }
        .icon-settings { background: linear-gradient(135deg, #1c1c1e 0%, #3a3a3c 100%); border: 1px solid rgba(255, 255, 255, 0.15); }

        .phone-app-label {
          font-size: 0.72rem;
          color: #ffffff;
          font-weight: 500;
          text-align: center;
        }

        .phone-app-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background-color: var(--gt-acid);
          color: #030303;
          font-size: 0.55rem;
          font-weight: 800;
          padding: 1px 4px;
          border-radius: 4px;
        }

        .phone-notif-count {
          position: absolute;
          top: -4px;
          right: -4px;
          background-color: #ff3b30;
          color: #ffffff;
          font-size: 0.62rem;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justifyContent: center;
        }

        .phone-dock {
          background-color: rgba(30, 30, 30, 0.75);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 28px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          margin-bottom: 6px;
        }

        .phone-dock-icon {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justifyContent: center;
          cursor: pointer;
        }

        .phone-notif-count-small {
          position: absolute;
          top: -3px;
          right: -3px;
          background-color: #ff3b30;
          color: #ffffff;
          font-size: 0.58rem;
          font-weight: 700;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justifyContent: center;
        }

        .phone-home-indicator-container {
          height: 24px;
          display: flex;
          align-items: center;
          justifyContent: center;
          cursor: pointer;
        }

        .phone-home-indicator {
          width: 128px;
          height: 4px;
          background-color: rgba(255, 255, 255, 0.55);
          border-radius: 2px;
        }

        .phone-app-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .phone-app-navbar {
          height: 48px;
          padding: 0 14px;
          background-color: rgba(18, 18, 18, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justifyContent: space-between;
          position: relative;
        }

        .phone-back-btn {
          background: transparent;
          border: none;
          color: var(--gt-acid);
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          padding: 6px 4px;
          z-index: 2;
        }

        .phone-app-title {
          position: absolute;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--gt-cream);
          pointer-events: none;
        }

        .phone-app-content {
          flex: 1;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

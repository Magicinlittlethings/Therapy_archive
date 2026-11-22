import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import {
  Folder,
  Globe,
  FileText,
  Bell,
  Disc3,
  Shield,
  Volume2,
  VolumeX,
  Home
} from 'lucide-react';

interface GTDesktopWorkstationProps {
  children?: React.ReactNode;
}

export const GTDesktopWorkstation: React.FC<GTDesktopWorkstationProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    openBrowser,
    isBrowserOpen,
    toggleNotifCenter,
    isNotifCenterOpen,
    notifications,
    persona,
    isSoundboardPlaying,
    toggleSoundboardPlay
  } = useStore();

  const isAppOpen = location.pathname !== '/';
  const [isDockHovered, setIsDockHovered] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`gt-desktop-workspace ${isAppOpen ? 'app-active' : 'wallpaper-active'}`}>
      
      {/* 
        MAIN SCREEN WALLPAPER:
        When on '/', children is LandingPage.tsx which serves as the rich landing page wallpaper!
        No loose desktop icons on the screen, just the landing page with its neat music player.
      */}
      {!isAppOpen ? (
        <div className="desktop-wallpaper-screen">
          {children}
        </div>
      ) : (
        /* 
          FULL SCREEN MACOS APPLICATION WINDOW:
          When an app/nav option is opened, it opens full screen taking up the entire display!
          Clicking the red traffic light or 'Close to Desktop' cancels/closes the window
          and returns immediately to the main screen.
        */
        <div className="fullscreen-os-window">
          {/* Window Interior Content */}
          <div className="fullscreen-window-body">
            {children}
          </div>
        </div>
      )}

      {/* 
        BOTTOM EDGE HOVER / TOUCH DETECTOR (Active when app is in full screen):
        Moving the cursor or tapping near the bottom reveals the macOS floating dock!
      */}
      {isAppOpen && (
        <div
          className="bottom-dock-hover-zone"
          onMouseEnter={() => setIsDockHovered(true)}
          onTouchStart={() => setIsDockHovered(true)}
        />
      )}

      {/* 
        MACOS BOTTOM DOCK:
        - Floating at bottom center.
        - Centered and spaced icons based on active user role.
        - When in full screen app, auto-hides until cursor moves to bottom edge.
      */}
      <div
        className={`os-dock-container ${isAppOpen ? 'fullscreen-mode' : 'desktop-mode'} ${isDockHovered || !isAppOpen ? 'revealed' : 'hidden'}`}
        onMouseEnter={() => setIsDockHovered(true)}
        onMouseLeave={() => setIsDockHovered(false)}
        onTouchStart={() => setIsDockHovered(true)}
      >
        <div className="os-dock">
          {/* Home / Main Screen (Wallpaper) */}
          <div
            className="os-dock-app"
            onClick={() => navigate('/')}
            title="Main Screen (Landing Wallpaper)"
          >
            <div className="os-dock-icon">
              <Home size={22} color="var(--gt-cream)" />
            </div>
            <span className={`dock-dot ${location.pathname === '/' ? 'active' : ''}`} />
          </div>

          {/* Finder (Sessions Archive) */}
          <div
            className="os-dock-app"
            onClick={() => navigate('/sessions')}
            title="Finder // 01_Sessions Archive"
          >
            <div className="os-dock-icon">
              <Folder size={22} color="#f8f8f4" />
            </div>
            <span className={`dock-dot ${location.pathname.startsWith('/sessions') ? 'active' : ''}`} />
          </div>

          {/* notes.html (In-system Web Browser) */}
          <div
            className="os-dock-app"
            onClick={() => openBrowser('gt://notes.html')}
            title="notes.html // Social Feed"
          >
            <div className="os-dock-icon" style={{ position: 'relative' }}>
              <span className="dock-feed-badge">FEED</span>
              <Globe size={22} color="var(--gt-acid)" />
            </div>
            <span className={`dock-dot ${isBrowserOpen ? 'active' : ''}`} />
          </div>

          {/* Role-Specific: My Dossier (Attendee / Patient / DJ / Admin) */}
          {persona !== 'visitor' && (
            <div
              className="os-dock-app"
              onClick={() => navigate('/my-sessions')}
              title="02_My_Files // Personal Dossier"
            >
              <div className="os-dock-icon">
                <Folder size={22} color="var(--gt-acid)" />
              </div>
              <span className={`dock-dot ${location.pathname.startsWith('/my-sessions') && !location.pathname.includes('/notes') ? 'active' : ''}`} />
            </div>
          )}

          {/* Role-Specific: Therapy Notes (Attendee / Patient / DJ / Admin) */}
          {persona !== 'visitor' && (
            <div
              className="os-dock-app"
              onClick={() => navigate('/my-sessions/gt-xii/notes')}
              title="Therapy Notes // Patient Reflection"
            >
              <div className="os-dock-icon">
                <FileText size={22} color="#ffd60a" />
              </div>
              <span className={`dock-dot ${location.pathname.includes('/notes') ? 'active' : ''}`} />
            </div>
          )}

          {/* Role-Specific: DJ Deck (Aniko) */}
          {persona === 'dj' && (
            <div
              className="os-dock-app"
              onClick={() => navigate('/admin')}
              title="Aniko DJ Deck // Crate Station & Track Requests"
            >
              <div className="os-dock-icon">
                <Disc3 size={22} color="#ff9500" />
              </div>
              <span className={`dock-dot ${location.pathname.startsWith('/admin') ? 'active' : ''}`} />
            </div>
          )}

          {/* Role-Specific: Curator Terminal (Staff) */}
          {persona === 'admin' && (
            <div
              className="os-dock-app"
              onClick={() => navigate('/admin')}
              title="Curator Terminal // Door Check-in & Moderation"
            >
              <div className="os-dock-icon">
                <Shield size={22} color="var(--gt-acid)" />
              </div>
              <span className={`dock-dot ${location.pathname.startsWith('/admin') ? 'active' : ''}`} />
            </div>
          )}

          {/* Live Soundboard Stream Toggle */}
          <div
            className="os-dock-app"
            onClick={toggleSoundboardPlay}
            title={isSoundboardPlaying ? 'Mute Soundboard Stream' : 'Enable Soundboard Stream (48kHz)'}
          >
            <div className="os-dock-icon">
              {isSoundboardPlaying ? <Volume2 size={22} color="var(--gt-acid)" /> : <VolumeX size={22} color="var(--gt-muted)" />}
            </div>
            <span className={`dock-dot ${isSoundboardPlaying ? 'active' : ''}`} />
          </div>

          {/* System Notifications */}
          <div
            className="os-dock-app"
            onClick={toggleNotifCenter}
            title={`System Alerts (${unreadCount} unread)`}
          >
            <div className="os-dock-icon" style={{ position: 'relative' }}>
              {unreadCount > 0 && <span className="dock-alert-badge">{unreadCount}</span>}
              <Bell size={22} color={unreadCount > 0 ? 'var(--gt-acid)' : 'var(--gt-cream)'} />
            </div>
            <span className={`dock-dot ${isNotifCenterOpen ? 'active' : ''}`} />
          </div>
        </div>
      </div>

      {/* PERSISTENT MOBILE BOTTOM NAVIGATION (Visible only on mobile/touch screens <= 820px) */}
      <div className="gt-mobile-bottom-nav">
        <button
          onClick={() => navigate('/')}
          className={`mobile-nav-item ${location.pathname === '/' && !isBrowserOpen ? 'active' : ''}`}
        >
          <Home size={18} />
          <span>Home</span>
        </button>

        <button
          onClick={() => navigate('/sessions')}
          className={`mobile-nav-item ${location.pathname.startsWith('/sessions') ? 'active' : ''}`}
        >
          <Folder size={18} />
          <span>Archive</span>
        </button>

        <button
          onClick={() => navigate('/my-sessions')}
          className={`mobile-nav-item ${location.pathname.startsWith('/my-sessions') ? 'active' : ''}`}
        >
          <FileText size={18} />
          <span>Notes</span>
        </button>

        <button
          onClick={() => openBrowser('gt://notes.html')}
          className={`mobile-nav-item ${isBrowserOpen ? 'active' : ''}`}
        >
          <Globe size={18} />
          <span>Feed</span>
        </button>

        {(persona === 'admin' || persona === 'dj') && (
          <button
            onClick={() => navigate('/admin')}
            className={`mobile-nav-item ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
          >
            {persona === 'dj' ? <Disc3 size={18} /> : <Shield size={18} />}
            <span>{persona === 'dj' ? 'DJ' : 'Staff'}</span>
          </button>
        )}
      </div>

      <style>{`
        .gt-desktop-workspace {
          width: 100vw;
          height: calc(100vh - 28px);
          max-height: calc(100vh - 28px);
          position: relative;
          overflow: hidden;
          background-color: #030403;
          display: flex;
          flex-direction: column;
        }

        /* Main Screen Wallpaper Canvas */
        .desktop-wallpaper-screen {
          width: 100%;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
        }

        /* Full Screen OS Window */
        .fullscreen-os-window {
          width: 100%;
          height: 100%;
          background-color: #080a08;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: windowExpand 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes windowExpand {
          from {
            opacity: 0.7;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .fullscreen-window-body {
          flex: 1;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          background-color: #060706;
          display: flex;
          flex-direction: column;
        }

        /* Hover Zones for Full Screen Auto-Hide */
        .bottom-dock-hover-zone {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 24px;
          z-index: 8999;
          pointer-events: auto;
        }

        /* Dock Container */
        .os-dock-container {
          position: fixed;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9000;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
        }

        .os-dock-container.hidden {
          transform: translateX(-50%) translateY(140%);
          opacity: 0;
          pointer-events: none;
        }

        .os-dock-container.revealed {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        /* Centered, Well-Spaced macOS Dock */
        .os-dock {
          background-color: rgba(14, 18, 14, 0.88);
          backdrop-filter: blur(28px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 20px;
          padding: 8px 18px;
          display: flex;
          align-items: center;
          justifyContent: center;
          gap: 16px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(4, 229, 57, 0.1);
        }

        .os-dock-app {
          display: flex;
          flex-direction: column;
          align-items: center;
          justifyContent: center;
          cursor: pointer;
          padding: 4px;
          position: relative;
          transition: transform 0.16s ease;
        }
        .os-dock-app:hover {
          transform: translateY(-4px) scale(1.12);
        }

        .os-dock-icon {
          width: 44px;
          height: 44px;
          border-radius: 11px;
          background: linear-gradient(135deg, rgba(30, 36, 30, 0.8) 0%, rgba(16, 20, 16, 0.95) 100%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .dock-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: transparent;
          margin-top: 4px;
          transition: background-color 0.2s ease;
        }
        .dock-dot.active {
          background-color: var(--gt-acid);
          box-shadow: 0 0 6px var(--gt-acid);
        }

        .dock-feed-badge {
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

        .dock-alert-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          background-color: var(--gt-red);
          color: #ffffff;
          font-size: 0.55rem;
          font-weight: 800;
          min-width: 14px;
          height: 14px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gt-mobile-bottom-nav {
          display: none;
        }

        @media (max-width: 820px) {
          .os-dock-container,
          .bottom-dock-hover-zone {
            display: none !important;
          }

          .gt-mobile-bottom-nav {
            display: flex;
            align-items: center;
            justify-content: space-around;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 52px;
            background-color: rgba(6, 8, 6, 0.96);
            backdrop-filter: blur(16px);
            border-top: 1px solid rgba(255, 255, 255, 0.12);
            z-index: 9500;
            padding: 0 4px;
          }

          .mobile-nav-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justifyContent: center;
            background: none;
            border: none;
            color: var(--gt-muted);
            padding: 4px;
            gap: 2px;
            cursor: pointer;
            font-family: var(--font-metadata);
            font-size: 0.65rem;
            font-weight: 600;
            transition: color 0.15s ease;
          }

          .mobile-nav-item.active {
            color: var(--gt-acid);
          }
        }
      `}</style>
    </div>
  );
};

export default GTDesktopWorkstation;

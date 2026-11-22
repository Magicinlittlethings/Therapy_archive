import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import {
  Wifi,
  Battery,
  Search,
  Bell,
  Sliders,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Monitor,
  Smartphone,
  Check,
  Disc3,
  Shield,
  RotateCcw,
  Sparkles,
  ChevronDown,
  X,
  Minus,
  Maximize2
} from 'lucide-react';
import { DemoPersona } from '../../types';

export const GTMacMenuBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    persona,
    setPersona,
    notifications,
    resetDemoData,
    openBrowser,
    closeBrowser,
    isBrowserOpen,
    toggleNotifCenter,
    isNotifCenterOpen,
    deviceMode,
    setDeviceMode,
    isSoundboardPlaying,
    toggleSoundboardPlay,
    setMobileApp
  } = useStore();

  const [currentTime, setCurrentTime] = useState<string>(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  const [currentDateStr, setCurrentDateStr] = useState<string>(() => {
    const now = new Date();
    return now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  });

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDateStr(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.mac-menu-item')) {
        setActiveMenu(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  // Determine current active application name
  const activeAppName = isBrowserOpen
    ? 'notes.html'
    : location.pathname.startsWith('/sessions') || location.pathname === '/'
    ? 'Finder'
    : location.pathname.startsWith('/my-sessions') && !location.pathname.includes('/notes')
    ? 'My Dossier'
    : location.pathname.includes('/notes')
    ? 'Therapy Notes'
    : location.pathname.startsWith('/admin')
    ? persona === 'dj' ? 'Aniko DJ Deck' : 'Curator Terminal'
    : 'Finder';

  const roleLabels: Record<DemoPersona, string> = {
    patient: 'Verified Patient (Demo)',
    follower: 'Community Follower (Unverified)',
    visitor: 'Public Visitor',
    dj: 'Resident DJ (Aniko - Simulated)',
    admin: 'GT Curator (Staff Terminal)'
  };

  const isAppOpen = location.pathname !== '/' || isBrowserOpen;
  const [isTopNavHovered, setIsTopNavHovered] = useState(false);
  const [isTrafficHovered, setIsTrafficHovered] = useState(false);

  const handleCloseCurrentWindow = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveMenu(null);
    if (isBrowserOpen) {
      closeBrowser();
    }
    navigate('/');
  };

  const handleToggleFullscreen = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveMenu(null);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  return (
    <>
      <div
        className={`gt-mac-menu-bar ${isAppOpen ? 'fullscreen-top-bar' : 'desktop-top-bar'}`}
        onMouseEnter={() => setIsTopNavHovered(true)}
        onMouseLeave={() => setIsTopNavHovered(false)}
        style={{
          height: '28px',
          width: '100%',
          flexShrink: 0,
          backgroundColor: '#000000',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
          zIndex: 9999,
          userSelect: 'none',
          boxSizing: 'border-box'
        }}
      >
        <div
          className="gt-mac-menu-inner"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            fontSize: '0.78rem',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: 'var(--gt-cream)',
            opacity: 1,
            pointerEvents: 'auto'
          }}
        >
          {/* Left Menu Items (Traffic Lights, Apple/GT System Menu, App Name, Menus) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* macOS Traffic Lights (Visible when app is open) */}
            {isAppOpen && (
              <div
                className="mac-traffic-lights-group"
                onMouseEnter={() => setIsTrafficHovered(true)}
                onMouseLeave={() => setIsTrafficHovered(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  marginRight: '8px',
                  cursor: 'pointer'
                }}
              >
                {/* Red: Close Window & Return to Desktop */}
                <button
                  onClick={handleCloseCurrentWindow}
                  className="traffic-dot dot-close"
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#ff5f56',
                    border: '1px solid #e0443e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    outline: 'none'
                  }}
                  title="Close Window (Return to Desktop)"
                >
                  {isTrafficHovered && <X size={7} strokeWidth={3} color="#4c0002" />}
                </button>

                {/* Yellow: Minimize Window */}
                <button
                  onClick={handleCloseCurrentWindow}
                  className="traffic-dot dot-minimize"
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#ffbd2e',
                    border: '1px solid #dea123',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    outline: 'none'
                  }}
                  title="Minimize Window"
                >
                  {isTrafficHovered && <Minus size={7} strokeWidth={3} color="#543c00" />}
                </button>

                {/* Green: Fullscreen / Maximize */}
                <button
                  onClick={handleToggleFullscreen}
                  className="traffic-dot dot-maximize"
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#27c93f',
                    border: '1px solid #1aab29',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    outline: 'none'
                  }}
                  title="Toggle Fullscreen"
                >
                  {isTrafficHovered && <Maximize2 size={6.5} strokeWidth={2.5} color="#003300" />}
                </button>
              </div>
            )}

            {/* System ✦ Logo Menu */}
            <div className="mac-menu-item" style={{ position: 'relative' }}>
              <button
                onClick={() => setActiveMenu(activeMenu === 'system' ? null : 'system')}
                style={{
                  background: activeMenu === 'system' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              border: 'none',
              color: 'var(--gt-acid)',
              padding: '2px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            ✦
          </button>

          {activeMenu === 'system' && (
            <div className="mac-dropdown-menu">
              <div className="mac-dropdown-item bold" onClick={() => { setActiveMenu(null); alert('GROUP THERAPY // ARCHIVE 1.0\nElectronic music archival kernel\nAttendance-linked session case files and progressive releases.'); }}>
                About GT-OS Workstation
              </div>
              <a
                href="https://grouptherapy.live"
                target="_blank"
                rel="noopener noreferrer"
                className="mac-dropdown-item"
                style={{ textDecoration: 'none', color: 'var(--gt-acid)' }}
                onClick={() => setActiveMenu(null)}
              >
                ✦ Exit to grouptherapy.live (Main Website)
              </a>
              <div className="mac-dropdown-divider" />
              <div className="mac-dropdown-item" onClick={() => { setActiveMenu(null); openBrowser('gt://notes.html'); }}>
                Launch notes.html (Browser)
              </div>
              <div className="mac-dropdown-item" onClick={() => { setActiveMenu(null); navigate('/sessions'); }}>
                Open Finder (File Explorer)
              </div>
              <div className="mac-dropdown-item" onClick={() => { setActiveMenu(null); navigate('/my-sessions/gt-xii/notes'); }}>
                New Therapy Note
              </div>
              {isAppOpen && (
                <div className="mac-dropdown-item" onClick={handleCloseCurrentWindow}>
                  Close Window (Desktop)
                </div>
              )}
              <div className="mac-dropdown-divider" />
              <div
                className="mac-dropdown-item"
                onClick={() => {
                  setActiveMenu(null);
                  if (confirm('Reset prototype storage to initial pristine state?')) {
                    resetDemoData();
                  }
                }}
              >
                Restart System Prototype...
              </div>
            </div>
          )}
        </div>

        {/* Current Active App Name in BOLD */}
        <div className="mac-menu-item" style={{ position: 'relative' }}>
          <button
            onClick={() => setActiveMenu(activeMenu === 'app' ? null : 'app')}
            style={{
              background: activeMenu === 'app' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              border: 'none',
              color: 'var(--gt-cream)',
              padding: '2px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.78rem'
            }}
          >
            {activeAppName}
          </button>

          {activeMenu === 'app' && (
            <div className="mac-dropdown-menu">
              <div className="mac-dropdown-item bold" onClick={() => { setActiveMenu(null); alert(`${activeAppName} // Group Therapy 1.0`); }}>
                About {activeAppName}
              </div>
              <div className="mac-dropdown-divider" />
              <div className="mac-dropdown-item" onClick={() => { setActiveMenu(null); toggleNotifCenter(); }}>
                Check Notifications ({unreadNotifCount})
              </div>
              <div className="mac-dropdown-item" onClick={handleCloseCurrentWindow}>
                Hide {activeAppName}
              </div>
              <div className="mac-dropdown-item" onClick={handleCloseCurrentWindow}>
                Quit {activeAppName} (Return to Desktop)
              </div>
            </div>
          )}
        </div>

        {/* Standard OS Menus: File, Edit, View, Go (Desktop only) */}
        <div className="mac-desktop-menus" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <div className="mac-menu-item" style={{ position: 'relative' }}>
            <button
              onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
              className={`mac-menu-btn ${activeMenu === 'file' ? 'active' : ''}`}
            >
              File
            </button>
            {activeMenu === 'file' && (
              <div className="mac-dropdown-menu">
                <div className="mac-dropdown-item" onClick={() => { setActiveMenu(null); navigate('/sessions'); }}>
                  Open File Explorer
                </div>
                <div className="mac-dropdown-item" onClick={() => { setActiveMenu(null); openBrowser('gt://notes.html'); }}>
                  Open notes.html Browser
                </div>
                <div className="mac-dropdown-item" onClick={() => { setActiveMenu(null); navigate('/my-sessions/gt-xii/notes'); }}>
                  New Therapy Note
                </div>
                <div className="mac-dropdown-divider" />
                <div className="mac-dropdown-item" onClick={handleCloseCurrentWindow}>
                  Close Window
                </div>
              </div>
            )}
          </div>

          <div className="mac-menu-item" style={{ position: 'relative' }}>
            <button
              onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
              className={`mac-menu-btn ${activeMenu === 'view' ? 'active' : ''}`}
            >
              View
            </button>
            {activeMenu === 'view' && (
              <div className="mac-dropdown-menu">
                <div className="mac-dropdown-item" onClick={handleCloseCurrentWindow}>
                  Main Screen (Landing Wallpaper)
                </div>
                <div className="mac-dropdown-item" onClick={() => { setActiveMenu(null); toggleSoundboardPlay(); }}>
                  {isSoundboardPlaying ? 'Mute Soundboard Monitor' : 'Enable Soundboard Monitor'}
                </div>
                <div className="mac-dropdown-divider" />
                <div className="mac-dropdown-item" onClick={() => { setActiveMenu(null); toggleNotifCenter(); }}>
                  System Notification Center
                </div>
                <div className="mac-dropdown-item" onClick={handleToggleFullscreen}>
                  Toggle Fullscreen
                </div>
              </div>
            )}
          </div>

          <div className="mac-menu-item" style={{ position: 'relative' }}>
            <button
              onClick={() => setActiveMenu(activeMenu === 'go' ? null : 'go')}
              className={`mac-menu-btn ${activeMenu === 'go' ? 'active' : ''}`}
            >
              Go
            </button>
            {activeMenu === 'go' && (
              <div className="mac-dropdown-menu">
                <div className="mac-dropdown-item" onClick={() => { setActiveMenu(null); navigate('/'); }}>
                  Main Screen (Landing Wallpaper)
                </div>
                <div className="mac-dropdown-item" onClick={() => { setActiveMenu(null); navigate('/sessions'); }}>
                  01_Sessions Archive (Finder)
                </div>
                <div className="mac-dropdown-item" onClick={() => { setActiveMenu(null); openBrowser('gt://notes.html'); }}>
                  notes.html (Social Feed)
                </div>

                {persona === 'dj' && (
                  <>
                    <div className="mac-dropdown-divider" />
                    <div className="mac-dropdown-item bold" onClick={() => { setActiveMenu(null); navigate('/admin'); }}>
                      Aniko DJ Deck (Crate Station)
                    </div>
                    <div className="mac-dropdown-item" onClick={() => { setActiveMenu(null); navigate('/my-sessions'); }}>
                      My Files (Dossier)
                    </div>
                    <div className="mac-dropdown-item" onClick={() => { setActiveMenu(null); navigate('/my-sessions/gt-xii/notes'); }}>
                      Therapy Notes
                    </div>
                  </>
                )}

                {persona === 'admin' && (
                  <>
                    <div className="mac-dropdown-divider" />
                    <div className="mac-dropdown-item bold" onClick={() => { setActiveMenu(null); navigate('/admin'); }}>
                      Curator Console & Telemetry
                    </div>
                    <div className="mac-dropdown-item" onClick={() => { setActiveMenu(null); navigate('/my-sessions'); }}>
                      My Files (Dossier)
                    </div>
                    <div className="mac-dropdown-item" onClick={() => { setActiveMenu(null); navigate('/my-sessions/gt-xii/notes'); }}>
                      Therapy Notes
                    </div>
                  </>
                )}

                {persona === 'patient' && (
                  <>
                    <div className="mac-dropdown-divider" />
                    <div className="mac-dropdown-item" onClick={() => { setActiveMenu(null); navigate('/my-sessions'); }}>
                      02_My_Files (Personal Dossier)
                    </div>
                    <div className="mac-dropdown-item" onClick={() => { setActiveMenu(null); navigate('/my-sessions/gt-xii/notes'); }}>
                      Therapy Notes
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Controls: Soundboard, Role/User, Battery, Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {/* Soundboard Audio Player Quick Button */}
        <button
          onClick={toggleSoundboardPlay}
          style={{
            background: isSoundboardPlaying ? 'rgba(4, 229, 57, 0.18)' : 'transparent',
            border: isSoundboardPlaying ? '1px solid var(--gt-acid)' : '1px solid rgba(255, 255, 255, 0.12)',
            color: isSoundboardPlaying ? 'var(--gt-acid)' : 'var(--gt-muted)',
            borderRadius: '4px',
            padding: '2px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-metadata)'
          }}
          title={isSoundboardPlaying ? 'Mute Ambient Soundboard Demo' : 'Play Ambient Soundboard Demo (Web Audio API)'}
        >
          {isSoundboardPlaying ? <Volume2 size={12} color="var(--gt-acid)" /> : <VolumeX size={12} />}
          <span className="desktop-only" style={{ fontSize: '0.65rem' }}>
            {isSoundboardPlaying ? 'SYNTH ON' : 'SYNTH MUTE'}
          </span>
        </button>

        {/* User Account / Role Switcher Menu */}
        <div className="mac-menu-item" style={{ position: 'relative' }}>
          <button
            onClick={() => setActiveMenu(activeMenu === 'role' ? null : 'role')}
            style={{
              background: activeMenu === 'role' ? 'rgba(4, 229, 57, 0.22)' : 'rgba(4, 229, 57, 0.1)',
              border: '1px solid rgba(4, 229, 57, 0.5)',
              boxShadow: activeMenu === 'role' ? '0 0 12px rgba(4, 229, 57, 0.35)' : '0 0 6px rgba(4, 229, 57, 0.15)',
              color: 'var(--gt-cream)',
              padding: '3px 10px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.18s ease'
            }}
            title="DEMO ROLE SWITCHER: Preview different access boundaries (reloads to landing page)"
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--gt-acid)',
                boxShadow: '0 0 6px #04e539',
                display: 'inline-block'
              }}
            />
            <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-acid)', fontWeight: 800, letterSpacing: '0.04em' }}>
              DEMO ROLE:
            </span>
            <span className="mac-role-name" style={{ fontWeight: 700, color: '#f8f8f4' }}>
              {roleLabels[persona]}
            </span>
            <ChevronDown size={11} color="var(--gt-acid)" style={{ transform: activeMenu === 'role' ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
          </button>

          {activeMenu === 'role' && (
            <div className="mac-dropdown-menu" style={{ right: 0, left: 'auto', width: '280px', padding: '6px 0' }}>
              <div style={{ padding: '6px 12px 2px', fontSize: '0.68rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-acid)', fontWeight: 800, letterSpacing: '0.05em' }}>
                DEMO ROLE SWITCHER // SIMULATION ONLY
              </div>
              <div style={{ padding: '0 12px 6px', fontSize: '0.65rem', color: 'var(--gt-muted)', lineHeight: 1.3 }}>
                Demonstration tool to test access boundaries. Not real authentication.
              </div>
              <div className="mac-dropdown-divider" style={{ margin: '4px 0' }} />
              {(['patient', 'follower', 'visitor', 'dj', 'admin'] as DemoPersona[]).map(r => (
                <div
                  key={r}
                  className="mac-dropdown-item"
                  onClick={() => {
                    setActiveMenu(null);
                    setPersona(r);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: persona === r ? 'rgba(4, 229, 57, 0.08)' : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', color: persona === r ? 'var(--gt-acid)' : 'var(--gt-cream)' }}>
                      {roleLabels[r]}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--gt-muted)', marginTop: '2px' }}>
                      {r === 'patient' && 'Physical attendance verified at GT-XII and GT-XV. Full patient privileges.'}
                      {r === 'follower' && 'Registered account without physical attendance. Public archive & follows.'}
                      {r === 'visitor' && 'Unregistered guest. Public session directory and published materials.'}
                      {r === 'dj' && 'Aniko resident DJ station. Track ID demands & set reviews (Simulated).'}
                      {r === 'admin' && 'Curator terminal. Submission moderation and attendance reconciliation.'}
                    </div>
                  </div>
                  {persona === r && <Check size={14} color="var(--gt-acid)" style={{ flexShrink: 0, marginLeft: '8px' }} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wi-Fi & Battery */}
        <div className="mac-sys-specs" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gt-muted)' }}>
          <Wifi size={12} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.7rem' }}>
            <span>98%</span>
            <Battery size={13} />
          </div>
        </div>

        {/* Notifications Control Center Icon */}
        <button
          onClick={toggleNotifCenter}
          style={{
            background: isNotifCenterOpen ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            border: 'none',
            color: unreadNotifCount > 0 ? 'var(--gt-acid)' : 'var(--gt-muted)',
            padding: '2px 4px',
            borderRadius: '4px',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Notification Center"
        >
          <Bell size={13} />
          {unreadNotifCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--gt-acid)'
              }}
            />
          )}
        </button>

        {/* Live System Clock */}
        <div style={{ fontSize: '0.72rem', color: 'var(--gt-cream)', fontWeight: 600, paddingLeft: '4px' }}>
          <span className="mac-clock-date">{currentDateStr}&nbsp;&nbsp;</span>
          <span>{currentTime}</span>
        </div>
      </div>
      </div>

      <style>{`
        .mac-menu-btn {
          background: transparent;
          border: none;
          color: var(--gt-cream);
          padding: 2px 7px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.78rem;
        }

        .mac-menu-btn.active,
        .mac-menu-btn:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .mac-dropdown-menu {
          position: absolute;
          top: 26px;
          left: 0;
          min-width: 190px;
          background-color: rgba(22, 22, 22, 0.96);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 6px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
          padding: 4px 0;
          z-index: 9999;
        }

        .mac-dropdown-item {
          padding: 6px 14px;
          font-size: 0.76rem;
          color: var(--gt-cream);
          cursor: pointer;
          transition: background 0.1s ease;
        }

        .mac-dropdown-item:hover {
          background-color: var(--gt-acid);
          color: #030303 !important;
          font-weight: 600;
        }

        .mac-dropdown-item.bold {
          font-weight: 700;
        }

        .mac-dropdown-divider {
          height: 1px;
          background-color: rgba(255, 255, 255, 0.1);
          margin: 4px 0;
        }

        @media (max-width: 820px) {
          .gt-mac-menu-bar {
            height: 32px !important;
            padding: 0 8px !important;
          }
          .mac-desktop-menus {
            display: none !important;
          }
          .mac-sys-specs {
            display: none !important;
          }
          .mac-clock-date {
            display: none !important;
          }
          .mac-role-name {
            max-width: 85px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
          }
        }
      `}</style>
    </div>
    </>
  );
};

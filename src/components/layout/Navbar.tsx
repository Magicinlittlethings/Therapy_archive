import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import {
  Folder,
  Globe,
  Bell,
  Radio,
  Shield,
  FileText,
  Disc3,
  RotateCcw,
  Wifi,
  Battery,
  Volume2
} from 'lucide-react';
import { GTDropdown, DropdownOption } from '../common/GTDropdown';
import { DemoPersona } from '../../types';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    persona,
    setPersona,
    notifications,
    resetDemoData,
    openBrowser,
    isBrowserOpen,
    toggleNotifCenter
  } = useStore();

  const [currentTime, setCurrentTime] = useState<string>(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  const [currentDateStr, setCurrentDateStr] = useState<string>(() => {
    const now = new Date();
    return now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDateStr(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  const roleOptions: DropdownOption[] = [
    { value: 'patient', label: 'Patient' },
    { value: 'visitor', label: 'Public Visitor' },
    { value: 'dj', label: 'Resident DJ (Aniko)' },
    { value: 'admin', label: 'GT Curator (Staff)' }
  ];

  const handleRoleChange = (newRole: string) => {
    const p = newRole as DemoPersona;
    setPersona(p);
    if (p === 'patient') {
      navigate('/sessions');
    } else if (p === 'visitor') {
      navigate('/sessions');
    } else if (p === 'dj' || p === 'admin') {
      navigate('/admin');
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Determine current active application name for OS status bar
  const activeAppName = isBrowserOpen
    ? 'notes.html (Browser)'
    : location.pathname.startsWith('/sessions')
    ? 'Archive Explorer'
    : location.pathname.startsWith('/my-sessions')
    ? 'Patient Dossier'
    : location.pathname.startsWith('/admin')
    ? persona === 'dj' ? 'Aniko DJ Deck' : 'Curator Terminal'
    : location.pathname.startsWith('/notes.html')
    ? 'notes.html (Social Feed)'
    : 'System Desktop';

  return (
    <>
      {/* Mobile Phone Status Bar (Device POV on small screens) */}
      <div className="mobile-phone-status-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--gt-cream)' }}>
            {currentTime}
          </span>
          <span
            style={{
              fontSize: '0.62rem',
              fontFamily: 'var(--font-metadata)',
              color: 'var(--gt-acid)',
              backgroundColor: 'rgba(4, 229, 57, 0.12)',
              padding: '1px 4px',
              borderRadius: '2px'
            }}
          >
            GT-NET
          </span>
        </div>

        {/* Dynamic Island center notch */}
        <div
          style={{
            backgroundColor: '#000000',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '2px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--gt-acid)',
              boxShadow: '0 0 6px var(--gt-acid)'
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-metadata)',
              fontSize: '0.62rem',
              color: 'var(--gt-muted)',
              letterSpacing: '0.06em'
            }}
          >
            GT-OS // LIVE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gt-cream)' }}>
          <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-muted)' }}>
            5G
          </span>
          <Wifi size={12} color="var(--gt-acid)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-metadata)' }}>98%</span>
            <Battery size={13} />
          </div>
        </div>
      </div>

      {/* Main OS Top Menu Bar */}
      <header
        style={{
          backgroundColor: 'rgba(5, 5, 5, 0.96)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid var(--gt-border)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '62px',
            gap: 'var(--space-sm)'
          }}
        >
          {/* Left: Brand Logo & Current Active App Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                flexShrink: 0
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.18rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  color: 'var(--gt-cream)',
                  lineHeight: 1.1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>GROUP THERAPY</span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-metadata)',
                  fontSize: '0.62rem',
                  color: 'var(--gt-acid)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>GT-OS WORKSTATION</span>
                <span className="eq-bars">
                  <span className="eq-bar"></span>
                  <span className="eq-bar"></span>
                  <span className="eq-bar"></span>
                  <span className="eq-bar"></span>
                </span>
              </div>
            </Link>

            {/* Active App Indicator Badge (Desktop) */}
            <div
              className="desktop-only"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-metadata)',
                color: 'var(--gt-cream)',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--gt-acid)',
                  boxShadow: '0 0 6px var(--gt-acid)'
                }}
              />
              <span style={{ color: 'var(--gt-muted)' }}>APP:</span>
              <span style={{ fontWeight: 600 }}>{activeAppName}</span>
            </div>
          </div>

          {/* Desktop Navigation Shortcuts */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            className="desktop-nav"
          >
            {/* Direct Link to Archive Explorer */}
            <Link
              to="/sessions"
              style={{
                fontSize: '0.8rem',
                fontFamily: 'var(--font-metadata)',
                fontWeight: 600,
                color: isActive('/sessions') ? 'var(--gt-acid)' : 'var(--gt-cream)',
                padding: '5px 10px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: isActive('/sessions') ? 'rgba(4, 229, 57, 0.08)' : 'transparent',
                border: isActive('/sessions') ? '1px solid rgba(4, 229, 57, 0.3)' : '1px solid transparent',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Folder size={13} />
              <span>File Explorer</span>
            </Link>

            {/* Launch notes.html in-system browser */}
            <button
              onClick={() => openBrowser('gt://notes.html')}
              style={{
                fontSize: '0.8rem',
                fontFamily: 'var(--font-metadata)',
                fontWeight: 600,
                color: isBrowserOpen ? 'var(--gt-acid)' : 'var(--gt-cream)',
                padding: '5px 10px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: isBrowserOpen ? 'rgba(4, 229, 57, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                border: isBrowserOpen ? '1px solid var(--border-accent)' : '1px solid var(--border-subtle)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Globe size={13} color="var(--gt-acid)" />
              <span>notes.html</span>
              <span
                style={{
                  fontSize: '0.62rem',
                  backgroundColor: 'var(--gt-acid)',
                  color: '#030303',
                  padding: '1px 4px',
                  borderRadius: '2px',
                  fontWeight: 800
                }}
              >
                FEED
              </span>
            </button>

            {/* Direct Action for Patients: Compose Note */}
            {persona === 'patient' && (
              <Link
                to="/my-sessions/gt-xii/notes"
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  color: 'var(--gt-cream)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <FileText size={13} />
                <span>+ Write Note</span>
              </Link>
            )}

            {/* Direct Action for Curator & DJ: Admin Terminal */}
            {(persona === 'admin' || persona === 'dj') && (
              <Link
                to="/admin"
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-metadata)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  backgroundColor: 'var(--gt-acid-dim)',
                  color: 'var(--gt-acid)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: 'var(--radius-xs)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {persona === 'dj' ? <Disc3 size={13} /> : <Shield size={13} />}
                <span>{persona === 'dj' ? 'Aniko DJ Deck' : 'Curator Terminal'}</span>
              </Link>
            )}
          </nav>

          {/* Right: System Telemetry, Clock, Notifications & Role Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-xs)',
              flexShrink: 0
            }}
          >
            {/* Live Clock & Date (Desktop) */}
            <div
              className="desktop-only"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                padding: '0 8px',
                fontFamily: 'var(--font-metadata)'
              }}
            >
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--gt-cream)' }}>
                {currentTime}
              </span>
              <span style={{ fontSize: '0.62rem', color: 'var(--gt-muted)' }}>
                {currentDateStr}
              </span>
            </div>

            {/* System Notifications Bell Button */}
            <button
              onClick={toggleNotifCenter}
              style={{
                background: 'transparent',
                border: '1px solid var(--gt-border)',
                borderRadius: 'var(--radius-xs)',
                color: unreadNotifCount > 0 ? 'var(--gt-acid)' : 'var(--gt-muted)',
                padding: '6px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                transition: 'all var(--transition-fast)'
              }}
              title="System Alerts & Session Updates"
            >
              <Bell size={15} />
              {unreadNotifCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--gt-acid)',
                    boxShadow: '0 0 8px var(--gt-acid)'
                  }}
                />
              )}
            </button>

            {/* Role Switcher */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span
                className="desktop-only"
                style={{
                  fontFamily: 'var(--font-metadata)',
                  fontSize: '0.72rem',
                  color: 'var(--gt-acid)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 700
                }}
              >
                Role:
              </span>
              <GTDropdown
                options={roleOptions}
                value={persona}
                onChange={handleRoleChange}
                variant="compact"
                width={175}
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                if (confirm('Reset prototype storage to initial pristine state?')) {
                  resetDemoData();
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 8px',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-metadata)',
                backgroundColor: 'transparent',
                color: 'var(--gt-muted)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              title="Reset prototype state to initial values"
            >
              <RotateCcw size={12} />
              <span className="reset-label">Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Phone Device POV Dock) */}
      <nav className="mobile-bottom-bar">
        <Link
          to="/"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: isActive('/') && location.pathname === '/' ? 'var(--gt-acid)' : 'var(--gt-muted)',
            fontSize: '0.66rem',
            fontFamily: 'var(--font-metadata)'
          }}
        >
          <Radio size={17} />
          <span>Desktop</span>
        </Link>

        <Link
          to="/sessions"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: isActive('/sessions') ? 'var(--gt-acid)' : 'var(--gt-muted)',
            fontSize: '0.66rem',
            fontFamily: 'var(--font-metadata)'
          }}
        >
          <Folder size={17} />
          <span>Explorer</span>
        </Link>

        {/* Browser notes.html shortcut */}
        <button
          onClick={() => openBrowser('gt://notes.html')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            background: 'transparent',
            border: 'none',
            color: isBrowserOpen ? 'var(--gt-acid)' : 'var(--gt-cream)',
            fontSize: '0.66rem',
            fontFamily: 'var(--font-metadata)',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <Globe size={17} color="var(--gt-acid)" />
          <span>notes.html</span>
        </button>

        {persona === 'patient' && (
          <Link
            to="/my-sessions/gt-xii/notes"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              color: location.pathname.includes('/notes') ? 'var(--gt-acid)' : 'var(--gt-muted)',
              fontSize: '0.66rem',
              fontFamily: 'var(--font-metadata)'
            }}
          >
            <FileText size={17} />
            <span>Notes</span>
          </Link>
        )}

        {/* Notifications Shortcut */}
        <button
          onClick={toggleNotifCenter}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            background: 'transparent',
            border: 'none',
            color: unreadNotifCount > 0 ? 'var(--gt-acid)' : 'var(--gt-muted)',
            fontSize: '0.66rem',
            fontFamily: 'var(--font-metadata)',
            cursor: 'pointer',
            position: 'relative',
            padding: 0
          }}
        >
          <Bell size={17} />
          <span>Alerts</span>
          {unreadNotifCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '4px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--gt-acid)'
              }}
            />
          )}
        </button>

        {(persona === 'admin' || persona === 'dj') && (
          <Link
            to="/admin"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              color: isActive('/admin') ? 'var(--gt-acid)' : 'var(--gt-muted)',
              fontSize: '0.66rem',
              fontFamily: 'var(--font-metadata)'
            }}
          >
            {persona === 'dj' ? <Disc3 size={17} /> : <Shield size={17} />}
            <span>{persona === 'dj' ? 'DJ Deck' : 'Curator'}</span>
          </Link>
        )}
      </nav>

      <style>{`
        .mobile-phone-status-bar {
          display: none;
          background-color: #030303;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 6px 14px;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-metadata);
          font-size: 0.72rem;
          color: var(--gt-cream);
          user-select: none;
        }

        @media (max-width: 820px) {
          .mobile-phone-status-bar {
            display: flex !important;
          }
          .desktop-nav,
          .desktop-only {
            display: none !important;
          }
          .reset-label {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

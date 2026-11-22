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
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const GTSystemDock: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    openBrowser,
    isBrowserOpen,
    toggleNotifCenter,
    isNotifCenterOpen,
    notifications,
    persona,
    resetDemoData
  } = useStore();

  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const isCurrent = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const dockApps = [
    {
      id: 'finder',
      name: 'File Explorer',
      shortLabel: 'Explorer',
      icon: <Folder size={22} color="var(--gt-cream)" />,
      badge: null,
      isActive: isCurrent('/sessions') || isCurrent('/my-sessions'),
      onClick: () => navigate('/sessions')
    },
    {
      id: 'browser',
      name: 'notes.html (Browser)',
      shortLabel: 'notes.html',
      icon: <Globe size={22} color="var(--gt-acid)" />,
      badge: 'FEED',
      badgeColor: 'var(--gt-acid)',
      isActive: isBrowserOpen || isCurrent('/notes.html'),
      onClick: () => openBrowser('gt://notes.html')
    },
    {
      id: 'notes',
      name: 'Write Therapy Note',
      shortLabel: 'Notes',
      icon: <FileText size={22} color="var(--gt-cream)" />,
      badge: null,
      isActive: location.pathname.includes('/notes'),
      onClick: () => navigate('/my-sessions/gt-xii/notes')
    },
    {
      id: 'notifications',
      name: 'System Notifications',
      shortLabel: 'Alerts',
      icon: <Bell size={22} color={unreadCount > 0 ? 'var(--gt-acid)' : 'var(--gt-cream)'} />,
      badge: unreadCount > 0 ? `${unreadCount}` : null,
      badgeColor: 'var(--gt-acid)',
      isActive: isNotifCenterOpen,
      onClick: () => toggleNotifCenter()
    },
    {
      id: 'admin',
      name: persona === 'dj' ? 'Aniko DJ Deck' : 'Curator Terminal',
      shortLabel: persona === 'dj' ? 'DJ Deck' : 'Terminal',
      icon: persona === 'dj' ? <Disc3 size={22} color="var(--gt-orange)" /> : <Shield size={22} color="var(--gt-acid)" />,
      badge: null,
      isActive: isCurrent('/admin'),
      onClick: () => navigate('/admin')
    },
    {
      id: 'reset',
      name: 'Reset System Prototype',
      shortLabel: 'Reset',
      icon: <RotateCcw size={18} color="var(--gt-muted)" />,
      badge: null,
      isActive: false,
      onClick: () => {
        if (confirm('Reset prototype storage to initial pristine state?')) {
          resetDemoData();
        }
      }
    }
  ];

  return (
    <>
      <div
        className="gt-system-dock-container"
        style={{
          position: 'fixed',
          bottom: '22px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 90,
          pointerEvents: 'none'
        }}
      >
        <div
          className="gt-system-dock"
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '8px',
            padding: '8px 14px',
            backgroundColor: 'rgba(10, 10, 10, 0.88)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.75), 0 0 24px rgba(4, 229, 57, 0.15)',
            borderRadius: '24px',
            position: 'relative',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {dockApps.map(app => {
            const isHovered = hoveredApp === app.id;
            return (
              <div
                key={app.id}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
                onMouseEnter={() => setHoveredApp(app.id)}
                onMouseLeave={() => setHoveredApp(null)}
              >
                {/* Hover Tooltip Label */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '58px',
                      whiteSpace: 'nowrap',
                      backgroundColor: 'rgba(18, 18, 18, 0.95)',
                      color: 'var(--gt-cream)',
                      border: '1px solid var(--border-accent)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-metadata)',
                      boxShadow: 'var(--shadow-md)',
                      pointerEvents: 'none',
                      animation: 'fadeInUp 0.15s ease'
                    }}
                  >
                    {app.name}
                  </div>
                )}

                {/* App Button */}
                <button
                  onClick={app.onClick}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: app.isActive
                      ? 'rgba(4, 229, 57, 0.15)'
                      : isHovered
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(26, 26, 26, 0.8)',
                    border: app.isActive
                      ? '1px solid var(--border-accent)'
                      : '1px solid rgba(255, 255, 255, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    transform: isHovered ? 'scale(1.15) translateY(-4px)' : 'scale(1)'
                  }}
                  title={app.name}
                >
                  {app.icon}

                  {/* Badge */}
                  {app.badge && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        backgroundColor: app.badgeColor || 'var(--gt-acid)',
                        color: '#030303',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        fontFamily: 'var(--font-metadata)',
                        borderRadius: '10px',
                        padding: '1px 5px',
                        boxShadow: '0 0 8px rgba(4, 229, 57, 0.6)'
                      }}
                    >
                      {app.badge}
                    </span>
                  )}
                </button>

                {/* Running App LED Indicator Dot */}
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    marginTop: '4px',
                    backgroundColor: app.isActive ? 'var(--gt-acid)' : 'transparent',
                    boxShadow: app.isActive ? '0 0 6px var(--gt-acid)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 820px) {
          .gt-system-dock-container {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

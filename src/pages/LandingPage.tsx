import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CURATED_SESSIONS } from '../data/seedData';
import {
  Folder,
  Globe,
  FileText,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowRight,
  Disc3,
  Sparkles,
  Shield,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Radio
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    openBrowser,
    persona,
    setPersona,
    isSoundboardPlaying,
    toggleSoundboardPlay,
    sessions,
    materials,
    notes,
    getAttendance
  } = useStore();

  const featuredSession = CURATED_SESSIONS.find(s => s.id === 'gt-xii') || CURATED_SESSIONS[0];
  const attendanceStatus = getAttendance(featuredSession.id);

  return (
    <div className="landing-wallpaper-container">
      {/* Ambient background glows */}
      <div className="wallpaper-glow glow-1" />
      <div className="wallpaper-glow glow-2" />

      {/* Main Wallpaper Content Canvas */}
      <div className="landing-wallpaper-content">

        {/* HERO SECTION */}
        <section className="wallpaper-hero-section">
          <div className="wallpaper-hero-left">
            <div className="wallpaper-telemetry-badge">
              <span className="telemetry-dot" />
              <span>THERAPY ARCHIVE</span>
            </div>

            <h1 className="wallpaper-headline">
              &ldquo;The music comes first. Everything else grows from it.&rdquo;
            </h1>

            <p className="wallpaper-subheadline">
              An electronic music gathering archive and cultural lineage.
              Attendance-linked session case files, progressive soundboard releases, and encrypted patient reflections.
            </p>

            {/* Quick Interactive Persona Switcher Strip */}
            <div className="wallpaper-role-switcher-strip">
              <div className="role-switcher-header">
                <span className="telemetry-dot" />
                <span className="role-switcher-label">
                  ACTIVE USER ROLE // TEST DIFFERENT PERSONAS:
                </span>
                <span className="role-switcher-hint">Clicking a role reloads the system</span>
              </div>
              <div className="role-switcher-pills">
                {([
                  { id: 'patient', label: 'Patient', desc: 'Door-verified passes & reflections' },
                  { id: 'visitor', label: 'Public Visitor', desc: 'Open music archive & sets' },
                  { id: 'dj', label: 'Resident DJ (Aniko)', desc: 'Track IDs & audience reviews' },
                  { id: 'admin', label: 'GT Curator', desc: 'Door check-in & moderation' }
                ] as const).map(role => (
                  <button
                    key={role.id}
                    onClick={() => setPersona(role.id)}
                    className={`role-pill-btn ${persona === role.id ? 'active' : ''}`}
                    title={`Switch role to ${role.label} (reloads to landing page)`}
                  >
                    <span className="role-pill-dot" />
                    <span className="role-pill-text">{role.label}</span>
                    {persona === role.id && <span className="role-pill-active-tag">CURRENT</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Action Launch Buttons */}
            <div className="wallpaper-actions-row">
              <button
                className="wallpaper-btn btn-primary-neon"
                onClick={() => navigate('/sessions')}
              >
                <Folder size={16} />
                <span>Open Finder // Sessions Archive</span>
              </button>

              <button
                className="wallpaper-btn btn-outline-cyber"
                onClick={() => openBrowser('gt://notes.html')}
              >
                <Globe size={16} />
                <span>Launch notes.html [FEED]</span>
              </button>

              {persona !== 'visitor' && (
                <button
                  className="wallpaper-btn btn-ghost-subtle"
                  onClick={() => navigate('/my-sessions')}
                >
                  <FileText size={16} />
                  <span>My Personal Dossier</span>
                </button>
              )}
            </div>
          </div>

          {/* NEAT MUSIC PLAYER ARRANGEMENT */}
          <div className="wallpaper-hero-right">
            <div className="neat-music-player-card">
              <div className="player-top-status">
                <div className="status-indicator-pill">
                  <span className={`live-dot ${isSoundboardPlaying ? 'pulsing' : ''}`} />
                  <span>{isSoundboardPlaying ? 'SYNTHETIC DEMO // AUDIO ACTIVE' : 'SYNTHETIC SOUNDBOARD DEMO // STANDBY'}</span>
                </div>
                <span className="player-sample-rate">WEB AUDIO API</span>
              </div>

              <div className="player-disc-and-info">
                <div className={`player-disc-graphic ${isSoundboardPlaying ? 'spinning' : ''}`}>
                  <Disc3 size={42} color={isSoundboardPlaying ? 'var(--gt-acid)' : 'var(--gt-cream)'} />
                </div>

                <div className="player-track-meta">
                  <div className="track-title">Synthetic Soundboard Demonstration</div>
                  <div className="track-subtitle">Group Therapy Soundscape Simulation</div>
                  <div className="track-specs">Generated via Web Audio API · Demonstrating interactive frequency monitors</div>
                </div>
              </div>

              {/* Graphic Equalizer Bars */}
              <div className="player-visualizer-container">
                <div className={`player-eq-visualizer ${isSoundboardPlaying ? 'active' : ''}`}>
                  {[45, 80, 60, 95, 30, 75, 90, 50, 85, 40, 70, 90, 65, 80, 45, 95, 35, 75, 60, 85].map((h, i) => (
                    <div
                      key={i}
                      className="visualizer-bar"
                      style={{
                        height: isSoundboardPlaying ? `${h}%` : '15%',
                        animationDelay: `${i * 0.05}s`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Controls Row */}
              <div className="player-controls-row">
                <button
                  className={`player-big-play-btn ${isSoundboardPlaying ? 'playing' : ''}`}
                  onClick={toggleSoundboardPlay}
                  title={isSoundboardPlaying ? 'Pause Audio Demo' : 'Listen to Synthetic Soundboard Demo'}
                >
                  {isSoundboardPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
                </button>

                <div className="player-status-text">
                  <span style={{ fontWeight: 700, color: 'var(--gt-cream)' }}>
                    {isSoundboardPlaying ? 'SYNTHETIC DEMO PLAYING' : 'AUDIO DEMO READY'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--gt-muted)' }}>
                    {isSoundboardPlaying ? 'Synthesized via Web Audio API' : 'Click to preview synthetic soundboard demonstration'}
                  </span>
                </div>

                <button
                  className="player-mute-btn"
                  onClick={toggleSoundboardPlay}
                  title={isSoundboardPlaying ? 'Mute' : 'Unmute'}
                >
                  {isSoundboardPlaying ? (
                    <Volume2 size={18} color="var(--gt-acid)" />
                  ) : (
                    <VolumeX size={18} color="var(--gt-muted)" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED CASE FILE SPOTLIGHT SECTION */}
        <section className="wallpaper-spotlight-section">
          {/* Header Row */}
          <div className="spotlight-header-row">
            <div>
              <div className="spotlight-tag">FEATURED CASE FILE SPOTLIGHT</div>
              <h2 className="spotlight-title">{featuredSession.title}</h2>
            </div>

            <button
              className="spotlight-view-all-btn"
              onClick={() => navigate('/sessions')}
            >
              <span>View All 6 Sessions in Finder</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Metadata Badges */}
          <div className="spotlight-meta-tags">
            <span className="case-ref-stamp">{featuredSession.sessionCode}</span>
            <span className="meta-pill"><Calendar size={12} /> {featuredSession.date}</span>
            <span className="meta-pill"><MapPin size={12} /> {featuredSession.venue}</span>
            {attendanceStatus === 'attended' && (
              <span className="verified-pill"><CheckCircle2 size={12} /> Door Pass (Simulated Demo)</span>
            )}
          </div>

          {/* Description */}
          <p className="spotlight-description">
            {featuredSession.description}
          </p>

          {/* Lineup Chips (Spacious & Clean) */}
          <div className="spotlight-lineup-container">
            <span className="lineup-label">LINEUP //</span>
            <div className="spotlight-lineup-chips">
              {featuredSession.artists.map((artist, idx) => {
                const isResident = artist.role?.toLowerCase().includes('resident');
                return (
                  <span key={idx} className={`lineup-chip ${isResident ? 'resident-chip' : ''}`}>
                    <span>{artist.name}</span>
                    {isResident && <span className="chip-badge">RESIDENT</span>}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="spotlight-card-footer">
            <button
              className="spotlight-action-btn"
              onClick={() => navigate(`/sessions/${featuredSession.id}`)}
            >
              <span>Inspect Case File in Finder</span>
              <ArrowRight size={14} />
            </button>

            <button
              className="spotlight-notes-btn"
              onClick={() => navigate(`/my-sessions/${featuredSession.id}/notes`)}
            >
              <FileText size={14} />
              <span>Therapy Notes</span>
            </button>
          </div>
        </section>

        {/* THREE CORE ARCHIVAL PILLARS */}
        <section className="wallpaper-pillars-section">
          <div className="pillar-card">
            <div className="pillar-num">01</div>
            <div className="pillar-title">Verified Door Matching</div>
            <div className="pillar-desc">
              Ticket purchases and door scanner check-ins reconcile automatically with attendee accounts via email, unlocking personal dossiers without claim barriers.
            </div>
          </div>

          <div className="pillar-card">
            <div className="pillar-num">02</div>
            <div className="pillar-title">Community Feed // notes.html</div>
            <div className="pillar-desc">
              Community reflections, crowd track ID requests, and Polaroid photo memories directly from the dancefloor.
            </div>
          </div>

          <div className="pillar-card">
            <div className="pillar-num">03</div>
            <div className="pillar-title">Soundboard & DJ Sets</div>
            <div className="pillar-desc">
              Direct soundboard captures and curated tracklists released progressively weeks and months after events, verified by resident DJs and curators.
            </div>
          </div>
        </section>

        {/* TELEMETRY FOOTER */}
        <div className="wallpaper-footer-strip">
          <div className="wallpaper-social-links">
            <span style={{ color: 'var(--gt-muted)', marginRight: '6px', fontSize: '0.68rem', letterSpacing: '0.06em' }}>
              COMMUNITY ARCHIVE //
            </span>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
              title="Instagram // @grouptherapy"
              aria-label="Instagram"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a
              href="https://soundcloud.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
              title="SoundCloud // Soundboard Master Tapes"
              aria-label="SoundCloud"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.56 8.87V17h8.1c1.84 0 3.34-1.46 3.34-3.26 0-1.74-1.39-3.17-3.17-3.25-.41-2.52-2.57-4.46-5.19-4.46-1.14 0-2.21.37-3.08 1.01v1.83zm-1.84-.71v8.84h.92V8.16zm-1.85 1.54v7.3h.92V9.7zm-1.84.92v6.38h.92v-6.38zm-1.85 1.48v4.9h.92v-4.9zm-1.84 1.25v3.65h.92v-3.65zm-1.85.7v2.95h.92v-2.95z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
              title="YouTube // Session Case Recordings"
              aria-label="YouTube"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"></polygon>
              </svg>
            </a>
            <a
              href="https://spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
              title="Spotify // Curated Lineup Playlists"
              aria-label="Spotify"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.436-5.308-1.76-8.793-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.808-.87 7.076-.51 9.722 1.113.294.18.386.563.207.857zm1.226-2.724c-.227.367-.71.482-1.077.254-2.69-1.654-6.79-2.133-9.97-1.167-.413.125-.85-.11-.975-.523-.125-.413.11-.85.523-.975 3.633-1.103 8.147-.568 11.245 1.334.367.227.482.71.254 1.077zm.106-2.836C14.692 8.95 9.375 8.775 6.297 9.71c-.494.15-1.018-.128-1.168-.622-.15-.494.128-1.018.622-1.168 3.532-1.072 9.404-.866 13.15 1.36.444.263.59.84.327 1.284-.264.444-.84.59-1.284.327z" />
              </svg>
            </a>
          </div>

          <div style={{ color: 'var(--gt-muted)', letterSpacing: '0.08em' }}>
            GROUP THERAPY // ARCHIVE 1.0
          </div>
        </div>
      </div>

      <style>{`
        .landing-wallpaper-container {
          min-height: 100%;
          width: 100%;
          background: radial-gradient(circle at 50% 10%, #080808 0%, #030303 60%, #000000 100%);
          color: var(--gt-cream);
          position: relative;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 24px 32px 100px;
          box-sizing: border-box;
        }

        .wallpaper-glow {
          display: none;
        }

        .landing-wallpaper-content {
          max-width: 1320px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        /* Hero Section (Two-Column Layout with Soundboard Player) */
        .wallpaper-hero-section {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 36px;
          align-items: center;
          padding-top: 10px;
        }

        @media (max-width: 960px) {
          .wallpaper-hero-section {
            grid-template-columns: 1fr;
          }
        }

        .wallpaper-telemetry-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-metadata);
          font-size: 0.72rem;
          color: #e2e6e2;
          background-color: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 4px 10px;
          border-radius: 4px;
          margin-bottom: 16px;
          letter-spacing: 0.06em;
        }

        .telemetry-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--gt-acid);
          box-shadow: 0 0 6px var(--gt-acid);
        }

        .wallpaper-headline {
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          font-family: var(--font-display);
          font-weight: 800;
          line-height: 1.15;
          color: #ffffff;
          margin: 0 0 16px 0;
          letter-spacing: -0.02em;
        }

        .wallpaper-subheadline {
          font-size: 1.05rem;
          color: #989c98;
          line-height: 1.6;
          max-width: 620px;
          margin: 0 0 28px 0;
        }

        .wallpaper-actions-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .wallpaper-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-primary-neon {
          background-color: #f2f5f2;
          color: #030403;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.6);
        }
        .btn-primary-neon:hover {
          background-color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.18);
        }

        .btn-outline-cyber {
          background-color: rgba(255, 255, 255, 0.04);
          color: var(--gt-cream);
          border: 1px solid rgba(255, 255, 255, 0.14);
        }
        .btn-outline-cyber:hover {
          border-color: rgba(255, 255, 255, 0.35);
          background-color: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          transform: translateY(-2px);
        }

        .btn-ghost-subtle {
          background: transparent;
          color: var(--gt-muted);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .btn-ghost-subtle:hover {
          color: var(--gt-cream);
          border-color: rgba(255, 255, 255, 0.2);
        }

        /* Neat Music Player Card (Refined Studio Hardware Console) */
        .neat-music-player-card {
          background-color: #0a0b0a;
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 20px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.85);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .player-top-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-metadata);
          font-size: 0.68rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 10px;
        }

        .status-indicator-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--gt-acid);
          font-weight: 700;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: var(--gt-acid);
        }
        .live-dot.pulsing {
          box-shadow: 0 0 8px var(--gt-acid);
          animation: pulseGlow 1.2s infinite alternate;
        }
        @keyframes pulseGlow {
          from { opacity: 0.5; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1.15); }
        }

        .player-sample-rate {
          color: var(--gt-muted);
        }

        .player-disc-and-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .player-disc-graphic {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #060706;
          border: 2px solid rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .player-disc-graphic.spinning {
          animation: spinRecord 6s linear infinite;
        }
        @keyframes spinRecord {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .player-track-meta {
          flex: 1;
        }
        .track-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #ffffff;
        }
        .track-subtitle {
          font-size: 0.8rem;
          color: #a4a8a4;
          font-family: var(--font-metadata);
          margin-top: 2px;
        }
        .track-specs {
          font-size: 0.72rem;
          color: var(--gt-muted);
          margin-top: 3px;
        }

        /* Equalizer visualizer */
        .player-visualizer-container {
          height: 38px;
          background-color: #050605;
          border-radius: 6px;
          padding: 4px 8px;
          display: flex;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .player-eq-visualizer {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          height: 100%;
          width: 100%;
        }
        .visualizer-bar {
          flex: 1;
          background-color: rgba(255, 255, 255, 0.12);
          border-radius: 2px;
          transition: height 0.15s ease;
        }
        .player-eq-visualizer.active .visualizer-bar {
          background: linear-gradient(to top, rgba(255, 255, 255, 0.3) 0%, var(--gt-acid) 100%);
          animation: barBounce 0.6s infinite alternate ease-in-out;
        }
        @keyframes barBounce {
          0% { height: 15%; }
          100% { height: 95%; }
        }

        .player-controls-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .player-big-play-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--gt-cream);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .player-big-play-btn:hover {
          background-color: rgba(255, 255, 255, 0.16);
          border-color: rgba(255, 255, 255, 0.4);
          transform: scale(1.05);
        }
        .player-big-play-btn.playing {
          background-color: var(--gt-acid);
          color: #030303;
          box-shadow: 0 0 14px rgba(4, 229, 57, 0.4);
        }

        .player-status-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          font-size: 0.8rem;
        }

        .player-mute-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px;
          color: var(--gt-muted);
          transition: color 0.15s ease;
        }
        .player-mute-btn:hover {
          color: var(--gt-cream);
        }

        /* Spotlight section (Single spacious showcase) */
        .wallpaper-spotlight-section {
          background: radial-gradient(ellipse at 85% 10%, rgba(255, 255, 255, 0.03) 0%, rgba(12, 16, 12, 0.7) 60%, rgba(4, 6, 4, 0.9) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 28px 32px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
        }

        .spotlight-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 14px;
        }

        .spotlight-tag {
          font-family: var(--font-metadata);
          font-size: 0.72rem;
          color: var(--gt-acid);
          letter-spacing: 0.08em;
          margin-bottom: 6px;
          font-weight: 700;
        }

        .spotlight-title {
          font-size: 1.85rem;
          font-family: var(--font-display);
          font-weight: 800;
          margin: 0;
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        .spotlight-view-all-btn {
          background: transparent;
          border: none;
          color: var(--gt-acid);
          font-family: var(--font-metadata);
          font-size: 0.78rem;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        .spotlight-view-all-btn:hover {
          background-color: rgba(4, 229, 57, 0.1);
        }

        .spotlight-meta-tags {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-metadata);
          font-size: 0.74rem;
          color: var(--gt-muted);
          background-color: rgba(255, 255, 255, 0.04);
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .verified-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-metadata);
          font-size: 0.74rem;
          color: var(--gt-acid);
          background-color: rgba(4, 229, 57, 0.12);
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid rgba(4, 229, 57, 0.35);
          font-weight: 700;
        }

        .spotlight-description {
          font-size: 0.96rem;
          color: #c4c8c4;
          line-height: 1.6;
          margin: 0 0 20px 0;
          max-width: 820px;
        }

        .spotlight-lineup-container {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .lineup-label {
          color: var(--gt-acid);
          font-family: var(--font-metadata);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          flex-shrink: 0;
        }

        .spotlight-lineup-chips {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .lineup-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          font-family: var(--font-metadata);
          font-size: 0.78rem;
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          color: var(--gt-cream);
          transition: all 0.15s ease;
        }

        .lineup-chip:hover {
          background-color: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .lineup-chip.resident-chip {
          background-color: rgba(4, 229, 57, 0.08);
          border-color: rgba(4, 229, 57, 0.3);
          color: var(--gt-acid);
        }

        .chip-badge {
          font-size: 0.62rem;
          font-weight: 800;
          padding: 1px 4px;
          border-radius: 3px;
          background-color: rgba(4, 229, 57, 0.2);
          color: var(--gt-acid);
        }

        .spotlight-card-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 20px;
          margin-top: 22px;
          flex-wrap: wrap;
        }

        .spotlight-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          background-color: #f2f5f2;
          color: #030403;
          border: 1px solid #ffffff;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .spotlight-action-btn:hover {
          background-color: #ffffff;
          box-shadow: 0 4px 16px rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .spotlight-notes-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          background-color: rgba(255, 255, 255, 0.04);
          color: var(--gt-cream);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 6px;
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .spotlight-notes-btn:hover {
          background-color: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.25);
        }

        /* Pillars Section */
        .wallpaper-pillars-section {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 860px) {
          .wallpaper-pillars-section {
            grid-template-columns: 1fr;
          }
        }

        .pillar-card {
          background-color: rgba(12, 16, 12, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 20px;
        }
        .pillar-num {
          font-family: var(--font-metadata);
          font-size: 0.78rem;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 800;
          margin-bottom: 8px;
        }
        .pillar-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
        }
        .pillar-desc {
          font-size: 0.82rem;
          color: var(--gt-muted);
          line-height: 1.5;
        }

        /* Telemetry footer */
        .wallpaper-footer-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-metadata);
          font-size: 0.68rem;
          color: var(--gt-muted);
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          flex-wrap: wrap;
          gap: 12px;
        }

        .wallpaper-social-links {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .social-icon-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--gt-muted);
          width: 30px;
          height: 30px;
          border-radius: 4px;
          background-color: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
        }

        .social-icon-link:hover {
          color: var(--gt-acid);
          border-color: var(--gt-acid);
          background-color: rgba(4, 229, 57, 0.12);
          box-shadow: 0 0 10px rgba(4, 229, 57, 0.3);
          transform: translateY(-2px);
        }

        .wallpaper-role-switcher-strip {
          margin: 16px 0 22px 0;
          padding: 12px 14px;
          background: rgba(14, 18, 14, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }

        .role-switcher-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .role-switcher-label {
          font-family: var(--font-metadata);
          font-size: 0.68rem;
          color: #ffffff;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .role-switcher-hint {
          font-family: var(--font-metadata);
          font-size: 0.64rem;
          color: var(--gt-muted);
        }

        .role-switcher-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .role-pill-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          color: var(--gt-cream);
          font-size: 0.76rem;
          font-family: var(--font-metadata);
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .role-pill-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.25);
          color: #fff;
          transform: translateY(-1px);
        }

        .role-pill-btn.active {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.35);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          font-weight: 700;
        }

        .role-pill-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #666;
        }
        .role-pill-btn.active .role-pill-dot {
          background: var(--gt-acid);
          box-shadow: 0 0 6px var(--gt-acid);
        }

        .role-pill-active-tag {
          font-size: 0.58rem;
          background: #ffffff;
          color: #030303;
          padding: 1px 5px;
          border-radius: 3px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        @media (max-width: 768px) {
          .landing-wallpaper-container {
            padding: 16px 14px 100px;
          }
          .wallpaper-headline {
            font-size: 1.8rem;
          }
          .wallpaper-subheadline {
            font-size: 0.92rem;
            margin-bottom: 20px;
          }
          .neat-music-player-card {
            padding: 14px;
            gap: 12px;
          }
          .wallpaper-actions-row {
            gap: 8px;
          }
          .wallpaper-btn {
            width: 100%;
            justify-content: center;
          }
          .wallpaper-spotlight-section {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

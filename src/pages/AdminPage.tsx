import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { GTDropdown, DropdownOption } from '../components/common/GTDropdown';
import {
  Shield,
  Upload,
  Check,
  Disc3,
  FileCheck,
  UserCheck,
  Sliders,
  Lock,
  Star,
  MessageSquare,
  AlertTriangle,
  History,
  Send
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    sessions,
    simulateAttendanceImport,
    notes,
    contentRequests,
    reports,
    trackInquiries,
    resolveReport,
    replyToTrackIdInquiry,
    persona,
    setPersona,
    approveNote,
    rejectNote,
    unflagNote,
    attendanceScenarios,
    activeScenarioId,
    selectAttendanceScenario
  } = useStore();

  const isDjMode = persona === 'dj';
  const [activeTab, setActiveTab] = useState<'dj_deck' | 'attendance' | 'moderation'>(
    isDjMode ? 'dj_deck' : 'attendance'
  );

  const [inquiryResponses, setInquiryResponses] = useState<Record<string, string>>({});

  useEffect(() => {
    if (persona === 'dj') {
      setActiveTab('dj_deck');
    } else if (persona === 'admin') {
      setActiveTab('attendance');
    }
  }, [persona]);

  // Attendance Simulation State
  const [importSessionId, setImportSessionId] = useState(sessions[3]?.id || sessions[0].id);
  const [importSuccess, setImportSuccess] = useState(false);

  // Community moderation queues
  const pendingSubmissions = notes.filter(n => n.submissionStatus === 'pending');
  const pendingReports = reports.filter(r => r.status === 'pending_review');
  const resolvedReports = reports.filter(r => r.status !== 'pending_review');
  const flaggedNotes = notes.filter(n => n.isFlagged || n.moderationStatus === 'pending');

  // Track ID Inquiries
  const handleReplyToInquiry = (inquiryId: string) => {
    const text = inquiryResponses[inquiryId]?.trim();
    if (!text) return;
    replyToTrackIdInquiry(inquiryId, text);
    setInquiryResponses(prev => ({ ...prev, [inquiryId]: '' }));
  };

  // Notes written mentioning Aniko
  const djMentionsCount = notes.filter(n =>
    n.artistName?.toLowerCase().includes('aniko') ||
    n.sessionTitle.toLowerCase().includes('aniko') ||
    n.content.toLowerCase().includes('aniko')
  ).length;

  // If visitor, patient, or attendee visits /admin, show strict case-file restriction screen
  if (persona !== 'admin' && persona !== 'dj') {
    const roleLabels: Record<string, string> = {
      visitor: 'Public Visitor',
      patient: 'Registered Patient (Unverified)',
      attendee: 'Verified Attendee (Lami Adeyemi)'
    };

    return (
      <div className="container" style={{ padding: 'var(--space-3xl) var(--space-md)', textAlign: 'center' }}>
        <div
          className="archival-panel-raised"
          style={{
            maxWidth: '640px',
            margin: '0 auto',
            border: '1px solid var(--gt-border)',
            padding: 'var(--space-2xl)'
          }}
        >
          <div style={{ marginBottom: '8px', fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--gt-acid)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            CURATOR &amp; ARTIST ACCESS
          </div>

          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-xs)' }}>
            Curator &amp; DJ Station Restricted
          </h2>

          <p style={{ color: 'var(--gt-cream)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 'var(--space-md)' }}>
            You are currently viewing as <strong>{roleLabels[persona]}</strong>. 
            In the Group Therapy platform, curation tools, door scanner attendance upload, track ID release desks, and resident performance telemetry are restricted to GT Curators and Resident Artists.
          </p>

          <p style={{ color: 'var(--gt-muted)', fontSize: '0.85rem', marginBottom: 'var(--space-xl)' }}>
            To inspect these administration tools or explore Aniko's DJ Crate, select <strong>"Resident DJ (Aniko)"</strong> or <strong>"GT Curator Terminal"</strong> from the top dropdown.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
            <button
              onClick={() => setPersona('dj')}
              className="btn btn-outline-neon"
              style={{ fontSize: '0.8rem', gap: '6px' }}
            >
              <Disc3 size={14} />
              <span>Switch to Resident DJ (Aniko)</span>
            </button>

            <button
              onClick={() => setPersona('admin')}
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', gap: '6px' }}
            >
              <Shield size={14} />
              <span>Switch to GT Curator Terminal</span>
            </button>

            <Link to="/my-sessions" className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>
              Return to My Patient Dossier
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSimulateImport = () => {
    simulateAttendanceImport(importSessionId, 68);
    setImportSuccess(true);
    setTimeout(() => setImportSuccess(false), 2500);
  };

  // Dropdown options
  const sessionOptions: DropdownOption[] = sessions.map(s => ({
    value: s.id,
    label: s.sessionCode ? `${s.sessionCode}: ${s.title}` : s.title,
    badge: s.branch === 'Side Quests' ? 'SIDE QUEST' : 'GT MAIN'
  }));

  return (
    <div style={{ padding: '28px 32px 80px', maxWidth: '1360px', margin: '0 auto', overflowY: 'auto', boxSizing: 'border-box', width: '100%' }}>
      {/* Header: Distinct Terminal / Crate Station Persona */}
      <div
        className="terminal-panel"
        style={{
          padding: '14px 18px',
          marginBottom: '16px',
          borderLeft: '4px solid var(--gt-acid)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="case-ref-stamp">
              {isDjMode ? 'DJ CRATE TERMINAL // RESIDENCY DESK' : 'GT ARCHIVE // MASTER CURATOR CONSOLE'}
            </span>
            <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--gt-acid)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="eq-bars">
                <span className="eq-bar"></span>
                <span className="eq-bar"></span>
                <span className="eq-bar"></span>
              </span>
              ONLINE
            </span>
          </div>

          <div style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.75rem', color: 'var(--gt-muted)' }}>
            STATION: {isDjMode ? 'RESIDENT PERFORMER (ANIKO)' : 'CURATOR DESK (ADMIN)'}
          </div>
        </div>

        {/* DJ Stats Strip */}
        {isDjMode && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'var(--space-sm)',
              marginTop: '10px',
              paddingTop: '10px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              fontFamily: 'var(--font-metadata)',
              fontSize: '0.78rem'
            }}
          >
            <div>
              <div style={{ color: 'var(--gt-muted)', fontSize: '0.65rem' }}>RESIDENT SESSIONS</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--gt-acid)' }}>GT-IV, V, VIII, X, XII, XV</div>
            </div>
            <div>
              <div style={{ color: 'var(--gt-muted)', fontSize: '0.65rem' }}>CROWD TRACK REQUESTS</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--gt-cream)' }}>{contentRequests.length} PENDING IDs</div>
            </div>
          </div>
        )}
      </div>

      {/* Console Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--gt-border)',
          marginBottom: 'var(--space-xl)',
          gap: 'var(--space-xs)',
          overflowX: 'auto'
        }}
      >
        {isDjMode ? (
          <div
            style={{
              padding: '12px 20px',
              fontFamily: 'var(--font-metadata)',
              fontSize: '0.825rem',
              fontWeight: 800,
              color: 'var(--gt-acid)',
              borderBottom: '2px solid var(--gt-acid)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sliders size={14} />
            <span>DJ Track ID Demands &amp; Reception</span>
          </div>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('attendance')}
              style={{
                padding: '12px 20px',
                fontFamily: 'var(--font-metadata)',
                fontSize: '0.825rem',
                fontWeight: activeTab === 'attendance' ? 800 : 500,
                color: activeTab === 'attendance' ? 'var(--gt-acid)' : 'var(--gt-muted)',
                borderBottom: activeTab === 'attendance' ? '2px solid var(--gt-acid)' : '2px solid transparent',
                background: 'transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <UserCheck size={14} />
              <span>Door Scanner Ingestion</span>
            </button>

            <button
              onClick={() => setActiveTab('moderation')}
              style={{
                padding: '12px 20px',
                fontFamily: 'var(--font-metadata)',
                fontSize: '0.825rem',
                fontWeight: activeTab === 'moderation' ? 800 : 500,
                color: activeTab === 'moderation' ? 'var(--gt-acid)' : 'var(--gt-muted)',
                borderBottom: activeTab === 'moderation' ? '2px solid var(--gt-acid)' : '2px solid transparent',
                background: 'transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FileCheck size={14} />
              <span>Review Flagged Notes</span>
              {flaggedNotes.length > 0 && (
                <span style={{ backgroundColor: 'rgba(255, 92, 46, 0.2)', color: '#ff5c2e', fontSize: '0.68rem', padding: '1px 6px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                  {flaggedNotes.length}
                </span>
              )}
            </button>
          </>
        )}
      </div>

      {/* Tab: DJ Deck Track ID Requests & Crowd Telemetry */}
      {activeTab === 'dj_deck' && isDjMode && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 'var(--space-xl)', width: '100%' }} className="notes-grid">
          <div>
            {/* Track ID Inquiries from Attendees */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <div className="case-ref-stamp" style={{ marginBottom: '4px' }}>
                ASYNC CONTRIBUTION SPACE // TRACK ID INQUIRIES ({trackInquiries.length})
              </div>
              <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                Track Identification Inquiries
              </h3>
              <p style={{ color: 'var(--gt-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                Attendees can submit track identification requests linked to particular sessions and timestamps. DJs and curators answer asynchronously when convenient.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {trackInquiries.map(inq => (
                  <div key={inq.id} className="archival-panel-raised" style={{ borderLeft: inq.status === 'answered' ? '3px solid var(--gt-acid)' : '3px solid #ffb830' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="case-ref-stamp">{inq.sessionCode || 'GT SESSION'}</span>
                        {inq.timestampApprox && (
                          <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--gt-cream)', backgroundColor: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '3px' }}>
                            TIMESTAMP: {inq.timestampApprox}
                          </span>
                        )}
                        <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-metadata)', color: inq.status === 'answered' ? 'var(--gt-acid)' : '#ffb830' }}>
                          ● {inq.status === 'answered' ? 'ANSWERED' : 'AWAITING DJ CONTEXT'}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--gt-muted)', fontFamily: 'var(--font-metadata)' }}>
                        BY {inq.submittedBy}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--gt-cream)', lineHeight: 1.5, margin: '8px 0 12px 0' }}>
                      "{inq.description}"
                    </p>

                    {inq.djResponse ? (
                      <div style={{ backgroundColor: 'rgba(4, 229, 57, 0.08)', border: '1px solid rgba(4, 229, 57, 0.25)', borderRadius: '4px', padding: '10px 14px', marginTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--gt-acid)', fontFamily: 'var(--font-metadata)', marginBottom: '4px', fontWeight: 700 }}>
                          <span>{inq.respondedBy || 'Aniko (Resident DJ)'}</span>
                          <span style={{ color: 'var(--gt-muted)', fontSize: '0.64rem' }}>[SIMULATED DEMO RESPONSE]</span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--gt-cream)', margin: 0, lineHeight: 1.45 }}>
                          {inq.djResponse}
                        </p>
                      </div>
                    ) : (
                      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--gt-border)' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            placeholder="Provide track title, unreleased dubplate context, or label..."
                            value={inquiryResponses[inq.id] || ''}
                            onChange={e => setInquiryResponses(prev => ({ ...prev, [inq.id]: e.target.value }))}
                            style={{
                              flex: 1,
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              border: '1px solid rgba(255,255,255,0.15)',
                              borderRadius: '4px',
                              padding: '6px 10px',
                              color: 'var(--gt-cream)',
                              fontSize: '0.8rem',
                              fontFamily: 'var(--font-body)',
                              outline: 'none'
                            }}
                          />
                          <button
                            onClick={() => handleReplyToInquiry(inq.id)}
                            className="btn btn-outline-neon"
                            style={{ fontSize: '0.74rem', padding: '6px 12px', minHeight: '32px' }}
                          >
                            Reply [DEMO]
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* General Content Requests */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <div className="case-ref-stamp" style={{ marginBottom: '4px' }}>
                ARCHIVAL REQUESTS // SET MATERIALS
              </div>
              <h4 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                Materials Requested by Attendees
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {contentRequests.map(req => {
                const reqSession = sessions.find(s => s.id === req.sessionId);
                return (
                  <div key={req.id} className="archival-panel-raised" style={{ borderLeft: '3px solid var(--gt-acid)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className="case-ref-stamp">{reqSession?.sessionCode || 'GT SESSION'}</span>
                      <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--gt-acid)' }}>
                        LOGGED {new Date(req.requestedAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gt-cream)', marginBottom: '4px' }}>
                      Request: {req.materialType.toUpperCase()} {req.artistName && `for ${req.artistName}`}
                    </div>

                    {req.note && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--gt-muted)', lineHeight: 1.45, fontStyle: 'italic' }}>
                        "{req.note}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Resident DJ Telemetry & Set Notes */}
          <div className="terminal-panel" style={{ padding: 'var(--space-lg)' }}>
            <h4 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-sm)', color: 'var(--gt-cream)' }}>
              Set Reception Telemetry
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', fontSize: '0.85rem' }}>
              <div style={{ padding: 'var(--space-sm)', backgroundColor: 'var(--gt-slate)', borderRadius: 'var(--radius-xs)' }}>
                <div style={{ color: 'var(--gt-muted)', fontSize: '0.7rem', fontFamily: 'var(--font-metadata)' }}>RESIDENT DJ</div>
                <div style={{ fontWeight: 700, color: 'var(--gt-cream)', fontSize: '1rem' }}>Aniko</div>
              </div>

              <div style={{ padding: 'var(--space-sm)', backgroundColor: 'var(--gt-slate)', borderRadius: 'var(--radius-xs)' }}>
                <div style={{ color: 'var(--gt-muted)', fontSize: '0.7rem', fontFamily: 'var(--font-metadata)' }}>SONIC ARCHIVE</div>
                <div style={{ color: 'var(--gt-cream)' }}>Afro-house, 3-step, unreleased club bootlegs</div>
              </div>

              <div style={{ padding: 'var(--space-sm)', backgroundColor: 'var(--gt-slate)', borderRadius: 'var(--radius-xs)' }}>
                <div style={{ color: 'var(--gt-muted)', fontSize: '0.7rem', fontFamily: 'var(--font-metadata)' }}>COMMUNITY MENTIONS</div>
                <div style={{ color: 'var(--gt-acid)', fontWeight: 700 }}>Featured in {djMentionsCount} attendee reflections</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Attendance Ingestion (Centered Station) */}
      {activeTab === 'attendance' && !isDjMode && (
        <div className="terminal-panel" style={{ maxWidth: '820px', margin: '0 auto', padding: 'var(--space-2xl)', boxSizing: 'border-box', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-xs)' }}>
            <UserCheck size={20} color="var(--gt-acid)" />
            <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)' }}>
              Door-Scanner Check-in Ingestion Station
            </h3>
          </div>
          <p style={{ color: 'var(--gt-muted)', fontSize: '0.85rem', marginBottom: 'var(--space-lg)' }}>
            Simulate importing door check-in exports from Tix.africa to reconcile claims and mark attendees as "VERIFIED".
          </p>

          {importSuccess ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-xl) 0' }}>
              <Check size={44} color="var(--gt-acid)" style={{ marginBottom: 'var(--space-sm)' }} />
              <h4 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>Check-in Records Reconciled</h4>
              <p style={{ color: 'var(--gt-muted)', fontSize: '0.85rem' }}>
                Your active profile now holds a VERIFIED ATTENDANCE badge for this session in My Sessions.
              </p>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <GTDropdown
                  options={sessionOptions}
                  value={importSessionId}
                  onChange={setImportSessionId}
                  label="TARGET SESSION CASE FILE"
                  width="100%"
                  variant="acid"
                />
              </div>

              {/* Mock Drag & Drop Box */}
              <div
                style={{
                  border: '2px dashed var(--border-accent)',
                  borderRadius: 'var(--radius-xs)',
                  padding: 'var(--space-2xl)',
                  textAlign: 'center',
                  backgroundColor: 'var(--gt-slate)',
                  marginBottom: 'var(--space-lg)',
                  cursor: 'pointer'
                }}
                onClick={handleSimulateImport}
              >
                <Upload size={32} color="var(--gt-acid)" style={{ marginBottom: 'var(--space-sm)' }} />
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gt-cream)' }}>
                  Click to simulate ingest of `gt_door_scans_export.csv`
                </div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-muted)', marginTop: '4px' }}>
                  HASHER: SHA-256 // CRYPTOGRAPHIC VERIFICATION RESOLUTION
                </div>
              </div>

              <button onClick={handleSimulateImport} className="btn btn-primary" style={{ marginBottom: '24px' }}>
                Simulate Ingestion &amp; Reconcile Attendance
              </button>

              {/* 6 Predictable Attendance Demonstration Scenarios */}
              <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px' }}>
                <div style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--gt-acid)', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  PREDICTABLE VERIFICATION DEMO SCENARIOS
                </div>
                <h4 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: 'var(--gt-cream)', marginBottom: '6px' }}>
                  Test How The Platform Evaluates Different Ticket States
                </h4>
                <p style={{ color: 'var(--gt-muted)', fontSize: '0.78rem', marginBottom: '14px' }}>
                  Click "Test This Flow" to observe how the active persona and permissions change based on door scan records.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                  {attendanceScenarios.map(sc => {
                    const isActive = activeScenarioId === sc.id;
                    return (
                      <div
                        key={sc.id}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '4px',
                          border: `1px solid ${isActive ? 'var(--gt-acid)' : 'rgba(255, 255, 255, 0.08)'}`,
                          backgroundColor: isActive ? 'rgba(4, 229, 57, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '10px'
                        }}
                      >
                        <div style={{ flex: 1, minWidth: '240px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isActive ? 'var(--gt-acid)' : 'var(--gt-cream)' }}>
                              {sc.name}
                            </span>
                            <span style={{ fontSize: '0.64rem', fontFamily: 'var(--font-metadata)', color: sc.eligibilityStatus === 'Verified Patient' ? 'var(--gt-acid)' : '#ffb830', backgroundColor: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: '3px' }}>
                              {sc.eligibilityStatus.toUpperCase()}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.76rem', color: 'var(--gt-muted)', margin: '2px 0 0 0' }}>
                            {sc.title} &bull; <strong style={{ color: 'var(--gt-cream)' }}>{sc.doorCheckInSummary}</strong>
                          </p>
                        </div>

                        <button
                          onClick={() => selectAttendanceScenario(sc.id)}
                          className={isActive ? 'btn btn-primary' : 'btn btn-outline-neon'}
                          style={{ fontSize: '0.72rem', padding: '4px 10px', minHeight: '28px' }}
                        >
                          {isActive ? '✓ Active Test State' : 'Test This Flow'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Moderation Desk */}
      {activeTab === 'moderation' && !isDjMode && (
        <div style={{ width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
          {/* Section 1: Pending Community Submissions */}
          <div>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <div className="case-ref-stamp" style={{ marginBottom: '4px' }}>
                COMMUNITY ARCHIVE CURATION // SUBMISSIONS QUEUE ({pendingSubmissions.length})
              </div>
              <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                Pending Community Reflection Submissions
              </h3>
              <p style={{ color: 'var(--gt-muted)', fontSize: '0.85rem' }}>
                Patient reflections submitted for consideration in the collective Group Therapy Community Archive. Curators review submissions before public display.
              </p>
            </div>

            {pendingSubmissions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {pendingSubmissions.map(n => (
                  <div key={n.id} className="notebook-ruled-container" style={{ paddingBottom: 'var(--space-md)' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 20px 12px 64px',
                        borderBottom: '1px solid var(--notebook-line)',
                        backgroundColor: 'rgba(255, 184, 48, 0.08)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="case-ref-stamp">{n.sessionCode || 'CASE REF'}</span>
                        <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.7rem', color: '#ffb830', fontWeight: 800 }}>
                          ● SUBMITTED FOR CURATION
                        </span>
                      </div>

                      <span style={{ fontSize: '0.75rem', color: 'var(--gt-muted)', fontFamily: 'var(--font-metadata)' }}>
                        SUBMITTED BY: {(n.isAnonymousSubmission || n.isAnonymous) ? 'Verified Attendee (Anonymous)' : (n.authorDisplayName || 'Patient')}
                      </span>
                    </div>

                    {n.polaroids && n.polaroids.length > 0 && n.includePolaroidsInSubmission !== false && n.includePolaroids !== false && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '16px 20px', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        {n.polaroids.map((pol, idx) => (
                          <div key={pol.id || idx} className="polaroid-card" style={{ transform: `rotate(${pol.rotation}deg)` }}>
                            <div className="washi-tape-strip washi-tape-top-center"></div>
                            <div className="polaroid-photo-frame">
                              <img src={pol.imageUrl} alt={pol.caption} />
                            </div>
                            <div className="polaroid-caption">
                              {pol.caption}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {n.title && (
                      <div style={{ padding: '14px 20px 10px 68px', borderBottom: '1px solid var(--notebook-line)' }}>
                        <h4 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--gt-cream)', margin: 0 }}>
                          {n.title}
                        </h4>
                      </div>
                    )}

                    <div className="notebook-ruled-display">
                      {n.content}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 'var(--space-sm)',
                        padding: '12px 20px 0 64px',
                        borderTop: '1px solid var(--notebook-line)'
                      }}
                    >
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', minHeight: '32px' }}
                        onClick={() => rejectNote(n.id, 'Returned to private dossier.')}
                      >
                        Decline Submission
                      </button>
                      <button
                        className="btn btn-primary"
                        style={{ fontSize: '0.75rem', minHeight: '32px' }}
                        onClick={() => approveNote(n.id, 'Approved for Group Therapy Community Archive.')}
                      >
                        Approve for Collective Archive
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: 'var(--space-xl)',
                  textAlign: 'center',
                  backgroundColor: 'var(--gt-charcoal)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed var(--gt-border)'
                }}
              >
                <FileCheck size={28} color="var(--gt-acid)" style={{ marginBottom: 'var(--space-xs)' }} />
                <p style={{ color: 'var(--gt-cream)', fontSize: '0.9rem', margin: 0 }}>
                  No pending community submissions in queue.
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Reported Content & Moderation Cases */}
          <div>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <div className="case-ref-stamp" style={{ marginBottom: '4px' }}>
                TRUST & SAFETY // MODERATION CASES ({pendingReports.length})
              </div>
              <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                Reported Content & Community Flags
              </h3>
              <p style={{ color: 'var(--gt-muted)', fontSize: '0.85rem' }}>
                Community reports generate investigatory moderation cases. Curators evaluate the context before removing or restoring content.
              </p>
            </div>

            {pendingReports.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {pendingReports.map(report => {
                  const targetNote = notes.find(n => n.id === report.noteId);
                  return (
                    <div key={report.id} className="archival-panel-raised" style={{ borderLeft: '3px solid #ff5c2e' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="case-ref-stamp" style={{ borderColor: '#ff5c2e', color: '#ff5c2e' }}>
                            REPORT #{report.id.slice(-6)}
                          </span>
                          <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-metadata)', color: '#ff5c2e', fontWeight: 700 }}>
                            CATEGORY: {report.reason.toUpperCase()}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--gt-muted)', fontFamily: 'var(--font-metadata)' }}>
                          REPORTED BY {report.reportedBy} · {new Date(report.reportedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.825rem', color: 'var(--gt-cream)', marginBottom: '8px' }}>
                        <strong>Reason:</strong> {report.reasonText}
                      </div>

                      {report.details && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--gt-muted)', fontStyle: 'italic', marginBottom: '10px' }}>
                          "{report.details}"
                        </p>
                      )}

                      <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '10px 14px', marginBottom: '12px' }}>
                        <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-muted)', marginBottom: '4px' }}>
                          REPORTED CONTENT SNIPPET:
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--gt-cream)', fontStyle: 'italic' }}>
                          "{report.noteSnippet}"
                        </div>
                        {targetNote && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--gt-acid)', marginTop: '4px' }}>
                            Author: {targetNote.authorDisplayName || 'Attendee'} · Session: {targetNote.sessionCode}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                          onClick={() => resolveReport(report.id, 'dismiss', 'No violation found. Reflection kept active in collective archive.')}
                          className="btn btn-primary"
                          style={{ fontSize: '0.74rem', minHeight: '32px' }}
                        >
                          Dismiss Flag (Keep Live)
                        </button>
                        <button
                          onClick={() => resolveReport(report.id, 'remove', 'Content violates community guidelines and was removed from collective view.')}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.74rem', minHeight: '32px', color: '#ff5c2e', borderColor: 'rgba(255, 92, 46, 0.4)' }}
                        >
                          Remove Violating Content
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  padding: 'var(--space-xl)',
                  textAlign: 'center',
                  backgroundColor: 'var(--gt-charcoal)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed var(--gt-border)'
                }}
              >
                <Check size={28} color="var(--gt-acid)" style={{ marginBottom: 'var(--space-xs)' }} />
                <p style={{ color: 'var(--gt-cream)', fontSize: '0.9rem', margin: 0 }}>
                  Moderation queue clear. No pending community reports.
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Moderation Audit Log */}
          {resolvedReports.length > 0 && (
            <div>
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <div className="case-ref-stamp" style={{ marginBottom: '4px' }}>
                  AUDIT TRAIL // PREVIOUS DECISIONS ({resolvedReports.length})
                </div>
                <h4 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-display)' }}>
                  Moderation History & Audit Trail
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {resolvedReports.map(res => (
                  <div key={res.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-metadata)', color: res.status === 'dismissed' ? 'var(--gt-acid)' : '#ff5c2e', fontWeight: 700, marginRight: '8px' }}>
                        [{res.status === 'dismissed' ? 'FLAG DISMISSED' : 'CONTENT REMOVED'}]
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--gt-cream)' }}>
                        {res.noteTitle || res.noteSnippet.slice(0, 40)}
                      </span>
                      {res.resolutionNotes && (
                        <div style={{ fontSize: '0.74rem', color: 'var(--gt-muted)', marginTop: '2px' }}>
                          Note: {res.resolutionNotes}
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--gt-muted)', fontFamily: 'var(--font-metadata)' }}>
                      RESOLVED BY {res.resolvedBy}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

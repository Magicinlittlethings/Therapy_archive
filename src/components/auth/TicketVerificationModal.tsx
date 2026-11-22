import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShieldCheck,
  X,
  Mail,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Ticket,
  ArrowRight
} from 'lucide-react';
import { AttendanceScenario } from '../../types';

export const TicketVerificationModal: React.FC = () => {
  const {
    isVerifyModalOpen,
    closeVerifyModal,
    attendanceScenarios,
    activeScenarioId,
    selectAttendanceScenario,
    simulateEmailVerification,
    persona,
    setPersona
  } = useStore();

  const [inputEmail, setInputEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'scenarios' | 'manual'>('scenarios');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'idle' | 'matched' | 'no_match' | 'no_scan';
    scenario?: AttendanceScenario;
    message?: string;
  }>({ status: 'idle' });

  if (!isVerifyModalOpen) return null;

  const handleSelectScenario = (scenario: AttendanceScenario) => {
    selectAttendanceScenario(scenario.id);
    setInputEmail(scenario.email);
    setVerificationResult({
      status: scenario.eligibilityStatus === 'Verified Patient' ? 'matched' : 'no_scan',
      scenario,
      message: `${scenario.doorCheckInSummary}. ${scenario.explanation}`
    });
  };

  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim()) return;

    const res = simulateEmailVerification(inputEmail.trim());
    if (res.success) {
      const match = attendanceScenarios.find(s => s.email.toLowerCase() === inputEmail.trim().toLowerCase());
      setVerificationResult({
        status: res.persona === 'patient' ? 'matched' : 'no_scan',
        scenario: match,
        message: res.message
      });
    } else {
      setVerificationResult({
        status: 'no_match',
        message: `No Group Therapy door scan or ticket record found for "${inputEmail}". You may enter another email address (e.g. work or group purchaser email) or submit an archival attendance claim.`
      });
    }
  };

  const handleEnterDossier = () => {
    closeVerifyModal();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={closeVerifyModal}
    >
      <div
        className="archival-panel-raised"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#0a0d0a',
          border: '1px solid rgba(4, 229, 57, 0.35)',
          borderRadius: '8px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(4, 229, 57, 0.15)',
          padding: 0
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(4, 229, 57, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: 'rgba(4, 229, 57, 0.15)',
                border: '1px solid var(--gt-acid)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Ticket size={16} color="var(--gt-acid)" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.68rem', color: 'var(--gt-acid)', letterSpacing: '0.08em' }}>
                DOOR SCAN RECONCILIATION &bull; TIX.AFRICA GATEWAY
              </div>
              <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-display)', color: 'var(--gt-cream)', margin: 0 }}>
                Attendance &amp; Ticket Verification
              </h3>
            </div>
          </div>

          <button
            onClick={closeVerifyModal}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--gt-muted)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Demo Notice */}
        <div
          style={{
            padding: '10px 20px',
            backgroundColor: 'rgba(255, 184, 48, 0.08)',
            borderBottom: '1px solid rgba(255, 184, 48, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            color: '#ffb830',
            fontFamily: 'var(--font-metadata)'
          }}
        >
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <span>
            <strong>DEMO SIMULATION:</strong> Physical door check-in scan is required to qualify as a Verified Patient. Choose a scenario below to observe how the platform reconciles attendance.
          </span>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button
              onClick={() => setActiveTab('scenarios')}
              style={{
                padding: '8px 16px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-metadata)',
                borderRadius: '4px',
                border: '1px solid',
                borderColor: activeTab === 'scenarios' ? 'var(--gt-acid)' : 'rgba(255,255,255,0.1)',
                backgroundColor: activeTab === 'scenarios' ? 'rgba(4, 229, 57, 0.12)' : 'transparent',
                color: activeTab === 'scenarios' ? 'var(--gt-acid)' : 'var(--gt-cream)',
                cursor: 'pointer'
              }}
            >
              1. Select Demonstration Scenario (6 Cases)
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              style={{
                padding: '8px 16px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-metadata)',
                borderRadius: '4px',
                border: '1px solid',
                borderColor: activeTab === 'manual' ? 'var(--gt-acid)' : 'rgba(255,255,255,0.1)',
                backgroundColor: activeTab === 'manual' ? 'rgba(4, 229, 57, 0.12)' : 'transparent',
                color: activeTab === 'manual' ? 'var(--gt-acid)' : 'var(--gt-cream)',
                cursor: 'pointer'
              }}
            >
              2. Manual Email Input
            </button>
          </div>

          {activeTab === 'scenarios' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--gt-muted)', marginBottom: '4px' }}>
                Select a simulated ticketing scenario to immediately test verification outcomes:
              </div>

              {attendanceScenarios.map(sc => {
                const isSelected = activeScenarioId === sc.id;
                const isPatient = sc.eligibilityStatus === 'Verified Patient';
                return (
                  <div
                    key={sc.id}
                    onClick={() => handleSelectScenario(sc)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '6px',
                      border: isSelected ? '1px solid var(--gt-acid)' : '1px solid rgba(255, 255, 255, 0.08)',
                      backgroundColor: isSelected ? 'rgba(4, 229, 57, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? 'var(--gt-acid)' : 'var(--gt-cream)' }}>
                        {sc.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-metadata)',
                          padding: '2px 8px',
                          borderRadius: '3px',
                          backgroundColor: isPatient ? 'rgba(4, 229, 57, 0.15)' : 'rgba(255, 184, 48, 0.15)',
                          color: isPatient ? 'var(--gt-acid)' : '#ffb830',
                          border: `1px solid ${isPatient ? 'rgba(4, 229, 57, 0.3)' : 'rgba(255, 184, 48, 0.3)'}`
                        }}
                      >
                        {sc.eligibilityStatus.toUpperCase()}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.78rem', color: 'var(--gt-muted)', margin: '4px 0 6px 0', lineHeight: 1.4 }}>
                      {sc.title} &bull; {sc.doorCheckInSummary}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-metadata)', color: 'rgba(255, 255, 255, 0.4)' }}>
                      <span>Email: {sc.email}</span>
                      <span style={{ color: isPatient ? 'var(--gt-acid)' : '#ffb830' }}>
                        Outcome: {sc.persona.toUpperCase()} PRIVILEGES
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              <form onSubmit={handleManualVerify}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-muted)', marginBottom: '6px' }}>
                    TICKET PURCHASE EMAIL OR CLAIM PASS ID
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Mail size={16} color="var(--gt-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                      <input
                        type="email"
                        value={inputEmail}
                        onChange={e => setInputEmail(e.target.value)}
                        placeholder="e.g. lami@grouptherapy.live, chidi@grouptherapy.live, alex@grouptherapy.live"
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 36px',
                          backgroundColor: '#050705',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '4px',
                          color: 'var(--gt-cream)',
                          fontSize: '0.85rem',
                          fontFamily: 'var(--font-body)',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0 18px', fontSize: '0.8rem' }}>
                      Verify
                    </button>
                  </div>
                </div>
              </form>

              <div style={{ padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--gt-muted)', lineHeight: 1.4 }}>
                <strong>Test Accounts in Seed Data:</strong>
                <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
                  <li><code>lami@grouptherapy.live</code> (Primary purchaser, door scanned &bull; Patient)</li>
                  <li><code>chidi@grouptherapy.live</code> (Group purchaser, door scanned &bull; Patient)</li>
                  <li><code>alex@grouptherapy.live</code> (Purchaser no-show, zero door scan &bull; Follower)</li>
                  <li><code>other@gmail.com</code> (Unrecognized email &bull; Options shown)</li>
                </ul>
              </div>
            </div>
          )}

          {/* Verification Outcome Card */}
          {verificationResult.status !== 'idle' && (
            <div
              style={{
                marginTop: '18px',
                padding: '16px',
                borderRadius: '6px',
                backgroundColor:
                  verificationResult.status === 'matched'
                    ? 'rgba(4, 229, 57, 0.08)'
                    : verificationResult.status === 'no_scan'
                    ? 'rgba(255, 184, 48, 0.08)'
                    : 'rgba(255, 92, 46, 0.08)',
                border: `1px solid ${
                  verificationResult.status === 'matched'
                    ? 'rgba(4, 229, 57, 0.35)'
                    : verificationResult.status === 'no_scan'
                    ? 'rgba(255, 184, 48, 0.35)'
                    : 'rgba(255, 92, 46, 0.35)'
                }`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                {verificationResult.status === 'matched' ? (
                  <CheckCircle2 size={20} color="var(--gt-acid)" style={{ flexShrink: 0 }} />
                ) : verificationResult.status === 'no_scan' ? (
                  <AlertCircle size={20} color="#ffb830" style={{ flexShrink: 0 }} />
                ) : (
                  <HelpCircle size={20} color="#ff5c2e" style={{ flexShrink: 0 }} />
                )}

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gt-cream)', marginBottom: '4px' }}>
                    {verificationResult.status === 'matched' && 'Physical Attendance Verified: Welcome, Patient'}
                    {verificationResult.status === 'no_scan' && 'Ticket Record Found — Zero Door Scan Detected'}
                    {verificationResult.status === 'no_match' && 'No Door Scan Record Found'}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--gt-muted)', margin: '0 0 12px 0', lineHeight: 1.45 }}>
                    {verificationResult.message}
                  </p>

                  {verificationResult.status === 'matched' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={handleEnterDossier}
                        className="btn btn-primary"
                        style={{ fontSize: '0.78rem', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <ShieldCheck size={14} />
                        <span>Enter Personal Dossier &amp; Notes</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}

                  {verificationResult.status === 'no_scan' && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => {
                          setPersona('follower');
                          closeVerifyModal();
                        }}
                        className="btn btn-outline-neon"
                        style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                      >
                        Continue as Community Follower
                      </button>
                      <button
                        onClick={() => {
                          alert('Archival Attendance Claim Submitted: Our archival curators will cross-reference paper door logs and photos for verification.');
                          closeVerifyModal();
                        }}
                        style={{
                          fontSize: '0.75rem',
                          padding: '6px 12px',
                          background: 'transparent',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: 'var(--gt-cream)',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Submit Archival Attendance Claim
                      </button>
                    </div>
                  )}

                  {verificationResult.status === 'no_match' && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setActiveTab('manual')}
                        className="btn btn-outline-neon"
                        style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                      >
                        Try Alternate Email
                      </button>
                      <button
                        onClick={() => {
                          alert('Archival Claim Gateway: If you purchased cash door tickets or attended before digital ticketing, submit your session proof to archive@grouptherapy.live.');
                          closeVerifyModal();
                        }}
                        style={{
                          fontSize: '0.75rem',
                          padding: '6px 12px',
                          background: 'transparent',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: 'var(--gt-cream)',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Submit Historical Entry Claim
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-metadata)',
            color: 'var(--gt-muted)'
          }}
        >
          <span>Current Active Demo Role: <strong style={{ color: 'var(--gt-acid)' }}>{persona.toUpperCase()}</strong></span>
          <button
            onClick={closeVerifyModal}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--gt-muted)',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.72rem'
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

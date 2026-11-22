import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { REFLECTION_PROMPTS, POLAROID_PRESETS, PolaroidPreset } from '../data/seedData';
import { NoteType, AttachedPolaroid, NoteVisibility, TherapyNote } from '../types';
import { GTDropdown, DropdownOption } from '../components/common/GTDropdown';
import {
  Lock,
  Sparkles,
  Save,
  Trash2,
  Send,
  Check,
  ArrowLeft,
  User,
  Disc3,
  AlertTriangle,
  Flame,
  HelpCircle,
  Camera,
  Plus,
  Image as ImageIcon,
  Pin,
  Globe,
  Eye,
  ShieldAlert,
  Headphones
} from 'lucide-react';

export const TherapyNotesPage: React.FC = () => {
  const { sessionId: paramSessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const {
    sessions,
    notes,
    materials,
    saveNote,
    deleteNote,
    submitNoteForModeration,
    submitNoteToCommunity,
    withdrawCommunitySubmission,
    persona,
    setPersona,
    attachPolaroidToNote,
    removePolaroidFromNote,
    getAttendance
  } = useStore();

  const [activeSessionId, setActiveSessionId] = useState<string>(paramSessionId || 'gt-xii');
  const session = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const attendance = getAttendance(session.id);
  const isVerifiedAttended = persona === 'dj' || attendance === 'attended';

  // Notes written by the current active persona for this session
  // Patient only sees their own reflections in their notebook dossier; community notes appear in notes.html
  const isMyAuthoredNote = (n: TherapyNote) => {
    if (persona === 'patient') {
      return n.authorDisplayName === 'Lami Adeyemi' || !n.authorDisplayName || n.authorDisplayName === 'Patient' || n.authorDisplayName === 'Attendee';
    }
    if (persona === 'dj') {
      return n.authorDisplayName?.includes('Aniko') || n.noteType === 'dj_session_note';
    }
    return true;
  };

  const sessionNotes = notes.filter(n => n.sessionId === session.id && isMyAuthoredNote(n));

  // Active Note State
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    sessionNotes.length > 0 ? sessionNotes[0].id : null
  );

  const [noteType, setNoteType] = useState<NoteType>('patient_note');
  const [noteVisibility, setNoteVisibility] = useState<NoteVisibility>('private');
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [selectedArtist, setSelectedArtist] = useState<string>(
    session.artists.length > 0 ? session.artists[0].name : 'Aniko'
  );
  const [content, setContent] = useState<string>('');
  const [activePrompt, setActivePrompt] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string>('Saved locally');

  // Polaroid Attachments State
  const [polaroidModalOpen, setPolaroidModalOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PolaroidPreset>(POLAROID_PRESETS[0]);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [polaroidCaption, setPolaroidCaption] = useState<string>(POLAROID_PRESETS[0].defaultCaption);
  const [polaroidPosition, setPolaroidPosition] = useState<AttachedPolaroid['position']>('top-right');

  // Moderation Submission Modal State
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [isAnonymousSubmission, setIsAnonymousSubmission] = useState(false);
  const [includePolaroidsInSubmission, setIncludePolaroidsInSubmission] = useState(true);

  // Load selected note into editor
  useEffect(() => {
    if (selectedNoteId) {
      const existing = notes.find(n => n.id === selectedNoteId);
      if (existing) {
        setNoteType(existing.noteType);
        setNoteVisibility(existing.visibility || 'private');
        setNoteTitle(existing.title || '');
        setSelectedArtist(existing.artistName || (session.artists[0]?.name || 'Aniko'));
        setContent(existing.content);
        setActivePrompt(existing.promptUsed || '');
        setSaveStatus(`Loaded (${new Date(existing.updatedAt).toLocaleTimeString()})`);
      }
    } else {
      setNoteType('patient_note');
      setNoteVisibility('private');
      setNoteTitle('');
      setSelectedArtist(session.artists[0]?.name || 'Aniko');
      setContent('');
      setActivePrompt('');
      setSaveStatus('New clean reflection');
    }
  }, [selectedNoteId, activeSessionId, notes, session]);

  // Handle session change
  const handleSessionChange = (newSessionId: string) => {
    setActiveSessionId(newSessionId);
    const newSessionNotes = notes.filter(n => n.sessionId === newSessionId && isMyAuthoredNote(n));
    setSelectedNoteId(newSessionNotes.length > 0 ? newSessionNotes[0].id : null);
    navigate(`/my-sessions/${newSessionId}/notes`);
  };

  // Autosave
  const persistNote = (
    newText: string,
    newTitle: string,
    newType: NoteType,
    newArtist?: string,
    prompt?: string,
    visibilityOverride?: NoteVisibility
  ) => {
    const existing = notes.find(n => n.id === selectedNoteId);
    const vis = visibilityOverride !== undefined ? visibilityOverride : noteVisibility;
    const noteData = {
      id: selectedNoteId || undefined,
      sessionId: session.id,
      sessionCode: session.sessionCode,
      sessionTitle: session.title,
      artistName: newType === 'dj_session_note' ? (newArtist || selectedArtist) : undefined,
      noteType: newType,
      title: newTitle || undefined,
      content: newText,
      promptUsed: prompt !== undefined ? prompt : activePrompt,
      visibility: vis,
      moderationStatus: vis === 'public_submission' ? 'approved' : (existing?.moderationStatus || 'none'),
      polaroids: existing?.polaroids || [],
      isDraft: true
    };

    const savedId = saveNote(noteData);
    if (!selectedNoteId) {
      setSelectedNoteId(savedId);
    }
    setSaveStatus(`Saved locally at ${new Date().toLocaleTimeString()}`);
  };

  const handleVisibilityChange = (newVis: NoteVisibility) => {
    setNoteVisibility(newVis);
    persistNote(content, noteTitle, noteType, selectedArtist, activePrompt, newVis);
  };

  const handleContentChange = (newText: string) => {
    setContent(newText);
    setSaveStatus('Saving draft...');
    persistNote(newText, noteTitle, noteType, selectedArtist);
  };

  const handleTitleChange = (newTitle: string) => {
    setNoteTitle(newTitle);
    persistNote(content, newTitle, noteType, selectedArtist);
  };

  const handleCreateNew = () => {
    setSelectedNoteId(null);
    setNoteTitle('');
    setContent('');
    setActivePrompt('');
    setNoteType('patient_note');
    setNoteVisibility('private');
    setSaveStatus('New clean reflection');
  };

  const handleDelete = () => {
    if (selectedNoteId && confirm('Permanently discard this reflection?')) {
      deleteNote(selectedNoteId);
      setSelectedNoteId(null);
      setNoteTitle('');
      setContent('');
      setActivePrompt('');
    }
  };

  const handleApplyPrompt = (prompt: string) => {
    setActivePrompt(prompt);
    if (!content.trim()) {
      const initial = `[Prompt: ${prompt}]\n\n`;
      setContent(initial);
      persistNote(initial, noteTitle, noteType, selectedArtist, prompt);
    }
  };

  const handleInsertTemplate = (type: 'qa' | 'aniko' | 'crowd') => {
    let templateText = '';
    let templateTitle = '';
    let tType: NoteType = 'patient_note';

    if (type === 'qa') {
      templateTitle = 'Dusk Intentions vs. 06:15 AM Reality';
      templateText = `[DUSK INTENTIONS // Before stepping into the room]
- What tempo will anchor the night?
- Will my energy last until the morning house lights?
- Which unexpected transition will stick with me?
- How will the sub-bass feel in the concrete?
I'll be back with daybreak answers...

---
[DAWN REALITY // Written on the ride home]
Back with answers:
1. 
2. 
3. 
4. `;
    } else if (type === 'aniko') {
      tType = 'dj_session_note';
      templateTitle = 'The 4:00 AM frequency shift behind the booth';
      templateText = `Around 3:45 AM, Aniko pulled the high-end down and locked the room into a deep, syncopated 3-step rhythm.

No frantic buildups, just pure command over the floor. The moment the sub-bass rolled back in...`;
    } else if (type === 'crowd') {
      templateTitle = 'Floor chemistry & respecting the perimeter';
      templateText = `Midway through the set near the left monitor stack, the floor grew dense.

The percussions were heavy. Realizing someone in front of me needed space to dance, I took three paces back to protect their perimeter. The space instantly opened up. Respect the room, always.`;
    }

    setNoteType(tType);
    setNoteTitle(templateTitle);
    setContent(templateText);
    persistNote(templateText, templateTitle, tType, selectedArtist);
  };

  const handleAttachPolaroid = () => {
    if (!selectedNoteId) {
      // Create draft note first
      const newId = saveNote({
        sessionId: session.id,
        sessionCode: session.sessionCode,
        sessionTitle: session.title,
        noteType,
        title: noteTitle || 'Untitled Therapy Note',
        content,
        visibility: 'private',
        isDraft: true
      });
      setSelectedNoteId(newId);
    }

    const noteIdToUse = selectedNoteId || `note-${Date.now()}`;
    const newPolaroid: AttachedPolaroid = {
      id: `pol-${Date.now()}`,
      imageUrl: customImageUrl.trim() || selectedPreset.imageUrl,
      caption: polaroidCaption.trim() || selectedPreset.defaultCaption,
      position: polaroidPosition,
      rotation: Math.round((Math.random() * 5 - 2.5) * 10) / 10 // between -2.5 and +2.5 deg
    };

    attachPolaroidToNote(noteIdToUse, newPolaroid);
    setPolaroidModalOpen(false);
    setCustomImageUrl('');
  };

  const handleConfirmSubmission = () => {
    if (!selectedNoteId) return;
    submitNoteToCommunity(selectedNoteId, {
      isAnonymous: isAnonymousSubmission,
      includePolaroids: includePolaroidsInSubmission
    });
    setSubmissionSuccess(true);
    setTimeout(() => {
      setSubmissionSuccess(false);
      setSubmissionModalOpen(false);
      setConsentChecked(false);
    }, 1800);
  };

  const activeNote = notes.find(n => n.id === selectedNoteId);

  // Visitor Access Lock
  if (persona === 'visitor') {
    return (
      <div className="container" style={{ padding: 'var(--space-3xl) var(--space-md)', textAlign: 'center' }}>
        <div className="archival-panel-raised" style={{ maxWidth: '620px', margin: '0 auto', padding: 'var(--space-2xl)' }}>
          <Lock size={44} color="var(--gt-acid)" style={{ marginBottom: 'var(--space-sm)' }} />
          <div className="case-ref-stamp" style={{ marginBottom: '8px' }}>
            CONFIDENTIAL ENCLAVE // PUBLIC ACCESS RESTRICTED
          </div>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-xs)' }}>
            Therapy Notes Enclave Locked
          </h2>
          <p style={{ color: 'var(--gt-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 'var(--space-xl)' }}>
            You are exploring as a <strong>Public Visitor</strong>. Therapy Notes are intimate, encrypted personal reflections tied to patient accounts and attendance records. Switch your role using the dropdown at top or the quick buttons below to read or write reflections.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            <button onClick={() => setPersona('patient')} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
              Switch to Patient
            </button>
            <Link to="/sessions" className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>
              Browse Collective Archive
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Session options for GTDropdown
  const sessionOptions: DropdownOption[] = sessions.map(s => {
    const isAtt = getAttendance(s.id) === 'attended';
    return {
      value: s.id,
      label: s.sessionCode ? `${s.sessionCode}: ${s.title}` : s.title,
      badge: isAtt ? 'VERIFIED' : 'PUBLIC RECORD',
      badgeColor: isAtt ? 'var(--gt-acid)' : 'var(--gt-muted)'
    };
  });

  // Artist options for GTDropdown
  const artistOptions: DropdownOption[] = session.artists.map(a => ({
    value: a.name,
    label: a.name,
    badge: a.role || 'DJ'
  }));

  const attachedPolaroids = activeNote?.polaroids || [];

  return (
    <div style={{ padding: '28px 32px 80px', maxWidth: '1400px', margin: '0 auto', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      {/* OS Notes App Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-md)',
          paddingBottom: '12px',
          marginBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link
            to={`/sessions/${session.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-metadata)',
              color: 'var(--gt-muted)',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              height: '36px',
              boxSizing: 'border-box'
            }}
          >
            <ArrowLeft size={13} />
            <span>{session.title.toUpperCase()}</span>
          </Link>

          {/* Session Selector (Using Theme-Compliant GTDropdown with clean inline height) */}
          <GTDropdown
            options={sessionOptions}
            value={activeSessionId}
            onChange={handleSessionChange}
            width={340}
            variant="acid"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleCreateNew}
            className="btn btn-outline-neon"
            style={{ padding: '6px 14px', fontSize: '0.75rem', height: '36px', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center' }}
          >
            + New Note
          </button>
        </div>
      </div>



      {/* Editor Layout: Left Column (Saved Notes / Jump to Verified) + Right Column (Ruled Notebook or Public Records) */}
      <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: 'var(--space-lg)' }} className="notes-grid">
        {/* Left Column: Note Dossier Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {isVerifiedAttended ? (
            <div className="archival-panel" style={{ padding: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--gt-acid)', fontWeight: 800 }}>
                  MY REFLECTIONS ({sessionNotes.length})
                </span>
                <button
                  onClick={handleCreateNew}
                  className="btn btn-outline-neon"
                  style={{ padding: '3px 8px', fontSize: '0.7rem', minHeight: '28px' }}
                >
                  + New Note
                </button>
              </div>

              {sessionNotes.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sessionNotes.map(n => {
                    const isSelected = selectedNoteId === n.id;
                    const hasPolaroids = n.polaroids && n.polaroids.length > 0;
                    const isPublic = n.visibility === 'public_submission' || n.moderationStatus === 'approved';
                    return (
                      <div
                        key={n.id}
                        onClick={() => setSelectedNoteId(n.id)}
                        style={{
                          padding: '12px',
                          backgroundColor: isSelected ? 'var(--gt-elevated)' : 'var(--gt-slate)',
                          border: `1px solid ${isSelected ? 'var(--gt-acid)' : 'var(--border-subtle)'}`,
                          borderRadius: 'var(--radius-xs)',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                          <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-metadata)', color: isSelected ? 'var(--gt-acid)' : 'var(--gt-muted)', fontWeight: 700 }}>
                            {n.noteType === 'patient_note' ? 'PATIENT NOTE' : `SET // ${n.artistName || 'DJ'}`}
                          </span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {hasPolaroids && (
                              <span title="Contains polaroids" style={{ color: 'var(--gt-acid)', display: 'flex' }}>
                                <Camera size={11} />
                              </span>
                            )}
                            <span
                              style={{
                                fontSize: '0.62rem',
                                fontFamily: 'var(--font-metadata)',
                                padding: '1px 5px',
                                borderRadius: '3px',
                                backgroundColor: isPublic ? 'rgba(4, 229, 57, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                                color: isPublic ? 'var(--gt-acid)' : 'var(--gt-muted)',
                                border: `1px solid ${isPublic ? 'rgba(4, 229, 57, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`
                              }}
                            >
                              {isPublic ? 'PUBLIC' : 'PRIVATE'}
                            </span>
                          </div>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--gt-cream)', marginBottom: '3px' }}>
                          {n.title || (n.noteType === 'patient_note' ? 'Session Reflection' : `${n.artistName} Set Reflection`)}
                        </div>
                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--gt-muted)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {n.content || '(Empty reflection)'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: 'var(--gt-muted)', fontSize: '0.8rem', fontStyle: 'italic', padding: 'var(--space-sm) 0' }}>
                  No notes for this session yet. Begin writing below.
                </p>
              )}
            </div>
          ) : (
            /* Left Panel for Unattended Session */
            <div className="archival-panel" style={{ padding: 'var(--space-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <ShieldAlert size={14} color="var(--gt-muted)" />
                <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--gt-muted)', fontWeight: 800 }}>
                  UNATTENDED SESSION
                </span>
              </div>
              <p style={{ color: 'var(--gt-muted)', fontSize: '0.78rem', lineHeight: 1.5, marginBottom: '16px' }}>
                You did not attend this gathering. Door-verified attendance is required to author private or public therapy notes.
              </p>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-acid)', fontWeight: 700, marginBottom: '8px' }}>
                  YOUR VERIFIED SESSIONS:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {sessions.filter(s => getAttendance(s.id) === 'attended').map(attS => (
                    <button
                      key={attS.id}
                      onClick={() => handleSessionChange(attS.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        backgroundColor: 'rgba(4, 229, 57, 0.06)',
                        border: '1px solid rgba(4, 229, 57, 0.25)',
                        borderRadius: '4px',
                        color: 'var(--gt-cream)',
                        cursor: 'pointer',
                        fontSize: '0.76rem',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{attS.sessionCode || attS.title}</span>
                      <span style={{ color: 'var(--gt-acid)', fontSize: '0.64rem', fontFamily: 'var(--font-metadata)' }}>VERIFIED</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Notes Info Box */}
          <div
            style={{
              backgroundColor: 'rgba(4, 229, 57, 0.04)',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-xs)',
              padding: 'var(--space-md)',
              fontSize: '0.8rem',
              color: 'var(--gt-muted)',
              lineHeight: 1.5
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gt-acid)', fontWeight: 800, marginBottom: '4px', fontFamily: 'var(--font-metadata)' }}>
              <Lock size={14} />
              <span>PRIVATE OR PUBLIC NOTES</span>
            </div>
            For sessions you attended, choose <strong>Private</strong> to keep notes in your personal device dossier, or <strong>Public</strong> to share on the community case file wall.
          </div>
        </div>

        {/* Right Column: Ruled Lined Notebook (Verified) OR Public Records Enclave (Unattended) */}
        {isVerifiedAttended ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {/* Note Type & Visibility Toolbar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 'var(--space-md)',
                backgroundColor: '#0a0b0a',
                padding: 'var(--space-sm) var(--space-md)',
                border: '1px solid var(--gt-border)',
                borderRadius: 'var(--radius-xs)'
              }}
            >
              {/* Note Type Switcher */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    setNoteType('patient_note');
                    persistNote(content, noteTitle, 'patient_note', selectedArtist);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 12px',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-metadata)',
                    backgroundColor: noteType === 'patient_note' ? 'var(--gt-acid)' : 'rgba(255, 255, 255, 0.04)',
                    color: noteType === 'patient_note' ? '#030303' : 'var(--gt-muted)',
                    border: `1px solid ${noteType === 'patient_note' ? 'var(--gt-acid)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-xs)',
                    cursor: 'pointer',
                    fontWeight: noteType === 'patient_note' ? 800 : 500
                  }}
                >
                  <User size={13} />
                  <span>Patient Note</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNoteType('dj_session_note');
                    persistNote(content, noteTitle, 'dj_session_note', selectedArtist);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 12px',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-metadata)',
                    backgroundColor: noteType === 'dj_session_note' ? 'var(--gt-acid)' : 'rgba(255, 255, 255, 0.04)',
                    color: noteType === 'dj_session_note' ? '#030303' : 'var(--gt-muted)',
                    border: `1px solid ${noteType === 'dj_session_note' ? 'var(--gt-acid)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-xs)',
                    cursor: 'pointer',
                    fontWeight: noteType === 'dj_session_note' ? 800 : 500
                  }}
                >
                  <Disc3 size={13} />
                  <span>DJ Set Review</span>
                </button>
              </div>

              {/* Resident Artist Selector (if DJ Set Review) */}
              {noteType === 'dj_session_note' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-muted)' }}>
                    RESIDENT:
                  </span>
                  <GTDropdown
                    options={artistOptions}
                    value={selectedArtist}
                    onChange={newArtist => {
                      setSelectedArtist(newArtist);
                      persistNote(content, noteTitle, noteType, newArtist);
                    }}
                    variant="subtle"
                    width={180}
                  />
                </div>
              )}

              {/* Attach Polaroid Button */}
              <button
                type="button"
                onClick={() => setPolaroidModalOpen(true)}
                className="btn btn-outline-neon"
                style={{ fontSize: '0.75rem', padding: '6px 12px', gap: '6px' }}
              >
                <Camera size={14} />
                <span>+ Attach Photo ({attachedPolaroids.length})</span>
              </button>
            </div>

            {/* Note Visibility Selector & Status Strip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
                padding: '10px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-xs)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-muted)', fontWeight: 600 }}>
                  NOTE VISIBILITY:
                </span>
                <div style={{ display: 'flex', backgroundColor: '#050705', padding: '2px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                  <button
                    type="button"
                    onClick={() => handleVisibilityChange('private')}
                    style={{
                      padding: '5px 12px',
                      fontSize: '0.75rem',
                      borderRadius: '3px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      backgroundColor: noteVisibility === 'private' ? 'rgba(255, 255, 255, 0.16)' : 'transparent',
                      color: noteVisibility === 'private' ? 'var(--gt-cream)' : 'var(--gt-muted)'
                    }}
                  >
                    <Lock size={12} />
                    <span>Private Note</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVisibilityChange('public_submission')}
                    style={{
                      padding: '5px 12px',
                      fontSize: '0.75rem',
                      borderRadius: '3px',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      backgroundColor: noteVisibility === 'public_submission' ? 'rgba(4, 229, 57, 0.2)' : 'transparent',
                      color: noteVisibility === 'public_submission' ? 'var(--gt-acid)' : 'var(--gt-muted)'
                    }}
                  >
                    <Globe size={12} />
                    <span>Public Note</span>
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-metadata)', color: noteVisibility === 'private' ? 'var(--gt-muted)' : 'var(--gt-acid)' }}>
                {noteVisibility === 'private'
                  ? '// Stored locally in your patient dossier'
                  : '// Published to community feed & session case file'}
              </div>
            </div>

            {/* Note Title Input */}
            <div>
              <input
                type="text"
                value={noteTitle}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="Title this reflection (e.g. The 4:00 AM frequency shift behind the booth)..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'var(--gt-charcoal)',
                  border: '1px solid var(--gt-border)',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--gt-cream)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  outline: 'none'
                }}
              />
            </div>

            {/* THE AUTHENTIC LINED NOTEBOOK CONTAINER */}
            <div className="notebook-ruled-container">
              {/* Therapy Notes Header Bar inside the Notebook */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                  padding: '10px 16px 10px 62px',
                  borderBottom: '1px solid var(--notebook-line)',
                  backgroundColor: 'rgba(0, 0, 0, 0.45)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-metadata)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gt-cream)' }}>
                  <span style={{ color: 'var(--gt-acid)', fontWeight: 700 }}>THERAPY NOTE //</span>
                  <span style={{ color: 'var(--gt-muted)', fontSize: '0.72rem' }}>
                    {attachedPolaroids.length === 0
                      ? 'Attach personal reflections and photos onto this note'
                      : `${attachedPolaroids.length} Photo${attachedPolaroids.length > 1 ? 's' : ''} attached to this page`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setPolaroidModalOpen(true)}
                  className="btn btn-outline-neon"
                  style={{ fontSize: '0.72rem', padding: '4px 10px', minHeight: '28px', gap: '5px' }}
                >
                  <Camera size={13} />
                  <span>+ Attach Photo</span>
                </button>
              </div>

              {/* Display Attached Polaroids as real taped photos on the notebook page */}
              {attachedPolaroids.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    padding: '20px 24px 16px 24px',
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    borderBottom: '1px dashed var(--notebook-line)',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start'
                  }}
                >
                  {attachedPolaroids.map((pol, idx) => (
                    <div
                      key={pol.id || idx}
                      className="polaroid-card"
                      style={{
                        transform: `rotate(${pol.rotation}deg)`,
                        position: 'relative'
                      }}
                    >
                      <div className="washi-tape-strip washi-tape-top-center"></div>
                      <div className="polaroid-photo-frame">
                        <img src={pol.imageUrl} alt={pol.caption} />
                      </div>
                      <div className="polaroid-caption">
                        {pol.caption}
                      </div>
                      <button
                        type="button"
                        onClick={() => selectedNoteId && removePolaroidFromNote(selectedNoteId, pol.id)}
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: '#e42335',
                          color: '#fff',
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                          zIndex: 30
                        }}
                        title="Detach Polaroid"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Ruled Notebook Writing Area */}
              <textarea
                className="notebook-lined-textarea"
                value={content}
                onChange={e => handleContentChange(e.target.value)}
                placeholder="What happened on the floor? Write line by line: the syncopation, the crowd perimeter, the unreleased 3-step roll, or the sunrise walk home..."
              />

              {/* Notebook Footer Strip */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 16px 8px 62px',
                  borderTop: '1px solid var(--notebook-line)',
                  backgroundColor: '#050605',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-metadata)',
                  color: 'var(--gt-muted)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gt-acid)' }}>
                  <Save size={12} />
                  <span>{saveStatus}</span>
                </div>

                <div>
                  {content.split('\n').length} LINES // {content.length} CHARS
                </div>
              </div>
            </div>

            {/* Action Bar: Discard & Community Submission */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 'var(--space-sm)',
                paddingTop: 'var(--space-xs)'
              }}
            >
              <div>
                {activeNote?.submissionStatus === 'approved' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gt-acid)', fontFamily: 'var(--font-metadata)', fontSize: '0.75rem' }}>
                    <Check size={14} />
                    <span>STATUS: APPROVED // PUBLISHED IN COMMUNITY ARCHIVE</span>
                  </div>
                )}
                {activeNote?.submissionStatus === 'pending' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffb830', fontFamily: 'var(--font-metadata)', fontSize: '0.75rem' }}>
                    <span>● STATUS: PENDING CURATOR REVIEW</span>
                    <button
                      type="button"
                      onClick={() => selectedNoteId && withdrawCommunitySubmission(selectedNoteId)}
                      className="btn btn-ghost"
                      style={{ fontSize: '0.7rem', padding: '2px 8px', color: 'var(--gt-muted)', border: '1px solid rgba(255,255,255,0.15)' }}
                    >
                      Withdraw Submission
                    </button>
                  </div>
                )}
                {activeNote?.submissionStatus === 'declined' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gt-muted)', fontFamily: 'var(--font-metadata)', fontSize: '0.75rem' }}>
                    <Lock size={13} />
                    <span>STATUS: DECLINED // STORED PRIVATELY IN PATIENT DOSSIER</span>
                  </div>
                )}
                {(!activeNote?.submissionStatus || activeNote?.submissionStatus === 'none') && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gt-muted)', fontFamily: 'var(--font-metadata)', fontSize: '0.75rem' }}>
                    <Lock size={13} />
                    <span>STATUS: PRIVATE PATIENT REFLECTION</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                {selectedNoteId && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="btn btn-ghost"
                    style={{ color: 'var(--status-error)', fontSize: '0.8rem', gap: '4px' }}
                    title="Discard this reflection"
                  >
                    <Trash2 size={14} />
                    <span>Discard</span>
                  </button>
                )}

                {selectedNoteId && content.trim().length > 0 && (!activeNote?.submissionStatus || activeNote?.submissionStatus === 'none') && (
                  <button
                    type="button"
                    onClick={() => setSubmissionModalOpen(true)}
                    className="btn btn-outline-neon"
                    style={{ gap: '6px', fontSize: '0.8rem' }}
                  >
                    <Send size={14} />
                    <span>Submit to Community Archive</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Public Records Enclave for Unattended Session */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {/* Archival Banner */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderLeft: '4px solid var(--gt-muted)',
                borderRadius: 'var(--radius-xs)',
                padding: '16px 20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <ShieldAlert size={16} color="var(--gt-muted)" />
                <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.78rem', color: 'var(--gt-cream)', fontWeight: 700, letterSpacing: '0.06em' }}>
                  PUBLIC ARCHIVAL RECORD ONLY // UNATTENDED SESSION
                </span>
              </div>
              <p style={{ color: 'var(--gt-muted)', fontSize: '0.84rem', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                You did not attend <strong>{session.title}</strong> (door check-in not on file). You can explore public community reflections, official lineups, and audio records below. Personal therapy notes can only be drafted for sessions with verified door attendance.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-acid)' }}>
                  YOUR VERIFIED SESSIONS:
                </span>
                {sessions.filter(s => getAttendance(s.id) === 'attended').map(attS => (
                  <button
                    key={attS.id}
                    onClick={() => handleSessionChange(attS.id)}
                    className="btn btn-outline-neon"
                    style={{ fontSize: '0.72rem', padding: '3px 10px', minHeight: '26px' }}
                  >
                    {attS.sessionCode || attS.title} (Verified)
                  </button>
                ))}
              </div>
            </div>

            {/* Session Master Details & Lineup */}
            <div className="archival-panel" style={{ padding: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.7rem', color: 'var(--gt-acid)', letterSpacing: '0.08em', marginBottom: '2px' }}>
                    CASE REF // {session.sessionCode || 'SPECIAL SESSION'}
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', margin: 0 }}>
                    {session.title}
                  </h2>
                </div>
                <Link
                  to={`/sessions/${session.id}`}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.75rem', gap: '4px' }}
                >
                  <Eye size={13} />
                  <span>Full Session Dossier</span>
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                <div style={{ padding: '8px 12px', backgroundColor: 'var(--brand-surface-raised)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontFamily: 'var(--font-metadata)' }}>DATE</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>{session.date}</div>
                </div>
                <div style={{ padding: '8px 12px', backgroundColor: 'var(--brand-surface-raised)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontFamily: 'var(--font-metadata)' }}>CITY / VENUE</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>{session.venue ? `${session.venue}, ${session.city}` : session.city}</div>
                </div>
                <div style={{ padding: '8px 12px', backgroundColor: 'var(--brand-surface-raised)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontFamily: 'var(--font-metadata)' }}>CLASSIFICATION</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 600 }}>{session.branch.toUpperCase()}</div>
                </div>
              </div>

              {/* Lineup List */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-metadata)', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  RECORDED LINEUP ({session.artists.length} ARTISTS)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {session.artists.map((art, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '3px',
                        fontSize: '0.75rem',
                        color: 'var(--gt-cream)'
                      }}
                    >
                      {art.name} <span style={{ color: 'var(--gt-acid)', fontSize: '0.68rem' }}>({art.role || 'DJ'})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Public Community Reflections for this Session */}
            <div className="archival-panel" style={{ padding: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.74rem', color: 'var(--gt-acid)', fontWeight: 800 }}>
                    PUBLIC COMMUNITY REFLECTIONS
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--gt-muted)' }}>
                    ({notes.filter(n => n.sessionId === session.id && (n.visibility === 'public_submission' || n.moderationStatus === 'approved')).length})
                  </span>
                </div>
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-muted)' }}>
                  FROM VERIFIED ATTENDEES
                </span>
              </div>

              {notes.filter(n => n.sessionId === session.id && (n.visibility === 'public_submission' || n.moderationStatus === 'approved')).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {notes
                    .filter(n => n.sessionId === session.id && (n.visibility === 'public_submission' || n.moderationStatus === 'approved'))
                    .map(pubNote => (
                      <div
                        key={pubNote.id}
                        className="notebook-ruled-container"
                        style={{ padding: '0 0 16px 0' }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px 16px 10px 60px',
                            borderBottom: '1px solid var(--notebook-line)',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            fontSize: '0.74rem',
                            fontFamily: 'var(--font-metadata)'
                          }}
                        >
                          <span style={{ color: 'var(--gt-acid)', fontWeight: 700 }}>
                            {pubNote.authorDisplayName || 'VERIFIED ATTENDEE'}
                          </span>
                          <span style={{ color: 'var(--gt-muted)', fontSize: '0.68rem' }}>
                            PUBLIC NOTE // {pubNote.sessionCode}
                          </span>
                        </div>

                        {/* Taped Polaroids if any */}
                        {pubNote.polaroids && pubNote.polaroids.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', padding: '16px 20px 8px 60px' }}>
                            {pubNote.polaroids.map((p, pIdx) => (
                              <div key={p.id || pIdx} className="polaroid-card" style={{ transform: `rotate(${p.rotation}deg)` }}>
                                <div className="washi-tape-strip washi-tape-top-center"></div>
                                <div className="polaroid-photo-frame">
                                  <img src={p.imageUrl} alt={p.caption} />
                                </div>
                                <div className="polaroid-caption">{p.caption}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div style={{ padding: '14px 20px 14px 60px', color: 'var(--gt-cream)', fontFamily: 'var(--font-handwriting)', fontSize: '1.2rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                          {pubNote.content}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '4px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <p style={{ color: 'var(--gt-muted)', fontSize: '0.82rem', margin: 0 }}>
                    No public community reflections have been shared for this session yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Attach Polaroid Photo Modal */}
      {polaroidModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(3, 3, 3, 0.88)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: 'var(--space-md)'
          }}
          onClick={() => setPolaroidModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--gt-elevated)',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-sm)',
              maxWidth: '560px',
              width: '100%',
              padding: 'var(--space-xl)',
              boxShadow: 'var(--shadow-acid-glow)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-xs)' }}>
              <Camera size={20} color="var(--gt-acid)" />
              <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)' }}>
                Attach Photo to Therapy Note
              </h3>
            </div>
            <p style={{ color: 'var(--gt-muted)', fontSize: '0.85rem', marginBottom: 'var(--space-lg)' }}>
              Select a club photo preset or paste a custom image URL to attach to your reflection.
            </p>

            {/* Presets Grid */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-acid)', marginBottom: '8px' }}>
                SELECT GT CAMERA ROLL PRESET:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '8px' }}>
                {POLAROID_PRESETS.map(preset => {
                  const isSelected = selectedPreset.id === preset.id && !customImageUrl;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => {
                        setSelectedPreset(preset);
                        setCustomImageUrl('');
                        setPolaroidCaption(preset.defaultCaption);
                      }}
                      style={{
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-xs)',
                        border: `2px solid ${isSelected ? 'var(--gt-acid)' : 'var(--border-subtle)'}`,
                        overflow: 'hidden',
                        position: 'relative',
                        aspectRatio: '1 / 1'
                      }}
                    >
                      <img src={preset.imageUrl} alt={preset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          fontSize: '0.62rem',
                          fontFamily: 'var(--font-metadata)',
                          padding: '2px 4px',
                          color: isSelected ? 'var(--gt-acid)' : 'var(--gt-cream)',
                          textAlign: 'center'
                        }}
                      >
                        {preset.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom URL Input */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-muted)', marginBottom: '4px' }}>
                OR PASTE IMAGE URL:
              </label>
              <input
                type="url"
                value={customImageUrl}
                onChange={e => setCustomImageUrl(e.target.value)}
                placeholder="https://... (or choose preset above)"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  backgroundColor: 'var(--gt-charcoal)',
                  border: '1px solid var(--gt-border)',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--gt-cream)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            {/* Photo Caption Input */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-muted)', marginBottom: '6px', letterSpacing: '0.04em' }}>
                PHOTO CAPTION:
              </label>
              <input
                type="text"
                value={polaroidCaption}
                onChange={e => setPolaroidCaption(e.target.value)}
                placeholder="Enter photo caption (e.g. 3:40 AM near the subs)..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: 'var(--gt-charcoal)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--gt-cream)',
                  fontFamily: 'var(--font-metadata)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            {/* Live Polaroid Preview */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: 'var(--space-md) 0' }}>
              <div className="polaroid-card" style={{ transform: 'rotate(-1.5deg)' }}>
                <div className="washi-tape-strip washi-tape-top-center"></div>
                <div className="polaroid-photo-frame">
                  <img src={customImageUrl || selectedPreset.imageUrl} alt="Preview" />
                </div>
                <div className="polaroid-caption">
                  {polaroidCaption || 'Write a caption...'}
                </div>
              </div>
            </div>

            {/* Modal Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)', borderTop: '1px solid var(--gt-border)', paddingTop: 'var(--space-md)' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setPolaroidModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAttachPolaroid}
              >
                Attach Photo to Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Community Submission Consent Modal */}
      {submissionModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(3, 3, 3, 0.88)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1200,
            padding: 'var(--space-md)'
          }}
          onClick={() => setSubmissionModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--gt-elevated)',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-sm)',
              maxWidth: '520px',
              width: '100%',
              padding: 'var(--space-xl)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {submissionSuccess ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-lg) 0' }}>
                <Check size={40} color="var(--gt-acid)" style={{ marginBottom: 'var(--space-sm)' }} />
                <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-xs)' }}>
                  Submitted to Curator Moderation Desk
                </h3>
                <p style={{ color: 'var(--gt-muted)', fontSize: '0.85rem' }}>
                  Group Therapy curators have received your reflection. It is now pending review and will appear in the collective archive if approved.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-sm)' }}>
                  <AlertTriangle size={20} color="var(--status-pending)" />
                  <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>
                    Submit Reflection to Community Archive
                  </h3>
                </div>

                <p style={{ color: 'var(--gt-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: 'var(--space-md)' }}>
                  By default, all Therapy Notes and photos are completely private to your patient dossier. Submitting this reflection requests its inclusion in the public Group Therapy Collective Archive.
                </p>

                <div
                  style={{
                    backgroundColor: 'rgba(255, 184, 48, 0.08)',
                    border: '1px solid rgba(255, 184, 48, 0.3)',
                    borderRadius: 'var(--radius-xs)',
                    padding: 'var(--space-sm)',
                    fontSize: '0.78rem',
                    color: 'var(--status-pending)',
                    fontFamily: 'var(--font-metadata)',
                    marginBottom: 'var(--space-md)'
                  }}
                >
                  CURATION NOTICE: Submissions are reviewed by GT curators before publication. Submitting a reflection does not guarantee approval or publication.
                </div>

                {/* Attribution & Attachment Preferences */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: 'var(--space-md)', padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.825rem' }}>
                    <input
                      type="checkbox"
                      checked={isAnonymousSubmission}
                      onChange={e => setIsAnonymousSubmission(e.target.checked)}
                      style={{ accentColor: 'var(--gt-acid)', width: '16px', height: '16px' }}
                    />
                    <span style={{ color: 'var(--gt-cream)' }}>
                      Submit anonymously (Display as "Verified Attendee" without my name)
                    </span>
                  </label>

                  {attachedPolaroids.length > 0 && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.825rem' }}>
                      <input
                        type="checkbox"
                        checked={includePolaroidsInSubmission}
                        onChange={e => setIncludePolaroidsInSubmission(e.target.checked)}
                        style={{ accentColor: 'var(--gt-acid)', width: '16px', height: '16px' }}
                      />
                      <span style={{ color: 'var(--gt-cream)' }}>
                        Include {attachedPolaroids.length} attached photo{attachedPolaroids.length > 1 ? 's' : ''} in submission
                      </span>
                    </label>
                  )}
                </div>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.825rem', marginBottom: 'var(--space-xl)' }}>
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={e => setConsentChecked(e.target.checked)}
                    style={{ accentColor: 'var(--gt-acid)', width: '18px', height: '18px', marginTop: '2px' }}
                  />
                  <span style={{ color: 'var(--gt-cream)', lineHeight: 1.4 }}>
                    I understand this reflection will be reviewed by GT curators and, if approved, published in the collective archive.
                  </span>
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setSubmissionModalOpen(false)}
                  >
                    Keep Private
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!consentChecked}
                    onClick={handleConfirmSubmission}
                    style={{ opacity: consentChecked ? 1 : 0.5, cursor: consentChecked ? 'pointer' : 'not-allowed' }}
                  >
                    Confirm Submission
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .notes-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

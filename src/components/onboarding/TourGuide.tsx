import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Sparkles,
  ShieldCheck,
  Lock,
  Radio,
  UserCheck,
  X,
  ArrowRight,
  ArrowLeft,
  Disc3,
  Sliders,
  FileCheck,
  Upload,
  Camera,
  Layers
} from 'lucide-react';
import { DemoPersona } from '../../types';

export const TourGuide: React.FC = () => {
  const {
    showTour,
    tourStep,
    nextTourStep,
    prevTourStep,
    closeTour,
    roleTourModalOpen,
    roleTourPersona,
    closeRoleTour
  } = useStore();

  // Role-specific explanatory tours
  const roleGuides: Record<DemoPersona, {
    title: string;
    subtitle: string;
    description: string;
    highlights: string[];
    actionPrompt: string;
  }> = {
    patient: {
      title: 'Patient',
      subtitle: 'Verified & unattended sessions',
      description: 'As a Patient, you have sessions with door-verified attendance (GT-XII and GT-XV) and sessions you did not attend. For verified sessions, you can add private or public therapy notes. For unattended sessions, you can explore all public records.',
      highlights: [
        'Verified Sessions (GT-XII & GT-XV): Author private notes or publish publicly to the community wall',
        'Unattended Sessions: Explore public archive records, lineups, sets, and attendee reflections',
        'Personal Dossier: Access your check-in badges, tracked sessions, and saved reflections'
      ],
      actionPrompt: 'Open My Files or draft a reflection for an attended session.'
    },
    visitor: {
      title: 'Public Visitor',
      subtitle: 'Open music archive & session history',
      description: 'Browse the open history of Group Therapy gatherings. Public session files, recorded sets, and community notes are open.',
      highlights: [
        'Browse verified session lineups, tracklists, and soundboard audio',
        'Read community reflections on session pages',
        'Switch roles anytime to test patient or curator tools'
      ],
      actionPrompt: 'Explore the Session Archive or switch roles to test other features.'
    },
    dj: {
      title: 'Resident DJ Desk (Aniko)',
      subtitle: 'Track IDs & Audience Reviews',
      description: 'Built for resident DJs to manage recordings, respond to track ID requests, and read reviews written about their sets.',
      highlights: [
        'Track ID requests sent by attendees during sets',
        'Audience Reviews: Read attendee reflections on your sets and pin favourites',
        'Publish soundboard sets directly to session case files'
      ],
      actionPrompt: 'Inspect the pending Track ID requests from attendees.'
    },
    admin: {
      title: 'GT Curator Desk',
      subtitle: 'Door Check in Ingest & Notes Moderation',
      description: 'The curator workspace to upload door check in data (which automatically matches attendees by email) and moderate reflections submitted by attendees.',
      highlights: [
        'Door Scanner Ingest: Upload check in data to automatically match attendee emails',
        'Community Moderation Desk: Review and approve community reflections',
        'Publish recordings with rights clearance tags'
      ],
      actionPrompt: 'Review the incoming community submissions in the Moderation Desk.'
    }
  };

  // If a role was just switched to, render the Role Explanatory Tour Modal
  if (roleTourModalOpen && roleTourPersona) {
    const currentRoleGuide = roleGuides[roleTourPersona];

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(3, 3, 3, 0.88)',
          backdropFilter: 'blur(12px)',
          zIndex: 2500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-md)'
        }}
        onClick={closeRoleTour}
      >
        <div
          style={{
            backgroundColor: '#0a0c0a',
            border: '1px solid var(--gt-acid)',
            borderRadius: 'var(--radius-sm)',
            maxWidth: '540px',
            width: '100%',
            padding: 'var(--space-2xl)',
            boxShadow: '0 0 35px rgba(4, 229, 57, 0.35)',
            position: 'relative'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={closeRoleTour}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'transparent',
              border: 'none',
              color: 'var(--gt-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
            title="Close Explanatory Tour"
          >
            <X size={20} />
          </button>

          {/* Title & Subtitle (No icon on left, no badge) */}
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: '1.45rem', fontFamily: 'var(--font-display)', marginBottom: '4px', color: 'var(--gt-cream)' }}>
              {currentRoleGuide.title}
            </h3>
            <div style={{ color: 'var(--gt-acid)', fontFamily: 'var(--font-display)', fontSize: '0.88rem', fontWeight: 600 }}>
              {currentRoleGuide.subtitle}
            </div>
          </div>

          {/* Description */}
          <p style={{ color: 'var(--gt-cream)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: 'var(--space-md)' }}>
            {currentRoleGuide.description}
          </p>

          {/* Key Unlocked Features */}
          <div
            style={{
              backgroundColor: 'var(--gt-slate)',
              border: '1px solid var(--gt-border)',
              borderRadius: 'var(--radius-xs)',
              padding: 'var(--space-md)',
              marginBottom: 'var(--space-lg)'
            }}
          >
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-metadata)', color: 'var(--gt-acid)', fontWeight: 800, marginBottom: '6px' }}>
              CAPABILITIES:
            </div>
            <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.825rem', color: 'var(--gt-cream)', lineHeight: 1.55 }}>
              {currentRoleGuide.highlights.map((h, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>{h}</li>
              ))}
            </ul>
          </div>

          {/* Action Prompt */}
          <div style={{ fontSize: '0.78rem', color: 'var(--gt-muted)', fontFamily: 'var(--font-metadata)', marginBottom: 'var(--space-xl)' }}>
            SUGGESTED: {currentRoleGuide.actionPrompt}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--gt-border)', paddingTop: 'var(--space-md)' }}>
            <button
              onClick={closeRoleTour}
              className="btn btn-ghost"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              Skip
            </button>

            <button
              onClick={closeRoleTour}
              className="btn btn-primary"
              style={{ gap: '6px', fontSize: '0.85rem' }}
            >
              <span>Explore This View</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // General Intro Tour (auto pops up on load)
  if (!showTour) return null;

  const steps = [
    {
      title: 'Welcome to Group Therapy',
      subtitle: 'The music comes first. Everything else grows from it.',
      description: `This platform is an event companion for the Group Therapy community across cities. 
      It is designed to deepen your connection to sessions after the night ends through verified session history, 
      personal reflections, and progressive archival releases.`
    },
    {
      title: 'Session Case Files & Collective History',
      subtitle: 'Every session maintains a living, verified record.',
      description: `Each GT session maintains a curated record with verified lineups, progressive soundboard recordings, and community reflections capturing the energy of the dancefloor.`
    },
    {
      title: 'Automated Attendance Matching',
      subtitle: 'Attendance is earned in the room.',
      description: `When door check-in data is uploaded after an event, the system automatically matches attendance to your registered email. Once matched, your attended sessions unlock soundboard recordings and session ratings without any manual steps required.`
    },
    {
      title: 'Therapy Notes & Reflections',
      subtitle: 'Authentic reflections safe from external eyes.',
      description: `Therapy Notes are a personal space to document your reflections and memories from sessions. Notes are private to your device unless you choose to submit them for community curation.`
    },
    {
      title: 'Role Views',
      subtitle: 'Switch views anytime from the top bar.',
      description: `Use the dropdown in the top bar anytime to experience the platform as a Verified Attendee, Registered Patient, Public Visitor, Resident DJ, or GT Curator.`
    }
  ];

  const currentStep = steps[tourStep] || steps[0];
  const isLastStep = tourStep === steps.length - 1;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 3, 3, 0.88)',
        backdropFilter: 'blur(12px)',
        zIndex: 2500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-md)'
      }}
      onClick={closeTour}
    >
      <div
        style={{
          backgroundColor: '#0a0c0a',
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-sm)',
          maxWidth: '520px',
          width: '100%',
          padding: 'var(--space-2xl)',
          boxShadow: 'var(--shadow-acid-glow)',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeTour}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--gt-muted)',
            cursor: 'pointer',
            padding: '6px'
          }}
          title="Close Tour"
        >
          <X size={20} />
        </button>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-md)' }}>
          <span style={{ fontFamily: 'var(--font-metadata)', fontSize: '0.72rem', color: 'var(--gt-acid)' }}>
            STEP {tourStep + 1} OF {steps.length}
          </span>
        </div>

        {/* Title & Subtitle (No icon on left, no badge) */}
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display)', marginBottom: '4px', color: 'var(--gt-cream)' }}>
            {currentStep.title}
          </h3>
          <div style={{ color: 'var(--gt-acid)', fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 600 }}>
            {currentStep.subtitle}
          </div>
        </div>

        {/* Description */}
        <p style={{ color: 'var(--gt-cream)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 'var(--space-xl)' }}>
          {currentStep.description}
        </p>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--gt-border)', paddingTop: 'var(--space-md)' }}>
          <button
            onClick={closeTour}
            className="btn btn-ghost"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            Skip Tour
          </button>

          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
            {tourStep > 0 && (
              <button
                onClick={() => prevTourStep()}
                className="btn btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                title="Previous step"
              >
                <ArrowLeft size={14} />
              </button>
            )}

            <button
              onClick={() => {
                if (isLastStep) {
                  closeTour();
                } else {
                  nextTourStep();
                }
              }}
              className="btn btn-primary"
              style={{ gap: '6px', fontSize: '0.825rem' }}
            >
              <span>{isLastStep ? 'Explore Archive' : 'Next Step'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

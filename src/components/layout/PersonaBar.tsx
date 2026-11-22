import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { DemoPersona } from '../../types';
import { GTDropdown, DropdownOption } from '../common/GTDropdown';
import { RotateCcw, UserCheck, Lock, Eye, Disc3, ShieldAlert } from 'lucide-react';

export const PersonaBar: React.FC = () => {
  const navigate = useNavigate();
  const { persona, setPersona, resetDemoData } = useStore();

  const options: DropdownOption[] = [
    {
      value: 'patient',
      label: 'Patient (Lami Adeyemi)',
      badge: 'PATIENT',
      badgeColor: 'var(--gt-acid)',
      icon: <UserCheck size={14} />,
      description: 'Door-scanned passes for GT-XII & XV. Verified note authoring & public records.'
    },
    {
      value: 'visitor',
      label: 'Public Visitor (Guest)',
      badge: 'PUBLIC',
      badgeColor: 'var(--gt-muted)',
      icon: <Eye size={14} />,
      description: 'Collective history, tracklists, and sets. Personal patient dossiers locked.'
    },
    {
      value: 'dj',
      label: 'Resident DJ (Aniko // DJ Crate)',
      badge: 'RESIDENT',
      badgeColor: 'var(--gt-acid)',
      icon: <Disc3 size={14} />,
      description: 'Crowd track ID demands and dancefloor set telemetry.'
    },
    {
      value: 'admin',
      label: 'GT Curator Terminal (Staff)',
      badge: 'LEVEL 4',
      badgeColor: 'var(--gt-purple)',
      icon: <ShieldAlert size={14} />,
      description: 'Master door-scanner CSV ingestion & note moderation desk.'
    }
  ];

  const currentOption = options.find(o => o.value === persona) || options[0];

  const handleRoleChange = (newRole: string) => {
    const p = newRole as DemoPersona;
    setPersona(p);

    // Automatically navigate to that role's primary view
    if (p === 'patient') {
      navigate('/my-sessions');
    } else if (p === 'visitor') {
      navigate('/sessions');
    } else if (p === 'dj') {
      navigate('/admin');
    } else if (p === 'admin') {
      navigate('/admin');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#020302',
        borderBottom: '1px solid var(--gt-border)',
        padding: '7px var(--space-md)',
        fontSize: '0.74rem',
        fontFamily: 'var(--font-metadata)',
        position: 'relative',
        zIndex: 150
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-md)'
        }}
      >
        {/* Left: Custom GT Dropdown Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--gt-acid)', fontWeight: 800, letterSpacing: '0.08em' }}>
            VIEW AS ROLE:
          </span>

          <GTDropdown
            options={options}
            value={persona}
            onChange={handleRoleChange}
            variant="acid"
            width={310}
          />
        </div>

        {/* Right: Active Role Capability & Reset Demo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <div style={{ color: 'var(--gt-muted)', fontSize: '0.73rem', maxWidth: '440px', lineHeight: 1.3 }}>
            {currentOption.description}
          </div>

          <button
            onClick={() => {
              if (confirm('Reset prototype storage to initial pristine seed state?')) {
                resetDemoData();
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
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
            <RotateCcw size={11} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

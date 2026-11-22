import React from 'react';

interface StatusBadgeProps {
  type:
    | 'attended'
    | 'pending'
    | 'followed'
    | 'verified_lineup'
    | 'recorded_only'
    | 'official_release'
    | 'authorized_embed'
    | 'confirmed'
    | 'partial_record'
    | 'awaiting_verification';
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, label }) => {
  let text = label;
  let bg = 'rgba(255, 255, 255, 0.05)';
  let color = 'var(--text-secondary)';
  let border = 'var(--border-default)';

  switch (type) {
    case 'attended':
      text = text || 'VERIFIED PHYSICAL ATTENDANCE';
      bg = 'var(--status-verified-bg)';
      color = 'var(--status-verified)';
      border = 'rgba(142, 219, 117, 0.3)';
      break;
    case 'pending':
      text = text || 'PENDING VERIFICATION';
      bg = 'var(--status-pending-bg)';
      color = 'var(--status-pending)';
      border = 'rgba(233, 180, 76, 0.3)';
      break;
    case 'followed':
      text = text || 'FOLLOWED SESSION';
      bg = 'var(--brand-primary-dim)';
      color = 'var(--brand-primary)';
      border = 'var(--border-accent)';
      break;
    case 'verified_lineup':
    case 'confirmed':
      text = text || 'CONFIRMED RECORD';
      bg = 'rgba(4, 229, 57, 0.12)';
      color = 'var(--gt-acid)';
      border = 'rgba(4, 229, 57, 0.3)';
      break;
    case 'partial_record':
      text = text || 'PARTIAL RECORD';
      bg = 'rgba(233, 180, 76, 0.12)';
      color = '#e9b44c';
      border = 'rgba(233, 180, 76, 0.35)';
      break;
    case 'awaiting_verification':
      text = text || 'AWAITING VERIFICATION';
      bg = 'rgba(255, 255, 255, 0.06)';
      color = 'var(--gt-muted)';
      border = 'rgba(255, 255, 255, 0.14)';
      break;
    case 'recorded_only':
      text = text || 'IDENTIFIED RECORDINGS ONLY';
      bg = 'rgba(233, 180, 76, 0.1)';
      color = 'var(--status-pending)';
      border = 'rgba(233, 180, 76, 0.3)';
      break;
    case 'official_release':
      text = text || 'OFFICIAL RELEASE';
      bg = 'var(--brand-primary-dim)';
      color = 'var(--brand-primary)';
      border = 'var(--border-accent)';
      break;
    case 'authorized_embed':
      text = text || 'AUTHORIZED LINK';
      bg = 'rgba(255, 255, 255, 0.06)';
      color = 'var(--text-primary)';
      border = 'var(--border-default)';
      break;
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 'var(--radius-xs)',
        fontSize: '0.68rem',
        fontWeight: 600,
        fontFamily: 'var(--font-metadata)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
        whiteSpace: 'nowrap'
      }}
    >
      {text}
    </span>
  );
};

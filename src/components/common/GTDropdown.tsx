import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  badge?: string;
  badgeColor?: string;
  icon?: React.ReactNode;
  description?: string;
}

interface GTDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  width?: string | number;
  variant?: 'acid' | 'subtle' | 'compact';
}

export const GTDropdown: React.FC<GTDropdownProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select option...',
  width = 'auto',
  variant = 'acid'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(prev => !prev);
    }
  };

  const isAcid = variant === 'acid';
  const isCompact = variant === 'compact';

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        width: typeof width === 'number' ? `${width}px` : width,
        userSelect: 'none'
      }}
    >
      {label && (
        <span
          style={{
            fontSize: '0.7rem',
            fontFamily: 'var(--font-metadata)',
            color: 'var(--gt-muted)',
            marginBottom: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}
        >
          {label}
        </span>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: isCompact ? '4px 10px' : '6px 14px',
          height: isCompact ? '30px' : '36px',
          boxSizing: 'border-box',
          backgroundColor: isOpen ? '#0d0f0d' : '#080908',
          color: selectedOption ? 'var(--gt-cream)' : 'var(--gt-muted)',
          border: `1px solid ${isOpen ? 'var(--gt-acid)' : isAcid ? 'rgba(4, 229, 57, 0.45)' : 'var(--gt-border)'}`,
          borderRadius: 'var(--radius-xs)',
          fontFamily: 'var(--font-metadata)',
          fontSize: isCompact ? '0.74rem' : '0.8rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: isOpen ? '0 0 16px rgba(4, 229, 57, 0.3)' : 'none',
          transition: 'all var(--transition-fast)',
          outline: 'none',
          width: '100%',
          textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          {selectedOption?.icon && (
            <span style={{ color: 'var(--gt-acid)', display: 'flex', alignItems: 'center' }}>
              {selectedOption.icon}
            </span>
          )}
          <span
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span
              style={{
                fontSize: '0.64rem',
                padding: '1px 6px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--gt-acid-dim)',
                color: selectedOption.badgeColor || 'var(--gt-acid)',
                border: '1px solid var(--border-accent)',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}
            >
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          size={14}
          color="var(--gt-acid)"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0
          }}
        />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            minWidth: '220px',
            backgroundColor: '#0a0b0a',
            border: '1px solid var(--gt-acid)',
            borderRadius: 'var(--radius-xs)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.95), 0 0 20px rgba(4, 229, 57, 0.25)',
            zIndex: 1000,
            padding: '4px',
            maxHeight: '320px',
            overflowY: 'auto'
          }}
        >
          {options.map(option => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: isSelected ? 'rgba(4, 229, 57, 0.14)' : 'transparent',
                  color: isSelected ? 'var(--gt-acid)' : 'var(--gt-cream)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-metadata)',
                  fontSize: '0.78rem',
                  transition: 'background-color var(--transition-fast)'
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {option.icon && (
                      <span style={{ color: isSelected ? 'var(--gt-acid)' : 'var(--gt-muted)', display: 'flex', alignItems: 'center' }}>
                        {option.icon}
                      </span>
                    )}
                    <span style={{ fontWeight: isSelected ? 700 : 500 }}>
                      {option.label}
                    </span>
                    {option.badge && (
                      <span
                        style={{
                          fontSize: '0.62rem',
                          padding: '1px 5px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: 'var(--gt-acid-dim)',
                          color: option.badgeColor || 'var(--gt-acid)',
                          border: '1px solid var(--border-accent)',
                          fontWeight: 700
                        }}
                      >
                        {option.badge}
                      </span>
                    )}
                  </div>
                  {option.description && (
                    <span style={{ fontSize: '0.68rem', color: 'var(--gt-muted)', whiteSpace: 'normal', lineHeight: 1.3 }}>
                      {option.description}
                    </span>
                  )}
                </div>

                {isSelected && (
                  <Check size={14} color="var(--gt-acid)" style={{ flexShrink: 0, marginLeft: '8px' }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

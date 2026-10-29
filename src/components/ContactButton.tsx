import React, { useRef, useId } from 'react';
import { useContactMenu, type PlacementPreference } from './ContactMenu';

interface ContactButtonProps {
  id?: string;
  label?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  download?: boolean | string;
  placement?: PlacementPreference;
  'aria-label'?: string;
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  id,
  label = 'Contact Me',
  onClick,
  className = '',
  href,
  target,
  rel,
  download,
  placement = 'top',
  'aria-label': ariaLabel = 'Contact options',
}) => {
  const autoId = useId();
  const triggerId = id || autoId;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { toggleMenu, isTriggerActive } = useContactMenu();

  const isContactMenuTrigger = !href && !download;

  const commonClasses = `relative inline-flex items-center justify-center rounded-full font-medium uppercase tracking-widest text-white transition-transform hover:scale-105 active:scale-95 cursor-pointer select-none px-6 py-2.5 sm:px-8 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 whitespace-nowrap ${className}`;

  const buttonStyle = {
    background:
      'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
    boxShadow:
      '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
    outline: '2px solid #FFFFFF',
    outlineOffset: '-3px',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
      return;
    }
    if (isContactMenuTrigger && buttonRef.current) {
      toggleMenu(buttonRef.current, placement, triggerId);
    }
  };

  if (href) {
    const isExternal = href.startsWith('http://') || href.startsWith('https://');
    const isPdf = href.endsWith('.pdf');
    return (
      <a
        href={href}
        target={target ?? (isExternal || isPdf ? '_blank' : undefined)}
        rel={rel ?? (isExternal || isPdf ? 'noopener noreferrer' : undefined)}
        download={download}
        className={commonClasses}
        style={buttonStyle}
        onClick={onClick}
      >
        <span>{label}</span>
      </a>
    );
  }

  return (
    <button
      ref={buttonRef}
      id={id}
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-expanded={isTriggerActive(triggerId)}
      aria-haspopup="true"
      className={commonClasses}
      style={buttonStyle}
    >
      <span>{label}</span>
    </button>
  );
};

export default ContactButton;


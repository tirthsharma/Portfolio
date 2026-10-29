import React from 'react';
import { profileData } from '../data/profile';

interface ResumeButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  download?: boolean | string;
}

export const ResumeButton: React.FC<ResumeButtonProps> = ({
  label = 'Resume',
  onClick,
  className = '',
  href = profileData.resumeUrl || '/resume.html',
  target,
  rel,
  download,
}) => {
  const commonClasses = `resume-button relative inline-flex items-center justify-center rounded-full font-medium uppercase tracking-widest text-[#D7E2EA] hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer select-none px-6 py-2.5 sm:px-8 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base whitespace-nowrap ${className}`;

  if (href) {
    const isExternal = href.startsWith('http://') || href.startsWith('https://');
    const isPdf = href.endsWith('.pdf');
    const isResume = href.includes('resume');
    return (
      <a
        href={href}
        target={target ?? (isExternal || isPdf || isResume ? '_blank' : undefined)}
        rel={rel ?? (isExternal || isPdf || isResume ? 'noopener noreferrer' : undefined)}
        download={download}
        className={commonClasses}
      >
        <span>{label}</span>
      </a>
    );
  }

  return (
    <button onClick={onClick} className={commonClasses}>
      <span>{label}</span>
    </button>
  );
};

export default ResumeButton;

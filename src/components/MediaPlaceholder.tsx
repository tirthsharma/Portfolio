import React from 'react';
import { Film } from 'lucide-react';

interface MediaPlaceholderProps {
  label?: string;
  className?: string;
}

export const MediaPlaceholder: React.FC<MediaPlaceholderProps> = ({
  label,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full h-full bg-[#141414] border border-[#222222] rounded-[inherit] overflow-hidden flex flex-col items-center justify-center p-4 group hover:border-[#333333] transition-colors ${className}`}
    >
      {/* Subtle Grid Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

      {/* Subtle Icon & Optional Label */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-2 text-neutral-600 group-hover:text-neutral-500 transition-colors">
        <Film className="w-6 h-6 stroke-[1.25] opacity-60" />
        {label && (
          <span className="text-[10px] uppercase tracking-widest font-mono text-neutral-500">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default MediaPlaceholder;

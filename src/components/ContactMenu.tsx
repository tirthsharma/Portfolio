import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// CONTACT LINKS (keep them in one config object at the top so I can edit them easily)
const contacts = [
  { id: "whatsapp", label: "WhatsApp", href: "https://wa.me/919351300612" },
  { id: "email", label: "Gmail", href: "mailto:imtirthh@gmail.com" },
  { id: "instagram", label: "Instagram", href: "https://instagram.com/imtirthh" },
  { id: "x", label: "X", href: "https://x.com/iamtirthh" }
];

export type PlacementPreference = 'top' | 'bottom';

interface ContactMenuContextValue {
  isOpen: boolean;
  activeTriggerId: string | null;
  openMenu: (trigger: HTMLElement, preferredPlacement?: PlacementPreference, triggerId?: string) => void;
  closeMenu: () => void;
  toggleMenu: (trigger: HTMLElement, preferredPlacement?: PlacementPreference, triggerId?: string) => void;
  isTriggerActive: (triggerId: string) => boolean;
}

const ContactMenuContext = createContext<ContactMenuContextValue | null>(null);

// oxlint-disable-next-line react/only-export-components
export const useContactMenu = (): ContactMenuContextValue => {
  const context = useContext(ContactMenuContext);
  if (!context) {
    throw new Error('useContactMenu must be used within a ContactMenuProvider');
  }
  return context;
};

// Clean, single-color 20px inline SVG icons matching site aesthetic
const ContactIcon: React.FC<{ id: string; className?: string }> = ({ id, className = '' }) => {
  switch (id) {
    case 'whatsapp':
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={className}
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          <path d="M16.5 14.2c-.2.4-.8.8-1.4.8-.4 0-.9-.2-1.9-.7-1.3-.7-2.3-1.7-3-3-.5-1-.7-1.5-.7-1.9 0-.6.4-1.2.8-1.4.2-.1.4-.1.6 0 .2.1.5.7.6.9.1.2.1.4 0 .5-.1.2-.2.3-.3.4-.1.1-.1.2 0 .4.4.7.9 1.2 1.6 1.6.2.1.3.1.4 0 .1-.1.3-.3.5-.4.1-.1.3-.1.5 0 .2.1.8.4 1 .5.2.1.2.3.1.5z" />
        </svg>
      );
    case 'email':
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={className}
        >
          <rect x="2" y="4" width="20" height="16" rx="2.5" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case 'instagram':
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={className}
        >
          <rect x="2.5" y="2.5" width="19" height="19" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
        </svg>
      );
    case 'x':
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={className}
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    default:
      return null;
  }
};

interface PositionState {
  top?: number;
  bottom?: number;
  left: number;
  placement: 'top' | 'bottom';
}

export const ContactMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTriggerId, setActiveTriggerId] = useState<string | null>(null);
  const [preferredPlacement, setPreferredPlacement] = useState<PlacementPreference>('top');
  const [position, setPosition] = useState<PositionState>({ left: 16, placement: 'top' });
  const [isMobile, setIsMobile] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const triggerRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const menuId = useId();

  // Detect mobile viewport (breakpoint 640px)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute popover position attached to trigger button with auto-flip
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || window.innerWidth < 640) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = 230;
    const menuHeight = 205; // 4 rows + padding
    const gap = 8;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spaceAbove = rect.top;
    const spaceBelow = viewportHeight - rect.bottom;

    let finalPlacement: 'top' | 'bottom' = preferredPlacement;

    if (preferredPlacement === 'top') {
      if (spaceAbove < menuHeight + gap && spaceBelow >= menuHeight + gap) {
        finalPlacement = 'bottom';
      }
    } else {
      if (spaceBelow < menuHeight + gap && spaceAbove >= menuHeight + gap) {
        finalPlacement = 'top';
      }
    }

    let top: number | undefined;
    let bottom: number | undefined;

    if (finalPlacement === 'top') {
      bottom = viewportHeight - rect.top + gap;
    } else {
      top = rect.bottom + gap;
    }

    // Align to the button's right edge
    let left = rect.right - menuWidth;

    // Keep within screen boundaries
    if (left + menuWidth > viewportWidth - 16) {
      left = viewportWidth - menuWidth - 16;
    }
    if (left < 16) {
      left = 16;
    }

    setPosition({ top, bottom, left, placement: finalPlacement });
  }, [preferredPlacement]);

  const openMenu = useCallback(
    (trigger: HTMLElement, placement: PlacementPreference = 'top', triggerId: string = '') => {
      triggerRef.current = trigger;
      setActiveTriggerId(triggerId || null);
      setPreferredPlacement(placement);
      setIsOpen(true);
    },
    []
  );

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    const triggerToFocus = triggerRef.current;
    setActiveTriggerId(null);
    triggerRef.current = null;
    if (triggerToFocus && typeof triggerToFocus.focus === 'function') {
      triggerToFocus.focus();
    }
  }, []);

  const toggleMenu = useCallback(
    (trigger: HTMLElement, placement: PlacementPreference = 'top', triggerId: string = '') => {
      if (isOpen && (activeTriggerId === triggerId || triggerRef.current === trigger)) {
        closeMenu();
      } else {
        openMenu(trigger, placement, triggerId);
      }
    },
    [isOpen, activeTriggerId, closeMenu, openMenu]
  );

  const isTriggerActive = useCallback(
    (triggerId: string) => isOpen && activeTriggerId === triggerId,
    [isOpen, activeTriggerId]
  );

  // Recalculate position on scroll, resize, or when menu opens
  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, updatePosition]);

  // Focus trap: Move focus into menu on open
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      rowRefs.current[0]?.focus();
    }, 40);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Handle outside click & Esc key
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        closeMenu();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }

      const items = rowRefs.current.filter((item): item is HTMLAnchorElement => item !== null);
      if (!items.length) return;

      const activeIdx = items.indexOf(document.activeElement as HTMLAnchorElement);

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (activeIdx <= 0) {
            e.preventDefault();
            items[items.length - 1]?.focus();
          }
        } else {
          if (activeIdx >= items.length - 1) {
            e.preventDefault();
            items[0]?.focus();
          }
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (activeIdx + 1) % items.length;
        items[next]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = (activeIdx - 1 + items.length) % items.length;
        items[prev]?.focus();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeMenu]);

  return (
    <ContactMenuContext.Provider
      value={{
        isOpen,
        activeTriggerId,
        openMenu,
        closeMenu,
        toggleMenu,
        isTriggerActive,
      }}
    >
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Mobile: Dimmed Backdrop */}
                {isMobile && (
                  <motion.div
                    key="contact-menu-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    onClick={closeMenu}
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]"
                    aria-hidden="true"
                  />
                )}

                {/* Popover (Desktop) or Bottom Sheet (Mobile) */}
                <div
                  className={
                    isMobile
                      ? 'fixed inset-x-0 bottom-0 z-50 p-4 pb-8 flex flex-col justify-end pointer-events-none'
                      : 'fixed z-50 pointer-events-auto'
                  }
                  style={
                    !isMobile
                      ? {
                        left: `${position.left}px`,
                        top: position.top !== undefined ? `${position.top}px` : undefined,
                        bottom: position.bottom !== undefined ? `${position.bottom}px` : undefined,
                        width: '230px',
                      }
                      : undefined
                  }
                >
                  <motion.div
                    ref={menuRef}
                    id={menuId}
                    role="menu"
                    aria-label="Contact options"
                    initial={
                      isMobile
                        ? {
                          opacity: prefersReducedMotion ? 0 : 1,
                          y: prefersReducedMotion ? 0 : '100%',
                        }
                        : {
                          opacity: 0,
                          y: prefersReducedMotion ? 0 : 8,
                        }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={
                      isMobile
                        ? {
                          opacity: prefersReducedMotion ? 0 : 1,
                          y: prefersReducedMotion ? 0 : '100%',
                        }
                        : {
                          opacity: 0,
                          y: prefersReducedMotion ? 0 : 6,
                        }
                    }
                    transition={{
                      duration: 0.18,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={
                      isMobile
                        ? 'pointer-events-auto w-full max-w-sm mx-auto bg-[#111111] border border-[#D7E2EA]/15 rounded-2xl shadow-[0_-10px_35px_rgba(0,0,0,0.85)] p-2.5 flex flex-col gap-1'
                        : 'bg-[#111111] border border-[#D7E2EA]/15 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.75)] p-1.5 flex flex-col gap-1'
                    }
                  >
                    {/* Mobile Sheet Handle */}
                    {isMobile && (
                      <div
                        className="w-10 h-1 bg-white/20 rounded-full mx-auto my-1.5 shrink-0"
                        aria-hidden="true"
                      />
                    )}

                    {/* 4 Contact Rows */}
                    {contacts.map((contact, index) => (
                      <a
                        key={contact.id}
                        ref={(el) => {
                          rowRefs.current[index] = el;
                        }}
                        href={contact.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        role="menuitem"
                        onClick={closeMenu}
                        className={`group flex items-center justify-between w-full rounded-xl text-[#D7E2EA] hover:text-white focus:text-white transition-all duration-150 hover:bg-white/[0.07] focus-visible:bg-white/[0.07] focus-visible:outline-none select-none ${isMobile
                            ? 'min-h-[48px] py-3.5 px-4 text-base'
                            : 'min-h-[40px] py-2 px-3 text-sm'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <ContactIcon
                            id={contact.id}
                            className="w-5 h-5 shrink-0 text-[#D7E2EA]/80 group-hover:text-white group-focus:text-white transition-colors duration-150"
                          />
                          <span className="font-medium tracking-wide">
                            {contact.label}
                          </span>
                        </div>
                        <span
                          aria-hidden="true"
                          className="text-xs text-[#D7E2EA]/40 group-hover:text-white group-focus:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150 select-none ml-2"
                        >
                          ↗
                        </span>
                      </a>
                    ))}
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </ContactMenuContext.Provider>
  );
};

export default ContactMenuProvider;

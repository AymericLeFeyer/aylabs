import React, { useEffect, useId, useRef } from "react";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { NavGroup, isGroupActive, isItemActive } from "./navigation";

interface NavDropdownProps {
  group: NavGroup;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const NavDropdown: React.FC<NavDropdownProps> = ({
  group,
  isOpen,
  onOpen,
  onClose,
}) => {
  const location = useLocation();
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const active = isGroupActive(group, location.pathname);

  // Le volet suit le pointeur, mais on laisse un délai pour traverser
  // l'espace entre le bouton et le panneau sans le perdre.
  const closeTimer = useRef<number>();
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(onClose, 120);
  };
  const cancelClose = () => window.clearTimeout(closeTimer.current);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) onClose();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        onOpen();
      }}
      onMouseLeave={scheduleClose}
      onFocus={cancelClose}
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node)) {
          onClose();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={panelId}
        onClick={() => (isOpen ? onClose() : onOpen())}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright ${
          active || isOpen
            ? "bg-white/10 text-white"
            : "text-gray-300 hover:bg-white/5 hover:text-white"
        }`}
      >
        <span>{group.label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id={panelId}
          className="absolute left-0 top-full z-50 w-72 pt-2"
          onMouseEnter={cancelClose}
        >
          <div className="overflow-hidden rounded-xl border border-ink-line bg-ink-soft shadow-2xl shadow-black/40">
            {group.items.map((item) => {
              const Icon = item.icon;
              const itemActive = isItemActive(item, location.pathname);
              const content = (
                <>
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      itemActive
                        ? "bg-brand text-white"
                        : "bg-white/5 text-brand-bright group-hover:bg-brand group-hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1 text-sm font-semibold text-white">
                      {item.label}
                      {item.external && (
                        <ArrowUpRight
                          className="h-3.5 w-3.5 text-gray-500"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-gray-400">
                      {item.hint}
                    </span>
                  </span>
                </>
              );

              const className =
                "group flex items-start gap-3 border-b border-ink-line/60 px-4 py-3 last:border-b-0 transition-colors hover:bg-white/5 focus:outline-none focus-visible:bg-white/5";

              if (item.external || item.hardNav) {
                return (
                  <a
                    key={item.label}
                    href={item.to}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className={className}
                    onClick={onClose}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={className}
                  onClick={onClose}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

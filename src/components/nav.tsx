"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Arrow, Mark } from "./icons";
const links = [
  ["Platform", "/platform"],
  ["Developers", "/developers"],
  ["Enterprise", "/enterprise"],
  ["Vision", "/vision"],
  ["Investors", "/investors"],
] as const;
export function Nav() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const path = usePathname();
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const closeOutside = (e: PointerEvent) => {
      if (e.target instanceof Node && !header.current?.contains(e.target))
        setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 641px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);
  function current(href: string) {
    return (
      path === href ||
      path.startsWith(href + "/") ||
      (href === "/platform" &&
        (path === "/product" || path.startsWith("/use-cases/")))
    );
  }
  return (
    <header
      ref={header}
      className="header"
      onBlurCapture={(e) => {
        if (
          open &&
          e.relatedTarget instanceof Node &&
          !header.current?.contains(e.relatedTarget)
        )
          setOpen(false);
      }}
    >
      <div className="nav-wrap">
        <Link
          href="/"
          className="wordmark"
          aria-label="UniMem home"
          onClick={() => setOpen(false)}
        >
          <Mark />
          UniMem<span className="wordmark-period">.</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link
              href={href}
              key={href}
              aria-current={current(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link className="button button-small nav-cta" href="/developers">
          Start building <Arrow />
        </Link>
        <button
          ref={toggle}
          type="button"
          className="menu-toggle"
          aria-label={open ? "Close navigation" : "Menu: open navigation"}
          aria-expanded={open}
          aria-controls={open ? "mobile-menu" : undefined}
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
          <span
            className={`menu-indicator ${open ? "is-open" : ""}`}
            aria-hidden="true"
          >
            +
          </span>
        </button>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {links.map(([label, href], i) => (
            <Link
              key={href}
              href={href}
              aria-current={current(href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              <span className="mobile-nav-index" aria-hidden="true">
                0{i + 1}
              </span>
              {label}
              <Arrow />
            </Link>
          ))}
          <Link
            href="/developers"
            className="mobile-start"
            onClick={() => setOpen(false)}
          >
            Start building <Arrow />
          </Link>
        </nav>
      )}
    </header>
  );
}

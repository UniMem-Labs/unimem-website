"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type SearchItem = { title: string; path: string; description: string };

export function SiteSearch({ items }: { items: SearchItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [query, setQuery] = useState("");
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const results = items.filter((item) =>
    terms.every((term) =>
      (item.title + " " + item.description + " " + item.path)
        .toLowerCase()
        .includes(term),
    ),
  );
  const openDialog = useCallback(() => {
    previousFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    dialog.current?.showModal();
    input.current?.focus();
  }, []);
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else {
          openDialog();
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [openDialog]);
  function move(e: React.KeyboardEvent) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const links = Array.from(
      dialog.current?.querySelectorAll<HTMLAnchorElement>(".search-result") ||
        [],
    );
    if (!links.length) return;
    e.preventDefault();
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    links[
      (current + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length
    ].focus();
  }
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="search-trigger"
        aria-label="Search UniMem"
        aria-keyshortcuts="Meta+K Control+K"
        aria-haspopup="dialog"
        title="Search (⌘ K or Ctrl K)"
        onClick={() => {
          openDialog();
        }}
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="10.5"
            cy="10.5"
            r="6.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span className="search-label">Search</span>
      </button>
      <dialog
        ref={dialog}
        className="search-dialog"
        aria-labelledby="search-title"
        onKeyDown={move}
        onClose={() => {
          setQuery("");
          (previousFocus.current || trigger.current)?.focus({
            preventScroll: true,
          });
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="search-surface">
          <div className="search-heading">
            <h2 id="search-title">Find your next step.</h2>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Close search"
            >
              Close <span aria-hidden="true">×</span>
            </button>
          </div>
          <label className="sr-only" htmlFor="site-search">
            Search pages and guides
          </label>
          <input
            ref={input}
            id="site-search"
            type="search"
            placeholder="Try ‘quickstart’, ‘benchmarks’, ‘robots’…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="search-count" role="status">
            {query ? results.length + " results" : "EXPLORE UNIMEM"}
          </p>
          <div className="search-results">
            {results.length ? (
              results.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="search-result"
                  onClick={() => dialog.current?.close()}
                >
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </span>
                  <span aria-hidden="true">↗</span>
                </Link>
              ))
            ) : (
              <div className="search-empty">
                <h3>No pages found.</h3>
                <p>Try a broader term such as memory, agent, or evidence.</p>
                <Link href="/docs" onClick={() => dialog.current?.close()}>
                  Browse the documentation →
                </Link>
              </div>
            )}
          </div>
          <div className="search-hint">
            <span>↑ ↓ to explore · Enter to open</span>
            <span>Esc to close</span>
          </div>
        </div>
      </dialog>
    </>
  );
}

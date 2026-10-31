"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
type Item = { id: string; title: string };
export function TableOfContents({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const position = items.reduce((found, item) => {
        const section = document.getElementById(item.id);
        return section && section.getBoundingClientRect().top <= 180
          ? item.id
          : found;
      }, items[0]?.id);
      setActive(position);
    };
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(onScroll);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      cancelAnimationFrame(frame);
    };
  }, [items]);
  const links = items.map((item) => (
    <a
      href={`#${item.id}`}
      key={item.id}
      aria-current={active === item.id ? "location" : undefined}
      onClick={() => {
        setActive(item.id);
        if (details.current) details.current.open = false;
      }}
    >
      {item.title.replace(/^\d\d \/ /, "")}
    </a>
  ));
  return (
    <aside className="page-toc">
      <nav className="toc-desktop" aria-label="On this page">
        <span className="toc-label">ON THIS PAGE</span>
        {links}
        <Link className="toc-bottom" href="/contact">
          Discuss your workflow
        </Link>
      </nav>
      <details className="toc-mobile" ref={details}>
        <summary>
          On this page <span aria-hidden="true">+</span>
        </summary>
        <nav aria-label="Article sections">{links}</nav>
      </details>
    </aside>
  );
}

import Link from "next/link";
import { pages } from "@/lib/content";
import { metadata as meta } from "@/lib/site";
import { Arrow, MemoryGlyph } from "@/components/icons";
export const metadata = meta(
  "Field notes on agent memory",
  "Practical writing on persistent agent memory, context architecture, and evaluating what remembered experience changes.",
  "/learn",
);
export default function Learn() {
  return (
    <div className="container">
      <section className="page-hero">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">UniMem</Link>
          <span>/</span>
          <span aria-current="page">Learn</span>
        </nav>
        <span className="eyebrow">
          <i className="status-dot" />
          FIELD NOTES / IDEAS FOR LONG-LIVED AGENTS
        </span>
        <h1>Think beyond recall.</h1>
        <p className="lead">
          A practical foundation for building agents that remember
          deliberately—and for evaluating what that memory changes.
        </p>
      </section>
      <div className="article-card-grid">
        {pages
          .filter((p) => p.article)
          .map((p, i) => (
            <article className="article-card" key={p.path}>
              <div className="article-card-art" aria-hidden="true">
                <span>
                  <MemoryGlyph
                    kind={
                      i === 0 ? "conversation" : i === 1 ? "block" : "lesson"
                    }
                  />
                </span>
              </div>
              <div className="article-card-body">
                <span className="eyebrow">
                  {p.eyebrow.replace("FIELD NOTES / ", "")} / 0{i + 1}
                </span>
                <h2>
                  <Link href={p.path}>{p.title}</Link>
                </h2>
                <p>{p.lead}</p>
                <Link className="text-link" href={p.path}>
                  Read the field note <Arrow />
                </Link>
              </div>
            </article>
          ))}
      </div>
    </div>
  );
}

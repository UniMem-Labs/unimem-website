import Link from "next/link";
import { notFound } from "next/navigation";
import { pages, getPage } from "@/lib/content";
import { metadata as meta, SITE, SOURCE } from "@/lib/site";
import { Arrow } from "@/components/icons";
import { TableOfContents } from "@/components/table-of-contents";
import { CopyCode } from "@/components/code-example";
export const dynamicParams = false;
export function generateStaticParams() {
  return pages.map((p) => ({ slug: p.path.slice(1).split("/") }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const p = getPage("/" + slug.join("/"));
  if (!p) return {};
  const m = meta(p.title.replace(/\.$/, ""), p.description, p.path);
  if (p.article) m.openGraph = { ...m.openGraph, type: "article" };
  return m;
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const p = getPage("/" + slug.join("/"));
  if (!p) notFound();
  const breadcrumb = p.path
    .split("/")
    .at(-1)!
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
  const readingMinutes = Math.max(
    1,
    Math.ceil(
      p.sections.reduce(
        (count, section) =>
          count +
          [section.title, ...section.paragraphs, ...(section.bullets || [])]
            .join(" ")
            .split(/\s+/).length,
        0,
      ) / 220,
    ),
  );
  const crumbs = [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE },
    ...(p.article
      ? [
          {
            "@type": "ListItem",
            position: 2,
            name: "Learn",
            item: `${SITE}/learn`,
          },
        ]
      : []),
    {
      "@type": "ListItem",
      position: p.article ? 3 : 2,
      name: p.title,
      item: SITE + p.path,
    },
  ];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "BreadcrumbList", itemListElement: crumbs },
              ...(p.article
                ? [
                    {
                      "@type": "Article",
                      headline: p.title,
                      description: p.description,
                      mainEntityOfPage: SITE + p.path,
                      author: {
                        "@type": "Organization",
                        name: "UniMem",
                        url: SITE,
                      },
                      publisher: {
                        "@type": "Organization",
                        name: "UniMem",
                        url: SITE,
                      },
                      image: `${SITE}/opengraph-image`,
                      inLanguage: "en",
                    },
                  ]
                : []),
            ],
          }),
        }}
      />
      <div className={`container ${p.article ? "editorial-page" : ""}`}>
        <section className="page-hero">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">UniMem</Link>
            <span>/</span>
            {p.article && (
              <>
                <Link href="/learn">Learn</Link>
                <span>/</span>
              </>
            )}
            <span aria-current="page">{breadcrumb}</span>
          </nav>
          <span className="eyebrow">
            <i className="status-dot" />
            {p.eyebrow}
          </span>
          <h1>{p.title}</h1>
          <p className="lead">{p.lead}</p>
          {p.legal ? (
            <div className="legal-notice">
              Draft for operator and legal review. This page has not been
              approved as final legal policy.
            </div>
          ) : p.article ? (
            <div className="article-meta">
              <span>UniMem field notes</span>
              <span aria-hidden="true">·</span>
              <span>{readingMinutes} min read</span>
            </div>
          ) : (
            <div className="hero-actions">
              <Link
                href={
                  p.path === "/developers"
                    ? "#quickstart"
                    : p.path === "/enterprise"
                      ? "/contact?intent=pilot"
                      : "/developers"
                }
                className="button"
              >
                {p.path === "/enterprise"
                  ? "Plan a pilot"
                  : p.path === "/developers"
                    ? "Run the quickstart"
                    : "Start building"}{" "}
                <Arrow />
              </Link>
              <Link
                href={p.path === "/docs" ? `${SOURCE}/README.md` : "/docs"}
                className="text-link"
              >
                {p.path === "/docs" ? "Browse the source" : "Read the docs"}{" "}
                <Arrow />
              </Link>
            </div>
          )}
        </section>
        <div className="page-layout">
          <TableOfContents
            key={p.path}
            items={p.sections.map(({ id, title }) => ({ id, title }))}
          />
          <div className="page-content">
            {p.sections.map((s) => (
              <section id={s.id} className="content-section" key={s.id}>
                <h2>{s.title}</h2>
                {s.paragraphs.map((text, i) => (
                  <p
                    key={i}
                    className={
                      p.article && s.id === "definition" && i === 0
                        ? "definition"
                        : undefined
                    }
                  >
                    {text}
                  </p>
                ))}
                {s.bullets && (
                  <ul>
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
                {s.code && <CopyCode code={s.code} label={s.codeLabel} />}
                {s.note && (
                  <div className="callout">
                    <p>{s.note}</p>
                  </div>
                )}
                {s.source && (
                  <a className="source-link" href={`${SOURCE}/${s.source[1]}`}>
                    {s.source[0]} <Arrow diagonal />
                  </a>
                )}
              </section>
            ))}
            {!p.legal && (
              <div className="content-cta">
                <h2>{p.cta || "Put experience to work."}</h2>
                <p>
                  Try the local loop, or bring one workflow to a pilot
                  conversation.
                </p>
                <div className="hero-actions">
                  <Link className="button" href="/contact?intent=pilot">
                    Talk about a pilot <Arrow />
                  </Link>
                  <Link className="text-link" href="/developers">
                    Developer quickstart <Arrow />
                  </Link>
                </div>
              </div>
            )}
            <div className="related-pages">
              <span className="eyebrow">KEEP EXPLORING</span>
              {p.related.map((path) => (
                <Link href={path} key={path}>
                  {getPage(path)?.title ||
                    (path === "/contact" ? "Test one workflow with us." : path)}
                  <Arrow />
                </Link>
              ))}
            </div>
            {!p.legal && (
              <p className="source-note">
                Technical details link to the inspected source. Check deployment
                requirements before enabling optional features.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

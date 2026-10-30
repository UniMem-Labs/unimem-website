import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { CONTACT, metadata as meta } from "@/lib/site";
export const metadata = meta(
  "Test one agent workflow with UniMem",
  "Discuss a UniMem pilot, integration, enterprise workflow, or strategic partnership. Start with one real memory or context problem.",
  "/contact",
);
export default function Contact() {
  const deliveryReady = [
    "RESEND_API_KEY",
    "CONTACT_FROM",
    "CONTACT_TO",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "CONTACT_RATE_LIMIT_SECRET",
  ].every((key) => Boolean(process.env[key]));
  return (
    <div className="container contact-page">
      <section className="page-hero">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">UniMem</Link>
          <span>/</span>
          <span aria-current="page">Contact</span>
        </nav>
        <span className="eyebrow">
          <i className="status-dot" />
          LET’S START WITH THE WORKFLOW
        </span>
        <h1>
          One agent.
          <br />
          One real memory problem.
        </h1>
        <p className="lead">
          Tell us what you’re building and where memory breaks down. We’ll
          explore whether a focused UniMem pilot makes sense.
        </p>
      </section>
      <div className="contact-layout">
        <aside className="contact-aside">
          <h2>A useful first conversation.</h2>
          <p>
            For investors, design partners, enterprise teams, developers, and
            people exploring integrations or strategic partnerships.
          </p>
          <ol>
            <li>
              Understand your agent, the recurring task, and the context it
              needs.
            </li>
            <li>
              Agree on a safe data boundary and a result your team can verify.
            </li>
            <li>Decide whether one workflow is a good place to start.</li>
          </ol>
          <p>Prefer email?</p>
          <a className="contact-email" href={`mailto:${CONTACT}`}>
            {CONTACT}
          </a>
          <p className="small-note">
            No secrets, production traces, or customer records are needed for
            the first conversation.
          </p>
        </aside>
        <ContactForm mode={deliveryReady ? "delivery" : "email"} />
      </div>
    </div>
  );
}

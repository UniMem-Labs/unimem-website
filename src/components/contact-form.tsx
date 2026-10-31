"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Arrow } from "./icons";
import { event } from "./analytics";
import { CONTACT } from "@/lib/site";
import { validateInquiry, type FieldErrors } from "@/lib/contact";
import { CopyCode } from "./code-example";
export function ContactForm({
  mode = "delivery",
}: {
  mode?: "delivery" | "email";
}) {
  const startedAt = useRef(0);
  const requestId = useRef("");
  const locked = useRef(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const [draft, setDraft] = useState("");
  const draftRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    startedAt.current = Date.now();
    requestId.current = crypto.randomUUID();
  }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (locked.current) return;
    const form = e.currentTarget;
    const payload = {
      ...Object.fromEntries(new FormData(form)),
      startedAt: startedAt.current,
      requestId: requestId.current,
    };
    const checked = validateInquiry(payload);
    setErrors(checked.errors);
    setResult(null);
    if (!checked.data) {
      const first = Object.keys(checked.errors)[0];
      const field = form.elements.namedItem(first);
      if (field instanceof HTMLElement) field.focus();
      else
        setResult({
          ok: false,
          message:
            checked.errors[first as keyof FieldErrors] ||
            "Please check the form.",
        });
      return;
    }
    if (mode === "email") {
      const d = checked.data;
      setDraft(
        [
          "Hello UniMem,",
          "",
          "I’d like to discuss a memory workflow.",
          "",
          "Name: " + d.name,
          "Reply to: " + d.email,
          "Company / project: " + d.company,
          "",
          "Workflow",
          d.workflow,
          "",
          "Memory problem",
          d.problem,
          ...(d.message ? ["", "Additional context", d.message] : []),
          "",
          "Thank you,",
          d.name,
        ].join("\n"),
      );
      requestAnimationFrame(() => {
        draftRef.current?.focus();
        draftRef.current?.scrollIntoView({
          block: "center",
          behavior: "instant",
        });
      });
      return;
    }
    locked.current = true;
    setBusy(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checked.data),
        signal: AbortSignal.timeout(18000),
      });
      const body = await res.json();
      setResult({
        ok: res.ok,
        message: body.message || "Please try again or use the email link.",
      });
      if (body.errors) setErrors(body.errors);
      if (res.ok) {
        form.reset();
        requestId.current = crypto.randomUUID();
        startedAt.current = Date.now();
        event("contact_submission");
      }
    } catch {
      setResult({
        ok: false,
        message:
          "We could not confirm delivery. Your entries are still here. Please retry or use the email link.",
      });
    } finally {
      locked.current = false;
      setBusy(false);
      requestAnimationFrame(() => resultRef.current?.focus());
    }
  }
  function error(field: keyof FieldErrors) {
    return errors[field] ? (
      <span className="field-error" id={`${field}-error`}>
        {errors[field]}
      </span>
    ) : null;
  }
  function recheckField(
    e: React.FocusEvent<HTMLFormElement> | React.FormEvent<HTMLFormElement>,
  ) {
    const field = e.target;
    if (!(
      field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement
    ))
      return;
    const name = field.name as keyof FieldErrors;
    if (
      !["name", "email", "company", "workflow", "problem", "message"].includes(
        name,
      )
    )
      return;
    const values = {
      ...Object.fromEntries(new FormData(e.currentTarget)),
      startedAt: startedAt.current,
      requestId: requestId.current,
    };
    const { errors: next } = validateInquiry(values);
    setErrors((previous) => ({ ...previous, [name]: next[name] }));
  }
  return (
    <form
      className="contact-form"
      onSubmit={submit}
      noValidate
      onBlurCapture={recheckField}
      onChangeCapture={(e) => {
        if (draft) setDraft("");
        const field = e.target;
        if (
          (field instanceof HTMLInputElement ||
            field instanceof HTMLTextAreaElement) &&
          errors[field.name as keyof FieldErrors]
        )
          recheckField(e);
      }}
      aria-label="Workflow inquiry"
      aria-busy={busy}
    >
      <noscript>
        <p>
          This form needs JavaScript. Please use the email link on this page.
        </p>
      </noscript>
      {result && (
        <div
          ref={resultRef}
          tabIndex={-1}
          className={`form-result ${result.ok ? "" : "error"}`}
          role={result.ok ? "status" : "alert"}
        >
          {result.message}
          {!result.ok && (
            <div>
              <a className="form-email-recovery" href={`mailto:${CONTACT}`}>
                Email us instead <Arrow diagonal />
              </a>
            </div>
          )}
        </div>
      )}
      <p className="form-intro">
        {mode === "email"
          ? "Prepare a note, review it, then send it from your email app. Nothing is sent or stored by this form."
          : "All fields are required unless marked optional."}
      </p>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            maxLength={100}
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {error("name")}
        </div>
        <div className="form-field">
          <label htmlFor="email">Work email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            maxLength={254}
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {error("email")}
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="company">Company or project</label>
        <input
          id="company"
          name="company"
          required
          autoComplete="organization"
          maxLength={150}
          placeholder="Where you’re building"
          aria-invalid={!!errors.company}
          aria-describedby={errors.company ? "company-error" : undefined}
        />
        {error("company")}
      </div>
      <div className="form-field">
        <label htmlFor="workflow">Your agent or workflow</label>
        <textarea
          id="workflow"
          name="workflow"
          required
          maxLength={1500}
          rows={3}
          placeholder="A coding agent, support workflow, multi-agent system…"
          aria-invalid={!!errors.workflow}
          aria-describedby={errors.workflow ? "workflow-error" : undefined}
        />
        {error("workflow")}
      </div>
      <div className="form-field">
        <label htmlFor="problem">What should memory help with?</label>
        <textarea
          id="problem"
          name="problem"
          required
          maxLength={2000}
          rows={3}
          placeholder="What gets forgotten, repeated, or remembered incorrectly?"
          aria-invalid={!!errors.problem}
          aria-describedby={errors.problem ? "problem-error" : undefined}
        />
        {error("problem")}
      </div>
      <details className="form-optional">
        <summary>
          Add a note <span>Optional</span>
        </summary>
        <div className="form-field">
          <label htmlFor="message">Anything else we should know?</label>
          <textarea
            id="message"
            name="message"
            maxLength={3000}
            rows={2}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {error("message")}
        </div>
      </details>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="button" type="submit" disabled={busy}>
        {busy
          ? "Sending inquiry…"
          : mode === "email"
            ? "Prepare your email"
            : "Start a conversation"}{" "}
        <Arrow />
      </button>
      {draft && (
        <div
          className="contact-draft"
          ref={draftRef}
          tabIndex={-1}
          aria-label="Review your inquiry"
        >
          <span className="eyebrow">Ready for your review</span>
          <h2>A conversation starts here.</h2>
          <p>
            Review the note below. Your email app will open with the recipient
            and message filled in; you decide when to send it.
          </p>
          <a
            className="button"
            href={
              "mailto:" +
              CONTACT +
              "?subject=" +
              encodeURIComponent("UniMem pilot · memory workflow") +
              "&body=" +
              encodeURIComponent(draft)
            }
          >
            Open email app <Arrow diagonal />
          </a>
          <p className="small-note">
            If your mail app limits long drafts, copy the full note below and
            email {CONTACT}.
          </p>
          <CopyCode code={draft} label="Inquiry draft" />
        </div>
      )}
      <p className="form-note">
        Please leave out secrets and customer data. We’ll use these details to
        respond to your inquiry. Read the{" "}
        <Link href="/privacy">privacy notice</Link>.
      </p>
    </form>
  );
}

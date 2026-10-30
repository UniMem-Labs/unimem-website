"use client";
import Link from "next/link";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container error-page">
      <span className="eyebrow">SOMETHING INTERRUPTED THIS PAGE</span>
      <h1>Let’s try that again.</h1>
      <p>The page could not load. Retry, or return to the homepage.</p>
      <button type="button" className="button" onClick={reset}>
        Try again
      </button>
      <Link href="/" className="button button-outline">
        Back to UniMem
      </Link>
    </div>
  );
}

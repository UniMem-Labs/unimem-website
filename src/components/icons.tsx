export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="30"
      height="30"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 8v10a6 6 0 0 0 12 0V8M15 24V14a6 6 0 0 1 12 0v10"
        stroke="currentColor"
        strokeWidth="3.5"
      />
      <circle cx="5" cy="5" r="2" fill="currentColor" />
      <circle cx="27" cy="27" r="2" fill="currentColor" />
    </svg>
  );
}

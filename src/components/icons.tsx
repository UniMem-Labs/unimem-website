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

export function WorkflowGlyph({
  kind,
}: {
  kind: "coding" | "enterprise" | "team" | "robot";
}) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === "coding" ? (
        <path d="m8 5-5 7 5 7m8-14 5 7-5 7m-3-16-2 18" />
      ) : kind === "enterprise" ? (
        <>
          <rect x="3" y="4" width="18" height="16" rx="1" />
          <path d="M3 9h18M8 9v11m4-7h5m-5 4h5" />
        </>
      ) : kind === "team" ? (
        <>
          <circle cx="5" cy="6" r="3" />
          <circle cx="19" cy="6" r="3" />
          <circle cx="12" cy="19" r="3" />
          <path d="M8 6h8M6 9l4 7m8-7-4 7" />
        </>
      ) : (
        <>
          <rect x="4" y="7" width="16" height="12" rx="3" />
          <path d="M12 3v4M8 20v2m8-2v2M1 11v4m22-4v4M9 15h6" />
          <circle cx="8" cy="11" r=".7" />
          <circle cx="16" cy="11" r=".7" />
        </>
      )}
    </svg>
  );
}

export function MemoryGlyph({
  kind,
}: {
  kind: "fact" | "lesson" | "graph" | "conversation" | "block" | "procedure";
}) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === "fact" ? (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7v5l3 2" />
        </>
      ) : kind === "lesson" ? (
        <>
          <path d="M6 3h9l3 3v15H6zM14 3v5h4M8 14l2 2 4-5" />
        </>
      ) : kind === "graph" ? (
        <>
          <path d="m7 6 9 2M6 8l3 9m8-7-6 8" />
          <circle cx="5" cy="5" r="3" />
          <circle cx="19" cy="8" r="3" />
          <circle cx="10" cy="20" r="3" />
        </>
      ) : kind === "conversation" ? (
        <>
          <path d="M4 4h16v12H9l-5 4zM8 8h8M8 12h5" />
        </>
      ) : kind === "block" ? (
        <>
          <rect x="4" y="4" width="16" height="6" rx="1" />
          <rect x="4" y="14" width="16" height="6" rx="1" />
        </>
      ) : (
        <path d="m3 6 2 2 3-4M11 6h10M3 13l2 2 3-4M11 13h10M4 20h3m4 0h10" />
      )}
    </svg>
  );
}

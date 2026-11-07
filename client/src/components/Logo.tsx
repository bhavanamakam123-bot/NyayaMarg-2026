export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  const ink = light ? "#F7F4EC" : "#0B1F3A";
  const gold = "#C6A15B";
  return (
    <span className={`inline-flex items-center gap-3 ${compact ? "" : "min-w-0"}`}>
      <svg width={compact ? 36 : 46} height={compact ? 36 : 46} viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill={light ? "#132C52" : "#0B1F3A"} />
        <path d="M32 8v14" stroke={gold} strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="8" r="3" fill={gold} />
        <path d="M16 24h32" stroke={ink === "#F7F4EC" ? "#F7F4EC" : "#F4F7FB"} strokeWidth="3" strokeLinecap="round" />
        <path d="M20 24l-8 16h16L20 24zm24 0l-8 16h16L44 24z" fill="none" stroke="#F4F7FB" strokeWidth="2.4" />
        <path d="M32 42v12M22 56h20" stroke={gold} strokeWidth="3" strokeLinecap="round" />
      </svg>
      {!compact && (
        <span className="min-w-0">
          <span className="block font-serif text-xl leading-none" style={{ color: ink }}>NyayaMarg</span>
          <span className="block text-xs tracking-wide" style={{ color: gold }}>Know your rights</span>
        </span>
      )}
    </span>
  );
}

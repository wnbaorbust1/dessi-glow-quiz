/**
 * The installed lucide-react version does not ship brand/logo icons
 * (Instagram, Facebook, etc). This is a small hand-drawn stroke icon in the
 * same visual style (24x24, currentColor, 2px stroke) used anywhere the
 * Instagram link needs an icon.
 */
export default function InstagramGlyph({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

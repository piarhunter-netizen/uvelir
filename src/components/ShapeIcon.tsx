import type { ShapeId } from "@/lib/diamonds";

// Силуэты огранок, вид сверху
export default function ShapeIcon({ shape }: { shape: ShapeId }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      {shape === "round" && (
        <g {...common}>
          <circle cx="16" cy="16" r="12" />
          <polygon points="16,8 22,11 24,16 22,21 16,24 10,21 8,16 10,11" />
        </g>
      )}
      {shape === "oval" && (
        <g {...common}>
          <ellipse cx="16" cy="16" rx="9" ry="13" />
          <ellipse cx="16" cy="16" rx="4.5" ry="7.5" />
        </g>
      )}
      {shape === "princess" && (
        <g {...common}>
          <rect x="5" y="5" width="22" height="22" />
          <path d="M5 5 L16 16 L27 5 M5 27 L16 16 L27 27" />
        </g>
      )}
      {shape === "cushion" && (
        <g {...common}>
          <rect x="5" y="5" width="22" height="22" rx="7" />
          <rect x="10" y="10" width="12" height="12" rx="3" />
        </g>
      )}
      {shape === "emerald" && (
        <g {...common}>
          <polygon points="11,3 21,3 25,7 25,25 21,29 11,29 7,25 7,7" />
          <rect x="11" y="8" width="10" height="16" />
        </g>
      )}
      {shape === "pear" && (
        <g {...common}>
          <path d="M16 3 C10 12 7 17 7 21 a9 9 0 0 0 18 0 C25 17 22 12 16 3 Z" />
          <path d="M16 11 L12 21 L16 26 L20 21 Z" />
        </g>
      )}
      {shape === "marquise" && (
        <g {...common}>
          <path d="M16 2 C24 9 24 23 16 30 C8 23 8 9 16 2 Z" />
          <path d="M16 9 L13 16 L16 23 L19 16 Z" />
        </g>
      )}
    </svg>
  );
}

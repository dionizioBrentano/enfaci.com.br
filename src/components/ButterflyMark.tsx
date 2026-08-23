interface ButterflyMarkProps {
  className?: string;
  /** Cor das asas. Use "currentColor" para herdar do contexto. */
  tone?: 'brand' | 'light';
}

/**
 * Marca da ENFACI — borboleta estilizada, placeholder até a identidade
 * visual definitiva chegar. Desenhada em SVG inline para escalar sem
 * perda e acompanhar a cor do contexto (header claro / footer escuro).
 */
export function ButterflyMark({ className = 'h-9 w-9', tone = 'brand' }: ButterflyMarkProps) {
  const leftWing = tone === 'brand' ? 'fill-brand-500' : 'fill-brand-200';
  const rightWing = tone === 'brand' ? 'fill-sage-500' : 'fill-sage-300';
  const body = tone === 'brand' ? 'stroke-brand-800' : 'stroke-brand-50';

  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="ENFACI">
      <g strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className={body} fill="none">
        <path
          d="M32 18c-4-6-11-9-17-7-5 2-7 8-5 14 2 5 7 8 12 9-4 2-6 6-5 10 1 4 6 6 10 3 3-2 5-6 5-10z"
          className={leftWing}
          fillOpacity={0.9}
        />
        <path
          d="M32 18c4-6 11-9 17-7 5 2 7 8 5 14-2 5-7 8-12 9 4 2 6 6 5 10-1 4-6 6-10 3-3-2-5-6-5-10z"
          className={rightWing}
          fillOpacity={0.9}
        />
        <path d="M32 16v33" />
        <path d="M32 16l-4-6M32 16l4-6" />
      </g>
    </svg>
  );
}

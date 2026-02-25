"use client";

import React, { useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  useProjection,
} from "react-simple-maps";

// ─── Types ────────────────────────────────────────────────────────────────────

type Coords = [number, number]; // [longitude, latitude]

export interface PlacementEdge {
  from: string;
  to: string;
  count: number;
}

export interface PlacementMapProps {
  edges?: PlacementEdge[];
  /** Origin country ISO-3 — pulsing amber glow appears here */
  origin?: string;
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const COORDS: Record<string, Coords> = {
  UGA: [32.49, 1.37],
  KEN: [37.91, -0.02],
  TZA: [34.89, -6.37],
  ETH: [40.49, 9.15],
  NGA: [8.68, 9.08],
  GHA: [-1.02, 7.95],
  ZAF: [25.08, -29.0],
  EGY: [30.8, 26.82],
  CAN: [-96.35, 56.13],
  USA: [-95.71, 37.09],
  MEX: [-102.55, 23.63],
  GBR: [-3.44, 55.38],
  DEU: [10.45, 51.17],
  FRA: [2.21, 46.23],
  NLD: [5.29, 52.13],
  AUS: [133.78, -25.27],
  IND: [78.96, 20.59],
  CHN: [104.2, 35.86],
  JPN: [138.25, 36.2],
  BRA: [-51.93, -14.24],
  ARE: [53.85, 23.42],
};

const NAMES: Record<string, string> = {
  UGA: "Uganda", KEN: "Kenya", TZA: "Tanzania", ETH: "Ethiopia",
  NGA: "Nigeria", GHA: "Ghana", ZAF: "South Africa", EGY: "Egypt",
  CAN: "Canada", USA: "United States", MEX: "Mexico",
  GBR: "UK", DEU: "Germany", FRA: "France", NLD: "Netherlands",
  AUS: "Australia", IND: "India", CHN: "China", JPN: "Japan",
  BRA: "Brazil", ARE: "UAE",
};

const DEFAULT_EDGES: PlacementEdge[] = [
  { from: "UGA", to: "CAN", count: 25 },
  { from: "UGA", to: "GBR", count: 40 },
  { from: "UGA", to: "USA", count: 18 },
  { from: "UGA", to: "DEU", count: 12 },
  { from: "UGA", to: "AUS", count: 8 },
];

// ─── Arc Layer ────────────────────────────────────────────────────────────────

interface ArcLayerProps {
  edges: PlacementEdge[];
  hoveredIdx: number | null;
  onHover: (i: number | null) => void;
}

const ArcLayer: React.FC<ArcLayerProps> = ({ edges, hoveredIdx, onHover }) => {
  const projection = useProjection();

  return (
    <g>
      {edges.map((edge, i) => {
        const from = COORDS[edge.from];
        const to = COORDS[edge.to];
        if (!from || !to) return null;

        const [x1, y1] = projection(from) ?? [0, 0];
        const [x2, y2] = projection(to) ?? [0, 0];

        // Control point arcs upward for globe feel
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.38;

        const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
        const hov = hoveredIdx === i;

        return (
          <g key={`arc-${i}`}>
            {/* Soft glow bloom */}
            <path
              d={d}
              fill="none"
              stroke={hov ? "#FFD166" : "#F5A623"}
              strokeWidth={hov ? 6 : 3}
              strokeOpacity={0.12}
              strokeLinecap="round"
            />
            {/* Travelling dash */}
            <path
              d={d}
              fill="none"
              stroke={hov ? "#FFD166" : "#F5A623"}
              strokeWidth={hov ? 2 : 1.5}
              strokeOpacity={hov ? 1 : 0.8}
              strokeLinecap="round"
              strokeDasharray="120 600"
              style={{
                animation: `arcTravel ${2.6 + i * 0.35}s linear infinite`,
                animationDelay: `${i * 0.55}s`,
              }}
            />
            {/* Fat transparent hit-area */}
            <path
              d={d}
              fill="none"
              stroke="transparent"
              strokeWidth={20}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
            />
          </g>
        );
      })}
    </g>
  );
};

// ─── Tooltip ──────────────────────────────────────────────────────────────────

const Tooltip: React.FC<{ x: number; y: number; edge: PlacementEdge }> = ({
  x, y, edge,
}) => (
  <div
    style={{ left: x + 14, top: y - 12 }}
    className="pointer-events-none fixed z-50 rounded-lg border border-amber-400/25
               bg-[#060f22]/90 px-3 py-2 text-xs shadow-2xl backdrop-blur-md"
  >
    <p className="font-semibold text-amber-300">
      {NAMES[edge.from] ?? edge.from} → {NAMES[edge.to] ?? edge.to}
    </p>
    <p className="mt-0.5 text-slate-400">
      <span className="font-bold text-white">{edge.count}</span> placements
    </p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const PlacementMap: React.FC<PlacementMapProps> = ({
  edges = DEFAULT_EDGES,
  origin = "UGA",
  className = "",
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);

  const validEdges = edges.filter((e) => {
    const ok = COORDS[e.from] && COORDS[e.to];
    if (!ok) console.warn(`PlacementMap: no coords for ${e.from} → ${e.to}`);
    return ok;
  });

  const originCoords = COORDS[origin];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-[#0D1B3E] ${className}`}
      onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => { setHoveredIdx(null); setMouse(null); }}
    >
      {/* ── CSS keyframes ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes arcTravel {
          0%   { stroke-dashoffset:  800; }
          100% { stroke-dashoffset: -100; }
        }
        @keyframes pulseRing {
          0%   { r: 7;  opacity: 0.75; }
          100% { r: 26; opacity: 0;    }
        }
        @keyframes pulseRing2 {
          0%   { r: 7;  opacity: 0.45; }
          100% { r: 42; opacity: 0;    }
        }
        @keyframes destPulse {
          0%, 100% { r: 3.5; opacity: 0.9; }
          50%       { r: 5;   opacity: 1;   }
        }
      `}</style>

      {/* ── Map ───────────────────────────────────────────────────────── */}
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 148, center: [10, 5] }}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <defs>
          {/* Dotted land fill */}
          <pattern
            id="landDots"
            x="0" y="0"
            width="4" height="4"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.5" cy="1.5" r="1.05" fill="#1E4DA1" opacity="0.85" />
          </pattern>

          {/* Origin amber glow */}
          <radialGradient id="originGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#F5A623" stopOpacity="0.95" />
            <stop offset="55%"  stopColor="#F5A623" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F5A623" stopOpacity="0"    />
          </radialGradient>

          {/* Destination blue glow */}
          <radialGradient id="destGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#7BC8F6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7BC8F6" stopOpacity="0"   />
          </radialGradient>

          {/* Edge vignette */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
            <stop offset="62%" stopColor="transparent"  />
            <stop offset="100%" stopColor="#0D1B3E" stopOpacity="0.65" />
          </radialGradient>
        </defs>

        {/* Ocean */}
        <rect width="100%" height="100%" fill="#091326" />

        {/* Dotted land masses */}
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="url(#landDots)"
                stroke="none"
                style={{
                  default: { outline: "none" },
                  hover:   { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {/* Arcs — must be inside ComposableMap to access projection context */}
        <ArcLayer
          edges={validEdges}
          hoveredIdx={hoveredIdx}
          onHover={setHoveredIdx}
        />

        {/* Destination dots */}
        {validEdges.map((edge, i) => {
          const coords = COORDS[edge.to];
          if (!coords) return null;
          const hov = hoveredIdx === i;
          return (
            <Marker key={`dest-${i}`} coordinates={coords}>
              <circle r={12} fill="url(#destGlow)" opacity={hov ? 1 : 0.5} />
              <circle
                r={3.5}
                fill={hov ? "#FFD166" : "#7BC8F6"}
                stroke="#FFFFFF"
                strokeWidth={1}
                style={{ animation: `destPulse ${2 + i * 0.3}s ease-in-out infinite` }}
              />
            </Marker>
          );
        })}

        {/* Origin pulse */}
        {originCoords && (
          <Marker coordinates={originCoords}>
            {/* Outer slow ring */}
            <circle r={7} fill="url(#originGlow)"
              style={{ animation: "pulseRing2 2.8s ease-out infinite", animationDelay: "0.5s" }} />
            {/* Inner fast ring */}
            <circle r={7} fill="url(#originGlow)"
              style={{ animation: "pulseRing 2.2s ease-out infinite" }} />
            {/* Core */}
            <circle r={5.5} fill="#F5A623" stroke="#FFD166" strokeWidth={1.5} />
            <circle r={2.5} fill="#FFFFFF" opacity={0.95} />
          </Marker>
        )}

        {/* Vignette */}
        <rect width="100%" height="100%" fill="url(#vignette)" pointerEvents="none" />
      </ComposableMap>

      {/* ── Legend bar ────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between
                   bg-gradient-to-t from-[#060f22] to-transparent px-4 pb-3 pt-8"
      >
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F5A623]" />
          <span className="text-[11px] text-slate-400 tracking-wide">
            {NAMES[origin] ?? origin}
            <span className="mx-1.5 text-slate-600">→</span>
            {validEdges.length} global destinations
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider">
            <span className="inline-block h-[2px] w-5 rounded bg-amber-400/70" />
            Student flows
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider">
            <span className="inline-block h-2 w-2 rounded-full bg-sky-400" />
            Destination
          </span>
        </div>
      </div>

      {/* ── Tooltip ───────────────────────────────────────────────────── */}
      {hoveredIdx !== null && mouse && validEdges[hoveredIdx] && (
        <Tooltip x={mouse.x} y={mouse.y} edge={validEdges[hoveredIdx]} />
      )}
    </div>
  );
};

export default PlacementMap;
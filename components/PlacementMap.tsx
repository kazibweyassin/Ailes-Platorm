import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, Line } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type Coords = [number, number];

export interface Edge {
  from: string;
  to: string;
  count: number;
  label?: string;
}

export type PlacementMapProps = {
  edges?: Edge[];
  title?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/** ISO 3166-1 alpha-3 → [longitude, latitude] */
const COUNTRY_COORDS: Record<string, Coords> = {
  UGA: [32.4925, 1.3733],
  CAN: [-106.3468, 56.1304],
  NGA: [8.6753, 9.082],
  GBR: [-3.436, 55.3781],
  USA: [-95.7129, 37.0902],
  KEN: [37.9062, -0.0236],
  ZAF: [25.0, -29.0],
  IND: [78.9629, 20.5937],
  AUS: [133.7751, -25.2744],
  DEU: [10.4515, 51.1657],
  BRA: [-51.9253, -14.235],
  CHN: [104.1954, 35.8617],
  FRA: [2.2137, 46.2276],
  JPN: [138.2529, 36.2048],
  MEX: [-102.5528, 23.6345],
  ZMB: [27.8493, -13.1339],
  TZA: [34.8888, -6.369],
  ETH: [40.4897, 9.145],
  GHA: [-1.0232, 7.9465],
  EGY: [30.8025, 26.8206],
};

const COUNTRY_NAMES: Record<string, string> = {
  UGA: "Uganda", CAN: "Canada", NGA: "Nigeria", GBR: "United Kingdom",
  USA: "United States", KEN: "Kenya", ZAF: "South Africa", IND: "India",
  AUS: "Australia", DEU: "Germany", BRA: "Brazil", CHN: "China",
  FRA: "France", JPN: "Japan", MEX: "Mexico", ZMB: "Zambia",
  TZA: "Tanzania", ETH: "Ethiopia", GHA: "Ghana", EGY: "Egypt",
};

const DEFAULT_EDGES: Edge[] = [
  { from: "UGA", to: "CAN", count: 25, label: "Tech talent" },
  { from: "NGA", to: "GBR", count: 40, label: "Finance" },
  { from: "KEN", to: "USA", count: 10, label: "Engineering" },
  { from: "GHA", to: "DEU", count: 18, label: "Healthcare" },
  { from: "ZAF", to: "AUS", count: 12, label: "Mining" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function strokeWidth(count: number): number {
  return 1 + Math.log10(count + 1) * 1.5;
}

function edgeKey(e: Edge) {
  return `${e.from}-${e.to}`;
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

interface TooltipData {
  x: number;
  y: number;
  edge: Edge;
}

const Tooltip: React.FC<{ data: TooltipData }> = ({ data }) => (
  <AnimatePresence>
    <motion.div
      key="tooltip"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      style={{ left: data.x + 12, top: data.y - 8 }}
      className="pointer-events-none fixed z-50 rounded-lg border border-orange-400/30
                 bg-gray-900/90 px-3 py-2 text-xs shadow-xl backdrop-blur-sm"
    >
      <p className="font-semibold text-orange-300">
        {COUNTRY_NAMES[data.edge.from] ?? data.edge.from}
        {" → "}
        {COUNTRY_NAMES[data.edge.to] ?? data.edge.to}
      </p>
      {data.edge.label && (
        <p className="mt-0.5 text-gray-400">{data.edge.label}</p>
      )}
      <p className="mt-0.5 text-white">
        <span className="font-bold">{data.edge.count}</span> placements
      </p>
    </motion.div>
  </AnimatePresence>
);

// ─── Legend ───────────────────────────────────────────────────────────────────

const Legend: React.FC<{ edges: Edge[] }> = ({ edges }) => {
  const total = edges.reduce((s, e) => s + e.count, 0);
  return (
    <div className="absolute bottom-3 left-3 rounded-lg border border-white/10
                    bg-gray-900/80 px-3 py-2 backdrop-blur-sm">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
        Corridors
      </p>
      {edges.map((e) => (
        <div key={edgeKey(e)} className="flex items-center gap-2 text-[11px] text-gray-300 mb-0.5">
          <span
            className="inline-block rounded-full bg-orange-500"
            style={{ width: strokeWidth(e.count) * 2, height: 3 }}
          />
          <span>
            {COUNTRY_NAMES[e.from] ?? e.from} → {COUNTRY_NAMES[e.to] ?? e.to}
          </span>
          <span className="ml-auto pl-3 font-semibold text-orange-400">{e.count}</span>
        </div>
      ))}
      <div className="mt-1.5 border-t border-white/10 pt-1.5 text-[11px] flex justify-between text-gray-500">
        <span>Total</span>
        <span className="font-bold text-white">{total}</span>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const PlacementMap: React.FC<PlacementMapProps> = ({
  edges = DEFAULT_EDGES,
  title = "Global Placement Map",
}) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const validEdges = edges.filter((e) => {
    const ok = COUNTRY_COORDS[e.from] && COUNTRY_COORDS[e.to];
    if (!ok) console.warn(`PlacementMap: missing coords for edge ${e.from} → ${e.to}`);
    return ok;
  });

  const handleMouseMove = (e: React.MouseEvent, edge: Edge) => {
    setTooltip({ x: e.clientX, y: e.clientY, edge });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
    setHoveredKey(null);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10
                    bg-gray-950 font-sans shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_6px_#FF5722]" />
          <h2 className="text-sm font-semibold tracking-wide text-white">{title}</h2>
        </div>
        <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-xs text-orange-400">
          {validEdges.length} corridors
        </span>
      </div>

      {/* Map */}
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 155, center: [-10, 5] }}
        style={{ width: "100%", height: "auto" }}
      >
        <defs>
          {/* Arrow marker — refX="9" keeps tip flush with destination */}
          <marker
            id="arrow-default"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0,1 L9,5 L0,9 z" fill="#FF5722" />
          </marker>
          <marker
            id="arrow-hover"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0,1 L9,5 L0,9 z" fill="#FF8A65" />
          </marker>

          {/* Subtle radial vignette */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="transparent" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0.7" />
          </radialGradient>
        </defs>

        {/* Countries */}
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1F2937"
                stroke="#374151"
                strokeWidth={0.4}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#374151", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {/* Edges */}
        {validEdges.map((edge, i) => {
          const key = edgeKey(edge);
          const isHovered = hoveredKey === key;
          const from = COUNTRY_COORDS[edge.from];
          const to = COUNTRY_COORDS[edge.to];
          const sw = strokeWidth(edge.count);

          return (
            <motion.g
              key={key}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0.75 }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{ cursor: "pointer" }}
              onMouseMove={(e) => {
                setHoveredKey(key);
                handleMouseMove(e as unknown as React.MouseEvent, edge);
              }}
              onMouseLeave={handleMouseLeave}
            >
              {/* Invisible fat hit-area so hovering is easy */}
              <Line
                from={from}
                to={to}
                stroke="transparent"
                strokeWidth={Math.max(sw + 8, 12)}
              />
              {/* Glow layer */}
              <Line
                from={from}
                to={to}
                stroke={isHovered ? "#FF8A65" : "#FF5722"}
                strokeWidth={sw + 3}
                strokeOpacity={0.15}
                strokeLinecap="round"
              />
              {/* Main line */}
              <Line
                from={from}
                to={to}
                stroke={isHovered ? "#FF8A65" : "#FF5722"}
                strokeWidth={sw}
                strokeLinecap="round"
                markerEnd={isHovered ? "url(#arrow-hover)" : "url(#arrow-default)"}
              />
            </motion.g>
          );
        })}

        {/* Origin / destination dots */}
        {validEdges.map((edge) => {
          const from = COUNTRY_COORDS[edge.from];
          const to = COUNTRY_COORDS[edge.to];
          return (
            <React.Fragment key={`dots-${edgeKey(edge)}`}>
              {/* Rendered as raw SVG circles via a foreignObject trick isn't possible;
                  use Marker or a custom SVG circle instead */}
            </React.Fragment>
          );
        })}

        {/* Vignette overlay */}
        <rect width="100%" height="100%" fill="url(#vignette)" pointerEvents="none" />
      </ComposableMap>

      {/* Legend */}
      <Legend edges={validEdges} />

      {/* Tooltip */}
      {tooltip && <Tooltip data={tooltip} />}
    </div>
  );
};

export default PlacementMap;
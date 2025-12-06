// Layout Diagram SVG Component
import React from "react";

const LayoutDiagram = ({ product }) => {
  const isFloating = product.deployment === "Floating";
  const hasUltrasonic = product.ultrasonic?.enabled;
  const hasSolar = product.solar !== null;
  const isXL = product.id === "smart-buoy-xl";

  return (
    <svg viewBox="0 0 600 450" style={{ width: "100%", maxWidth: 600 }}>
      <defs>
        <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="solarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="enclosureGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="600" height="450" fill="#0f172a" />

      {isFloating ? (
        <>
          {/* Water */}
          <rect x="0" y="220" width="600" height="230" fill="url(#waterGrad)" />
          <path d="M0,220 Q75,210 150,220 T300,220 T450,220 T600,220 L600,230 Q525,240 450,230 T300,230 T150,230 T0,230 Z" fill="#38bdf8" opacity="0.2" />

          {/* Float Platform */}
          <ellipse cx="300" cy="220" rx={isXL ? 180 : 100} ry="25" fill="#f59e0b" opacity="0.8" />
          <ellipse cx="300" cy="215" rx={isXL ? 170 : 90} ry="20" fill="#fbbf24" />

          {/* Enclosure */}
          <rect x="250" y="140" width="100" height="70" rx="8" fill="url(#enclosureGrad)" />
          <text x="300" y="180" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="600">ENCLOSURE</text>

          {/* Solar Panel */}
          {hasSolar && (
            <>
              <rect x="220" y="80" width="160" height="50" rx="4" fill="url(#solarGrad)" />
              <text x="300" y="110" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="600">
                {product.solar.watts}W SOLAR
              </text>
              {isXL && <rect x="390" y="80" width="80" height="50" rx="4" fill="url(#solarGrad)" />}
            </>
          )}

          {/* Ultrasonic Transducers */}
          {hasUltrasonic && (
            <>
              <rect x="270" y="250" width="60" height="30" rx="4" fill="#f97316" />
              <text x="300" y="270" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="600">ULTRASONIC</text>
              <line x1="300" y1="280" x2="300" y2="350" stroke="#f97316" strokeWidth="2" strokeDasharray="4" />
              <text x="300" y="370" textAnchor="middle" fill="#f97316" fontSize="10">28kHz waves</text>
              {isXL && (
                <>
                  <rect x="370" y="250" width="60" height="30" rx="4" fill="#f97316" />
                  <line x1="400" y1="280" x2="400" y2="350" stroke="#f97316" strokeWidth="2" strokeDasharray="4" />
                </>
              )}
            </>
          )}

          {/* Sensors */}
          <g transform="translate(180, 250)">
            <rect width="40" height="60" rx="4" fill="#22c55e" />
            <text x="20" y="35" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="600">SENSORS</text>
          </g>

          {/* Anchor */}
          <line x1="300" y1="240" x2="300" y2="420" stroke="#94a3b8" strokeWidth="2" />
          <polygon points="290,420 310,420 300,440" fill="#94a3b8" />
          <text x="300" y="445" textAnchor="middle" fill="#94a3b8" fontSize="10">ANCHOR</text>
        </>
      ) : (
        <>
          {/* Shore/Ground */}
          <rect x="0" y="280" width="300" height="170" fill="#78716c" opacity="0.3" />
          <rect x="300" y="320" width="300" height="130" fill="url(#waterGrad)" />
          <path d="M300,280 L300,320 Q350,340 300,360 L300,450" stroke="#78716c" strokeWidth="3" fill="none" />

          {/* Mounting Pole */}
          <rect x="140" y="100" width="20" height="180" fill="#94a3b8" />

          {/* Enclosure */}
          <rect x="100" y="120" width="100" height="70" rx="8" fill="url(#enclosureGrad)" />
          <text x="150" y="160" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="600">ENCLOSURE</text>

          {/* Solar Panel */}
          {hasSolar && (
            <>
              <rect x="85" y="50" width="130" height="60" rx="4" fill="url(#solarGrad)" transform="rotate(-15, 150, 80)" />
              <text x="150" y="80" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="600" transform="rotate(-15, 150, 80)">
                {product.solar.watts}W SOLAR
              </text>
            </>
          )}

          {/* Cable to water */}
          <path d="M150,190 L150,250 Q150,300 200,320 L350,340" stroke="#475569" strokeWidth="4" fill="none" />

          {/* Ultrasonic in water */}
          {hasUltrasonic && (
            <>
              <rect x="330" y="330" width="60" height="30" rx="4" fill="#f97316" />
              <text x="360" y="350" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="600">ULTRASONIC</text>
              <line x1="360" y1="360" x2="360" y2="420" stroke="#f97316" strokeWidth="2" strokeDasharray="4" />
              <text x="360" y="440" textAnchor="middle" fill="#f97316" fontSize="10">28kHz waves</text>
            </>
          )}

          {/* Sensors in water */}
          <g transform="translate(420, 350)">
            <rect width="40" height="60" rx="4" fill="#22c55e" />
            <text x="20" y="35" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="600">SENSORS</text>
          </g>

          {/* AC Power */}
          {product.power.type === "AC" && (
            <>
              <line x1="50" y1="150" x2="100" y2="150" stroke="#fbbf24" strokeWidth="3" />
              <text x="30" y="155" textAnchor="middle" fill="#fbbf24" fontSize="10">AC</text>
            </>
          )}

          {/* Battery */}
          {product.battery && (
            <g transform="translate(220, 140)">
              <rect width="50" height="35" rx="4" fill="#4ade80" opacity="0.8" />
              <text x="25" y="22" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="600">BATTERY</text>
            </g>
          )}
        </>
      )}

      {/* Labels */}
      <text x="20" y="30" fill="#60a5fa" fontSize="14" fontWeight="700">{product.name}</text>
      <text x="20" y="48" fill="#94a3b8" fontSize="11">{product.deployment} Deployment</text>
    </svg>
  );
};

export default LayoutDiagram;

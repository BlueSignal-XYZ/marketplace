import styled from 'styled-components';

const DiagramSvg = styled.svg`
  width: 100%;
  height: auto;
  display: block;

  .water-flow {
    stroke-dasharray: 8 12;
    animation: waterFlow 1.5s linear infinite;
  }
  .data-flow {
    stroke-dasharray: 6 10;
    animation: dataFlow 1s linear infinite;
  }
  .sensor-glow {
    animation: sensorGlow 2s ease-in-out infinite;
  }
  .pulse-dot {
    animation: pulse 2s ease-in-out infinite;
  }

  .label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .label-sm {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 7px;
    font-weight: 400;
  }
  .label-data {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8px;
    font-weight: 500;
  }
  .label-title {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    font-weight: 600;
  }
  .label-pin {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 5.5px;
    font-weight: 400;
  }
`;

/* ── Colour constants ───────────────────────────────── */
const C = {
  green: '#34d399',
  blue: '#2d8cf0',
  red: '#f87171',
  amber: '#fbbf24',
  w: (a) => `rgba(255,255,255,${a})`,
  g: (a) => `rgba(52,211,153,${a})`,
  b: (a) => `rgba(45,140,240,${a})`,
  r: (a) => `rgba(248,113,113,${a})`,
  a: (a) => `rgba(251,191,36,${a})`,
};

const WiringDiagram = () => (
  <DiagramSvg viewBox="0 0 580 490" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wd-boardGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#171a1d" />
        <stop offset="100%" stopColor="#0f1114" />
      </linearGradient>
      <linearGradient id="wd-powerGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#f87171" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#f87171" stopOpacity="0.1" />
      </linearGradient>
    </defs>

    {/* ══════════════════════════════════════════════════════
        PCB BOARD
    ══════════════════════════════════════════════════════ */}
    <g>
      {/* ── Board outline ── */}
      <rect x="35" y="52" width="475" height="365" rx="5" fill="url(#wd-boardGrad)" stroke={C.g(0.35)} strokeWidth="1.2" />

      {/* ── Mounting holes (4 corners) ── */}
      {[[52, 69], [493, 69], [52, 400], [493, 400]].map(([cx, cy]) => (
        <g key={`mh-${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r="6" fill="none" stroke={C.w(0.1)} strokeWidth="0.8" />
          <circle cx={cx} cy={cy} r="2.5" fill={C.w(0.06)} stroke={C.w(0.12)} strokeWidth="0.5" />
        </g>
      ))}

      {/* ── Board label ── */}
      <text x="275" y="67" textAnchor="middle" fill={C.g(0.3)} className="label">WQM-1 Rev 2.1</text>

      {/* ── Subtle PCB traces (background detail) ── */}
      <path d="M120 130 L120 190 L145 190" stroke={C.w(0.03)} strokeWidth="0.5" />
      <path d="M280 200 L290 200 L290 240" stroke={C.w(0.03)} strokeWidth="0.5" />
      <path d="M420 160 L420 175" stroke={C.w(0.03)} strokeWidth="0.5" />
      <path d="M350 280 L400 280 L400 310" stroke={C.w(0.03)} strokeWidth="0.5" />
      <path d="M200 310 L200 370" stroke={C.w(0.03)} strokeWidth="0.5" />
      {/* Scattered SMD components */}
      {[[155, 95, 8, 4], [175, 100, 6, 3], [195, 93, 4, 6], [320, 145, 6, 3], [340, 148, 4, 5],
        [255, 155, 8, 3], [270, 160, 5, 3], [350, 100, 6, 4], [365, 105, 4, 6],
        [300, 310, 6, 3], [315, 315, 5, 4], [260, 340, 8, 3], [280, 345, 4, 6],
        [380, 290, 6, 3], [395, 285, 4, 5], [180, 280, 8, 4], [200, 275, 5, 3],
      ].map(([x, y, w, h], i) => (
        <rect key={`smd-${i}`} x={x} y={y} width={w} height={h} rx="0.5" fill={C.w(0.03)} stroke={C.w(0.04)} strokeWidth="0.3" />
      ))}

      {/* ════════════════════════════════════════════════════
          VIN / GND — top-left power input
      ════════════════════════════════════════════════════ */}
      <g>
        {/* Screw terminal block */}
        <rect x="48" y="38" width="58" height="28" rx="3" fill={C.r(0.06)} stroke={C.r(0.35)} strokeWidth="0.8" />
        {/* Screw circles */}
        <circle cx="66" cy="52" r="3.5" fill="none" stroke={C.r(0.3)} strokeWidth="0.6" />
        <circle cx="66" cy="52" r="1" fill={C.r(0.2)} />
        <circle cx="88" cy="52" r="3.5" fill="none" stroke={C.w(0.2)} strokeWidth="0.6" />
        <circle cx="88" cy="52" r="1" fill={C.w(0.1)} />
        {/* Labels */}
        <text x="66" y="46" textAnchor="middle" fill={C.r(0.55)} className="label-data">VIN</text>
        <text x="88" y="46" textAnchor="middle" fill={C.w(0.3)} className="label-data">GND</text>
        {/* Down arrows */}
        <path d="M66 30 L66 36 M63 34 L66 37 L69 34" stroke={C.r(0.4)} strokeWidth="0.8" fill="none" />
        <path d="M88 30 L88 36 M85 34 L88 37 L91 34" stroke={C.w(0.25)} strokeWidth="0.8" fill="none" />
        {/* Power trace to power reg */}
        <path d="M77 66 L77 88" stroke={C.r(0.15)} strokeWidth="0.6" strokeDasharray="2 3" />
      </g>

      {/* ════════════════════════════════════════════════════
          4× RELAY TERMINALS — top edge
      ════════════════════════════════════════════════════ */}
      <g>
        <text x="310" y="44" textAnchor="middle" fill={C.a(0.25)} className="label-sm">10A · 250VAC</text>
        {[0, 1, 2, 3].map(i => {
          const bx = 155 + i * 85;
          return (
            <g key={`rt-${i}`}>
              <rect x={bx} y="48" width="75" height="24" rx="3" fill={C.a(0.04)} stroke={C.a(0.3)} strokeWidth="0.8" />
              {/* 3 screw terminals */}
              {[0, 1, 2].map(j => {
                const tcx = bx + 15 + j * 22;
                return <circle key={`rt-c-${i}-${j}`} cx={tcx} cy="60" r="3" fill="none" stroke={C.a(0.25)} strokeWidth="0.6" />;
              })}
              {/* NC / COM / NO labels */}
              <text x={bx + 15} y="56" textAnchor="middle" fill={C.w(0.15)} className="label-pin">{`NC${i + 1}`}</text>
              <text x={bx + 37} y="56" textAnchor="middle" fill={C.w(0.15)} className="label-pin">COM</text>
              <text x={bx + 59} y="56" textAnchor="middle" fill={C.w(0.15)} className="label-pin">{`NO${i + 1}`}</text>
            </g>
          );
        })}
      </g>

      {/* ════════════════════════════════════════════════════
          4× RELAY DRIVER ICs — below terminals
      ════════════════════════════════════════════════════ */}
      <g>
        {[0, 1, 2, 3].map(i => {
          const bx = 163 + i * 85;
          const cx = bx + 30;
          return (
            <g key={`ri-${i}`}>
              <rect x={bx} y="86" width="60" height="36" rx="3" fill={C.w(0.02)} stroke={C.a(0.2)} strokeWidth="0.6" />
              <text x={cx} y="104" textAnchor="middle" fill={C.a(0.45)} className="label-data">{`CH${i + 1}`}</text>
              <text x={cx} y="115" textAnchor="middle" fill={C.w(0.18)} className="label-sm">Relay</text>
              {/* Trace IC → terminal */}
              <line x1={cx} y1="86" x2={192 + i * 85} y2="72" stroke={C.a(0.12)} strokeWidth="0.5" strokeDasharray="2 3" />
            </g>
          );
        })}
      </g>

      {/* ════════════════════════════════════════════════════
          POWER REGULATION — upper-left
      ════════════════════════════════════════════════════ */}
      <g>
        <rect x="48" y="88" width="75" height="42" rx="3" fill={C.w(0.02)} stroke={C.r(0.22)} strokeWidth="0.6" />
        <text x="86" y="108" textAnchor="middle" fill={C.r(0.4)} className="label-data">Power Reg</text>
        <text x="86" y="120" textAnchor="middle" fill={C.w(0.2)} className="label-sm">5V / 3.3V</text>
        {/* Capacitors */}
        <rect x="130" y="92" width="6" height="12" rx="1" fill="none" stroke={C.r(0.12)} strokeWidth="0.4" />
        <rect x="140" y="92" width="6" height="12" rx="1" fill="none" stroke={C.r(0.12)} strokeWidth="0.4" />
        <rect x="130" y="108" width="6" height="12" rx="1" fill="none" stroke={C.r(0.1)} strokeWidth="0.4" />
      </g>

      {/* ════════════════════════════════════════════════════
          STATUS LEDs — left side
      ════════════════════════════════════════════════════ */}
      <g>
        {/* PWR */}
        <circle cx="56" cy="158" r="3" fill={C.red} className="pulse-dot" />
        <text x="64" y="161" fill={C.w(0.25)} className="label-sm">PWR</text>
        {/* STA1–STA4 */}
        {[
          { cy: 178, color: C.green, label: 'STA1', delay: '0s' },
          { cy: 194, color: C.green, label: 'STA2', delay: '0.3s' },
          { cy: 210, color: C.blue, label: 'STA3', delay: '0.6s' },
          { cy: 226, color: C.blue, label: 'STA4', delay: '0.9s' },
        ].map(({ cy, color, label, delay }) => (
          <g key={label}>
            <circle cx="56" cy={cy} r="2.5" fill={color} className="pulse-dot" style={{ animationDelay: delay }} />
            <text x="64" y={cy + 3} fill={C.w(0.2)} className="label-sm">{label}</text>
          </g>
        ))}
      </g>

      {/* ════════════════════════════════════════════════════
          D17 DIODE — center area detail
      ════════════════════════════════════════════════════ */}
      <g>
        <rect x="130" y="155" width="14" height="8" rx="1" fill="none" stroke={C.w(0.08)} strokeWidth="0.5" />
        <text x="137" y="172" textAnchor="middle" fill={C.w(0.1)} className="label-pin">D17</text>
      </g>

      {/* ════════════════════════════════════════════════════
          ADS1115 ADC — center-left
      ════════════════════════════════════════════════════ */}
      <g>
        <rect x="145" y="200" width="105" height="55" rx="4" fill={C.w(0.02)} stroke={C.g(0.25)} strokeWidth="0.8" />
        <text x="198" y="225" textAnchor="middle" fill={C.g(0.5)} className="label-title">ADS1115</text>
        <text x="198" y="240" textAnchor="middle" fill={C.w(0.22)} className="label-sm">16-bit · 4ch</text>
        {/* Trace ADC → Processor */}
        <path d="M250 228 L275 228 L275 225 L290 225" stroke={C.w(0.06)} strokeWidth="0.6" strokeDasharray="2 4" />
      </g>

      {/* ════════════════════════════════════════════════════
          BCM2710A1 PROCESSOR — center-right
      ════════════════════════════════════════════════════ */}
      <g>
        <rect x="290" y="180" width="120" height="85" rx="4" fill={C.w(0.025)} stroke={C.w(0.14)} strokeWidth="0.8" />
        {/* QFN pads — top */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <rect key={`qfn-t-${i}`} x={298 + i * 13} y="178" width="7" height="3" rx="0.5" fill={C.w(0.06)} />
        ))}
        {/* QFN pads — bottom */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <rect key={`qfn-b-${i}`} x={298 + i * 13} y="263" width="7" height="3" rx="0.5" fill={C.w(0.06)} />
        ))}
        {/* QFN pads — left */}
        {[0, 1, 2, 3, 4].map(i => (
          <rect key={`qfn-l-${i}`} x="288" y={190 + i * 13} width="3" height="7" rx="0.5" fill={C.w(0.06)} />
        ))}
        {/* QFN pads — right */}
        {[0, 1, 2, 3, 4].map(i => (
          <rect key={`qfn-r-${i}`} x="409" y={190 + i * 13} width="3" height="7" rx="0.5" fill={C.w(0.06)} />
        ))}
        {/* Thermal pad */}
        <rect x="322" y="207" width="56" height="34" rx="2" fill={C.w(0.03)} stroke={C.w(0.05)} strokeWidth="0.4" />
        {/* Labels */}
        <text x="350" y="224" textAnchor="middle" fill={C.w(0.4)} className="label-title">BCM2710A1</text>
        <text x="350" y="238" textAnchor="middle" fill={C.w(0.22)} className="label-sm">Quad A53</text>
        {/* Indicator LEDs */}
        <circle cx="300" cy="192" r="2" fill={C.green} className="pulse-dot" />
        <circle cx="300" cy="200" r="2" fill={C.blue} className="pulse-dot" style={{ animationDelay: '0.7s' }} />
      </g>

      {/* ════════════════════════════════════════════════════
          GPS MODULE — right side, upper
      ════════════════════════════════════════════════════ */}
      <g>
        <rect x="430" y="92" width="65" height="38" rx="3" fill={C.w(0.02)} stroke={C.b(0.22)} strokeWidth="0.6" />
        <text x="462" y="112" textAnchor="middle" fill={C.b(0.45)} className="label-data">GPS</text>
        <text x="462" y="124" textAnchor="middle" fill={C.w(0.18)} className="label-sm">u.FL</text>
        {/* Trace to SMA */}
        <path d="M495 110 L510 110 L515 110" stroke={C.b(0.2)} strokeWidth="0.6" strokeDasharray="2 3" />
        {/* Trace to processor */}
        <path d="M430 115 L415 115 L415 180" stroke={C.w(0.05)} strokeWidth="0.5" strokeDasharray="2 4" />
      </g>

      {/* ════════════════════════════════════════════════════
          SX1262 LoRa — right side, below GPS
      ════════════════════════════════════════════════════ */}
      <g>
        <rect x="430" y="148" width="65" height="42" rx="4" fill={C.w(0.02)} stroke={C.b(0.28)} strokeWidth="0.8" />
        <text x="462" y="168" textAnchor="middle" fill={C.b(0.5)} className="label-data">SX1262</text>
        <text x="462" y="181" textAnchor="middle" fill={C.w(0.22)} className="label-sm">LoRa</text>
        {/* Trace to SMA */}
        <path d="M495 167 L510 167 L515 167" stroke={C.b(0.3)} strokeWidth="1" strokeDasharray="3 3" className="data-flow" />
        {/* Trace to processor */}
        <path d="M430 170 L415 170 L415 190" stroke={C.w(0.05)} strokeWidth="0.5" strokeDasharray="2 4" />
      </g>

      {/* ════════════════════════════════════════════════════
          PH BNC CONNECTOR — right edge, lower
      ════════════════════════════════════════════════════ */}
      <g>
        {/* BNC connector body (straddles board edge) */}
        <circle cx="500" cy="330" r="13" fill="#0f1114" stroke={C.g(0.35)} strokeWidth="1" />
        <circle cx="500" cy="330" r="6" fill="none" stroke={C.g(0.25)} strokeWidth="0.8" />
        <circle cx="500" cy="330" r="2.5" fill={C.green} opacity="0.4" className="sensor-glow" />
        <text x="500" y="350" textAnchor="middle" fill={C.w(0.25)} className="label-sm">PH</text>
        <text x="500" y="361" textAnchor="middle" fill={C.g(0.3)} className="label-sm">BNC</text>
        {/* Trace BNC → ADC */}
        <path d="M487 330 L440 330 L440 250 L250 250" stroke={C.g(0.1)} strokeWidth="0.6" strokeDasharray="2 4" />
      </g>

      {/* ════════════════════════════════════════════════════
          BLUESIGNAL XYZ LOGO — lower-right
      ════════════════════════════════════════════════════ */}
      <g>
        {/* Wave curves (matching real board silkscreen) */}
        <path d="M470 260 Q482 275 470 290" fill="none" stroke={C.w(0.2)} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M476 262 Q488 277 476 292" fill="none" stroke={C.w(0.16)} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M482 264 Q494 279 482 294" fill="none" stroke={C.w(0.12)} strokeWidth="2.5" strokeLinecap="round" />
        {/* Brand text (rotated) */}
        <text
          x="488" y="310"
          fill={C.w(0.22)}
          style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, letterSpacing: '0.12em' }}
          transform="rotate(-90 488 310)"
        >BlueSignal XYZ</text>
      </g>

      {/* ════════════════════════════════════════════════════
          GPIO HEADER — lower-left
      ════════════════════════════════════════════════════ */}
      <g>
        <rect x="48" y="268" width="105" height="62" rx="2" fill={C.w(0.02)} stroke={C.w(0.1)} strokeWidth="0.5" />
        <text x="100" y="282" textAnchor="middle" fill={C.w(0.25)} className="label-sm">GPIO Header</text>
        {/* Pin grid (4 rows × 6 cols) */}
        {[0, 1, 2, 3].map(r =>
          [0, 1, 2, 3, 4, 5].map(c => (
            <circle key={`gpio-${r}-${c}`} cx={62 + c * 15} cy={290 + r * 9} r="1.5" fill={C.w(0.15)} />
          ))
        )}
        {/* Pin labels */}
        {['3V3', '+5V', 'IO6', 'IO7', 'IO8', 'IO22'].map((label, c) => (
          <text key={`gl-${c}`} x={62 + c * 15} y="327" textAnchor="middle" fill={C.w(0.12)} className="label-pin">{label}</text>
        ))}
      </g>

      {/* ════════════════════════════════════════════════════
          SENSOR / I²C HEADER — bottom edge
      ════════════════════════════════════════════════════ */}
      <g>
        <rect x="48" y="385" width="400" height="16" rx="2" fill={C.g(0.04)} stroke={C.g(0.18)} strokeWidth="0.5" />
        {/* Pin dots */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
          <circle
            key={`hdr-${i}`}
            cx={68 + i * 32}
            cy="393"
            r="1.8"
            fill={i < 4 ? C.green : i < 7 ? C.blue : C.w(0.2)}
            opacity={i < 7 ? 0.5 : 0.3}
          />
        ))}
        {/* Pin labels */}
        {['SDA', 'SCL', 'GND', 'V+', 'GND', '3V3', '1W', 'OUT', 'IN', 'OUT', 'IN', '5V'].map((label, i) => (
          <text key={`hl-${i}`} x={68 + i * 32} y="412" textAnchor="middle" fill={C.w(0.14)} className="label-pin">{label}</text>
        ))}
        {/* Trace header → ADC */}
        <path d="M100 385 L100 255 L145 255" stroke={C.g(0.08)} strokeWidth="0.5" strokeDasharray="2 3" />
      </g>

      {/* ── Processor → Relay driver traces ── */}
      <path d="M350 265 L350 280 L290 280 L290 122" stroke={C.a(0.07)} strokeWidth="0.5" strokeDasharray="2 4" />

      {/* ════════════════════════════════════════════════════
          EDGE CONNECTORS (protruding from board)
      ════════════════════════════════════════════════════ */}

      {/* SMA — GPS */}
      <g>
        <rect x="515" y="102" width="22" height="16" rx="2" fill="#0f1114" stroke={C.b(0.35)} strokeWidth="0.8" />
        <text x="526" y="128" textAnchor="middle" fill={C.b(0.35)} className="label-sm">SMA</text>
      </g>

      {/* SMA — LoRa */}
      <g>
        <rect x="515" y="159" width="22" height="16" rx="2" fill="#0f1114" stroke={C.b(0.4)} strokeWidth="0.8" />
        <text x="526" y="184" textAnchor="middle" fill={C.b(0.35)} className="label-sm">SMA</text>
        {/* Signal arcs from LoRa SMA */}
        <path d="M542 160 Q548 154 554 160" fill="none" stroke={C.b(0.35)} strokeWidth="0.8">
          <animate attributeName="opacity" values="0.35;0.1;0.35" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M539 154 Q548 146 557 154" fill="none" stroke={C.b(0.25)} strokeWidth="0.8">
          <animate attributeName="opacity" values="0.25;0.05;0.25" dur="2s" begin="0.3s" repeatCount="indefinite" />
        </path>
      </g>

      {/* BNC — PH (protruding) */}
      <g>
        <rect x="515" y="320" width="28" height="20" rx="2" fill="#0f1114" stroke={C.g(0.3)} strokeWidth="0.8" />
        {/* BNC ridges */}
        {[0, 1, 2, 3, 4].map(i => (
          <line key={`bnc-r-${i}`} x1="543" y1={323 + i * 4} x2="543" y2={325 + i * 4} stroke={C.w(0.12)} strokeWidth="1.2" />
        ))}
        <path d="M510 330 L515 330" stroke={C.g(0.2)} strokeWidth="0.6" />
      </g>
    </g>

    {/* ══════════════════════════════════════════════════════
        COLOR LEGEND
    ══════════════════════════════════════════════════════ */}
    <g>
      {[
        { cx: 160, color: C.green, label: 'Sensor' },
        { cx: 230, color: C.blue, label: 'Data' },
        { cx: 290, color: C.red, label: 'Power' },
        { cx: 360, color: C.amber, label: 'Control' },
      ].map(({ cx, color, label }) => (
        <g key={label}>
          <circle cx={cx} cy="462" r="4" fill={color} opacity="0.55" />
          <text x={cx + 10} y="465" fill={C.w(0.35)} className="label-sm">{label}</text>
        </g>
      ))}
    </g>
  </DiagramSvg>
);

export default WiringDiagram;

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
`;

/* ── Colour helpers ─────────────────────────────────── */
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

const SystemDiagram = () => (
  <DiagramSvg viewBox="0 0 660 580" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sd-boardGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#171a1d" />
        <stop offset="100%" stopColor="#0f1114" />
      </linearGradient>
    </defs>

    {/* ══════════════════════════════════════════════════════
        IP65 ENCLOSURE
    ══════════════════════════════════════════════════════ */}
    <g>
      {/* Main enclosure body */}
      <rect x="80" y="30" width="500" height="280" rx="12" fill="#0f1114" stroke={C.w(0.12)} strokeWidth="1.8" />
      {/* Enclosure label */}
      <text x="330" y="322" textAnchor="middle" fill={C.w(0.12)} className="label">IP65 Rated Enclosure</text>

      {/* Corner mounting lugs */}
      {[[96, 46], [564, 46], [96, 294], [564, 294]].map(([cx, cy]) => (
        <circle key={`lug-${cx}-${cy}`} cx={cx} cy={cy} r="5" fill="none" stroke={C.w(0.08)} strokeWidth="0.8" />
      ))}

      {/* ── Cable glands ── */}
      {/* Left: power */}
      <circle cx="80" cy="110" r="6" fill="#0f1114" stroke={C.w(0.14)} strokeWidth="0.8" />
      {/* Bottom: sensors, I2C */}
      <circle cx="220" cy="310" r="6" fill="#0f1114" stroke={C.w(0.14)} strokeWidth="0.8" />
      <circle cx="340" cy="310" r="6" fill="#0f1114" stroke={C.w(0.14)} strokeWidth="0.8" />
      {/* Right: LoRa SMA, GPS SMA, PH BNC */}
      <circle cx="580" cy="120" r="6" fill="#0f1114" stroke={C.w(0.14)} strokeWidth="0.8" />
      <circle cx="580" cy="170" r="6" fill="#0f1114" stroke={C.w(0.14)} strokeWidth="0.8" />
      <circle cx="580" cy="240" r="6" fill="#0f1114" stroke={C.w(0.14)} strokeWidth="0.8" />
      {/* Top: relay output */}
      <circle cx="460" cy="30" r="6" fill="#0f1114" stroke={C.w(0.14)} strokeWidth="0.8" />

      {/* ── PCB Board (simplified) ── */}
      <g>
        <rect x="110" y="55" width="440" height="235" rx="5" fill="url(#sd-boardGrad)" stroke={C.g(0.3)} strokeWidth="0.8" />
        {/* Board label */}
        <text x="330" y="75" textAnchor="middle" fill={C.g(0.25)} className="label-data">WQM-1 Rev 2.1</text>

        {/* Simplified component blocks */}
        {/* VIN/GND */}
        <rect x="125" y="82" width="45" height="18" rx="2" fill={C.r(0.05)} stroke={C.r(0.2)} strokeWidth="0.5" />
        <text x="148" y="94" textAnchor="middle" fill={C.r(0.4)} className="label-sm">VIN</text>

        {/* Power Reg */}
        <rect x="125" y="110" width="55" height="25" rx="2" fill={C.w(0.02)} stroke={C.r(0.15)} strokeWidth="0.5" />
        <text x="153" y="126" textAnchor="middle" fill={C.r(0.3)} className="label-sm">Power</text>

        {/* Status LEDs */}
        <circle cx="132" cy="155" r="2" fill={C.red} className="pulse-dot" />
        <circle cx="132" cy="167" r="1.5" fill={C.green} className="pulse-dot" style={{ animationDelay: '0.3s' }} />
        <circle cx="132" cy="177" r="1.5" fill={C.green} className="pulse-dot" style={{ animationDelay: '0.6s' }} />

        {/* Relay ICs */}
        {[0, 1, 2, 3].map(i => (
          <g key={`ri-${i}`}>
            <rect x={200 + i * 55} y="86" width="45" height="22" rx="2" fill={C.a(0.04)} stroke={C.a(0.15)} strokeWidth="0.5" />
            <text x={222 + i * 55} y="100" textAnchor="middle" fill={C.a(0.35)} className="label-sm">{`CH${i + 1}`}</text>
          </g>
        ))}

        {/* ADS1115 */}
        <rect x="195" y="155" width="70" height="35" rx="3" fill={C.w(0.02)} stroke={C.g(0.2)} strokeWidth="0.5" />
        <text x="230" y="175" textAnchor="middle" fill={C.g(0.35)} className="label-sm">ADS1115</text>

        {/* Processor */}
        <rect x="295" y="140" width="85" height="60" rx="3" fill={C.w(0.02)} stroke={C.w(0.1)} strokeWidth="0.6" />
        <text x="338" y="170" textAnchor="middle" fill={C.w(0.3)} className="label-data">BCM2710A1</text>
        <text x="338" y="183" textAnchor="middle" fill={C.w(0.15)} className="label-sm">Quad A53</text>

        {/* GPS */}
        <rect x="430" y="110" width="50" height="25" rx="2" fill={C.w(0.02)} stroke={C.b(0.18)} strokeWidth="0.5" />
        <text x="455" y="126" textAnchor="middle" fill={C.b(0.35)} className="label-sm">GPS</text>

        {/* LoRa */}
        <rect x="430" y="148" width="50" height="28" rx="2" fill={C.w(0.02)} stroke={C.b(0.22)} strokeWidth="0.5" />
        <text x="455" y="166" textAnchor="middle" fill={C.b(0.4)} className="label-sm">SX1262</text>

        {/* PH */}
        <circle cx="495" cy="230" r="9" fill="#0f1114" stroke={C.g(0.25)} strokeWidth="0.6" />
        <text x="495" y="233" textAnchor="middle" fill={C.g(0.3)} className="label-sm">PH</text>

        {/* GPIO */}
        <rect x="125" y="200" width="55" height="35" rx="2" fill={C.w(0.02)} stroke={C.w(0.08)} strokeWidth="0.4" />
        <text x="153" y="221" textAnchor="middle" fill={C.w(0.18)} className="label-sm">GPIO</text>

        {/* Bottom header */}
        <rect x="195" y="255" width="250" height="10" rx="1.5" fill={C.g(0.04)} stroke={C.g(0.12)} strokeWidth="0.4" />

        {/* BlueSignal logo (simplified) */}
        <path d="M505 200 Q512 210 505 220" fill="none" stroke={C.w(0.12)} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M509 202 Q516 212 509 222" fill="none" stroke={C.w(0.1)} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M513 204 Q520 214 513 224" fill="none" stroke={C.w(0.08)} strokeWidth="1.5" strokeLinecap="round" />

        {/* Internal traces (subtle) */}
        <path d="M148 100 L148 110" stroke={C.r(0.1)} strokeWidth="0.4" strokeDasharray="2 3" />
        <path d="M265 172 L295 172" stroke={C.w(0.05)} strokeWidth="0.4" strokeDasharray="2 3" />
        <path d="M380 170 L430 155" stroke={C.w(0.04)} strokeWidth="0.4" strokeDasharray="2 3" />
        <path d="M380 165 L430 162" stroke={C.w(0.04)} strokeWidth="0.4" strokeDasharray="2 3" />
      </g>
    </g>

    {/* ══════════════════════════════════════════════════════
        EXTERNAL WIRING
    ══════════════════════════════════════════════════════ */}

    {/* ── LoRa Antenna (right side) ── */}
    <g>
      {/* SMA connector */}
      <rect x="582" y="112" width="14" height="16" rx="2" fill="#0f1114" stroke={C.b(0.4)} strokeWidth="0.8" />
      {/* Cable to antenna */}
      <path d="M596 120 L620 120 L620 80" stroke={C.b(0.3)} strokeWidth="1.5" strokeDasharray="4 4" className="data-flow" fill="none" />
      {/* Antenna mast */}
      <line x1="620" y1="80" x2="620" y2="40" stroke={C.w(0.3)} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="620" cy="36" r="3.5" fill="none" stroke={C.b(0.5)} strokeWidth="1.2" />
      <circle cx="620" cy="36" r="1.5" fill={C.blue} opacity="0.6" />
      {/* Signal arcs */}
      <path d="M612 30 Q620 22 628 30" fill="none" stroke={C.b(0.35)} strokeWidth="0.8">
        <animate attributeName="opacity" values="0.35;0.1;0.35" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M608 24 Q620 14 632 24" fill="none" stroke={C.b(0.25)} strokeWidth="0.8">
        <animate attributeName="opacity" values="0.25;0.05;0.25" dur="2s" begin="0.3s" repeatCount="indefinite" />
      </path>
      <text x="620" y="17" textAnchor="middle" fill={C.w(0.22)} className="label-sm">915 MHz</text>
      <text x="620" y="100" textAnchor="middle" fill={C.w(0.2)} className="label-sm">LoRa Antenna</text>
    </g>

    {/* ── GPS SMA (right side, below LoRa) ── */}
    <g>
      <rect x="582" y="162" width="14" height="16" rx="2" fill="#0f1114" stroke={C.b(0.3)} strokeWidth="0.8" />
      <text x="608" y="175" fill={C.b(0.25)} className="label-sm">GPS</text>
    </g>

    {/* ── DC Power Supply (left side) ── */}
    <g>
      {/* Power cable from enclosure */}
      <path d="M80 110 L50 110 L50 390" stroke={C.r(0.35)} strokeWidth="2" strokeDasharray="4 4" fill="none" />
      <path d="M52 110 L52 390" stroke={C.w(0.05)} strokeWidth="1" strokeDasharray="4 4" fill="none" />
      {/* Power supply icon */}
      <rect x="26" y="390" width="48" height="48" rx="5" fill="#0f1114" stroke={C.r(0.3)} strokeWidth="1" />
      {/* + symbol */}
      <line x1="38" y1="408" x2="46" y2="408" stroke={C.red} strokeWidth="1.2" />
      <line x1="42" y1="404" x2="42" y2="412" stroke={C.red} strokeWidth="1.2" />
      {/* - symbol */}
      <line x1="56" y1="408" x2="64" y2="408" stroke={C.w(0.3)} strokeWidth="1.2" />
      <text x="50" y="428" textAnchor="middle" fill={C.r(0.5)} className="label-data">9–24V</text>
      <text x="50" y="452" textAnchor="middle" fill={C.w(0.22)} className="label-sm">DC Power</text>
    </g>

    {/* ── pH Probe (right side, from BNC) ── */}
    <g>
      <path d="M580 240 L610 240 L610 390" stroke={C.g(0.35)} strokeWidth="2" strokeDasharray="4 4" className="sensor-glow" fill="none" />
      <rect x="596" y="390" width="28" height="55" rx="4" fill="#0f1114" stroke={C.g(0.3)} strokeWidth="1" />
      {/* Probe tip */}
      <line x1="610" y1="445" x2="610" y2="470" stroke={C.g(0.4)} strokeWidth="1.5" />
      <circle cx="610" cy="473" r="3" fill={C.green} opacity="0.4" className="sensor-glow" />
      <text x="610" y="408" textAnchor="middle" fill={C.g(0.55)} className="label-data">pH</text>
      <text x="610" y="420" textAnchor="middle" fill={C.w(0.2)} className="label-sm">0–14</text>
      <text x="610" y="492" textAnchor="middle" fill={C.w(0.2)} className="label-sm">pH Probe</text>
    </g>

    {/* ── Sensor Array (from bottom header) ── */}
    <g>
      {/* Main cable */}
      <path d="M220 310 L220 360" stroke={C.g(0.3)} strokeWidth="2" strokeDasharray="4 4" className="sensor-glow" fill="none" />
      {/* Branch to 3 sensors */}
      <path d="M220 360 L190 380" stroke={C.b(0.25)} strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
      <path d="M220 360 L220 380" stroke={C.b(0.25)} strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
      <path d="M220 360 L250 380" stroke={C.a(0.25)} strokeWidth="1.2" strokeDasharray="3 3" fill="none" />

      {/* TDS probe */}
      <rect x="177" y="380" width="26" height="42" rx="3" fill="#0f1114" stroke={C.b(0.25)} strokeWidth="0.8" />
      <text x="190" y="398" textAnchor="middle" fill={C.b(0.5)} className="label-data">TDS</text>
      <line x1="190" y1="422" x2="190" y2="445" stroke={C.b(0.3)} strokeWidth="1.2" />
      <circle cx="190" cy="448" r="2.5" fill={C.blue} opacity="0.4" className="sensor-glow" />

      {/* ORP probe */}
      <rect x="207" y="380" width="26" height="42" rx="3" fill="#0f1114" stroke={C.b(0.25)} strokeWidth="0.8" />
      <text x="220" y="398" textAnchor="middle" fill={C.b(0.5)} className="label-data">ORP</text>
      <line x1="220" y1="422" x2="220" y2="445" stroke={C.b(0.3)} strokeWidth="1.2" />
      <circle cx="220" cy="448" r="2.5" fill={C.blue} opacity="0.4" className="sensor-glow" style={{ animationDelay: '0.4s' }} />

      {/* Turbidity probe */}
      <rect x="237" y="380" width="26" height="42" rx="3" fill="#0f1114" stroke={C.a(0.25)} strokeWidth="0.8" />
      <text x="250" y="398" textAnchor="middle" fill={C.a(0.5)} className="label-data">Turb</text>
      <line x1="250" y1="422" x2="250" y2="445" stroke={C.a(0.3)} strokeWidth="1.2" />
      <circle cx="250" cy="448" r="2.5" fill={C.amber} opacity="0.4" className="sensor-glow" style={{ animationDelay: '0.8s' }} />

      <text x="220" y="468" textAnchor="middle" fill={C.w(0.2)} className="label-sm">Sensor Array</text>
    </g>

    {/* ── I²C Expansion (from bottom header) ── */}
    <g>
      <path d="M340 310 L340 380" stroke={C.b(0.25)} strokeWidth="1.5" strokeDasharray="4 6" fill="none" />
      <rect x="315" y="380" width="50" height="35" rx="4" fill="#0f1114" stroke={C.b(0.2)} strokeWidth="0.8" />
      <text x="340" y="398" textAnchor="middle" fill={C.b(0.4)} className="label-data">I²C</text>
      <text x="340" y="410" textAnchor="middle" fill={C.w(0.18)} className="label-sm">3.3V</text>
      {/* Connector pins */}
      {[0, 1, 2, 3].map(i => (
        <line key={`i2c-p-${i}`} x1={325 + i * 9} y1="380" x2={325 + i * 9} y2="375" stroke={C.b(0.2)} strokeWidth="0.6" />
      ))}
      <text x="340" y="428" textAnchor="middle" fill={C.w(0.2)} className="label-sm">Expansion</text>
    </g>

    {/* ── Relay Output / Chemical Doser ── */}
    <g>
      {/* Trace from relay area through enclosure */}
      <path d="M460 30 L460 0 L460 -5" stroke={C.a(0.15)} strokeWidth="0.5" strokeDasharray="2 3" fill="none" />
      <path d="M460 30 L460 380" stroke={C.a(0.3)} strokeWidth="1.5" strokeDasharray="5 5" className="data-flow" fill="none" />
      {/* Doser housing */}
      <rect x="435" y="380" width="50" height="48" rx="5" fill="#0f1114" stroke={C.a(0.3)} strokeWidth="1" />
      {/* Pump icon */}
      <rect x="448" y="388" width="24" height="14" rx="2" fill="none" stroke={C.a(0.25)} strokeWidth="0.8" />
      <rect x="449" y="396" width="22" height="5" rx="1" fill={C.a(0.08)} />
      {/* Drip line */}
      <line x1="460" y1="402" x2="460" y2="412" stroke={C.a(0.3)} strokeWidth="1" />
      <circle cx="460" cy="416" r="1.5" fill={C.a(0.35)}>
        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <text x="460" y="434" textAnchor="middle" fill={C.a(0.5)} className="label-data">Doser</text>
      <text x="460" y="448" textAnchor="middle" fill={C.w(0.2)} className="label-sm">Relay Out</text>
      <text x="460" y="460" textAnchor="middle" fill={C.w(0.15)} className="label-sm">10A · 250VAC</text>
    </g>

    {/* ══════════════════════════════════════════════════════
        COLOR LEGEND
    ══════════════════════════════════════════════════════ */}
    <g>
      {[
        { cx: 180, color: C.green, label: 'Sensor' },
        { cx: 260, color: C.blue, label: 'Data' },
        { cx: 330, color: C.red, label: 'Power' },
        { cx: 410, color: C.amber, label: 'Control' },
      ].map(({ cx, color, label }) => (
        <g key={label}>
          <circle cx={cx} cy="540" r="4" fill={color} opacity="0.55" />
          <text x={cx + 10} y="543" fill={C.w(0.35)} className="label-sm">{label}</text>
        </g>
      ))}
    </g>
  </DiagramSvg>
);

export default SystemDiagram;

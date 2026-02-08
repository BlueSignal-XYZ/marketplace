import styled from 'styled-components';

const SceneSvg = styled.svg`
  width: 100%;
  height: auto;
  display: block;

  /* Animation styles for SVG elements */
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
  .wave-surface {
    animation: waveMove 3s linear infinite;
  }
  .pulse-dot {
    animation: pulse 2s ease-in-out infinite;
  }

  /* Label text */
  .label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .label-sm {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 7.5px;
    font-weight: 400;
  }
  .label-data {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8px;
    font-weight: 500;
  }
  .label-title {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8.5px;
    font-weight: 600;
  }
`;

const SystemScene = () => (
  <SceneSvg viewBox="0 0 1400 480" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Definitions */}
    <defs>
      <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2d8cf0" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#2d8cf0" stopOpacity="0.15" />
      </linearGradient>
      <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0f1114" />
        <stop offset="100%" stopColor="#0a0b0d" />
      </linearGradient>
      <clipPath id="tankClip">
        <rect x="480" y="140" width="240" height="220" rx="12" />
      </clipPath>
      <clipPath id="dashClip">
        <rect x="1060" y="100" width="280" height="200" rx="8" />
      </clipPath>
    </defs>

    {/* ========== ATMOSPHERIC WATER GENERATOR (left) ========== */}
    <g>
      <rect x="60" y="160" width="140" height="180" rx="8" fill="#0f1114" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* Intake grilles */}
      <line x1="80" y1="180" x2="120" y2="180" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="80" y1="188" x2="120" y2="188" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="80" y1="196" x2="120" y2="196" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      {/* Condensation chamber */}
      <rect x="80" y="220" width="80" height="60" rx="4" fill="rgba(45,140,240,0.06)" stroke="rgba(45,140,240,0.2)" strokeWidth="0.5" />
      {/* Drip indicator */}
      <circle cx="120" cy="300" r="4" fill="#2d8cf0" opacity="0.7" className="sensor-glow" />
      <circle cx="120" cy="300" r="8" fill="none" stroke="#2d8cf0" strokeWidth="0.5" opacity="0.3" className="sensor-glow" />
      {/* Label */}
      <text x="130" y="358" textAnchor="middle" fill="rgba(255,255,255,0.3)" className="label">Atmospheric Water Generator</text>
    </g>

    {/* ========== SUPPLY PIPE (AWG -> Tank) ========== */}
    <g>
      <line x1="200" y1="250" x2="480" y2="250" stroke="rgba(255,255,255,0.08)" strokeWidth="14" strokeLinecap="round" />
      <line x1="200" y1="250" x2="480" y2="250" stroke="#2d8cf0" strokeWidth="2" className="water-flow" />
      <text x="340" y="238" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">H&#x2082;O Supply</text>
    </g>

    {/* ========== STORAGE TANK (center) ========== */}
    <g>
      <rect x="480" y="140" width="240" height="220" rx="12" fill="#0f1114" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      {/* Water fill */}
      <g clipPath="url(#tankClip)">
        <rect x="480" y="200" width="240" height="160" fill="url(#waterGrad)" />
        {/* Wave surface */}
        <g className="wave-surface">
          <path d="M460 200 Q500 192 540 200 Q580 208 620 200 Q660 192 700 200 Q740 208 780 200" stroke="#2d8cf0" strokeWidth="1.5" fill="none" opacity="0.4" />
        </g>
        {/* Particle dots */}
        <circle cx="520" cy="280" r="1.5" fill="#2d8cf0" opacity="0.3" className="sensor-glow" />
        <circle cx="560" cy="310" r="1" fill="#2d8cf0" opacity="0.25" />
        <circle cx="640" cy="260" r="1.2" fill="#2d8cf0" opacity="0.2" className="sensor-glow" />
        <circle cx="680" cy="300" r="1" fill="#2d8cf0" opacity="0.3" />
      </g>
      {/* Level indicator bar */}
      <rect x="726" y="160" width="6" height="180" rx="3" fill="rgba(255,255,255,0.04)" />
      <rect x="726" y="210" width="6" height="130" rx="3" fill="rgba(45,140,240,0.3)" />
      <text x="738" y="213" fill="rgba(255,255,255,0.25)" className="label-sm">72%</text>
    </g>

    {/* ========== BLUESIGNAL WQM-1 (mounted on tank) ========== */}
    <g>
      <rect x="580" y="105" width="90" height="55" rx="6" fill="#0f1114" stroke="#34d399" strokeWidth="1.2" />
      {/* Mini screen */}
      <rect x="588" y="113" width="50" height="28" rx="3" fill="rgba(0,0,0,0.5)" />
      <text x="594" y="126" fill="#34d399" className="label-data">pH 7.2</text>
      <text x="594" y="136" fill="#5badff" className="label-data">420 ppm</text>
      {/* LEDs */}
      <circle cx="650" cy="122" r="3" fill="#34d399" className="pulse-dot" />
      <circle cx="650" cy="134" r="3" fill="#2d8cf0" className="pulse-dot" style={{ animationDelay: '0.5s' }} />
      {/* Probe lines into water */}
      <line x1="598" y1="160" x2="598" y2="280" stroke="rgba(52,211,153,0.4)" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="598" cy="280" r="3.5" fill="#34d399" opacity="0.7" />
      <line x1="615" y1="160" x2="615" y2="300" stroke="rgba(45,140,240,0.4)" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="615" cy="300" r="3.5" fill="#2d8cf0" opacity="0.7" />
      <line x1="632" y1="160" x2="632" y2="270" stroke="rgba(251,191,36,0.4)" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="632" cy="270" r="3.5" fill="#fbbf24" opacity="0.7" />
      {/* Label */}
      <text x="625" y="96" textAnchor="middle" fill="rgba(255,255,255,0.3)" className="label">BlueSignal WQM-1</text>
    </g>

    {/* ========== ULTRASONIC TRANSDUCER ========== */}
    <g>
      <rect x="500" y="290" width="40" height="30" rx="4" fill="#0f1114" stroke="rgba(168,85,247,0.4)" strokeWidth="1" />
      <text x="520" y="309" textAnchor="middle" fill="rgba(168,85,247,0.6)" className="label-data">XDCR</text>
      {/* Sonar rings */}
      <circle cx="520" cy="340" r="12" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="0.8">
        <animate attributeName="r" values="12;40" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="520" cy="340" r="12" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="0.8">
        <animate attributeName="r" values="12;40" dur="2.5s" begin="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0" dur="2.5s" begin="0.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="520" cy="340" r="12" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="0.8">
        <animate attributeName="r" values="12;40" dur="2.5s" begin="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0" dur="2.5s" begin="1.6s" repeatCount="indefinite" />
      </circle>
      <text x="520" y="385" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">Anti-Algae</text>
    </g>

    {/* ========== OUTPUT PIPE (Tank -> Pump) ========== */}
    <g>
      <line x1="720" y1="280" x2="840" y2="280" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round" />
      <line x1="720" y1="280" x2="840" y2="280" stroke="#2d8cf0" strokeWidth="1.5" className="water-flow" />
    </g>

    {/* ========== DAB MINI PUMP ========== */}
    <g>
      <rect x="840" y="240" width="80" height="80" rx="8" fill="#0f1114" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* Impeller icon */}
      <circle cx="880" cy="270" r="14" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1="880" y1="256" x2="880" y2="284" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="866" y1="270" x2="894" y2="270" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      {/* Efficiency bar */}
      <rect x="856" y="296" width="48" height="6" rx="3" fill="rgba(255,255,255,0.04)" />
      <rect x="856" y="296" width="45" height="6" rx="3" fill="rgba(52,211,153,0.4)" />
      <text x="910" y="302" fill="rgba(255,255,255,0.25)" className="label-sm">94%</text>
      <text x="880" y="338" textAnchor="middle" fill="rgba(255,255,255,0.3)" className="label">DAB Mini</text>
    </g>

    {/* ========== LORA DATA UPLINK ========== */}
    <g>
      {/* Dashed line from WQM-1 to cloud dashboard */}
      <path d="M670 120 L760 80 L1060 80 L1060 130" stroke="#2d8cf0" strokeWidth="1.5" strokeDasharray="6 10" className="data-flow" fill="none" />
      {/* Antenna icon */}
      <line x1="760" y1="80" x2="760" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <circle cx="760" cy="48" r="3" fill="none" stroke="rgba(45,140,240,0.4)" strokeWidth="1" />
      {/* Signal arcs */}
      <path d="M748 42 Q760 32 772 42" fill="none" stroke="rgba(45,140,240,0.3)" strokeWidth="0.8" />
      <path d="M742 36 Q760 22 778 36" fill="none" stroke="rgba(45,140,240,0.2)" strokeWidth="0.8" />
      <text x="860" y="70" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">LoRaWAN &middot; Cayenne LPP &middot; Encrypted</text>
    </g>

    {/* ========== CLOUD DASHBOARD (right) ========== */}
    <g>
      {/* Monitor frame */}
      <rect x="1050" y="90" width="300" height="220" rx="10" fill="#0f1114" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      {/* Screen */}
      <g clipPath="url(#dashClip)">
        <rect x="1060" y="100" width="280" height="200" fill="url(#screenGrad)" />
        {/* Header bar */}
        <rect x="1060" y="100" width="280" height="28" fill="rgba(255,255,255,0.03)" />
        <circle cx="1078" cy="114" r="4" fill="#34d399" className="pulse-dot" />
        <text x="1090" y="118" fill="rgba(255,255,255,0.6)" className="label-title">BlueSignal Cloud</text>
        <text x="1240" y="118" fill="rgba(255,255,255,0.25)" className="label-sm">3 devices online</text>
        {/* Sparkline charts */}
        {/* pH chart (green) */}
        <polyline points="1075,155 1095,150 1115,158 1135,148 1155,153 1175,146 1195,152" fill="none" stroke="#34d399" strokeWidth="1.2" opacity="0.7" />
        <text x="1075" y="170" fill="rgba(255,255,255,0.2)" className="label-sm">pH</text>
        {/* TDS chart (blue) */}
        <polyline points="1075,195 1095,190 1115,200 1135,188 1155,195 1175,192 1195,198" fill="none" stroke="#2d8cf0" strokeWidth="1.2" opacity="0.7" />
        <text x="1075" y="210" fill="rgba(255,255,255,0.2)" className="label-sm">TDS</text>
        {/* Turbidity chart (amber) */}
        <polyline points="1075,235 1095,230 1115,238 1135,228 1155,233 1175,240 1195,235" fill="none" stroke="#fbbf24" strokeWidth="1.2" opacity="0.7" />
        <text x="1075" y="250" fill="rgba(255,255,255,0.2)" className="label-sm">Turb</text>
        {/* Device status sidebar */}
        <rect x="1220" y="138" width="110" height="150" fill="rgba(255,255,255,0.02)" />
        <circle cx="1232" cy="153" r="3" fill="#34d399" />
        <text x="1242" y="156" fill="rgba(255,255,255,0.4)" className="label-sm">Tank-01 Active</text>
        <circle cx="1232" cy="173" r="3" fill="#34d399" />
        <text x="1242" y="176" fill="rgba(255,255,255,0.4)" className="label-sm">Pond-NE Active</text>
        <circle cx="1232" cy="193" r="3" fill="#fbbf24" className="pulse-dot" />
        <text x="1242" y="196" fill="rgba(255,255,255,0.4)" className="label-sm">Well-03 Alert</text>
        {/* Status badge */}
        <rect x="1230" y="220" width="88" height="20" rx="4" fill="rgba(52,211,153,0.1)" />
        <text x="1274" y="234" textAnchor="middle" fill="#34d399" className="label-sm">ALL NORMAL</text>
      </g>
    </g>

    {/* ========== RELAY CONTROL FEEDBACK ========== */}
    <g>
      <path d="M1060 280 L940 280 L920 280" stroke="#34d399" strokeWidth="1" strokeDasharray="4 6" className="data-flow" fill="none" opacity="0.5" />
      <text x="990" y="272" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">Relay Ctrl</text>
    </g>

    {/* ========== ALERT NOTIFICATION (floating) ========== */}
    <g>
      <rect x="1120" y="340" width="200" height="60" rx="8" fill="#151719" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <rect x="1120" y="340" width="3" height="60" rx="1.5" fill="#fbbf24" />
      {/* Alert icon */}
      <circle cx="1142" cy="362" r="10" fill="rgba(251,191,36,0.1)" />
      <text x="1142" y="367" textAnchor="middle" fill="#fbbf24" style={{ fontSize: '11px', fontWeight: 700 }}>!</text>
      {/* Alert text */}
      <text x="1160" y="360" fill="rgba(255,255,255,0.6)" className="label-title">pH drift detected</text>
      <text x="1160" y="378" fill="rgba(255,255,255,0.25)" className="label-sm">Well-03 &middot; 6.2&#x2192;5.8 &middot; 3m ago</text>
    </g>
  </SceneSvg>
);

export default SystemScene;

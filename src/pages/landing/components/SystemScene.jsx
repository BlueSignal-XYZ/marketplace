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
  .credit-flow {
    stroke-dasharray: 4 8;
    animation: dataFlow 1.2s linear infinite;
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
  .label-lg {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.04em;
  }
`;

const SystemScene = () => (
  <SceneSvg viewBox="0 0 1400 520" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <linearGradient id="blueGlow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2d8cf0" stopOpacity="0.15" />
        <stop offset="50%" stopColor="#2d8cf0" stopOpacity="0.06" />
        <stop offset="100%" stopColor="#34d399" stopOpacity="0.08" />
      </linearGradient>
      <linearGradient id="creditGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#2d8cf0" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="awgGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2d8cf0" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#2d8cf0" stopOpacity="0.03" />
      </linearGradient>
      <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#2d8cf0" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#2d8cf0" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="greenNodeGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
      </radialGradient>
      <filter id="softGlow">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <clipPath id="tankClip">
        <rect x="460" y="140" width="200" height="200" rx="10" />
      </clipPath>
      <clipPath id="dashClip">
        <rect x="830" y="60" width="260" height="180" rx="8" />
      </clipPath>
      <clipPath id="mktClip">
        <rect x="1140" y="100" width="220" height="160" rx="8" />
      </clipPath>
      {/* Dot grid pattern */}
      <pattern id="dotGrid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
        <circle cx="15" cy="15" r="0.5" fill="rgba(255,255,255,0.04)" />
      </pattern>
    </defs>

    {/* Background dot grid */}
    <rect width="1400" height="520" fill="url(#dotGrid)" />

    {/* Ambient glow behind center */}
    <ellipse cx="560" cy="240" rx="300" ry="200" fill="url(#blueGlow)" />
    <ellipse cx="1050" cy="200" rx="250" ry="180" fill="url(#blueGlow)" opacity="0.5" />

    {/* ── PHASE LABELS (top) ──────────────────────────── */}
    <text x="150" y="38" textAnchor="middle" fill="rgba(45,140,240,0.4)" className="label">01 — Generate</text>
    <text x="560" y="38" textAnchor="middle" fill="rgba(52,211,153,0.4)" className="label">02 — Monitor &amp; Verify</text>
    <text x="960" y="38" textAnchor="middle" fill="rgba(91,173,255,0.4)" className="label">03 — Report</text>
    <text x="1250" y="38" textAnchor="middle" fill="rgba(52,211,153,0.4)" className="label">04 — Trade &amp; Rebate</text>

    {/* Thin phase divider lines */}
    <line x1="330" y1="50" x2="330" y2="480" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 8" />
    <line x1="760" y1="50" x2="760" y2="480" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 8" />
    <line x1="1100" y1="50" x2="1100" y2="480" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 8" />

    {/* ========== ATMOSPHERIC WATER GENERATOR (left) ========== */}
    <g>
      {/* Glow behind AWG */}
      <ellipse cx="150" cy="220" rx="100" ry="120" fill="url(#nodeGlow)" />
      {/* Main housing */}
      <rect x="60" y="110" width="180" height="230" rx="10" fill="#0f1114" stroke="rgba(45,140,240,0.2)" strokeWidth="1.5" />
      {/* Inner panel border */}
      <rect x="68" y="118" width="164" height="214" rx="6" fill="none" stroke="rgba(45,140,240,0.06)" strokeWidth="0.5" />

      {/* Air intake section */}
      <text x="150" y="140" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">Air Intake</text>
      {/* Intake grilles - more detailed */}
      <line x1="90" y1="150" x2="210" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <line x1="90" y1="157" x2="210" y2="157" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <line x1="90" y1="164" x2="210" y2="164" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <line x1="90" y1="171" x2="210" y2="171" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      {/* Fan icon */}
      <circle cx="150" cy="160" r="16" fill="none" stroke="rgba(45,140,240,0.15)" strokeWidth="0.8" />
      <line x1="150" y1="144" x2="150" y2="176" stroke="rgba(45,140,240,0.12)" strokeWidth="0.8" />
      <line x1="134" y1="160" x2="166" y2="160" stroke="rgba(45,140,240,0.12)" strokeWidth="0.8" />

      {/* Condensation chamber */}
      <rect x="82" y="190" width="136" height="80" rx="6" fill="rgba(45,140,240,0.06)" stroke="rgba(45,140,240,0.18)" strokeWidth="0.8" />
      <text x="150" y="205" textAnchor="middle" fill="rgba(45,140,240,0.4)" className="label-sm">Condensation</text>
      {/* Coil lines */}
      <path d="M95 215 Q110 210 125 215 Q140 220 155 215 Q170 210 185 215 Q200 220 205 215" fill="none" stroke="rgba(45,140,240,0.15)" strokeWidth="0.8" />
      <path d="M95 225 Q110 220 125 225 Q140 230 155 225 Q170 220 185 225 Q200 230 205 225" fill="none" stroke="rgba(45,140,240,0.12)" strokeWidth="0.8" />
      <path d="M95 235 Q110 230 125 235 Q140 240 155 235 Q170 230 185 235 Q200 240 205 235" fill="none" stroke="rgba(45,140,240,0.1)" strokeWidth="0.8" />
      {/* Humidity reading */}
      <rect x="88" y="248" width="52" height="14" rx="3" fill="rgba(45,140,240,0.08)" />
      <text x="114" y="258" textAnchor="middle" fill="rgba(45,140,240,0.6)" className="label-data">RH 78%</text>

      {/* Collection reservoir */}
      <rect x="90" y="280" width="120" height="32" rx="4" fill="rgba(45,140,240,0.04)" stroke="rgba(45,140,240,0.12)" strokeWidth="0.5" />
      <rect x="92" y="296" width="116" height="14" rx="2" fill="rgba(45,140,240,0.08)" />
      {/* Drip animation */}
      <circle cx="150" cy="276" r="3" fill="#2d8cf0" opacity="0.6" className="sensor-glow" />
      <circle cx="150" cy="276" r="7" fill="none" stroke="#2d8cf0" strokeWidth="0.4" opacity="0.2" className="sensor-glow" />

      {/* Production rate */}
      <rect x="100" y="320" width="100" height="14" rx="3" fill="rgba(52,211,153,0.08)" />
      <text x="150" y="330" textAnchor="middle" fill="rgba(52,211,153,0.6)" className="label-data">12 gal/day</text>
    </g>
    {/* AWG label */}
    <text x="150" y="360" textAnchor="middle" fill="rgba(255,255,255,0.35)" className="label-lg">AWG Unit</text>
    <text x="150" y="375" textAnchor="middle" fill="rgba(255,255,255,0.15)" className="label-sm">Atmospheric Water Generator</text>

    {/* ========== SUPPLY PIPE (AWG -> Tank) ========== */}
    <g>
      <line x1="240" y1="250" x2="460" y2="250" stroke="rgba(255,255,255,0.06)" strokeWidth="12" strokeLinecap="round" />
      <line x1="240" y1="250" x2="460" y2="250" stroke="#2d8cf0" strokeWidth="2" className="water-flow" />
      {/* Flow direction arrows */}
      <path d="M310 244 l8 6 -8 6" fill="none" stroke="rgba(45,140,240,0.3)" strokeWidth="1" />
      <path d="M370 244 l8 6 -8 6" fill="none" stroke="rgba(45,140,240,0.3)" strokeWidth="1" />
      <text x="350" y="238" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">H&#x2082;O Supply &middot; Filtered</text>
    </g>

    {/* ========== STORAGE TANK (center-left) ========== */}
    <g>
      <rect x="460" y="140" width="200" height="200" rx="10" fill="#0f1114" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      {/* Water fill */}
      <g clipPath="url(#tankClip)">
        <rect x="460" y="200" width="200" height="140" fill="url(#waterGrad)" />
        {/* Wave surface */}
        <g className="wave-surface">
          <path d="M440 200 Q475 193 510 200 Q545 207 580 200 Q615 193 650 200 Q685 207 720 200" stroke="#2d8cf0" strokeWidth="1.5" fill="none" opacity="0.4" />
        </g>
        {/* Particle dots */}
        <circle cx="500" cy="270" r="1.5" fill="#2d8cf0" opacity="0.3" className="sensor-glow" />
        <circle cx="530" cy="300" r="1" fill="#2d8cf0" opacity="0.25" />
        <circle cx="600" cy="250" r="1.2" fill="#2d8cf0" opacity="0.2" className="sensor-glow" />
        <circle cx="630" cy="290" r="1" fill="#2d8cf0" opacity="0.3" />
      </g>
      {/* Level indicator */}
      <rect x="666" y="150" width="5" height="180" rx="2.5" fill="rgba(255,255,255,0.04)" />
      <rect x="666" y="200" width="5" height="130" rx="2.5" fill="rgba(45,140,240,0.3)" />
      <text x="678" y="203" fill="rgba(255,255,255,0.25)" className="label-sm">72%</text>
    </g>

    {/* ========== BLUESIGNAL WQM-1 SENSOR (mounted on tank) ========== */}
    <g>
      {/* Glow behind sensor */}
      <ellipse cx="560" cy="115" rx="60" ry="40" fill="url(#greenNodeGlow)" />
      {/* Sensor body */}
      <rect x="515" y="95" width="90" height="55" rx="6" fill="#0f1114" stroke="#34d399" strokeWidth="1.2" />
      {/* Mini screen */}
      <rect x="523" y="103" width="50" height="28" rx="3" fill="rgba(0,0,0,0.5)" />
      <text x="529" y="116" fill="#34d399" className="label-data">pH 7.2</text>
      <text x="529" y="126" fill="#5badff" className="label-data">420 ppm</text>
      {/* LEDs */}
      <circle cx="585" cy="112" r="3" fill="#34d399" className="pulse-dot" />
      <circle cx="585" cy="124" r="3" fill="#2d8cf0" className="pulse-dot" style={{ animationDelay: '0.5s' }} />
      <circle cx="585" cy="136" r="3" fill="#fbbf24" className="pulse-dot" style={{ animationDelay: '1s' }} />
      {/* Probe lines into water */}
      <line x1="535" y1="150" x2="535" y2="270" stroke="rgba(52,211,153,0.4)" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="535" cy="270" r="3.5" fill="#34d399" opacity="0.7" />
      <line x1="550" y1="150" x2="550" y2="290" stroke="rgba(45,140,240,0.4)" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="550" cy="290" r="3.5" fill="#2d8cf0" opacity="0.7" />
      <line x1="565" y1="150" x2="565" y2="260" stroke="rgba(251,191,36,0.4)" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="565" cy="260" r="3.5" fill="#fbbf24" opacity="0.7" />
      {/* Label */}
      <text x="560" y="84" textAnchor="middle" fill="rgba(255,255,255,0.35)" className="label-lg">BlueSignal WQM-1</text>
    </g>

    {/* ========== ULTRASONIC TRANSDUCER ========== */}
    <g>
      <rect x="468" y="305" width="100" height="24" rx="4" fill="#0f1114" stroke="rgba(168,85,247,0.35)" strokeWidth="0.8" />
      <text x="518" y="321" textAnchor="middle" fill="rgba(168,85,247,0.5)" className="label-sm">Ultrasonic Anti-Fouling</text>
      {/* Sonar rings */}
      <circle cx="518" cy="345" r="10" fill="none" stroke="rgba(168,85,247,0.25)" strokeWidth="0.6">
        <animate attributeName="r" values="10;35" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="518" cy="345" r="10" fill="none" stroke="rgba(168,85,247,0.25)" strokeWidth="0.6">
        <animate attributeName="r" values="10;35" dur="2.5s" begin="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0" dur="2.5s" begin="0.8s" repeatCount="indefinite" />
      </circle>
    </g>

    {/* ========== LORA DATA UPLINK (Sensor → Cloud) ========== */}
    <g>
      <path d="M605 115 L710 80 L830 80" stroke="#2d8cf0" strokeWidth="1.5" strokeDasharray="6 10" className="data-flow" fill="none" />
      {/* Antenna */}
      <line x1="710" y1="80" x2="710" y2="52" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <circle cx="710" cy="50" r="3" fill="none" stroke="rgba(45,140,240,0.4)" strokeWidth="1" />
      {/* Signal arcs */}
      <path d="M698 44 Q710 34 722 44" fill="none" stroke="rgba(45,140,240,0.3)" strokeWidth="0.8" />
      <path d="M692 38 Q710 24 728 38" fill="none" stroke="rgba(45,140,240,0.2)" strokeWidth="0.8" />
      <text x="760" y="70" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">LoRaWAN &middot; AES-128 Encrypted</text>
    </g>

    {/* ========== CLOUD DASHBOARD (center-right) ========== */}
    <g>
      {/* Monitor frame */}
      <rect x="820" y="50" width="280" height="200" rx="10" fill="#0f1114" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      {/* Screen */}
      <g clipPath="url(#dashClip)">
        <rect x="830" y="60" width="260" height="180" fill="url(#screenGrad)" />
        {/* Header bar */}
        <rect x="830" y="60" width="260" height="26" fill="rgba(255,255,255,0.03)" />
        <circle cx="847" cy="73" r="4" fill="#34d399" className="pulse-dot" />
        <text x="858" y="77" fill="rgba(255,255,255,0.6)" className="label-title">BlueSignal Cloud</text>
        <text x="1000" y="77" fill="rgba(255,255,255,0.25)" className="label-sm">3 devices online</text>
        {/* Sparkline charts */}
        <polyline points="845,110 862,106 880,113 897,104 915,108 932,102 950,107" fill="none" stroke="#34d399" strokeWidth="1.2" opacity="0.7" />
        <text x="845" y="124" fill="rgba(255,255,255,0.2)" className="label-sm">pH</text>
        <polyline points="845,145 862,141 880,149 897,139 915,145 932,143 950,147" fill="none" stroke="#2d8cf0" strokeWidth="1.2" opacity="0.7" />
        <text x="845" y="159" fill="rgba(255,255,255,0.2)" className="label-sm">TDS</text>
        <polyline points="845,180 862,176 880,183 897,174 915,178 932,184 950,180" fill="none" stroke="#fbbf24" strokeWidth="1.2" opacity="0.7" />
        <text x="845" y="194" fill="rgba(255,255,255,0.2)" className="label-sm">Turb</text>
        {/* Device status sidebar */}
        <rect x="975" y="96" width="108" height="135" fill="rgba(255,255,255,0.02)" />
        <circle cx="987" cy="110" r="3" fill="#34d399" />
        <text x="996" y="113" fill="rgba(255,255,255,0.4)" className="label-sm">Property-01 Active</text>
        <circle cx="987" cy="128" r="3" fill="#34d399" />
        <text x="996" y="131" fill="rgba(255,255,255,0.4)" className="label-sm">Property-02 Active</text>
        <circle cx="987" cy="146" r="3" fill="#fbbf24" className="pulse-dot" />
        <text x="996" y="149" fill="rgba(255,255,255,0.4)" className="label-sm">Property-03 Alert</text>
        {/* Compliance badge */}
        <rect x="985" y="168" width="88" height="20" rx="4" fill="rgba(52,211,153,0.1)" />
        <text x="1029" y="182" textAnchor="middle" fill="#34d399" className="label-sm">COMPLIANT</text>
        {/* Credits counter */}
        <rect x="985" y="195" width="88" height="20" rx="4" fill="rgba(45,140,240,0.1)" />
        <text x="1029" y="209" textAnchor="middle" fill="#5badff" className="label-sm">+24 CREDITS</text>
      </g>
      {/* Label */}
      <text x="960" y="270" textAnchor="middle" fill="rgba(255,255,255,0.35)" className="label">cloud.bluesignal.xyz</text>
    </g>

    {/* ========== CREDITS FLOW (Cloud → Marketplace) ========== */}
    <g>
      <path d="M1100 150 L1140 150" stroke="url(#creditGrad)" strokeWidth="2" className="credit-flow" fill="none" />
      {/* Flow label */}
      <text x="1120" y="140" textAnchor="middle" fill="rgba(52,211,153,0.3)" className="label-sm">Credits</text>
    </g>

    {/* ========== WATERQUALITY.TRADING MARKETPLACE (right) ========== */}
    <g>
      {/* Glow behind marketplace */}
      <ellipse cx="1250" cy="180" rx="130" ry="100" fill="url(#greenNodeGlow)" opacity="0.5" />
      {/* Monitor frame */}
      <rect x="1130" y="90" width="240" height="180" rx="10" fill="#0f1114" stroke="rgba(52,211,153,0.2)" strokeWidth="1.5" />
      {/* Screen */}
      <g clipPath="url(#mktClip)">
        <rect x="1140" y="100" width="220" height="160" fill="url(#screenGrad)" />
        {/* Header bar */}
        <rect x="1140" y="100" width="220" height="24" fill="rgba(255,255,255,0.03)" />
        <circle cx="1155" cy="112" r="3.5" fill="#34d399" className="pulse-dot" />
        <text x="1165" y="116" fill="rgba(255,255,255,0.6)" className="label-title">waterquality.trading</text>

        {/* Credit listings */}
        <rect x="1150" y="132" width="200" height="28" rx="4" fill="rgba(52,211,153,0.04)" stroke="rgba(52,211,153,0.12)" strokeWidth="0.5" />
        <text x="1160" y="147" fill="rgba(255,255,255,0.5)" className="label-data">Nutrient Credit</text>
        <text x="1310" y="147" fill="#34d399" className="label-data">$12.40</text>
        <rect x="1288" y="150" width="58" height="4" rx="2" fill="rgba(52,211,153,0.08)" />
        <rect x="1288" y="150" width="42" height="4" rx="2" fill="rgba(52,211,153,0.3)" />

        <rect x="1150" y="166" width="200" height="28" rx="4" fill="rgba(45,140,240,0.04)" stroke="rgba(45,140,240,0.12)" strokeWidth="0.5" />
        <text x="1160" y="181" fill="rgba(255,255,255,0.5)" className="label-data">Phosphorus Credit</text>
        <text x="1310" y="181" fill="#5badff" className="label-data">$8.75</text>

        <rect x="1150" y="200" width="200" height="28" rx="4" fill="rgba(52,211,153,0.04)" stroke="rgba(52,211,153,0.12)" strokeWidth="0.5" />
        <text x="1160" y="215" fill="rgba(255,255,255,0.5)" className="label-data">Nitrogen Credit</text>
        <text x="1310" y="215" fill="#34d399" className="label-data">$15.20</text>

        {/* Total earned */}
        <rect x="1150" y="236" width="200" height="18" rx="3" fill="rgba(52,211,153,0.08)" />
        <text x="1250" y="249" textAnchor="middle" fill="#34d399" className="label-data">TOTAL EARNED: $2,847.60</text>
      </g>
      {/* Label */}
      <text x="1250" y="290" textAnchor="middle" fill="rgba(255,255,255,0.35)" className="label">WQT Marketplace</text>
    </g>

    {/* ========== MUNICIPALITY / REBATE (bottom-right) ========== */}
    <g>
      {/* Municipality card */}
      <rect x="1150" y="330" width="200" height="80" rx="10" fill="#0f1114" stroke="rgba(52,211,153,0.15)" strokeWidth="1" />
      <rect x="1150" y="330" width="4" height="80" rx="2" fill="rgba(52,211,153,0.4)" />
      {/* Icon */}
      <rect x="1170" y="345" width="28" height="28" rx="6" fill="rgba(52,211,153,0.08)" />
      <text x="1184" y="364" textAnchor="middle" fill="#34d399" style={{ fontSize: '14px' }}>&#x1F3DB;</text>
      {/* Text */}
      <text x="1210" y="356" fill="rgba(255,255,255,0.6)" className="label-title">Municipal Rebate</text>
      <text x="1210" y="372" fill="rgba(255,255,255,0.3)" className="label-sm">Program verified &middot; Auto-enrolled</text>
      {/* Rebate amount */}
      <rect x="1270" y="382" width="70" height="18" rx="4" fill="rgba(52,211,153,0.1)" />
      <text x="1305" y="395" textAnchor="middle" fill="#34d399" className="label-data">-$180/mo</text>

      {/* Arrow from marketplace to municipality */}
      <path d="M1250 275 L1250 330" stroke="rgba(52,211,153,0.3)" strokeWidth="1.5" strokeDasharray="4 6" className="credit-flow" fill="none" />
      <path d="M1244 322 l6 8 6-8" fill="none" stroke="rgba(52,211,153,0.4)" strokeWidth="1" />
    </g>

    {/* ========== ALERT NOTIFICATION (floating) ========== */}
    <g>
      <rect x="860" y="310" width="180" height="54" rx="8" fill="#151719" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <rect x="860" y="310" width="3" height="54" rx="1.5" fill="#fbbf24" />
      {/* Alert icon */}
      <circle cx="880" cy="330" r="9" fill="rgba(251,191,36,0.1)" />
      <text x="880" y="334" textAnchor="middle" fill="#fbbf24" style={{ fontSize: '10px', fontWeight: 700 }}>!</text>
      {/* Alert text */}
      <text x="896" y="328" fill="rgba(255,255,255,0.6)" className="label-title">pH drift detected</text>
      <text x="896" y="344" fill="rgba(255,255,255,0.25)" className="label-sm">Property-03 &middot; 6.2&#x2192;5.8 &middot; 3m ago</text>
    </g>

    {/* ========== BLOCKCHAIN VERIFICATION (bottom center) ========== */}
    <g>
      {/* Chain blocks */}
      <rect x="580" y="400" width="44" height="24" rx="4" fill="#0f1114" stroke="rgba(45,140,240,0.2)" strokeWidth="0.8" />
      <text x="602" y="416" textAnchor="middle" fill="rgba(45,140,240,0.4)" className="label-sm">#4091</text>
      <line x1="624" y1="412" x2="640" y2="412" stroke="rgba(45,140,240,0.2)" strokeWidth="1" />
      <rect x="640" y="400" width="44" height="24" rx="4" fill="#0f1114" stroke="rgba(45,140,240,0.2)" strokeWidth="0.8" />
      <text x="662" y="416" textAnchor="middle" fill="rgba(45,140,240,0.4)" className="label-sm">#4092</text>
      <line x1="684" y1="412" x2="700" y2="412" stroke="rgba(45,140,240,0.2)" strokeWidth="1" />
      <rect x="700" y="400" width="44" height="24" rx="4" fill="#0f1114" stroke="rgba(52,211,153,0.3)" strokeWidth="0.8" />
      <text x="722" y="416" textAnchor="middle" fill="rgba(52,211,153,0.5)" className="label-sm">#4093</text>
      <circle cx="752" cy="412" r="4" fill="#34d399" opacity="0.6" className="pulse-dot" />
      <text x="662" y="444" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label">Polygon &middot; Immutable Verification</text>

      {/* Line from cloud to blockchain */}
      <path d="M960 255 L960 380 L750 380 L750 400" stroke="rgba(45,140,240,0.15)" strokeWidth="1" strokeDasharray="4 6" className="data-flow" fill="none" />
      {/* Line from blockchain to marketplace */}
      <path d="M744 412 L1100 412 L1100 300 L1140 220" stroke="rgba(52,211,153,0.15)" strokeWidth="1" strokeDasharray="4 6" className="credit-flow" fill="none" />
    </g>

    {/* ========== DAB MINI PUMP (below tank) ========== */}
    <g>
      <rect x="490" y="370" width="70" height="50" rx="6" fill="#0f1114" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
      {/* Impeller */}
      <circle cx="525" cy="390" r="10" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
      <line x1="525" y1="380" x2="525" y2="400" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
      <line x1="515" y1="390" x2="535" y2="390" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
      {/* Efficiency */}
      <rect x="497" y="406" width="56" height="4" rx="2" fill="rgba(255,255,255,0.04)" />
      <rect x="497" y="406" width="52" height="4" rx="2" fill="rgba(52,211,153,0.3)" />
      <text x="525" y="430" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">DAB Mini &middot; 94%</text>
      {/* Pipe from tank to pump */}
      <line x1="525" y1="340" x2="525" y2="370" stroke="rgba(255,255,255,0.06)" strokeWidth="8" strokeLinecap="round" />
      <line x1="525" y1="340" x2="525" y2="370" stroke="#2d8cf0" strokeWidth="1.2" className="water-flow" />
    </g>
  </SceneSvg>
);

export default SystemScene;

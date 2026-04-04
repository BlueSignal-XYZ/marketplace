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

const WiringDiagram = () => (
  <DiagramSvg viewBox="0 0 660 600" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wd-boardGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#151719" />
        <stop offset="100%" stopColor="#0f1114" />
      </linearGradient>
      <linearGradient id="wd-powerGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#f87171" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#f87171" stopOpacity="0.15" />
      </linearGradient>
    </defs>

    {/* ========== IP65 ENCLOSURE ========== */}
    <g>
      {/* Main enclosure body */}
      <rect x="30" y="20" width="600" height="340" rx="14" fill="#0f1114" stroke="rgba(255,255,255,0.12)" strokeWidth="1.8" />
      {/* Enclosure lid line */}
      <line x1="44" y1="34" x2="616" y2="34" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      {/* Corner mounting lugs */}
      <circle cx="46" cy="36" r="5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <circle cx="614" cy="36" r="5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <circle cx="46" cy="344" r="5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <circle cx="614" cy="344" r="5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* Enclosure label */}
      <text x="330" y="372" textAnchor="middle" fill="rgba(255,255,255,0.12)" className="label">IP65 Rated Enclosure</text>

      {/* ========== Cable glands ========== */}
      {/* Bottom glands: sensor, I2C */}
      <circle cx="200" cy="360" r="7" fill="#0f1114" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <circle cx="330" cy="360" r="7" fill="#0f1114" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {/* Left gland: power */}
      <circle cx="30" cy="120" r="7" fill="#0f1114" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {/* Right glands: LoRa, GPS, PH */}
      <circle cx="630" cy="180" r="7" fill="#0f1114" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <circle cx="630" cy="140" r="7" fill="#0f1114" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <circle cx="630" cy="280" r="7" fill="#0f1114" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {/* Top gland: relay output */}
      <circle cx="380" cy="20" r="7" fill="#0f1114" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

      {/* ========== PCB BOARD (landscape, inside enclosure) ========== */}
      <g>
        <rect x="60" y="42" width="540" height="300" rx="6" fill="url(#wd-boardGrad)" stroke="#34d399" strokeWidth="1" strokeOpacity="0.5" />
        {/* PCB mounting holes */}
        <circle cx="74" cy="56" r="5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <circle cx="586" cy="56" r="5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <circle cx="74" cy="328" r="5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <circle cx="586" cy="328" r="5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        {/* Board label */}
        <text x="300" y="60" textAnchor="middle" fill="rgba(52,211,153,0.4)" className="label">WQM-1 Rev 2.1</text>

        {/* ---- VIN / GND — top-left power input ---- */}
        <g>
          <rect x="80" y="66" width="50" height="24" rx="3" fill="rgba(248,113,113,0.06)" stroke="rgba(248,113,113,0.3)" strokeWidth="0.8" />
          <text x="92" y="79" fill="rgba(248,113,113,0.6)" className="label-data">VIN</text>
          <text x="118" y="79" fill="rgba(255,255,255,0.25)" className="label-data">GND</text>
          {/* Screw terminal dots */}
          <circle cx="95" cy="82" r="2" fill="none" stroke="rgba(248,113,113,0.3)" strokeWidth="0.6" />
          <circle cx="115" cy="82" r="2" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />
          {/* Power trace down */}
          <path d="M105 90 L105 130" stroke="rgba(248,113,113,0.15)" strokeWidth="0.6" strokeDasharray="2 4" />
        </g>

        {/* ---- Power regulation section (upper-left) ---- */}
        <g>
          {/* Buck converter IC */}
          <rect x="80" y="105" width="60" height="35" rx="3" fill="rgba(255,255,255,0.02)" stroke="rgba(248,113,113,0.2)" strokeWidth="0.6" />
          <text x="110" y="122" textAnchor="middle" fill="rgba(248,113,113,0.35)" className="label-sm">Power Reg</text>
          <text x="110" y="132" textAnchor="middle" fill="rgba(255,255,255,0.15)" className="label-sm">5V / 3.3V</text>
          {/* Capacitor symbols */}
          <rect x="148" y="110" width="8" height="14" rx="1" fill="none" stroke="rgba(248,113,113,0.15)" strokeWidth="0.5" />
          <rect x="160" y="110" width="8" height="14" rx="1" fill="none" stroke="rgba(248,113,113,0.15)" strokeWidth="0.5" />
          {/* Power LED */}
          <circle cx="88" y="175" r="2.5" fill="#f87171" className="pulse-dot" />
          <text x="96" y="178" fill="rgba(255,255,255,0.2)" className="label-sm">PWR</text>
        </g>

        {/* ---- Status LEDs (left side, vertical) ---- */}
        <g>
          <circle cx="88" cy="190" r="2" fill="#34d399" className="pulse-dot" />
          <text x="96" y="193" fill="rgba(255,255,255,0.15)" className="label-sm">STA1</text>
          <circle cx="88" cy="202" r="2" fill="#34d399" className="pulse-dot" style={{ animationDelay: '0.3s' }} />
          <text x="96" y="205" fill="rgba(255,255,255,0.15)" className="label-sm">STA2</text>
          <circle cx="88" cy="214" r="2" fill="#2d8cf0" className="pulse-dot" style={{ animationDelay: '0.6s' }} />
          <text x="96" y="217" fill="rgba(255,255,255,0.15)" className="label-sm">STA3</text>
          <circle cx="88" cy="226" r="2" fill="#2d8cf0" className="pulse-dot" style={{ animationDelay: '0.9s' }} />
          <text x="96" y="229" fill="rgba(255,255,255,0.15)" className="label-sm">STA4</text>
        </g>

        {/* ---- GPIO header (lower-left, pin grid) ---- */}
        <g>
          <rect x="80" y="244" width="80" height="54" rx="2" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          <text x="120" y="258" textAnchor="middle" fill="rgba(255,255,255,0.25)" className="label-sm">GPIO Header</text>
          {/* Pin grid (4×4) */}
          {[0,1,2,3].map(r => [0,1,2,3,4,5].map(c => (
            <circle key={`gpio-${r}-${c}`} cx={90 + c * 11} cy={266 + r * 8} r="1.2" fill="rgba(255,255,255,0.15)" />
          )))}
          <text x="88" y="303" fill="rgba(255,255,255,0.1)" style={{ fontSize: '4.5px', fontFamily: 'IBM Plex Mono, monospace' }}>3V3 +5V IO6 IO7 IO8 IO22</text>
        </g>

        {/* ---- 4× Relay Terminals (top edge, center-to-right) ---- */}
        <g>
          {[0,1,2,3].map(i => (
            <g key={`relay-term-${i}`}>
              <rect x={200 + i * 90} y="50" width="80" height="26" rx="3" fill="rgba(251,191,36,0.05)" stroke="rgba(251,191,36,0.3)" strokeWidth="0.8" />
              {/* 3 screw terminal circles per relay */}
              <circle cx={215 + i * 90} cy="63" r="3" fill="none" stroke="rgba(251,191,36,0.25)" strokeWidth="0.6" />
              <circle cx={233 + i * 90} cy="63" r="3" fill="none" stroke="rgba(251,191,36,0.25)" strokeWidth="0.6" />
              <circle cx={251 + i * 90} cy="63" r="3" fill="none" stroke="rgba(251,191,36,0.25)" strokeWidth="0.6" />
              <text x={215 + i * 90} y="57" fill="rgba(255,255,255,0.1)" style={{ fontSize: '4px', fontFamily: 'IBM Plex Mono, monospace' }}>NC</text>
              <text x={230 + i * 90} y="57" fill="rgba(255,255,255,0.1)" style={{ fontSize: '4px', fontFamily: 'IBM Plex Mono, monospace' }}>COM</text>
              <text x={248 + i * 90} y="57" fill="rgba(255,255,255,0.1)" style={{ fontSize: '4px', fontFamily: 'IBM Plex Mono, monospace' }}>NO</text>
            </g>
          ))}
          <text x="380" y="48" textAnchor="middle" fill="rgba(251,191,36,0.3)" className="label-sm">Relay Terminals — 10A · 250VAC</text>
        </g>

        {/* ---- 4× Relay Driver ICs (center, below terminals) ---- */}
        <g>
          {[0,1,2,3].map(i => (
            <g key={`relay-ic-${i}`}>
              <rect x={210 + i * 80} y="100" width="55" height="35" rx="3" fill="rgba(255,255,255,0.03)" stroke="rgba(251,191,36,0.2)" strokeWidth="0.6" />
              <text x={237 + i * 80} y="118" textAnchor="middle" fill="rgba(251,191,36,0.45)" className="label-data">{`CH${i + 1}`}</text>
              <text x={237 + i * 80} y="129" textAnchor="middle" fill="rgba(255,255,255,0.15)" className="label-sm">Relay</text>
              {/* Trace from IC to terminal */}
              <line x1={237 + i * 80} y1="100" x2={237 + i * 90} y2="76" stroke="rgba(251,191,36,0.12)" strokeWidth="0.5" strokeDasharray="2 3" />
            </g>
          ))}
        </g>

        {/* ---- Main Processor (center-right, QFN) ---- */}
        <g>
          <rect x="370" y="160" width="100" height="70" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
          {/* QFN pads around perimeter */}
          {[0,1,2,3,4,5,6].map(i => (
            <rect key={`qfn-b-${i}`} x={378 + i * 12} y="228" width="6" height="3" rx="0.5" fill="rgba(255,255,255,0.06)" />
          ))}
          {[0,1,2,3,4,5,6].map(i => (
            <rect key={`qfn-t-${i}`} x={378 + i * 12} y="159" width="6" height="3" rx="0.5" fill="rgba(255,255,255,0.06)" />
          ))}
          {[0,1,2,3].map(i => (
            <rect key={`qfn-l-${i}`} x={368} y={170 + i * 14} width="3" height="6" rx="0.5" fill="rgba(255,255,255,0.06)" />
          ))}
          {[0,1,2,3].map(i => (
            <rect key={`qfn-r-${i}`} x={469} y={170 + i * 14} width="3" height="6" rx="0.5" fill="rgba(255,255,255,0.06)" />
          ))}
          <text x="420" y="192" textAnchor="middle" fill="rgba(255,255,255,0.4)" className="label-data">BCM2710A1</text>
          <text x="420" y="204" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">Quad A53</text>
          {/* Power + Data LEDs on processor */}
          <circle cx="380" cy="172" r="2" fill="#34d399" className="pulse-dot" />
          <circle cx="380" cy="180" r="2" fill="#2d8cf0" className="pulse-dot" style={{ animationDelay: '0.7s' }} />
        </g>

        {/* ---- ADS1115 ADC (center-left) ---- */}
        <g>
          <rect x="185" y="170" width="80" height="45" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(52,211,153,0.25)" strokeWidth="0.8" />
          <text x="225" y="192" textAnchor="middle" fill="rgba(52,211,153,0.5)" className="label-data">ADS1115</text>
          <text x="225" y="204" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">16-bit · 4ch</text>
          {/* Trace ADC → Processor */}
          <path d="M265 195 L290 195 L290 190 L370 190" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" strokeDasharray="2 4" />
        </g>

        {/* ---- GPS Module (right side, above LoRa) ---- */}
        <g>
          <rect x="510" y="100" width="65" height="35" rx="3" fill="rgba(255,255,255,0.03)" stroke="rgba(45,140,240,0.2)" strokeWidth="0.6" />
          <text x="542" y="118" textAnchor="middle" fill="rgba(45,140,240,0.4)" className="label-data">GPS</text>
          <text x="542" y="128" textAnchor="middle" fill="rgba(255,255,255,0.15)" className="label-sm">u.FL</text>
          {/* Trace GPS → edge connector */}
          <path d="M575 117 L600 117 L600 140" stroke="rgba(45,140,240,0.2)" strokeWidth="0.6" strokeDasharray="2 3" />
          {/* Trace GPS → processor */}
          <path d="M510 120 L475 120 L475 170" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="2 4" />
        </g>

        {/* ---- SX1262 LoRa (right side, below GPS) ---- */}
        <g>
          <rect x="510" y="155" width="65" height="40" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(45,140,240,0.25)" strokeWidth="0.8" />
          <text x="542" y="174" textAnchor="middle" fill="rgba(45,140,240,0.5)" className="label-data">SX1262</text>
          <text x="542" y="186" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">LoRa Radio</text>
          {/* Trace SX1262 → edge SMA connector */}
          <path d="M575 175 L600 175 L600 180" stroke="rgba(45,140,240,0.3)" strokeWidth="1" strokeDasharray="3 3" className="data-flow" />
          {/* Trace SX1262 → processor (SPI bus) */}
          <path d="M510 175 L475 175 L475 180" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" strokeDasharray="2 4" />
        </g>

        {/* ---- PH BNC Connector (right edge, lower) ---- */}
        <g>
          <circle cx="585" cy="275" r="12" fill="#0f1114" stroke="rgba(52,211,153,0.4)" strokeWidth="1" />
          <circle cx="585" cy="275" r="5" fill="none" stroke="rgba(52,211,153,0.25)" strokeWidth="0.8" />
          <circle cx="585" cy="275" r="2" fill="#34d399" opacity="0.5" />
          <text x="585" y="295" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">PH</text>
          <text x="585" y="304" textAnchor="middle" fill="rgba(52,211,153,0.3)" className="label-sm">BNC</text>
          {/* Trace BNC → ADC */}
          <path d="M573 275 L520 275 L520 210 L265 210" stroke="rgba(52,211,153,0.12)" strokeWidth="0.6" strokeDasharray="2 4" />
        </g>

        {/* ---- Sensor / I²C header (bottom edge) ---- */}
        <g>
          <rect x="170" y="316" width="220" height="14" rx="2" fill="rgba(52,211,153,0.06)" stroke="rgba(52,211,153,0.2)" strokeWidth="0.5" />
          {/* Pin dots */}
          {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
            <circle key={`hdr-${i}`} cx={182 + i * 17} cy="323" r="1.5" fill={i < 4 ? '#34d399' : i < 6 ? '#2d8cf0' : 'rgba(255,255,255,0.2)'} opacity={i < 6 ? 0.5 : 0.3} />
          ))}
          <text x="182" y="340" fill="rgba(255,255,255,0.1)" style={{ fontSize: '4px', fontFamily: 'IBM Plex Mono, monospace' }}>SDA SCL GND V+ GN DATA VN SNDY TUS 1M OUT IN</text>
          {/* Trace header → ADC */}
          <path d="M225 316 L225 215" stroke="rgba(52,211,153,0.1)" strokeWidth="0.5" strokeDasharray="2 3" />
        </g>

        {/* ---- Processor → Relay driver traces ---- */}
        <path d="M420 230 L420 245 L350 245 L350 135" stroke="rgba(251,191,36,0.08)" strokeWidth="0.5" strokeDasharray="2 4" />

        {/* ---- BlueSignal XYZ branding (right side, vertical) ---- */}
        <text x="596" y="230" fill="rgba(255,255,255,0.08)" style={{ fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, letterSpacing: '0.15em' }} transform="rotate(-90 596 230)">BlueSignal XYZ</text>
        {/* Antenna trace curves (decorative, matching real board) */}
        <path d="M575 60 Q590 80 575 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
        <path d="M580 62 Q595 82 580 102" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
        <path d="M585 64 Q600 84 585 104" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
      </g>
    </g>

    {/* ========== EXTERNAL WIRING ========== */}

    {/* ---- LoRa Antenna (right side) ---- */}
    <g>
      {/* SMA connector on enclosure edge */}
      <rect x="632" y="172" width="14" height="16" rx="2" fill="#0f1114" stroke="rgba(45,140,240,0.4)" strokeWidth="0.8" />
      {/* Antenna mast */}
      <line x1="652" y1="180" x2="652" y2="130" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="652" cy="126" r="3.5" fill="none" stroke="rgba(45,140,240,0.5)" strokeWidth="1.2" />
      <circle cx="652" cy="126" r="1.5" fill="#2d8cf0" opacity="0.7" />
      {/* Signal arcs */}
      <path d="M644 120 Q652 112 660 120" fill="none" stroke="rgba(45,140,240,0.35)" strokeWidth="0.8">
        <animate attributeName="opacity" values="0.35;0.1;0.35" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M640 114 Q652 104 664 114" fill="none" stroke="rgba(45,140,240,0.25)" strokeWidth="0.8">
        <animate attributeName="opacity" values="0.25;0.05;0.25" dur="2s" begin="0.3s" repeatCount="indefinite" />
      </path>
      <text x="652" y="108" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">915 MHz</text>
      <text x="652" y="196" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">SMA</text>
    </g>

    {/* ---- Power Supply (left side, from VIN) ---- */}
    <g>
      <path d="M60 78 L30 78 L30 120 L24 120 L24 420" stroke="rgba(248,113,113,0.35)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
      <path d="M26 78 L26 420" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
      {/* DC Power supply icon */}
      <rect x="0" y="420" width="48" height="50" rx="5" fill="#0f1114" stroke="rgba(248,113,113,0.3)" strokeWidth="1" />
      <line x1="12" y1="438" x2="20" y2="438" stroke="#f87171" strokeWidth="1.2" />
      <line x1="16" y1="434" x2="16" y2="442" stroke="#f87171" strokeWidth="1.2" />
      <line x1="32" y1="438" x2="40" y2="438" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
      <text x="24" y="458" textAnchor="middle" fill="rgba(248,113,113,0.5)" className="label-data">9–24V</text>
      <text x="24" y="485" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">DC Power</text>
    </g>

    {/* ---- pH Probe (from right-side BNC) ---- */}
    <g>
      <path d="M597 275 L630 275 L630 280 L630 420" stroke="rgba(52,211,153,0.35)" strokeWidth="2" strokeDasharray="4 4" className="sensor-glow" fill="none" />
      <rect x="616" y="420" width="28" height="60" rx="4" fill="#0f1114" stroke="rgba(52,211,153,0.3)" strokeWidth="1" />
      <line x1="630" y1="480" x2="630" y2="505" stroke="rgba(52,211,153,0.4)" strokeWidth="1.5" />
      <circle cx="630" cy="508" r="3" fill="#34d399" opacity="0.5" className="sensor-glow" />
      <text x="630" y="440" textAnchor="middle" fill="rgba(52,211,153,0.6)" className="label-data">pH</text>
      <text x="630" y="452" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">0–14</text>
      <text x="630" y="525" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">pH Probe</text>
    </g>

    {/* ---- Sensor Array (from bottom header) ---- */}
    <g>
      <path d="M200 330 L200 360 L200 410" stroke="rgba(45,140,240,0.3)" strokeWidth="2" strokeDasharray="4 4" className="sensor-glow" fill="none" />
      <path d="M200 410 L170 430" stroke="rgba(45,140,240,0.25)" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
      <path d="M200 410 L200 430" stroke="rgba(45,140,240,0.25)" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
      <path d="M200 410 L230 430" stroke="rgba(251,191,36,0.25)" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />

      <rect x="157" y="430" width="26" height="45" rx="3" fill="#0f1114" stroke="rgba(45,140,240,0.25)" strokeWidth="0.8" />
      <text x="170" y="448" textAnchor="middle" fill="rgba(45,140,240,0.5)" className="label-data">TDS</text>
      <line x1="170" y1="475" x2="170" y2="500" stroke="rgba(45,140,240,0.3)" strokeWidth="1.2" />
      <circle cx="170" cy="503" r="2.5" fill="#2d8cf0" opacity="0.5" className="sensor-glow" />

      <rect x="187" y="430" width="26" height="45" rx="3" fill="#0f1114" stroke="rgba(45,140,240,0.25)" strokeWidth="0.8" />
      <text x="200" y="448" textAnchor="middle" fill="rgba(45,140,240,0.5)" className="label-data">ORP</text>
      <line x1="200" y1="475" x2="200" y2="500" stroke="rgba(45,140,240,0.3)" strokeWidth="1.2" />
      <circle cx="200" cy="503" r="2.5" fill="#2d8cf0" opacity="0.5" className="sensor-glow" style={{ animationDelay: '0.4s' }} />

      <rect x="217" y="430" width="26" height="45" rx="3" fill="#0f1114" stroke="rgba(251,191,36,0.25)" strokeWidth="0.8" />
      <text x="230" y="448" textAnchor="middle" fill="rgba(251,191,36,0.5)" className="label-data">Turb</text>
      <line x1="230" y1="475" x2="230" y2="500" stroke="rgba(251,191,36,0.3)" strokeWidth="1.2" />
      <circle cx="230" cy="503" r="2.5" fill="#fbbf24" opacity="0.5" className="sensor-glow" style={{ animationDelay: '0.8s' }} />

      <text x="200" y="525" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">Sensor Array</text>
    </g>

    {/* ---- I2C Expansion (from bottom header) ---- */}
    <g>
      <path d="M330 330 L330 360 L330 430" stroke="rgba(45,140,240,0.25)" strokeWidth="1.5" strokeDasharray="4 6" fill="none" />
      <rect x="305" y="430" width="50" height="35" rx="4" fill="#0f1114" stroke="rgba(45,140,240,0.2)" strokeWidth="0.8" />
      <text x="330" y="448" textAnchor="middle" fill="rgba(45,140,240,0.4)" className="label-data">I²C</text>
      <text x="330" y="460" textAnchor="middle" fill="rgba(255,255,255,0.15)" className="label-sm">3.3V</text>
      <line x1="315" y1="430" x2="315" y2="425" stroke="rgba(45,140,240,0.2)" strokeWidth="0.6" />
      <line x1="322" y1="430" x2="322" y2="425" stroke="rgba(45,140,240,0.2)" strokeWidth="0.6" />
      <line x1="329" y1="430" x2="329" y2="425" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />
      <line x1="336" y1="430" x2="336" y2="425" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />
      <text x="330" y="480" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">Expansion</text>
    </g>

    {/* ---- Relay Output / Chemical Doser (from top relay terminals) ---- */}
    <g>
      <path d="M380 20 L380 0 L380 -10" stroke="rgba(251,191,36,0.3)" strokeWidth="1.5" fill="none" />
      <path d="M380 50 L380 20" stroke="rgba(251,191,36,0.15)" strokeWidth="1" strokeDasharray="2 3" fill="none" />
      {/* Wire down to doser */}
      <path d="M560 50 L560 10 L480 10 L480 420" stroke="rgba(251,191,36,0.3)" strokeWidth="1.5" strokeDasharray="5 5" className="data-flow" fill="none" />
      <rect x="456" y="420" width="50" height="50" rx="6" fill="#0f1114" stroke="rgba(251,191,36,0.3)" strokeWidth="1" />
      <rect x="470" y="427" width="22" height="15" rx="2" fill="none" stroke="rgba(251,191,36,0.25)" strokeWidth="1" />
      <rect x="471" y="434" width="20" height="7" rx="1" fill="rgba(251,191,36,0.08)" />
      <line x1="481" y1="442" x2="481" y2="450" stroke="rgba(251,191,36,0.3)" strokeWidth="1.2" />
      <circle cx="481" cy="454" r="1.5" fill="rgba(251,191,36,0.35)">
        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <text x="481" y="465" textAnchor="middle" fill="rgba(251,191,36,0.5)" className="label-data">Doser</text>
      <text x="481" y="485" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">Relay Out</text>
      <text x="481" y="495" textAnchor="middle" fill="rgba(255,255,255,0.15)" className="label-sm">10A · 250VAC</text>
    </g>

    {/* ========== COLOR LEGEND ========== */}
    <g>
      <circle cx="140" cy="575" r="4" fill="#34d399" opacity="0.6" />
      <text x="150" y="578" fill="rgba(255,255,255,0.35)" className="label-sm">Sensor</text>

      <circle cx="210" cy="575" r="4" fill="#2d8cf0" opacity="0.6" />
      <text x="220" y="578" fill="rgba(255,255,255,0.35)" className="label-sm">Data</text>

      <circle cx="270" cy="575" r="4" fill="#f87171" opacity="0.6" />
      <text x="280" y="578" fill="rgba(255,255,255,0.35)" className="label-sm">Power</text>

      <circle cx="330" cy="575" r="4" fill="#fbbf24" opacity="0.6" />
      <text x="340" y="578" fill="rgba(255,255,255,0.35)" className="label-sm">Control</text>
    </g>
  </DiagramSvg>
);

export default WiringDiagram;

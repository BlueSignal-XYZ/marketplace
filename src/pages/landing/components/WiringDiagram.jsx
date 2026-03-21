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
  <DiagramSvg viewBox="0 0 620 580" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
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

    {/* ========== LORA ANTENNA (top) ========== */}
    <g>
      {/* Antenna mast */}
      <line x1="470" y1="28" x2="470" y2="72" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Antenna tip */}
      <circle cx="470" cy="24" r="3.5" fill="none" stroke="rgba(45,140,240,0.5)" strokeWidth="1.2" />
      <circle cx="470" cy="24" r="1.5" fill="#2d8cf0" opacity="0.7" />
      {/* Signal arcs */}
      <path d="M458 18 Q470 8 482 18" fill="none" stroke="rgba(45,140,240,0.35)" strokeWidth="0.8">
        <animate attributeName="opacity" values="0.35;0.1;0.35" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M452 12 Q470 -2 488 12" fill="none" stroke="rgba(45,140,240,0.25)" strokeWidth="0.8">
        <animate attributeName="opacity" values="0.25;0.05;0.25" dur="2s" begin="0.3s" repeatCount="indefinite" />
      </path>
      <path d="M446 6 Q470 -12 494 6" fill="none" stroke="rgba(45,140,240,0.15)" strokeWidth="0.8">
        <animate attributeName="opacity" values="0.15;0.02;0.15" dur="2s" begin="0.6s" repeatCount="indefinite" />
      </path>
      {/* Label */}
      <text x="470" y="10" textAnchor="middle" fill="rgba(255,255,255,0.25)" className="label-sm">915 MHz LoRa</text>
      {/* SMA connector base */}
      <rect x="464" y="72" width="12" height="8" rx="2" fill="#0f1114" stroke="rgba(251,191,36,0.4)" strokeWidth="0.8" />
      <text x="470" y="92" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">SMA</text>
    </g>

    {/* ========== IP65 ENCLOSURE ========== */}
    <g>
      {/* Main enclosure body */}
      <rect x="80" y="100" width="460" height="270" rx="14" fill="#0f1114" stroke="rgba(255,255,255,0.12)" strokeWidth="1.8" />
      {/* Enclosure lid line */}
      <line x1="94" y1="114" x2="526" y2="114" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      {/* Corner mounting lugs */}
      <circle cx="96" cy="116" r="5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <circle cx="524" cy="116" r="5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <circle cx="96" cy="354" r="5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <circle cx="524" cy="354" r="5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* Enclosure label */}
      <text x="310" y="382" textAnchor="middle" fill="rgba(255,255,255,0.12)" className="label">IP65 Rated Enclosure</text>

      {/* ========== CABLE GLANDS (bottom of enclosure) ========== */}
      {/* pH / BNC gland */}
      <circle cx="150" cy="370" r="7" fill="#0f1114" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {/* Sensor array gland */}
      <circle cx="230" cy="370" r="7" fill="#0f1114" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {/* I2C gland */}
      <circle cx="350" cy="370" r="7" fill="#0f1114" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {/* Power gland */}
      <circle cx="430" cy="370" r="7" fill="#0f1114" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {/* Antenna gland (top) */}
      <circle cx="470" cy="100" r="7" fill="#0f1114" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

      {/* ========== PCB BOARD (inside enclosure) ========== */}
      <g>
        <rect x="120" y="130" width="380" height="210" rx="8" fill="url(#wd-boardGrad)" stroke="#34d399" strokeWidth="1" strokeOpacity="0.5" />
        {/* PCB mounting holes */}
        <circle cx="134" cy="144" r="4" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
        <circle cx="486" cy="144" r="4" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
        <circle cx="134" cy="326" r="4" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
        <circle cx="486" cy="326" r="4" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
        {/* Board label */}
        <text x="310" y="152" textAnchor="middle" fill="rgba(52,211,153,0.4)" className="label">WQM-1 Rev 2.1</text>

        {/* ---- BCM2710A1 (main processor) ---- */}
        <rect x="150" y="165" width="90" height="55" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
        <text x="195" y="188" textAnchor="middle" fill="rgba(255,255,255,0.4)" className="label-data">BCM2710A1</text>
        <text x="195" y="200" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">Quad A53</text>
        {/* Power LED */}
        <circle cx="160" cy="178" r="2.5" fill="#34d399" className="pulse-dot" />
        {/* Data LED */}
        <circle cx="160" cy="186" r="2.5" fill="#2d8cf0" className="pulse-dot" style={{ animationDelay: '0.7s' }} />

        {/* ---- SX1262 (LoRa transceiver) ---- */}
        <rect x="370" y="165" width="80" height="45" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(45,140,240,0.25)" strokeWidth="0.8" />
        <text x="410" y="185" textAnchor="middle" fill="rgba(45,140,240,0.5)" className="label-data">SX1262</text>
        <text x="410" y="197" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">LoRa Radio</text>
        {/* Trace from SX1262 to SMA connector */}
        <path d="M430 165 L430 145 L470 145 L470 130" stroke="rgba(45,140,240,0.3)" strokeWidth="1" strokeDasharray="3 3" className="data-flow" />

        {/* ---- ADS1115 (ADC) ---- */}
        <rect x="150" y="235" width="80" height="45" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(52,211,153,0.25)" strokeWidth="0.8" />
        <text x="190" y="255" textAnchor="middle" fill="rgba(52,211,153,0.5)" className="label-data">ADS1115</text>
        <text x="190" y="267" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">16-bit · 4ch</text>

        {/* ---- 4× Relay Block ---- */}
        <rect x="280" y="235" width="100" height="45" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(251,191,36,0.25)" strokeWidth="0.8" />
        <text x="330" y="255" textAnchor="middle" fill="rgba(251,191,36,0.5)" className="label-data">4× Relay</text>
        <text x="330" y="267" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">10A · 250VAC</text>
        {/* Relay terminal indicators */}
        <rect x="284" y="282" width="18" height="6" rx="1" fill="rgba(251,191,36,0.1)" stroke="rgba(251,191,36,0.2)" strokeWidth="0.5" />
        <rect x="306" y="282" width="18" height="6" rx="1" fill="rgba(251,191,36,0.1)" stroke="rgba(251,191,36,0.2)" strokeWidth="0.5" />
        <rect x="328" y="282" width="18" height="6" rx="1" fill="rgba(251,191,36,0.1)" stroke="rgba(251,191,36,0.2)" strokeWidth="0.5" />
        <rect x="350" y="282" width="18" height="6" rx="1" fill="rgba(251,191,36,0.1)" stroke="rgba(251,191,36,0.2)" strokeWidth="0.5" />
        <text x="284" y="296" fill="rgba(255,255,255,0.12)" style={{ fontSize: '5px', fontFamily: 'IBM Plex Mono, monospace' }}>NC COM NO</text>

        {/* ---- BNC Connector (pH) ---- */}
        <circle cx="135" cy="270" r="10" fill="#0f1114" stroke="rgba(52,211,153,0.4)" strokeWidth="1" />
        <circle cx="135" cy="270" r="4" fill="none" stroke="rgba(52,211,153,0.25)" strokeWidth="0.8" />
        <circle cx="135" cy="270" r="1.5" fill="#34d399" opacity="0.5" />
        <text x="135" y="290" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">BNC</text>
        {/* Trace from BNC to ADC */}
        <line x1="145" y1="270" x2="150" y2="258" stroke="rgba(52,211,153,0.2)" strokeWidth="0.8" />

        {/* ---- Sensor header (PH connector) ---- */}
        <rect x="200" y="310" width="50" height="12" rx="2" fill="rgba(52,211,153,0.08)" stroke="rgba(52,211,153,0.25)" strokeWidth="0.6" />
        <text x="225" y="335" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">Sensor Header</text>
        {/* Pin dots */}
        <circle cx="210" cy="316" r="1.5" fill="#34d399" opacity="0.4" />
        <circle cx="218" cy="316" r="1.5" fill="#2d8cf0" opacity="0.4" />
        <circle cx="226" cy="316" r="1.5" fill="#fbbf24" opacity="0.4" />
        <circle cx="234" cy="316" r="1.5" fill="rgba(255,255,255,0.3)" />
        <circle cx="242" cy="316" r="1.5" fill="rgba(255,255,255,0.3)" />

        {/* ---- I2C Header ---- */}
        <rect x="320" y="310" width="40" height="12" rx="2" fill="rgba(45,140,240,0.08)" stroke="rgba(45,140,240,0.25)" strokeWidth="0.6" />
        <text x="340" y="335" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">I²C</text>
        {/* Pin labels */}
        <text x="325" y="308" fill="rgba(255,255,255,0.1)" style={{ fontSize: '4.5px', fontFamily: 'IBM Plex Mono, monospace' }}>SDA SCL GND V+</text>

        {/* ---- Power Input ---- */}
        <rect x="410" y="310" width="40" height="12" rx="2" fill="rgba(248,113,113,0.08)" stroke="rgba(248,113,113,0.25)" strokeWidth="0.6" />
        <text x="430" y="335" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">PWR</text>
        {/* JST pin dots */}
        <circle cx="423" cy="316" r="1.5" fill="#f87171" opacity="0.5" />
        <circle cx="437" cy="316" r="1.5" fill="rgba(255,255,255,0.2)" />

        {/* ---- Internal traces (simplified) ---- */}
        {/* ADC to sensor header */}
        <line x1="190" y1="280" x2="225" y2="310" stroke="rgba(52,211,153,0.12)" strokeWidth="0.6" />
        {/* Processor to radio */}
        <line x1="240" y1="190" x2="370" y2="185" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" strokeDasharray="2 4" />
        {/* Processor to ADC */}
        <line x1="195" y1="220" x2="190" y2="235" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" strokeDasharray="2 4" />
        {/* Processor to relays */}
        <line x1="240" y1="200" x2="280" y2="248" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" strokeDasharray="2 4" />
      </g>
    </g>

    {/* ========== EXTERNAL WIRING ========== */}

    {/* ---- pH Probe (from BNC through cable gland) ---- */}
    <g>
      {/* Cable through gland */}
      <path d="M150 340 L150 370 L150 420" stroke="rgba(52,211,153,0.35)" strokeWidth="2" strokeDasharray="4 4" className="sensor-glow" fill="none" />
      {/* BNC probe icon */}
      <rect x="136" y="420" width="28" height="60" rx="4" fill="#0f1114" stroke="rgba(52,211,153,0.3)" strokeWidth="1" />
      <line x1="150" y1="480" x2="150" y2="505" stroke="rgba(52,211,153,0.4)" strokeWidth="1.5" />
      <circle cx="150" cy="508" r="3" fill="#34d399" opacity="0.5" className="sensor-glow" />
      <text x="150" y="440" textAnchor="middle" fill="rgba(52,211,153,0.6)" className="label-data">pH</text>
      <text x="150" y="452" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">0–14</text>
      <text x="150" y="525" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">pH Probe</text>
    </g>

    {/* ---- Sensor Array (from sensor header through cable gland) ---- */}
    <g>
      {/* Main cable */}
      <path d="M230 340 L230 370 L230 410" stroke="rgba(45,140,240,0.3)" strokeWidth="2" strokeDasharray="4 4" className="sensor-glow" fill="none" />
      {/* Fan out to probes */}
      <path d="M230 410 L200 430" stroke="rgba(45,140,240,0.25)" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
      <path d="M230 410 L230 430" stroke="rgba(45,140,240,0.25)" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />
      <path d="M230 410 L260 430" stroke="rgba(251,191,36,0.25)" strokeWidth="1.2" strokeDasharray="3 3" fill="none" />

      {/* TDS probe */}
      <rect x="187" y="430" width="26" height="45" rx="3" fill="#0f1114" stroke="rgba(45,140,240,0.25)" strokeWidth="0.8" />
      <text x="200" y="448" textAnchor="middle" fill="rgba(45,140,240,0.5)" className="label-data">TDS</text>
      <line x1="200" y1="475" x2="200" y2="500" stroke="rgba(45,140,240,0.3)" strokeWidth="1.2" />
      <circle cx="200" cy="503" r="2.5" fill="#2d8cf0" opacity="0.5" className="sensor-glow" />

      {/* ORP probe */}
      <rect x="217" y="430" width="26" height="45" rx="3" fill="#0f1114" stroke="rgba(45,140,240,0.25)" strokeWidth="0.8" />
      <text x="230" y="448" textAnchor="middle" fill="rgba(45,140,240,0.5)" className="label-data">ORP</text>
      <line x1="230" y1="475" x2="230" y2="500" stroke="rgba(45,140,240,0.3)" strokeWidth="1.2" />
      <circle cx="230" cy="503" r="2.5" fill="#2d8cf0" opacity="0.5" className="sensor-glow" style={{ animationDelay: '0.4s' }} />

      {/* Turbidity probe */}
      <rect x="247" y="430" width="26" height="45" rx="3" fill="#0f1114" stroke="rgba(251,191,36,0.25)" strokeWidth="0.8" />
      <text x="260" y="448" textAnchor="middle" fill="rgba(251,191,36,0.5)" className="label-data">Turb</text>
      <line x1="260" y1="475" x2="260" y2="500" stroke="rgba(251,191,36,0.3)" strokeWidth="1.2" />
      <circle cx="260" cy="503" r="2.5" fill="#fbbf24" opacity="0.5" className="sensor-glow" style={{ animationDelay: '0.8s' }} />

      <text x="230" y="525" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">Sensor Array</text>
    </g>

    {/* ---- I2C Expansion (from I2C header through cable gland) ---- */}
    <g>
      {/* Cable */}
      <path d="M350 340 L350 370 L350 430" stroke="rgba(45,140,240,0.25)" strokeWidth="1.5" strokeDasharray="4 6" fill="none" />
      {/* Expansion module box */}
      <rect x="325" y="430" width="50" height="35" rx="4" fill="#0f1114" stroke="rgba(45,140,240,0.2)" strokeWidth="0.8" />
      <text x="350" y="448" textAnchor="middle" fill="rgba(45,140,240,0.4)" className="label-data">I²C</text>
      <text x="350" y="460" textAnchor="middle" fill="rgba(255,255,255,0.15)" className="label-sm">3.3V</text>
      {/* 4 wire indicators */}
      <line x1="335" y1="430" x2="335" y2="425" stroke="rgba(45,140,240,0.2)" strokeWidth="0.6" />
      <line x1="342" y1="430" x2="342" y2="425" stroke="rgba(45,140,240,0.2)" strokeWidth="0.6" />
      <line x1="349" y1="430" x2="349" y2="425" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />
      <line x1="356" y1="430" x2="356" y2="425" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />
      <text x="350" y="480" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">Expansion</text>
    </g>

    {/* ---- Power Input (from PWR header through cable gland) ---- */}
    <g>
      {/* Cable */}
      <path d="M430 340 L430 370 L430 420" stroke="rgba(248,113,113,0.35)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
      <path d="M432 340 L432 370 L432 420" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
      {/* DC Power supply icon */}
      <rect x="408" y="420" width="46" height="50" rx="5" fill="#0f1114" stroke="rgba(248,113,113,0.3)" strokeWidth="1" />
      {/* + / - symbols */}
      <line x1="420" y1="438" x2="428" y2="438" stroke="#f87171" strokeWidth="1.2" />
      <line x1="424" y1="434" x2="424" y2="442" stroke="#f87171" strokeWidth="1.2" />
      <line x1="436" y1="438" x2="444" y2="438" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
      {/* Voltage label */}
      <text x="431" y="458" textAnchor="middle" fill="rgba(248,113,113,0.5)" className="label-data">9–24V</text>
      <text x="431" y="485" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">DC Power</text>
      <text x="431" y="495" textAnchor="middle" fill="rgba(255,255,255,0.15)" className="label-sm">JST-XH</text>
    </g>

    {/* ---- Relay Output (right side) ---- */}
    <g>
      {/* Wires from relay block out through right side of enclosure */}
      <path d="M380 258 L540 258 L540 250 L560 250" stroke="rgba(251,191,36,0.3)" strokeWidth="1.5" strokeDasharray="5 5" className="data-flow" fill="none" />
      {/* Cable gland (right side of enclosure) */}
      <circle cx="540" cy="250" r="7" fill="#0f1114" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

      {/* Pump / Valve icon */}
      <rect x="560" y="225" width="50" height="50" rx="6" fill="#0f1114" stroke="rgba(251,191,36,0.3)" strokeWidth="1" />
      {/* Pump impeller icon */}
      <circle cx="585" cy="244" r="12" fill="none" stroke="rgba(251,191,36,0.2)" strokeWidth="1" />
      <line x1="585" y1="232" x2="585" y2="256" stroke="rgba(251,191,36,0.15)" strokeWidth="0.8" />
      <line x1="573" y1="244" x2="597" y2="244" stroke="rgba(251,191,36,0.15)" strokeWidth="0.8" />
      <text x="585" y="267" textAnchor="middle" fill="rgba(251,191,36,0.5)" className="label-data">Pump</text>
      <text x="585" y="290" textAnchor="middle" fill="rgba(255,255,255,0.2)" className="label-sm">Relay Out</text>
      <text x="585" y="300" textAnchor="middle" fill="rgba(255,255,255,0.15)" className="label-sm">10A · 250VAC</text>
    </g>

    {/* ---- Coax from antenna gland to SX1262 ---- */}
    <g>
      <path d="M470 107 L470 130 L430 145" stroke="rgba(251,191,36,0.25)" strokeWidth="1" strokeDasharray="3 3" className="data-flow" fill="none" />
    </g>

    {/* ========== COLOR LEGEND ========== */}
    <g>
      <circle cx="120" cy="555" r="4" fill="#34d399" opacity="0.6" />
      <text x="130" y="558" fill="rgba(255,255,255,0.35)" className="label-sm">Sensor</text>

      <circle cx="185" cy="555" r="4" fill="#2d8cf0" opacity="0.6" />
      <text x="195" y="558" fill="rgba(255,255,255,0.35)" className="label-sm">Data</text>

      <circle cx="240" cy="555" r="4" fill="#f87171" opacity="0.6" />
      <text x="250" y="558" fill="rgba(255,255,255,0.35)" className="label-sm">Power</text>

      <circle cx="300" cy="555" r="4" fill="#fbbf24" opacity="0.6" />
      <text x="310" y="558" fill="rgba(255,255,255,0.35)" className="label-sm">Control</text>
    </g>
  </DiagramSvg>
);

export default WiringDiagram;

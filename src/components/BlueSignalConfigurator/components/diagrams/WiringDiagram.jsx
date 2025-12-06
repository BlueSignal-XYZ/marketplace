// Wiring Diagram SVG Component
import React from "react";

const WiringDiagram = ({ product }) => {
  const voltage = product.battery?.voltage || (product.power.type === "AC" ? 24 : 12);
  const hasSolar = product.solar !== null;
  const hasUltrasonic = product.ultrasonic?.enabled;
  const isXL = product.id === "smart-buoy-xl";

  return (
    <svg viewBox="0 0 700 500" style={{ width: "100%", maxWidth: 700 }}>
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
        </marker>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="700" height="500" fill="#0f172a" />

      {/* Title */}
      <text x="20" y="30" fill="#60a5fa" fontSize="14" fontWeight="700">{product.name} Wiring Diagram</text>

      {/* Voltage Rails */}
      <text x="20" y="60" fill="#94a3b8" fontSize="11" fontWeight="600">VOLTAGE RAILS:</text>

      {/* 24V/12V Rail */}
      <line x1="50" y1="80" x2="650" y2="80" stroke="#f97316" strokeWidth="4" />
      <text x="55" y="95" fill="#f97316" fontSize="10" fontWeight="600">{voltage}V DC</text>

      {/* 5V Rail */}
      <line x1="50" y1="110" x2="650" y2="110" stroke="#22c55e" strokeWidth="3" />
      <text x="55" y="125" fill="#22c55e" fontSize="10" fontWeight="600">5V DC</text>

      {/* 3.3V Rail */}
      <line x1="50" y1="135" x2="650" y2="135" stroke="#a855f7" strokeWidth="2" />
      <text x="55" y="150" fill="#a855f7" fontSize="10" fontWeight="600">3.3V DC</text>

      {/* GND Rail */}
      <line x1="50" y1="460" x2="650" y2="460" stroke="#64748b" strokeWidth="4" />
      <text x="55" y="475" fill="#64748b" fontSize="10" fontWeight="600">GND</text>

      {/* Power Source */}
      <g transform="translate(70, 180)">
        <rect width="100" height="80" rx="8" fill="rgba(251, 146, 60, 0.2)" stroke="#f97316" strokeWidth="2" />
        <text x="50" y="25" textAnchor="middle" fill="#f97316" fontSize="11" fontWeight="600">
          {product.power.type === "AC" ? "AC/DC PSU" : "SOLAR + MPPT"}
        </text>
        {hasSolar && (
          <>
            <text x="50" y="45" textAnchor="middle" fill="#cbd5e1" fontSize="9">{product.solar.watts}W Panel</text>
            <text x="50" y="60" textAnchor="middle" fill="#cbd5e1" fontSize="9">Victron MPPT</text>
          </>
        )}
        {product.power.type === "AC" && (
          <text x="50" y="50" textAnchor="middle" fill="#cbd5e1" fontSize="9">Mean Well 24V</text>
        )}
        <line x1="100" y1="20" x2="120" y2="20" stroke="#f97316" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="50" y1="80" x2="50" y2="100" stroke="#64748b" strokeWidth="2" />
      </g>

      {/* Battery */}
      {product.battery && (
        <g transform="translate(200, 180)">
          <rect width="90" height="80" rx="8" fill="rgba(74, 222, 128, 0.2)" stroke="#4ade80" strokeWidth="2" />
          <text x="45" y="25" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="600">BATTERY</text>
          <text x="45" y="45" textAnchor="middle" fill="#cbd5e1" fontSize="9">{product.battery.voltage}V {product.battery.capacity}Ah</text>
          <text x="45" y="60" textAnchor="middle" fill="#cbd5e1" fontSize="9">LiFePO4</text>
          <line x1="0" y1="20" x2="-20" y2="20" stroke="#f97316" strokeWidth="2" />
          <line x1="90" y1="20" x2="110" y2="20" stroke="#f97316" strokeWidth="2" markerEnd="url(#arrowhead)" />
        </g>
      )}

      {/* Buck Converter */}
      <g transform="translate(320, 180)">
        <rect width="80" height="60" rx="8" fill="rgba(34, 197, 94, 0.2)" stroke="#22c55e" strokeWidth="2" />
        <text x="40" y="22" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="600">BUCK</text>
        <text x="40" y="38" textAnchor="middle" fill="#cbd5e1" fontSize="9">{voltage}V → 5V</text>
        <line x1="0" y1="20" x2="-20" y2="20" stroke="#f97316" strokeWidth="2" />
        <line x1="80" y1="20" x2="100" y2="20" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrowhead)" />
      </g>

      {/* Pi Zero / Pi 4 */}
      <g transform="translate(440, 170)">
        <rect width="120" height="90" rx="8" fill="rgba(96, 165, 250, 0.2)" stroke="#60a5fa" strokeWidth="2" />
        <text x="60" y="22" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="600">
          {isXL ? "Pi 4 (4GB)" : "Pi Zero 2W"}
        </text>
        <text x="60" y="42" textAnchor="middle" fill="#cbd5e1" fontSize="9">Controller</text>
        <text x="60" y="58" textAnchor="middle" fill="#94a3b8" fontSize="8">I2C / UART / GPIO</text>
        <line x1="0" y1="25" x2="-20" y2="25" stroke="#22c55e" strokeWidth="2" />

        {/* GPIO pins */}
        <rect x="105" y="30" width="10" height="40" fill="#1e293b" />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx="110" cy={35 + i * 10} r="3" fill="#60a5fa" />
        ))}
      </g>

      {/* SIM HAT */}
      <g transform="translate(580, 170)">
        <rect width="100" height="70" rx="8" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" strokeWidth="2" />
        <text x="50" y="22" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="600">SIM7670G</text>
        <text x="50" y="40" textAnchor="middle" fill="#cbd5e1" fontSize="9">LTE Cat-1 HAT</text>
        <text x="50" y="55" textAnchor="middle" fill="#94a3b8" fontSize="8">UART</text>
        <line x1="0" y1="25" x2="-20" y2="25" stroke="#22c55e" strokeWidth="2" />
      </g>

      {/* ADC */}
      <g transform="translate(320, 300)">
        <rect width="80" height="60" rx="8" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" />
        <text x="40" y="22" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="600">ADS1115</text>
        <text x="40" y="38" textAnchor="middle" fill="#cbd5e1" fontSize="9">16-bit ADC</text>
        <text x="40" y="52" textAnchor="middle" fill="#94a3b8" fontSize="8">I2C 0x48</text>
        <line x1="40" y1="0" x2="500" y2="-40" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3" />
      </g>

      {/* Sensors */}
      <g transform="translate(200, 320)">
        <rect width="100" height="80" rx="8" fill="rgba(34, 197, 94, 0.2)" stroke="#22c55e" strokeWidth="2" />
        <text x="50" y="22" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="600">SENSORS</text>
        {product.sensorList.slice(0, 3).map((s, i) => (
          <text key={i} x="50" y={40 + i * 12} textAnchor="middle" fill="#cbd5e1" fontSize="8">{s}</text>
        ))}
        <line x1="100" y1="30" x2="120" y2="10" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3" />
      </g>

      {/* Ultrasonic */}
      {hasUltrasonic && (
        <g transform="translate(450, 300)">
          <rect width="110" height="80" rx="8" fill="rgba(249, 115, 22, 0.2)" stroke="#f97316" strokeWidth="2" />
          <text x="55" y="22" textAnchor="middle" fill="#f97316" fontSize="10" fontWeight="600">ULTRASONIC</text>
          <text x="55" y="40" textAnchor="middle" fill="#cbd5e1" fontSize="9">{product.ultrasonic.watts}W @ 28kHz</text>
          <text x="55" y="55" textAnchor="middle" fill="#94a3b8" fontSize="8">Driver + Transducer</text>
          {isXL && <text x="55" y="70" textAnchor="middle" fill="#94a3b8" fontSize="8">(×2 units)</text>}
          <line x1="55" y1="0" x2="55" y2="-120" stroke="#f97316" strokeWidth="2" />
          <line x1="55" y1="80" x2="55" y2="100" stroke="#64748b" strokeWidth="2" />
        </g>
      )}

      {/* Legend */}
      <g transform="translate(20, 420)">
        <text fill="#94a3b8" fontSize="10" fontWeight="600">CONNECTIONS:</text>
        <line x1="100" y1="-5" x2="130" y2="-5" stroke="#f97316" strokeWidth="2" />
        <text x="135" y="-2" fill="#f97316" fontSize="9">{voltage}V Power</text>
        <line x1="200" y1="-5" x2="230" y2="-5" stroke="#22c55e" strokeWidth="2" />
        <text x="235" y="-2" fill="#22c55e" fontSize="9">5V Logic</text>
        <line x1="300" y1="-5" x2="330" y2="-5" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3" />
        <text x="335" y="-2" fill="#60a5fa" fontSize="9">I2C/Data</text>
      </g>
    </svg>
  );
};

export default WiringDiagram;

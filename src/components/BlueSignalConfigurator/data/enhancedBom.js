// Enhanced BOM Data with Supplier URLs, Lead Times, and Critical Flags

export const ENHANCED_BOM = {
  'wqm-1': {
    sections: [
      {
        category: 'Compute',
        items: [
          { name: 'Raspberry Pi Zero 2 W', part: 'SC0510', qty: 1, unit: 30.99, supplier: 'Adafruit', url: 'https://www.adafruit.com/product/5291', leadDays: 3, critical: true },
          { name: 'WQM-1 HAT PCB', part: '6-ch ADC + LoRa + Relay', qty: 1, unit: 85.00, supplier: 'Custom', url: null, leadDays: 14, critical: true },
          { name: 'MicroSD Card 32GB', part: 'SanDisk Industrial', qty: 1, unit: 12.00, supplier: 'Amazon', url: 'https://amazon.com/dp/B07P14QWB1', leadDays: 2, critical: false },
        ],
      },
      {
        category: 'Connectivity',
        items: [
          { name: 'LoRa Module', part: 'Semtech SX1262', qty: 1, unit: 18.00, supplier: 'DigiKey', url: 'https://www.digikey.com', leadDays: 5, critical: true },
          { name: 'LoRa Antenna', part: 'SMA 915MHz ¼-wave', qty: 1, unit: 8.00, supplier: 'Amazon', url: 'https://amazon.com/dp/B07WNQKZ95', leadDays: 3, critical: false },
          { name: 'GPS/GNSS Module', part: 'UART NMEA', qty: 1, unit: 12.00, supplier: 'Amazon', url: 'https://amazon.com/dp/B07P8YMVNT', leadDays: 5, critical: true },
        ],
      },
      {
        category: 'Sensors',
        items: [
          { name: 'ADC Module', part: 'ADS1115 16-bit', qty: 1, unit: 5.00, supplier: 'Adafruit', url: 'https://www.adafruit.com/product/1085', leadDays: 2, critical: true },
          { name: 'pH Sensor + Probe', part: 'PH-4502C + BNC', qty: 1, unit: 28.79, supplier: 'Amazon', url: 'https://amazon.com/dp/B0899NQKPL', leadDays: 3, critical: false },
          { name: 'TDS Sensor', part: 'CQRobot Ocean', qty: 1, unit: 11.99, supplier: 'Amazon', url: 'https://amazon.com/dp/B083DZZWTQ', leadDays: 3, critical: false },
          { name: 'Turbidity Sensor', part: 'DFRobot SEN0189', qty: 1, unit: 11.90, supplier: 'DFRobot', url: 'https://www.dfrobot.com/product-1394.html', leadDays: 5, critical: false },
          { name: 'ORP Sensor + Electrode', part: 'Platinum tip BNC', qty: 1, unit: 35.00, supplier: 'Amazon', url: 'https://amazon.com/dp/B07JH2N7WZ', leadDays: 5, critical: false },
          { name: 'Temperature Probe', part: 'DS18B20 Waterproof', qty: 1, unit: 8.00, supplier: 'Amazon', url: 'https://amazon.com/dp/B087JQ6MCP', leadDays: 3, critical: false },
          { name: 'pH Calibration Kit', part: '4.0 + 7.0 buffers', qty: 1, unit: 10.00, supplier: 'Amazon', url: 'https://amazon.com/dp/B07JH2N7WZ', leadDays: 3, critical: false },
        ],
      },
      {
        category: 'Power & Control',
        items: [
          { name: 'Power Connector', part: 'JST-XH 2-pin', qty: 1, unit: 1.50, supplier: 'DigiKey', url: 'https://www.digikey.com', leadDays: 2, critical: false },
          { name: 'Relay Module', part: '10A single channel', qty: 1, unit: 6.00, supplier: 'Amazon', url: 'https://amazon.com/dp/B07BDJJTLZ', leadDays: 2, critical: false },
          { name: 'I²C Expansion Header', part: '4-pin 3.3V', qty: 1, unit: 1.00, supplier: 'DigiKey', url: 'https://www.digikey.com', leadDays: 2, critical: false },
        ],
      },
      {
        category: 'Hardware',
        items: [
          { name: 'Standoffs & Screws', part: 'M3 nylon/brass kit', qty: 1, unit: 5.00, supplier: 'Amazon', url: 'https://amazon.com/dp/B07D7828LC', leadDays: 2, critical: false },
          { name: 'Wiring & Connectors', part: 'Assorted kit', qty: 1, unit: 10.00, supplier: 'Amazon', url: 'https://amazon.com/dp/B07TX6BX47', leadDays: 3, critical: false },
        ],
      },
    ],
  },
};

// Helper to calculate totals from enhanced BOM
export const calculateBOMTotals = (productId) => {
  const bom = ENHANCED_BOM[productId];
  if (!bom) return { total: 0, criticalCount: 0, maxLeadDays: 0 };

  let total = 0;
  let criticalCount = 0;
  let maxLeadDays = 0;

  bom.sections.forEach(section => {
    section.items.forEach(item => {
      total += item.unit * item.qty;
      if (item.critical) criticalCount++;
      if (item.leadDays > maxLeadDays) maxLeadDays = item.leadDays;
    });
  });

  return { total: Math.round(total * 100) / 100, criticalCount, maxLeadDays };
};

export default ENHANCED_BOM;

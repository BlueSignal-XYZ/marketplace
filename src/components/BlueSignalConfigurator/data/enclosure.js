// Enclosure Component Data - Physical layout and component details for WQM-1

export const ENCLOSURE_COMPONENTS = {
  'wqm-1': [
    {
      id: 'pi-zero',
      name: 'Raspberry Pi Zero 2 W',
      shortName: 'Pi Zero',
      category: 'compute',
      position: { x: 10, y: 15, width: 20, height: 14 },
      details: {
        partNumber: 'SC0510',
        function:
          'Main controller - runs sensor polling, data logging, LoRaWAN upload, relay scheduling',
        voltage: '5V DC',
        current: '350mA typical, 500mA peak',
        connections: [
          'GPIO2/3 → I2C bus (ADS1115)',
          'GPIO4 → 1-Wire (DS18B20)',
          'GPIO10/9/11/8 → SPI0 (SX1262 LoRa)',
          'GPIO14/15 → UART (GPS)',
          'GPIO17 → Relay (10A)',
          'GPIO24 → Status LED',
          'GPIO25 → SX1262 DIO1 (interrupt)',
        ],
        notes: 'Pre-soldered headers required. Runs Raspberry Pi OS Lite with BlueSignal daemon.',
        datasheet:
          'https://datasheets.raspberrypi.com/rpizero2/raspberry-pi-zero-2-w-product-brief.pdf',
      },
      color: '#15803d',
    },
    {
      id: 'wqm1-hat',
      name: 'WQM-1 HAT PCB',
      shortName: 'WQM-1 HAT',
      category: 'compute',
      position: { x: 10, y: 31, width: 20, height: 14 },
      details: {
        partNumber: 'WQM-1-HAT-R1',
        function:
          'Custom HAT with ADC, LoRa transceiver, relay driver, power regulation, and sensor connectors',
        voltage: '9-24V DC input, 5V regulated output',
        current: 'Varies by load',
        connections: [
          '40-pin GPIO stacking header → Pi Zero',
          'JST-XH 2-pin → DC power input',
          'SMA → LoRa antenna',
          'BNC × 2 → pH and ORP probes',
          '4-pin header → I²C expansion',
          'Screw terminal → Relay output (COM/NO/NC)',
        ],
        notes: 'Custom PCB. Includes ADS1115, SX1262 module, voltage regulator, relay driver.',
      },
      color: '#15803d',
    },
    {
      id: 'sx1262',
      name: 'Semtech SX1262 LoRa Module',
      shortName: 'LoRa',
      category: 'comms',
      position: { x: 35, y: 15, width: 12, height: 10 },
      details: {
        partNumber: 'SX1262',
        function: 'LoRaWAN 1.0.3 Class A transceiver for long-range data upload (15 km LOS)',
        voltage: '3.3V',
        current: '118mA TX, 5mA RX',
        connections: [
          'SPI0 → Pi Zero (MOSI/MISO/SCLK/CS)',
          'DIO1 → GPIO25 (interrupt)',
          'RESET → GPIO22',
          'SMA → 915 MHz antenna',
        ],
        notes: 'AES-128 encryption. Cayenne LPP payload format.',
      },
      color: '#1d4ed8',
    },
    {
      id: 'gps-module',
      name: 'GPS/GNSS Module',
      shortName: 'GPS',
      category: 'comms',
      position: { x: 35, y: 27, width: 12, height: 10 },
      details: {
        partNumber: 'GNSS UART',
        function: 'GPS + GLONASS positioning for geo-tagged readings',
        voltage: '3.3V',
        current: '30mA',
        connections: ['TX → Pi GPIO15 (RXD)', 'PPS → available for sync'],
        notes: '2.5m CEP accuracy. NMEA output.',
      },
      color: '#1d4ed8',
    },
    {
      id: 'ads1115',
      name: 'ADS1115 16-bit ADC',
      shortName: 'ADC',
      category: 'sensor',
      position: { x: 50, y: 15, width: 10, height: 8 },
      details: {
        partNumber: 'ADS1115',
        function: '4-channel 16-bit ADC for analog sensor inputs (pH, TDS, Turbidity, ORP)',
        voltage: '3.3V',
        current: '3mA',
        connections: [
          'I2C (0x48) → GPIO2 SDA, GPIO3 SCL',
          'A0 ← pH sensor',
          'A1 ← TDS sensor',
          'A2 ← Turbidity sensor',
          'A3 ← ORP sensor',
        ],
        notes: 'Programmable gain amplifier. 860 SPS max.',
      },
      color: '#0891b2',
    },
    {
      id: 'relay',
      name: '10A Relay Module',
      shortName: 'Relay',
      category: 'control',
      position: { x: 50, y: 25, width: 10, height: 8 },
      details: {
        partNumber: '10A Relay',
        function: 'Switched output for automation (pumps, valves, ultrasonics, alerts)',
        voltage: '5V coil, 250VAC/30VDC contact',
        current: '10A max contact rating',
        connections: ['IN ← GPIO17', 'COM/NO/NC → Screw terminal output'],
        notes: 'Active-LOW. Triggered by threshold rules or cloud commands.',
      },
      color: '#dc2626',
    },
    {
      id: 'status-led',
      name: 'Status LED',
      shortName: 'LED',
      category: 'control',
      position: { x: 50, y: 35, width: 8, height: 6 },
      details: {
        function: 'Visual status indicator (heartbeat, error codes, connectivity)',
        voltage: '3.3V via 330Ω',
        connections: ['GPIO24 → Anode (via 330Ω resistor)'],
      },
      color: '#dc2626',
    },
  ],
};

// Category colors for legend
export const CATEGORY_COLORS = {
  compute: { color: '#15803d', label: 'Compute' },
  comms: { color: '#1d4ed8', label: 'Communications' },
  power: { color: '#374151', label: 'Power' },
  sensor: { color: '#0891b2', label: 'Sensors' },
  control: { color: '#dc2626', label: 'Control' },
  protection: { color: '#fbbf24', label: 'Protection' },
  housing: { color: '#f59e0b', label: 'Housing' },
};

export default ENCLOSURE_COMPONENTS;

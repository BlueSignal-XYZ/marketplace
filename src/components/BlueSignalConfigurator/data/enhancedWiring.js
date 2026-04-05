// Enhanced Wiring Data - Detailed wire runs, test points, and connectors

export const WIRING_DIAGRAMS = {
  'wqm-1': {
    productId: 'wqm-1',
    description: 'WQM-1 - 6-channel water quality monitor HAT with LoRaWAN',

    buses: [
      { id: 'gnd', name: 'Ground Bus', voltage: '0V', color: '#1f2937', rail: true },
      { id: '5v', name: '5V DC Bus', voltage: '5V', color: '#f97316', rail: false },
      { id: '3v3', name: '3.3V DC Bus', voltage: '3.3V', color: '#22c55e', rail: false },
    ],

    runs: [
      // Power Input
      {
        id: 'dc-in',
        from: { component: 'DC Input', terminal: 'JST-XH V+' },
        to: { component: 'Regulator', terminal: 'VIN' },
        wire: { gauge: '20 AWG', color: 'Red', type: 'power' },
        length: '2"',
        notes: '9-24V DC input via JST-XH 2-pin',
      },
      {
        id: 'dc-gnd',
        from: { component: 'DC Input', terminal: 'JST-XH GND' },
        to: { component: 'GND Bus', terminal: 'IN' },
        wire: { gauge: '20 AWG', color: 'Black', type: 'ground' },
        length: '2"',
      },
      // Regulator to Pi
      {
        id: 'reg-pi',
        from: { component: 'Regulator', terminal: 'VOUT' },
        to: { component: 'Pi Zero', terminal: '5V (Pin 2)' },
        wire: { gauge: '22 AWG', color: 'Red', type: 'power' },
        length: '1"',
        notes: 'Onboard 5V regulator, verify 5.0-5.1V',
      },
      // I2C Bus (ADC)
      {
        id: 'pi-adc-sda',
        from: { component: 'Pi Zero', terminal: 'GPIO2 (Pin 3)' },
        to: { component: 'ADS1115', terminal: 'SDA' },
        wire: { gauge: '24 AWG', color: 'Blue', type: 'data' },
        length: '1"',
        notes: 'I2C Data - onboard trace',
      },
      {
        id: 'pi-adc-scl',
        from: { component: 'Pi Zero', terminal: 'GPIO3 (Pin 5)' },
        to: { component: 'ADS1115', terminal: 'SCL' },
        wire: { gauge: '24 AWG', color: 'Yellow', type: 'data' },
        length: '1"',
        notes: 'I2C Clock - onboard trace',
      },
      // SPI Bus (LoRa)
      {
        id: 'pi-lora-spi',
        from: { component: 'Pi Zero', terminal: 'SPI0 (GPIO10/9/11/8)' },
        to: { component: 'SX1262', terminal: 'MOSI/MISO/SCLK/CS' },
        wire: { gauge: '24 AWG', color: 'Green', type: 'data' },
        length: '1"',
        notes: 'SPI0 bus - onboard traces',
      },
      {
        id: 'lora-dio1',
        from: { component: 'SX1262', terminal: 'DIO1' },
        to: { component: 'Pi Zero', terminal: 'GPIO25 (Pin 22)' },
        wire: { gauge: '24 AWG', color: 'Green', type: 'signal' },
        length: '1"',
        notes: 'LoRa interrupt line',
      },
      // Sensor Analog Inputs
      {
        id: 'ph-adc',
        from: { component: 'pH Sensor', terminal: 'Po' },
        to: { component: 'ADS1115', terminal: 'A0' },
        wire: { gauge: '24 AWG', color: 'Pink', type: 'signal' },
        length: '2"',
      },
      {
        id: 'tds-adc',
        from: { component: 'TDS Sensor', terminal: 'AOUT' },
        to: { component: 'ADS1115', terminal: 'A1' },
        wire: { gauge: '24 AWG', color: 'Purple', type: 'signal' },
        length: '2"',
      },
      {
        id: 'turb-adc',
        from: { component: 'Turbidity', terminal: 'AOUT' },
        to: { component: 'ADS1115', terminal: 'A2' },
        wire: { gauge: '24 AWG', color: 'Orange', type: 'signal' },
        length: '2"',
      },
      {
        id: 'orp-adc',
        from: { component: 'ORP Sensor', terminal: 'AOUT' },
        to: { component: 'ADS1115', terminal: 'A3' },
        wire: { gauge: '24 AWG', color: 'Cyan', type: 'signal' },
        length: '2"',
      },
      // 1-Wire Temperature
      {
        id: 'onewire-temp',
        from: { component: 'Pi Zero', terminal: 'GPIO4 (Pin 7)' },
        to: { component: 'DS18B20', terminal: 'Data' },
        wire: { gauge: '24 AWG', color: 'White', type: 'data' },
        length: '12"',
        notes: 'With 4.7kΩ pullup to 3.3V',
      },
      // UART GPS
      {
        id: 'gps-uart',
        from: { component: 'GPS Module', terminal: 'TX' },
        to: { component: 'Pi Zero', terminal: 'GPIO15 RXD (Pin 10)' },
        wire: { gauge: '24 AWG', color: 'Green', type: 'data' },
        length: '2"',
        notes: 'NMEA data stream',
      },
      // Relay
      {
        id: 'gpio17-relay',
        from: { component: 'Pi Zero', terminal: 'GPIO17 (Pin 11)' },
        to: { component: 'Relay', terminal: 'IN' },
        wire: { gauge: '24 AWG', color: 'Green', type: 'signal' },
        length: '1"',
        notes: 'Relay control - Active LOW',
      },
      // Status LED
      {
        id: 'gpio24-led',
        from: { component: 'Pi Zero', terminal: 'GPIO24 (Pin 18)' },
        to: { component: 'LED', terminal: 'Anode (via 330Ω)' },
        wire: { gauge: '24 AWG', color: 'Green', type: 'signal' },
        length: '1"',
      },
    ],

    connectors: [
      { id: 'power-in', type: 'JST-XH 2-pin', pins: 2, location: 'DC power input (9-24V)' },
      { id: 'pi-header', type: '2x20 Pin Header', pins: 40, location: 'Pi GPIO (HAT stacking)' },
      { id: 'lora-sma', type: 'SMA Female', pins: 1, location: 'LoRa antenna' },
      { id: 'ph-bnc', type: 'BNC Female', pins: 1, location: 'pH probe' },
      { id: 'orp-bnc', type: 'BNC Female', pins: 1, location: 'ORP probe' },
      {
        id: 'i2c-exp',
        type: '4-pin Header',
        pins: 4,
        location: 'I²C expansion (3.3V, SDA, SCL, GND)',
      },
      { id: 'relay-out', type: 'Screw Terminal', pins: 3, location: 'Relay output (COM/NO/NC)' },
    ],

    testPoints: [
      { id: 'tp1', location: 'Regulator Output', expected: '5.0V ± 0.1V', probe: 'VOUT to GND' },
      { id: 'tp2', location: 'Pi 3.3V Rail', expected: '3.3V ± 0.1V', probe: 'Pin 1 to Pin 6' },
      { id: 'tp3', location: 'ADC A0 (pH)', expected: '0-3.3V analog', probe: 'A0 to GND' },
      { id: 'tp4', location: 'LoRa SPI CS', expected: '3.3V idle', probe: 'GPIO8 to GND' },
      {
        id: 'tp5',
        location: 'GPS UART',
        expected: 'NMEA text',
        probe: 'GPIO15 with logic analyzer',
      },
    ],
  },
};

// Wire color legend
export const WIRE_LEGEND = [
  { color: '#dc2626', label: 'V+ Power', gauge: '20-22 AWG' },
  { color: '#1f2937', label: 'Ground', gauge: 'Match +' },
  { color: '#3b82f6', label: 'I2C SDA', gauge: '24 AWG' },
  { color: '#eab308', label: 'I2C SCL', gauge: '24 AWG' },
  { color: '#22c55e', label: 'SPI / GPIO Signal', gauge: '24 AWG' },
  { color: '#a855f7', label: 'Analog Signal', gauge: '24 AWG' },
  { color: '#f97316', label: '5V DC', gauge: '22 AWG' },
  { color: '#ffffff', border: true, label: '1-Wire Data', gauge: '24 AWG' },
];

export default WIRING_DIAGRAMS;

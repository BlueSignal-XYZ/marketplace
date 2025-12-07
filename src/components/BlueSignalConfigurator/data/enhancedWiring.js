// Enhanced Wiring Data - Detailed wire runs, test points, and connectors

export const WIRING_DIAGRAMS = {
  's-ac': {
    productId: 's-ac',
    description: 'Shore Monitor AC - 120V mains powered with ultrasonic',

    buses: [
      { id: 'gnd', name: 'Ground Bus', voltage: '0V', color: '#1f2937', rail: true },
      { id: '12v', name: '12V DC Bus', voltage: '12V', color: '#dc2626', rail: true },
      { id: '5v', name: '5V DC Bus', voltage: '5V', color: '#f97316', rail: false },
      { id: 'ac-hot', name: 'AC Hot', voltage: '120V', color: '#000000', rail: false },
      { id: 'ac-neutral', name: 'AC Neutral', voltage: '120V', color: '#ffffff', rail: false },
    ],

    runs: [
      // AC Input
      {
        id: 'ac-in-hot',
        from: { component: 'Power Cord', terminal: 'Hot (Black)' },
        to: { component: 'AC Terminal', terminal: 'L' },
        wire: { gauge: '16 AWG', color: 'Black', type: 'ac' },
        length: '6"',
        notes: 'Strain relief required at cord grip',
      },
      {
        id: 'ac-in-neutral',
        from: { component: 'Power Cord', terminal: 'Neutral (White)' },
        to: { component: 'AC Terminal', terminal: 'N' },
        wire: { gauge: '16 AWG', color: 'White', type: 'ac' },
        length: '6"',
      },
      {
        id: 'ac-in-ground',
        from: { component: 'Power Cord', terminal: 'Ground (Green)' },
        to: { component: 'AC Terminal', terminal: 'G' },
        wire: { gauge: '16 AWG', color: 'Green', type: 'ground' },
        length: '6"',
        notes: 'Also connect to enclosure ground lug',
      },
      // AC to PSU
      {
        id: 'ac-psu-hot',
        from: { component: 'AC Terminal', terminal: 'L' },
        to: { component: 'Fuse', terminal: 'IN' },
        wire: { gauge: '18 AWG', color: 'Black', type: 'ac' },
        length: '3"',
      },
      {
        id: 'fuse-psu',
        from: { component: 'Fuse', terminal: 'OUT' },
        to: { component: 'PSU', terminal: 'L' },
        wire: { gauge: '18 AWG', color: 'Black', type: 'ac' },
        length: '4"',
      },
      {
        id: 'ac-psu-neutral',
        from: { component: 'AC Terminal', terminal: 'N' },
        to: { component: 'PSU', terminal: 'N' },
        wire: { gauge: '18 AWG', color: 'White', type: 'ac' },
        length: '5"',
      },
      {
        id: 'psu-ground',
        from: { component: 'AC Terminal', terminal: 'G' },
        to: { component: 'PSU', terminal: 'FG' },
        wire: { gauge: '18 AWG', color: 'Green/Yellow', type: 'ground' },
        length: '5"',
      },
      // AC to Ultrasonic (via Relay)
      {
        id: 'ac-relay-hot',
        from: { component: 'AC Terminal', terminal: 'L' },
        to: { component: 'Relay CH1', terminal: 'COM' },
        wire: { gauge: '18 AWG', color: 'Black', type: 'ac' },
        length: '8"',
        notes: 'Switched AC for ultrasonic driver',
      },
      {
        id: 'relay-us-hot',
        from: { component: 'Relay CH1', terminal: 'NO' },
        to: { component: 'US Driver', terminal: 'AC IN (L)' },
        wire: { gauge: '18 AWG', color: 'Black', type: 'ac' },
        length: '6"',
      },
      {
        id: 'ac-us-neutral',
        from: { component: 'AC Terminal', terminal: 'N' },
        to: { component: 'US Driver', terminal: 'AC IN (N)' },
        wire: { gauge: '18 AWG', color: 'White', type: 'ac' },
        length: '10"',
        notes: 'Direct neutral - not switched',
      },
      // PSU DC Output
      {
        id: 'psu-12v-bus',
        from: { component: 'PSU', terminal: '+V' },
        to: { component: '12V Bus', terminal: 'IN' },
        wire: { gauge: '14 AWG', color: 'Red', type: 'power' },
        length: '4"',
        notes: 'Main 12V distribution point',
      },
      {
        id: 'psu-gnd-bus',
        from: { component: 'PSU', terminal: '-V' },
        to: { component: 'GND Bus', terminal: 'IN' },
        wire: { gauge: '14 AWG', color: 'Black', type: 'ground' },
        length: '4"',
        notes: 'Star ground point',
      },
      // 12V to Buck Converter
      {
        id: '12v-buck',
        from: { component: '12V Bus', terminal: 'OUT1' },
        to: { component: 'Buck 5V', terminal: 'VIN+' },
        wire: { gauge: '18 AWG', color: 'Red', type: 'power' },
        length: '3"',
      },
      {
        id: 'gnd-buck',
        from: { component: 'GND Bus', terminal: 'OUT1' },
        to: { component: 'Buck 5V', terminal: 'VIN-' },
        wire: { gauge: '18 AWG', color: 'Black', type: 'ground' },
        length: '3"',
      },
      // 5V Distribution
      {
        id: 'buck-pi',
        from: { component: 'Buck 5V', terminal: 'VOUT+' },
        to: { component: 'Pi Zero', terminal: '5V (Pin 2)' },
        wire: { gauge: '22 AWG', color: 'Red', type: 'power' },
        length: '4"',
        notes: 'Critical: verify 5.0-5.1V before connecting',
      },
      {
        id: 'buck-sensors',
        from: { component: 'Buck 5V', terminal: 'VOUT+' },
        to: { component: 'Sensor VCC Bus', terminal: 'IN' },
        wire: { gauge: '22 AWG', color: 'Red', type: 'power' },
        length: '5"',
      },
      // I2C Bus
      {
        id: 'pi-adc-sda',
        from: { component: 'Pi Zero', terminal: 'GPIO2 (Pin 3)' },
        to: { component: 'ADS1115', terminal: 'SDA' },
        wire: { gauge: '24 AWG', color: 'Blue', type: 'data' },
        length: '3"',
        notes: 'I2C Data - keep short, away from power wires',
      },
      {
        id: 'pi-adc-scl',
        from: { component: 'Pi Zero', terminal: 'GPIO3 (Pin 5)' },
        to: { component: 'ADS1115', terminal: 'SCL' },
        wire: { gauge: '24 AWG', color: 'Yellow', type: 'data' },
        length: '3"',
        notes: 'I2C Clock',
      },
      // Sensor Analog
      {
        id: 'tds-adc',
        from: { component: 'TDS Sensor', terminal: 'AOUT' },
        to: { component: 'ADS1115', terminal: 'A0' },
        wire: { gauge: '24 AWG', color: 'Purple', type: 'signal' },
        length: '2"',
      },
      {
        id: 'turb-adc',
        from: { component: 'Turbidity', terminal: 'AOUT' },
        to: { component: 'ADS1115', terminal: 'A1' },
        wire: { gauge: '24 AWG', color: 'Orange', type: 'signal' },
        length: '2"',
      },
      {
        id: 'ph-adc',
        from: { component: 'pH Sensor', terminal: 'Po' },
        to: { component: 'ADS1115', terminal: 'A2' },
        wire: { gauge: '24 AWG', color: 'Pink', type: 'signal' },
        length: '2"',
      },
      {
        id: 'vmon-adc',
        from: { component: 'V-Divider', terminal: 'OUT' },
        to: { component: 'ADS1115', terminal: 'A3' },
        wire: { gauge: '24 AWG', color: 'Gray', type: 'signal' },
        length: '2"',
      },
      // GPIO to Relays
      {
        id: 'gpio17-relay1',
        from: { component: 'Pi Zero', terminal: 'GPIO17 (Pin 11)' },
        to: { component: 'Relay Module', terminal: 'IN1' },
        wire: { gauge: '24 AWG', color: 'Green', type: 'signal' },
        length: '4"',
        notes: 'Ultrasonic control - Active LOW',
      },
      {
        id: 'gpio23-relay4',
        from: { component: 'Pi Zero', terminal: 'GPIO23 (Pin 16)' },
        to: { component: 'Relay Module', terminal: 'IN4' },
        wire: { gauge: '24 AWG', color: 'Green', type: 'signal' },
        length: '4"',
        notes: 'Fan control - Active LOW',
      },
      {
        id: 'gpio24-led',
        from: { component: 'Pi Zero', terminal: 'GPIO24 (Pin 18)' },
        to: { component: 'LED', terminal: 'Anode (via 330Ω)' },
        wire: { gauge: '24 AWG', color: 'Green', type: 'signal' },
        length: '3"',
      },
      // 12V Loads
      {
        id: 'relay-fan',
        from: { component: 'Relay CH4', terminal: 'NO' },
        to: { component: 'Fan', terminal: 'V+' },
        wire: { gauge: '22 AWG', color: 'Red', type: 'power' },
        length: '6"',
      },
      {
        id: '12v-relay-com4',
        from: { component: '12V Bus', terminal: 'OUT2' },
        to: { component: 'Relay CH4', terminal: 'COM' },
        wire: { gauge: '22 AWG', color: 'Red', type: 'power' },
        length: '4"',
      },
    ],

    connectors: [
      { id: 'sensor-header', type: 'JST XH 2.54mm', pins: 8, location: 'Sensor board' },
      { id: 'power-terminals', type: 'Screw Terminal', pins: 6, location: 'Power distribution' },
      { id: 'pi-header', type: '2x20 Pin Header', pins: 40, location: 'Pi GPIO' },
      { id: 'relay-header', type: 'Dupont 2.54mm', pins: 6, location: 'Relay module' },
      { id: 'ac-terminal', type: '3-Position 15A', pins: 3, location: 'AC input' },
    ],

    testPoints: [
      { id: 'tp1', location: 'PSU Output', expected: '12.0V ± 0.3V', probe: 'Red to +V, Black to -V' },
      { id: 'tp2', location: 'Buck Output', expected: '5.0V ± 0.1V', probe: 'Red to VOUT+, Black to GND' },
      { id: 'tp3', location: 'Pi 5V Rail', expected: '5.0V ± 0.2V', probe: 'Pin 2 to Pin 6' },
      { id: 'tp4', location: 'V-Divider Out', expected: '2.9-3.0V', probe: 'Divider mid to GND' },
      { id: 'tp5', location: 'Relay Coil', expected: '12V when active', probe: 'Coil terminals' },
    ],
  },

  's-sol': {
    productId: 's-sol',
    description: 'Shore Monitor Solar - 24V solar system with battery and inverter',

    buses: [
      { id: 'gnd', name: 'Ground Bus', voltage: '0V', color: '#1f2937', rail: true },
      { id: '24v', name: '24V DC Bus', voltage: '24V', color: '#dc2626', rail: true },
      { id: '12v', name: '12V DC Bus', voltage: '12V', color: '#f97316', rail: true },
      { id: '5v', name: '5V DC Bus', voltage: '5V', color: '#22c55e', rail: false },
      { id: 'ac-inverter', name: 'Inverter AC', voltage: '120V', color: '#7c3aed', rail: false },
    ],

    runs: [
      // Solar Input
      {
        id: 'solar-mppt-pos',
        from: { component: 'Solar Panel', terminal: 'MC4+' },
        to: { component: 'MPPT', terminal: 'PV+' },
        wire: { gauge: '10 AWG', color: 'Red', type: 'power' },
        length: '15ft',
        notes: 'UV-rated outdoor cable, MC4 connectors',
      },
      {
        id: 'solar-mppt-neg',
        from: { component: 'Solar Panel', terminal: 'MC4-' },
        to: { component: 'MPPT', terminal: 'PV-' },
        wire: { gauge: '10 AWG', color: 'Black', type: 'power' },
        length: '15ft',
      },
      // MPPT to Battery
      {
        id: 'mppt-bat-pos',
        from: { component: 'MPPT', terminal: 'BAT+' },
        to: { component: 'Battery', terminal: 'B+' },
        wire: { gauge: '10 AWG', color: 'Red', type: 'power' },
        length: '12"',
        notes: 'Via 60A ANL fuse at battery terminal',
      },
      {
        id: 'mppt-bat-neg',
        from: { component: 'MPPT', terminal: 'BAT-' },
        to: { component: 'Battery', terminal: 'B-' },
        wire: { gauge: '10 AWG', color: 'Black', type: 'ground' },
        length: '12"',
      },
      // Battery to LVD
      {
        id: 'bat-lvd',
        from: { component: 'Battery', terminal: 'B+' },
        to: { component: 'LVD', terminal: 'IN' },
        wire: { gauge: '10 AWG', color: 'Red', type: 'power' },
        length: '8"',
        notes: 'Via 60A ANL fuse',
      },
      // LVD to Loads
      {
        id: 'lvd-24v-bus',
        from: { component: 'LVD', terminal: 'OUT' },
        to: { component: '24V Bus', terminal: 'IN' },
        wire: { gauge: '12 AWG', color: 'Red', type: 'power' },
        length: '6"',
      },
      // 24V to Inverter
      {
        id: '24v-inverter-pos',
        from: { component: '24V Bus', terminal: 'OUT1' },
        to: { component: 'Inverter', terminal: 'DC+' },
        wire: { gauge: '10 AWG', color: 'Red', type: 'power' },
        length: '6"',
        notes: 'Via 30A ANL fuse',
      },
      {
        id: '24v-inverter-neg',
        from: { component: 'GND Bus', terminal: 'OUT1' },
        to: { component: 'Inverter', terminal: 'DC-' },
        wire: { gauge: '10 AWG', color: 'Black', type: 'ground' },
        length: '6"',
      },
      // Inverter to Relay (switched AC)
      {
        id: 'inverter-relay',
        from: { component: 'Inverter', terminal: 'AC OUT' },
        to: { component: 'Relay CH1', terminal: 'COM' },
        wire: { gauge: '16 AWG', color: 'Black/White', type: 'ac' },
        length: '8"',
        notes: 'Switched AC for ultrasonic',
      },
      {
        id: 'relay-us',
        from: { component: 'Relay CH1', terminal: 'NO' },
        to: { component: 'US Driver', terminal: 'AC IN' },
        wire: { gauge: '16 AWG', color: 'Black/White', type: 'ac' },
        length: '6"',
      },
      // Buck Converters
      {
        id: '24v-buck12',
        from: { component: '24V Bus', terminal: 'OUT2' },
        to: { component: 'Buck 12V', terminal: 'VIN+' },
        wire: { gauge: '14 AWG', color: 'Red', type: 'power' },
        length: '4"',
      },
      {
        id: 'buck12-12v-bus',
        from: { component: 'Buck 12V', terminal: 'VOUT+' },
        to: { component: '12V Bus', terminal: 'IN' },
        wire: { gauge: '14 AWG', color: 'Orange', type: 'power' },
        length: '3"',
      },
      {
        id: '12v-buck5',
        from: { component: '12V Bus', terminal: 'OUT1' },
        to: { component: 'Buck 5V', terminal: 'VIN+' },
        wire: { gauge: '18 AWG', color: 'Orange', type: 'power' },
        length: '3"',
      },
      {
        id: 'buck5-5v-bus',
        from: { component: 'Buck 5V', terminal: 'VOUT+' },
        to: { component: '5V Bus', terminal: 'IN' },
        wire: { gauge: '18 AWG', color: 'Red', type: 'power' },
        length: '3"',
      },
      // Pi and Sensors (same as s-ac)
      {
        id: '5v-pi',
        from: { component: '5V Bus', terminal: 'OUT1' },
        to: { component: 'Pi Zero', terminal: '5V (Pin 2)' },
        wire: { gauge: '22 AWG', color: 'Red', type: 'power' },
        length: '4"',
      },
      {
        id: 'pi-adc-i2c',
        from: { component: 'Pi Zero', terminal: 'GPIO2/3' },
        to: { component: 'ADS1115', terminal: 'SDA/SCL' },
        wire: { gauge: '24 AWG', color: 'Blue/Yellow', type: 'data' },
        length: '3"',
      },
      // 12V Loads
      {
        id: '12v-relay-coils',
        from: { component: '12V Bus', terminal: 'OUT2' },
        to: { component: 'Relay Module', terminal: 'VCC' },
        wire: { gauge: '18 AWG', color: 'Orange', type: 'power' },
        length: '4"',
      },
      {
        id: '12v-fan',
        from: { component: 'Relay CH4', terminal: 'NO' },
        to: { component: 'Fan', terminal: 'V+' },
        wire: { gauge: '20 AWG', color: 'Orange', type: 'power' },
        length: '6"',
      },
    ],

    connectors: [
      { id: 'mc4-solar', type: 'MC4', pins: 2, location: 'Solar panel' },
      { id: 'anderson-bat', type: 'Anderson SB50', pins: 2, location: 'Battery' },
      { id: 'screw-terminals', type: 'Screw Terminal Block', pins: 12, location: 'Distribution' },
    ],

    testPoints: [
      { id: 'tp1', location: 'Solar Open Circuit', expected: '38-42V (no load)', probe: 'MC4 terminals' },
      { id: 'tp2', location: 'Battery Voltage', expected: '25.6V (charged)', probe: 'Battery terminals' },
      { id: 'tp3', location: 'LVD Output', expected: '24V (load connected)', probe: 'LVD OUT to GND' },
      { id: 'tp4', location: '12V Bus', expected: '12.0V ± 0.3V', probe: '12V bus to GND' },
      { id: 'tp5', location: '5V Bus', expected: '5.0V ± 0.1V', probe: '5V bus to GND' },
      { id: 'tp6', location: 'Inverter AC', expected: '120V AC', probe: 'AC output (meter set to AC)' },
    ],
  },

  's-mon': {
    productId: 's-mon',
    description: 'Shore Monitor Lite - 12V solar monitoring only',

    buses: [
      { id: 'gnd', name: 'Ground Bus', voltage: '0V', color: '#1f2937', rail: true },
      { id: '12v', name: '12V DC Bus', voltage: '12V', color: '#dc2626', rail: true },
      { id: '5v', name: '5V DC Bus', voltage: '5V', color: '#22c55e', rail: false },
    ],

    runs: [
      // Solar to MPPT
      {
        id: 'solar-mppt',
        from: { component: 'Solar Panel', terminal: 'Output' },
        to: { component: 'MPPT', terminal: 'PV Input' },
        wire: { gauge: '12 AWG', color: 'Red/Black', type: 'power' },
        length: '10ft',
      },
      // MPPT to Battery
      {
        id: 'mppt-battery',
        from: { component: 'MPPT', terminal: 'BAT' },
        to: { component: 'Battery', terminal: 'B+/B-' },
        wire: { gauge: '12 AWG', color: 'Red/Black', type: 'power' },
        length: '8"',
        notes: 'Via 15A fuse',
      },
      // Battery to LVD
      {
        id: 'battery-lvd',
        from: { component: 'Battery', terminal: 'B+' },
        to: { component: 'LVD', terminal: 'IN' },
        wire: { gauge: '12 AWG', color: 'Red', type: 'power' },
        length: '6"',
      },
      // LVD to 12V Bus
      {
        id: 'lvd-12v',
        from: { component: 'LVD', terminal: 'OUT' },
        to: { component: '12V Bus', terminal: 'IN' },
        wire: { gauge: '14 AWG', color: 'Red', type: 'power' },
        length: '4"',
      },
      // 12V to Buck
      {
        id: '12v-buck',
        from: { component: '12V Bus', terminal: 'OUT1' },
        to: { component: 'Buck 5V', terminal: 'VIN' },
        wire: { gauge: '18 AWG', color: 'Red', type: 'power' },
        length: '3"',
      },
      // Buck to 5V Bus
      {
        id: 'buck-5v',
        from: { component: 'Buck 5V', terminal: 'VOUT' },
        to: { component: '5V Bus', terminal: 'IN' },
        wire: { gauge: '20 AWG', color: 'Red', type: 'power' },
        length: '3"',
      },
      // Pi and Sensors
      {
        id: '5v-pi',
        from: { component: '5V Bus', terminal: 'OUT1' },
        to: { component: 'Pi Zero', terminal: '5V' },
        wire: { gauge: '22 AWG', color: 'Red', type: 'power' },
        length: '4"',
      },
      {
        id: 'i2c-bus',
        from: { component: 'Pi Zero', terminal: 'GPIO2/3' },
        to: { component: 'ADS1115', terminal: 'SDA/SCL' },
        wire: { gauge: '24 AWG', color: 'Blue/Yellow', type: 'data' },
        length: '3"',
      },
      {
        id: 'sensors-adc',
        from: { component: 'Sensors', terminal: 'Analog Out' },
        to: { component: 'ADS1115', terminal: 'A0-A2' },
        wire: { gauge: '24 AWG', color: 'Various', type: 'signal' },
        length: '2"',
      },
    ],

    testPoints: [
      { id: 'tp1', location: 'Solar Voc', expected: '20-22V', probe: 'Panel terminals (disconnected)' },
      { id: 'tp2', location: 'Battery', expected: '12.8V (charged)', probe: 'Battery terminals' },
      { id: 'tp3', location: 'LVD Output', expected: '12V', probe: 'LVD OUT to GND' },
      { id: 'tp4', location: '5V Rail', expected: '5.0V ± 0.1V', probe: '5V bus to GND' },
    ],
  },

  'smart-buoy': {
    productId: 'smart-buoy',
    description: 'Smart Buoy - Floating platform with 24V solar, 5 sensors',

    buses: [
      { id: 'gnd', name: 'Ground Bus', voltage: '0V', color: '#1f2937', rail: true },
      { id: '24v', name: '24V DC Bus', voltage: '24V', color: '#dc2626', rail: true },
      { id: '5v', name: '5V DC Bus', voltage: '5V', color: '#22c55e', rail: false },
      { id: 'ac', name: 'Inverter AC', voltage: '120V', color: '#7c3aed', rail: false },
    ],

    runs: [
      // Solar to MPPT
      {
        id: 'solar-mppt',
        from: { component: '50W Solar', terminal: 'Output' },
        to: { component: 'MPPT', terminal: 'PV' },
        wire: { gauge: '14 AWG', color: 'Red/Black', type: 'power' },
        length: '3ft',
        notes: 'Marine-grade cable',
      },
      // Battery Circuit
      {
        id: 'mppt-battery',
        from: { component: 'MPPT', terminal: 'BAT' },
        to: { component: 'Battery', terminal: 'B+/B-' },
        wire: { gauge: '12 AWG', color: 'Red/Black', type: 'power' },
        length: '10"',
      },
      {
        id: 'battery-lvd',
        from: { component: 'Battery', terminal: 'B+' },
        to: { component: 'LVD', terminal: 'IN' },
        wire: { gauge: '10 AWG', color: 'Red', type: 'power' },
        length: '6"',
      },
      // Power Distribution
      {
        id: 'lvd-24v',
        from: { component: 'LVD', terminal: 'OUT' },
        to: { component: '24V Bus', terminal: 'IN' },
        wire: { gauge: '12 AWG', color: 'Red', type: 'power' },
        length: '4"',
      },
      {
        id: '24v-inverter',
        from: { component: '24V Bus', terminal: 'OUT1' },
        to: { component: 'Inverter', terminal: 'DC' },
        wire: { gauge: '12 AWG', color: 'Red', type: 'power' },
        length: '6"',
      },
      {
        id: '24v-buck',
        from: { component: '24V Bus', terminal: 'OUT2' },
        to: { component: 'Buck 5V', terminal: 'VIN' },
        wire: { gauge: '16 AWG', color: 'Red', type: 'power' },
        length: '4"',
      },
      // 5V Distribution
      {
        id: 'buck-5v',
        from: { component: 'Buck 5V', terminal: 'VOUT' },
        to: { component: '5V Bus', terminal: 'IN' },
        wire: { gauge: '18 AWG', color: 'Red', type: 'power' },
        length: '3"',
      },
      {
        id: '5v-pi',
        from: { component: '5V Bus', terminal: 'OUT' },
        to: { component: 'Pi Zero', terminal: '5V' },
        wire: { gauge: '22 AWG', color: 'Red', type: 'power' },
        length: '4"',
      },
      // I2C Bus (multiple devices)
      {
        id: 'i2c-adc',
        from: { component: 'Pi Zero', terminal: 'I2C' },
        to: { component: 'ADS1115', terminal: 'SDA/SCL' },
        wire: { gauge: '24 AWG', color: 'Blue/Yellow', type: 'data' },
        length: '3"',
      },
      {
        id: 'i2c-ezo-do',
        from: { component: 'I2C Bus', terminal: 'EXT' },
        to: { component: 'EZO-DO', terminal: 'I2C' },
        wire: { gauge: '24 AWG', color: 'Blue/Yellow', type: 'data' },
        length: '4"',
        notes: 'Address 0x61',
      },
      // 1-Wire Temperature
      {
        id: 'onewire-temp',
        from: { component: 'Pi Zero', terminal: 'GPIO4' },
        to: { component: 'DS18B20', terminal: 'Data' },
        wire: { gauge: '24 AWG', color: 'White', type: 'data' },
        length: '12"',
        notes: 'With 4.7kΩ pullup',
      },
      // Ultrasonic AC
      {
        id: 'inverter-us',
        from: { component: 'Inverter', terminal: 'AC' },
        to: { component: 'Relay CH1', terminal: 'COM/NO' },
        wire: { gauge: '16 AWG', color: 'Black/White', type: 'ac' },
        length: '8"',
      },
      {
        id: 'relay-us-driver',
        from: { component: 'Relay CH1', terminal: 'NO' },
        to: { component: 'US Driver', terminal: 'AC IN' },
        wire: { gauge: '16 AWG', color: 'Black/White', type: 'ac' },
        length: '6"',
      },
      // Transducer (shielded)
      {
        id: 'us-transducer',
        from: { component: 'US Driver', terminal: 'OUT' },
        to: { component: 'Transducer', terminal: 'Leads' },
        wire: { gauge: '16 AWG', color: 'Shielded', type: 'signal' },
        length: '24"',
        notes: 'Shielded twisted pair through hull gland',
      },
    ],

    testPoints: [
      { id: 'tp1', location: 'Solar', expected: '~30V Voc', probe: 'Panel terminals' },
      { id: 'tp2', location: 'Battery', expected: '25.6V', probe: 'Battery terminals' },
      { id: 'tp3', location: 'LVD Output', expected: '24V', probe: 'LVD OUT' },
      { id: 'tp4', location: '5V Bus', expected: '5.0V', probe: '5V bus to GND' },
      { id: 'tp5', location: 'I2C (DO)', expected: '3.3V high', probe: 'SDA/SCL with scope' },
    ],
  },

  'smart-buoy-xl': {
    productId: 'smart-buoy-xl',
    description: 'Smart Buoy XL - Research platform with CM4, 8 sensors, dual ultrasonic',

    buses: [
      { id: 'gnd', name: 'Ground Bus', voltage: '0V', color: '#1f2937', rail: true },
      { id: '24v', name: '24V DC Bus', voltage: '24V', color: '#dc2626', rail: true },
      { id: '12v', name: '12V DC Bus', voltage: '12V', color: '#f97316', rail: true },
      { id: '5v', name: '5V DC Bus', voltage: '5V', color: '#22c55e', rail: false },
      { id: 'ac', name: 'Inverter AC', voltage: '120V', color: '#7c3aed', rail: false },
    ],

    runs: [
      // Solar Array
      {
        id: 'solar-array',
        from: { component: '3×100W Solar', terminal: 'Parallel Output' },
        to: { component: 'MPPT', terminal: 'PV' },
        wire: { gauge: '10 AWG', color: 'Red/Black', type: 'power' },
        length: '6ft',
        notes: 'Marine-grade, combiner box to MPPT',
      },
      // High-Capacity Battery
      {
        id: 'mppt-battery',
        from: { component: 'MPPT', terminal: 'BAT' },
        to: { component: '100Ah Battery', terminal: 'B+/B-' },
        wire: { gauge: '8 AWG', color: 'Red/Black', type: 'power' },
        length: '12"',
        notes: 'Via 100A ANL fuse',
      },
      {
        id: 'battery-lvd',
        from: { component: 'Battery', terminal: 'B+' },
        to: { component: 'LVD 100A', terminal: 'IN' },
        wire: { gauge: '8 AWG', color: 'Red', type: 'power' },
        length: '8"',
      },
      // Main Distribution
      {
        id: 'lvd-24v',
        from: { component: 'LVD', terminal: 'OUT' },
        to: { component: '24V Bus', terminal: 'IN' },
        wire: { gauge: '10 AWG', color: 'Red', type: 'power' },
        length: '6"',
      },
      // 500W Inverter
      {
        id: '24v-inverter',
        from: { component: '24V Bus', terminal: 'OUT1' },
        to: { component: '500W Inverter', terminal: 'DC' },
        wire: { gauge: '8 AWG', color: 'Red', type: 'power' },
        length: '8"',
        notes: 'Via 30A fuse, handles 200W ultrasonic load',
      },
      // Step-Down Converters
      {
        id: '24v-buck12',
        from: { component: '24V Bus', terminal: 'OUT2' },
        to: { component: 'Buck 12V', terminal: 'VIN' },
        wire: { gauge: '12 AWG', color: 'Red', type: 'power' },
        length: '4"',
      },
      {
        id: 'buck12-12v',
        from: { component: 'Buck 12V', terminal: 'VOUT' },
        to: { component: '12V Bus', terminal: 'IN' },
        wire: { gauge: '12 AWG', color: 'Orange', type: 'power' },
        length: '3"',
      },
      {
        id: '12v-buck5',
        from: { component: '12V Bus', terminal: 'OUT1' },
        to: { component: 'Buck 5V', terminal: 'VIN' },
        wire: { gauge: '16 AWG', color: 'Orange', type: 'power' },
        length: '3"',
      },
      // CM4 Power
      {
        id: 'buck5-cm4',
        from: { component: 'Buck 5V', terminal: 'VOUT' },
        to: { component: 'CM4 IO Board', terminal: '5V' },
        wire: { gauge: '18 AWG', color: 'Red', type: 'power' },
        length: '4"',
        notes: 'Stable 5V critical for CM4',
      },
      // I2C Bus (Atlas sensors)
      {
        id: 'i2c-atlas-ph',
        from: { component: 'CM4', terminal: 'I2C' },
        to: { component: 'EZO-pH', terminal: 'I2C' },
        wire: { gauge: '24 AWG', color: 'Blue/Yellow', type: 'data' },
        length: '4"',
        notes: 'Address 0x63',
      },
      {
        id: 'i2c-atlas-do',
        from: { component: 'I2C Bus', terminal: 'EXT' },
        to: { component: 'EZO-DO', terminal: 'I2C' },
        wire: { gauge: '24 AWG', color: 'Blue/Yellow', type: 'data' },
        length: '4"',
        notes: 'Address 0x61',
      },
      {
        id: 'i2c-atlas-ec',
        from: { component: 'I2C Bus', terminal: 'EXT' },
        to: { component: 'EZO-EC', terminal: 'I2C' },
        wire: { gauge: '24 AWG', color: 'Blue/Yellow', type: 'data' },
        length: '4"',
        notes: 'Address 0x64',
      },
      {
        id: 'i2c-atlas-orp',
        from: { component: 'I2C Bus', terminal: 'EXT' },
        to: { component: 'EZO-ORP', terminal: 'I2C' },
        wire: { gauge: '24 AWG', color: 'Blue/Yellow', type: 'data' },
        length: '4"',
        notes: 'Address 0x62',
      },
      // RS-232 for Fluorometers
      {
        id: 'rs232-chl',
        from: { component: 'CM4 UART', terminal: 'TX/RX' },
        to: { component: 'RS-232 Adapter', terminal: 'TTL' },
        wire: { gauge: '24 AWG', color: 'Green/White', type: 'data' },
        length: '3"',
      },
      {
        id: 'rs232-fluoro',
        from: { component: 'RS-232 Adapter', terminal: 'DB9' },
        to: { component: 'Chlorophyll Sensor', terminal: 'Serial' },
        wire: { gauge: '22 AWG', color: 'Various', type: 'data' },
        length: '8"',
      },
      // Dual Ultrasonic
      {
        id: 'inverter-relay1',
        from: { component: 'Inverter', terminal: 'AC' },
        to: { component: 'Relay CH1', terminal: 'COM' },
        wire: { gauge: '14 AWG', color: 'Black', type: 'ac' },
        length: '6"',
      },
      {
        id: 'relay1-us1',
        from: { component: 'Relay CH1', terminal: 'NO' },
        to: { component: 'US Driver #1', terminal: 'AC' },
        wire: { gauge: '14 AWG', color: 'Black/White', type: 'ac' },
        length: '6"',
      },
      {
        id: 'relay2-us2',
        from: { component: 'Relay CH2', terminal: 'NO' },
        to: { component: 'US Driver #2', terminal: 'AC' },
        wire: { gauge: '14 AWG', color: 'Black/White', type: 'ac' },
        length: '6"',
      },
      // Navigation Light
      {
        id: 'relay5-navlight',
        from: { component: 'Relay CH5', terminal: 'NO' },
        to: { component: 'Nav Light', terminal: 'V+' },
        wire: { gauge: '18 AWG', color: 'Red', type: 'power' },
        length: '24"',
        notes: 'Through mast to top',
      },
    ],

    testPoints: [
      { id: 'tp1', location: 'Solar Array', expected: '38-42V Voc', probe: 'Combiner output' },
      { id: 'tp2', location: 'Battery Bank', expected: '25.6V', probe: 'Battery terminals' },
      { id: 'tp3', location: 'LVD Output', expected: '24V @ load', probe: 'LVD OUT' },
      { id: 'tp4', location: '12V Bus', expected: '12.0V', probe: '12V bus to GND' },
      { id: 'tp5', location: '5V Bus', expected: '5.0V', probe: '5V bus to GND' },
      { id: 'tp6', location: 'Inverter AC', expected: '120V AC', probe: 'Inverter output' },
      { id: 'tp7', location: 'I2C Pull-ups', expected: '3.3V', probe: 'SDA/SCL idle' },
      { id: 'tp8', location: 'Nav Light', expected: '12V (night)', probe: 'Light terminals' },
    ],
  },
};

// Wire color legend
export const WIRE_LEGEND = [
  { color: '#000000', label: 'AC Hot', gauge: '14-18 AWG' },
  { color: '#ffffff', border: true, label: 'AC Neutral', gauge: '14-18 AWG' },
  { color: '#22c55e', label: 'AC/DC Ground', gauge: '14-18 AWG' },
  { color: '#dc2626', label: '24V/12V DC+', gauge: '10-18 AWG' },
  { color: '#f97316', label: '12V DC', gauge: '14-18 AWG' },
  { color: '#ef4444', label: '5V DC', gauge: '20-22 AWG' },
  { color: '#1f2937', label: 'DC Ground', gauge: 'Match +' },
  { color: '#3b82f6', label: 'I2C SDA', gauge: '24 AWG' },
  { color: '#eab308', label: 'I2C SCL', gauge: '24 AWG' },
  { color: '#22c55e', label: 'GPIO Signal', gauge: '24 AWG' },
  { color: '#a855f7', label: 'Analog Signal', gauge: '24 AWG' },
  { color: '#7c3aed', label: 'Shielded Pair', gauge: '16 AWG' },
];

export default WIRING_DIAGRAMS;

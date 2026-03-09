// Full Specifications Data per Product
// Environmental ratings, certifications, detailed electrical specs

export const FULL_SPECS = {
  'wqm-1': {
    // Environmental
    operatingTemp: '-20°C to +55°C (-4°F to +131°F)',
    storageTemp: '-40°C to +70°C (-40°F to +158°F)',
    humidity: '0-95% RH non-condensing',
    ipRating: 'IP65 (optional enclosure)',
    ipDescription: 'Dust tight, low-pressure water jets',

    // Electrical
    inputVoltage: '9-24V DC (JST-XH 2-pin)',
    powerConsumption: '2.3W avg',
    internalVoltage: '5V DC (onboard regulator)',

    // Sensing
    adcResolution: '16-bit (ADS1115)',
    adcChannels: '4 analog + 1-Wire + UART',
    sensorChannels: '6 total (pH, TDS, Turbidity, ORP, Temperature, GPS)',
    phRange: '0-14 (±0.02 accuracy)',
    tdsRange: '0-1000 ppm (±2% FS)',
    turbidityRange: '0-3000 NTU (IR 850 nm nephelometric)',
    orpRange: '±2000 mV (±5 mV, platinum tip)',
    tempRange: '-5 to 85°C (±0.5°C, DS18B20)',
    gpsAccuracy: '2.5m CEP (GPS + GLONASS)',

    // Connectivity
    loraTransceiver: 'Semtech SX1262',
    loraFrequency: '915 MHz (US) / 868 MHz (EU)',
    loraProtocol: 'LoRaWAN 1.0.3 Class A',
    loraRange: '15 km line-of-sight',
    loraPayload: 'Cayenne LPP encoded',
    loraEncryption: 'AES-128',
    antennaType: 'SMA 50Ω / ¼-wave whip',

    // Compute
    processor: 'BCM2710A1 Quad Cortex-A53 (Pi Zero 2W)',
    ram: '512 MB LPDDR2',
    storage: 'microSD + SQLite WAL buffer',
    os: 'Raspberry Pi OS Lite',

    // Physical
    dimensions: '65 × 56.5 mm (HAT form factor)',
    weight: '< 1 lb (HAT + Pi)',
    formFactor: 'Raspberry Pi HAT (40-pin GPIO)',
    relayOutput: '10A @ 250 VAC / 30 VDC',
    expansionPort: 'I²C bus (3.3V, 4-pin header)',

    // Maintenance
    sensorLifespan: 'pH: 12-18 mo, ORP: 18-24 mo, TDS/Turb: 24+ mo, Temp: 5+ yr',
    warrantyPeriod: '1 year parts',
    calibrationInterval: '30 days (pH, ORP) / 90 days (TDS, Turb)',

    // Certifications
    certifications: ['FCC Part 15B (pending)', 'CE Mark (pending)'],
  },
};

export default FULL_SPECS;

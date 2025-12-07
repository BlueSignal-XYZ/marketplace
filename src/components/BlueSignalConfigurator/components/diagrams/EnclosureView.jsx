import React, { useState } from 'react';

const EnclosureLayout = ({ product }) => {
  const [hoveredComponent, setHoveredComponent] = useState(null);

  // Product-specific component configurations
  const getComponentsForProduct = (productId) => {
    const baseComponents = {
      // Upper Zone - Control Electronics (larger zone, ~65% of space)
      piZero: {
        id: 'piZero',
        name: 'Raspberry Pi Zero 2 WH',
        description: 'Main controller with WiFi/BT. Runs sensor polling, data logging, and uplink coordination.',
        specs: '1GHz Quad-core, 512MB RAM, WiFi 802.11n',
        color: '#22c55e',
        zone: 'upper',
        position: { top: '10%', left: '15%', width: '90px', height: '50px' }
      },
      lteHat: {
        id: 'lteHat',
        name: 'Waveshare LTE Cat-1/GNSS HAT',
        description: 'Cellular modem for data uplink. GNSS for geolocation tagging of sensor readings.',
        specs: 'A7670E, LTE Cat-1/2G fallback, GPS/GLONASS',
        color: '#3b82f6',
        zone: 'upper',
        position: { top: '10%', left: '58%', width: '95px', height: '55px' }
      },
      ads1115: {
        id: 'ads1115',
        name: 'ADS1115 ADC (×3)',
        description: '16-bit analog-to-digital converters for water quality sensors. I2C bus, addressable.',
        specs: '16-bit, 4-ch each, 860 SPS max',
        color: '#6366f1',
        zone: 'upper',
        position: { top: '52%', left: '15%', width: '70px', height: '35px' }
      },
      rs485Hat: {
        id: 'rs485Hat',
        name: 'RS485/CAN HAT',
        description: 'Industrial communication bus for Modbus sensors and future expansion.',
        specs: 'RS485 + CAN bus, isolated',
        color: '#8b5cf6',
        zone: 'upper',
        position: { top: '52%', left: '50%', width: '80px', height: '35px' }
      }
    };

    // Product-specific power zone components
    const powerConfigs = {
      's-ac': {
        acPsu: {
          id: 'acPsu',
          name: 'AC-DC Power Supply',
          description: 'Grid power input. Dual output for system power and ultrasonic drive.',
          specs: '120VAC → 24V 4A + 5V 1A, 120W max',
          color: '#eab308',
          zone: 'lower',
          position: { top: '15%', left: '8%', width: '100px', height: '55px' }
        },
        ultrasonicDriver: {
          id: 'ultrasonicDriver',
          name: 'Ultrasonic Driver Board',
          description: '100W driver for 28kHz transducer. Generates high-frequency signal for algae disruption.',
          specs: '110VAC input, 100W, 28kHz output',
          color: '#f97316',
          zone: 'lower',
          position: { top: '15%', left: '55%', width: '90px', height: '50px' }
        },
        relay: {
          id: 'relay',
          name: '24V Relay Module',
          description: 'Controls ultrasonic emitter power. GPIO-triggered via optocoupler isolation.',
          specs: '24VDC coil, 10A contacts, optocoupler isolated',
          color: '#ef4444',
          zone: 'lower',
          position: { top: '60%', left: '8%', width: '55px', height: '32px' }
        },
        boostConverter: {
          id: 'boostConverter',
          name: 'DC-AC Boost Converter',
          description: 'Steps 24VDC up to 110VAC for ultrasonic driver when running off-grid.',
          specs: '24V in → 110V out, 100W',
          color: '#a855f7',
          zone: 'lower',
          position: { top: '60%', left: '35%', width: '65px', height: '32px' }
        },
        solarMppt: {
          id: 'solarMppt',
          name: 'Solar MPPT Module',
          description: 'Solar charge controller with 18650 battery holder. Powers Pi and sensors off-grid.',
          specs: '6-24V solar in, 5V 2A out, MPPT',
          color: '#14b8a6',
          zone: 'lower',
          position: { top: '60%', left: '68%', width: '60px', height: '32px' }
        }
      },
      's-sol': {
        solarMppt: {
          id: 'solarMppt',
          name: 'Solar MPPT Controller',
          description: 'Maximum power point tracking for optimal solar harvest. Charges battery bank.',
          specs: '6-24V solar in, 5V 3A out, MPPT tracking',
          color: '#14b8a6',
          zone: 'lower',
          position: { top: '15%', left: '8%', width: '100px', height: '55px' }
        },
        batteryPack: {
          id: 'batteryPack',
          name: '18650 Battery Pack',
          description: '4S2P lithium battery pack for overnight operation and cloudy day backup.',
          specs: '14.8V nominal, 5200mAh, protected cells',
          color: '#22c55e',
          zone: 'lower',
          position: { top: '15%', left: '55%', width: '90px', height: '50px' }
        },
        dcConverter: {
          id: 'dcConverter',
          name: 'DC-DC Buck Converter',
          description: 'Steps battery voltage down to 5V for Pi and sensors.',
          specs: '8-28V in → 5V 3A out, 93% efficient',
          color: '#eab308',
          zone: 'lower',
          position: { top: '60%', left: '8%', width: '65px', height: '32px' }
        },
        bms: {
          id: 'bms',
          name: 'Battery Management System',
          description: 'Balances cells, protects against over-charge/discharge, monitors temperature.',
          specs: '4S BMS, 20A continuous, temp sensor',
          color: '#ef4444',
          zone: 'lower',
          position: { top: '60%', left: '45%', width: '75px', height: '32px' }
        }
      },
      's-mon': {
        dcPsu: {
          id: 'dcPsu',
          name: 'PoE Splitter',
          description: 'Power over Ethernet for single-cable deployment. Provides power and data.',
          specs: '802.3af/at PoE, 5V 2.4A out',
          color: '#3b82f6',
          zone: 'lower',
          position: { top: '15%', left: '8%', width: '90px', height: '50px' }
        },
        ethernetSwitch: {
          id: 'ethernetSwitch',
          name: 'Ethernet Switch',
          description: 'Managed switch for sensor network expansion.',
          specs: '5-port Gigabit, VLAN capable',
          color: '#6366f1',
          zone: 'lower',
          position: { top: '15%', left: '55%', width: '85px', height: '50px' }
        },
        dcConverter: {
          id: 'dcConverter',
          name: 'DC-DC Buck Converter',
          description: 'Voltage regulation for sensor power rails.',
          specs: '12V in → 5V/3.3V out, dual rail',
          color: '#eab308',
          zone: 'lower',
          position: { top: '60%', left: '25%', width: '100px', height: '32px' }
        }
      },
      'smart-buoy': {
        solarMppt: {
          id: 'solarMppt',
          name: 'Marine Solar MPPT',
          description: 'Waterproof solar controller optimized for marine environment.',
          specs: '12V 10W solar in, 5V 2A out, conformal coated',
          color: '#14b8a6',
          zone: 'lower',
          position: { top: '15%', left: '8%', width: '95px', height: '50px' }
        },
        batteryPack: {
          id: 'batteryPack',
          name: 'LiFePO4 Battery',
          description: 'Marine-grade lithium iron phosphate for safety and longevity.',
          specs: '12.8V 6Ah, 2000+ cycles, IP67',
          color: '#22c55e',
          zone: 'lower',
          position: { top: '15%', left: '55%', width: '85px', height: '50px' }
        },
        chargeController: {
          id: 'chargeController',
          name: 'Smart Charge Controller',
          description: 'Manages battery charging with temperature compensation.',
          specs: '12V 5A, temp sensor, low-voltage disconnect',
          color: '#eab308',
          zone: 'lower',
          position: { top: '60%', left: '8%', width: '70px', height: '32px' }
        },
        dcConverter: {
          id: 'dcConverter',
          name: '5V Regulator',
          description: 'Efficient switching regulator for Pi and sensors.',
          specs: '12V in → 5V 3A out, 95% efficient',
          color: '#a855f7',
          zone: 'lower',
          position: { top: '60%', left: '50%', width: '70px', height: '32px' }
        }
      },
      'smart-buoy-xl': {
        solarMppt: {
          id: 'solarMppt',
          name: 'High-Power Solar MPPT',
          description: 'Dual-input solar controller for 50W panel array.',
          specs: '24V 50W solar in, dual input, MPPT',
          color: '#14b8a6',
          zone: 'lower',
          position: { top: '10%', left: '5%', width: '85px', height: '45px' }
        },
        batteryPack: {
          id: 'batteryPack',
          name: 'LiFePO4 Battery Bank',
          description: 'High-capacity marine battery for extended autonomy.',
          specs: '12.8V 20Ah, 4S prismatic cells',
          color: '#22c55e',
          zone: 'lower',
          position: { top: '10%', left: '48%', width: '95px', height: '45px' }
        },
        bms: {
          id: 'bms',
          name: 'Marine BMS',
          description: 'Active cell balancing with CAN bus monitoring.',
          specs: '4S 30A, active balance, CAN reporting',
          color: '#ef4444',
          zone: 'lower',
          position: { top: '55%', left: '5%', width: '60px', height: '35px' }
        },
        dcConverter: {
          id: 'dcConverter',
          name: 'Multi-Rail DC-DC',
          description: 'Multiple regulated outputs for sensors and peripherals.',
          specs: '12V → 5V/3.3V/12V rails, 5A total',
          color: '#eab308',
          zone: 'lower',
          position: { top: '55%', left: '35%', width: '55px', height: '35px' }
        },
        ultrasonicDriver: {
          id: 'ultrasonicDriver',
          name: 'Ultrasonic Driver',
          description: 'Algae control transducer driver for buoy-mounted emitter.',
          specs: '12V input, 50W, 40kHz',
          color: '#f97316',
          zone: 'lower',
          position: { top: '55%', left: '62%', width: '75px', height: '35px' }
        }
      }
    };

    return {
      ...baseComponents,
      ...(powerConfigs[productId] || powerConfigs['s-ac'])
    };
  };

  const components = getComponentsForProduct(product?.id || 's-ac');
  const hoveredData = hoveredComponent ? components[hoveredComponent] : null;

  const neonColor = '#00ff88';
  const neonGlow = '0 0 4px #00ff88, 0 0 8px #00ff8866';

  // Get cable glands based on product
  const getCableGlands = (productId) => {
    const glandConfigs = {
      's-ac': [
        { label: 'AC IN', color: '#eab308' },
        { label: 'SENSORS', color: '#06b6d4' },
        { label: 'XDCR OUT', color: '#f97316' }
      ],
      's-sol': [
        { label: 'SOLAR', color: '#14b8a6' },
        { label: 'SENSORS', color: '#06b6d4' },
        { label: 'ANT', color: '#3b82f6' }
      ],
      's-mon': [
        { label: 'PoE IN', color: '#3b82f6' },
        { label: 'SENSORS', color: '#06b6d4' },
        { label: 'ETH OUT', color: '#6366f1' }
      ],
      'smart-buoy': [
        { label: 'SOLAR', color: '#14b8a6' },
        { label: 'SENSORS', color: '#06b6d4' },
        { label: 'ANT', color: '#3b82f6' }
      ],
      'smart-buoy-xl': [
        { label: 'SOLAR', color: '#14b8a6' },
        { label: 'SENSORS', color: '#06b6d4' },
        { label: 'XDCR', color: '#f97316' },
        { label: 'ANT', color: '#3b82f6' }
      ]
    };
    return glandConfigs[productId] || glandConfigs['s-ac'];
  };

  const cableGlands = getCableGlands(product?.id);

  const ComponentBlock = ({ component }) => {
    const isHovered = hoveredComponent === component.id;

    return (
      <div
        onMouseEnter={() => setHoveredComponent(component.id)}
        onMouseLeave={() => setHoveredComponent(null)}
        style={{
          position: 'absolute',
          ...component.position,
          background: isHovered ? component.color : `${component.color}22`,
          border: `2px solid ${component.color}`,
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          boxShadow: isHovered
            ? `0 0 20px ${component.color}88, inset 0 0 10px ${component.color}33`
            : `0 0 6px ${component.color}33`,
          zIndex: isHovered ? 50 : 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px'
        }}
      >
        <span style={{
          color: isHovered ? '#000' : component.color,
          fontSize: '9px',
          fontWeight: '600',
          textAlign: 'center',
          lineHeight: '1.2',
          textShadow: isHovered ? 'none' : `0 0 4px ${component.color}`
        }}>
          {component.name}
        </span>
      </div>
    );
  };

  const productName = product?.name || 'BlueSignal WQ-100';

  return (
    <div style={{
      fontFamily: 'SF Mono, Consolas, monospace',
      padding: '24px',
      background: 'transparent',
      minHeight: '600px',
      color: neonColor
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{
          margin: '0 0 6px 0',
          fontSize: '18px',
          fontWeight: '400',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          textShadow: neonGlow
        }}>
          {productName}
        </h1>
        <p style={{ margin: 0, color: '#00aa66', fontSize: '11px', letterSpacing: '1px' }}>
          Internal Component Layout
        </p>
      </div>

      <div style={{ display: 'flex', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>

        {/* Enclosure Interior View */}
        <div style={{ flex: '0 0 500px' }}>

          {/* Simple IP67 Enclosure Outline */}
          <div style={{
            border: `3px solid ${neonColor}`,
            borderRadius: '8px',
            padding: '12px',
            background: 'transparent',
            boxShadow: neonGlow
          }}>

            {/* Interior container */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '520px',
              background: 'transparent',
              borderRadius: '4px',
              border: `1px solid ${neonColor}44`
            }}>

              {/* Exhaust Fan - LEFT WALL */}
              <div style={{
                position: 'absolute',
                left: '0',
                top: '20px',
                width: '50px',
                height: '70px',
                borderRight: `1px solid ${neonColor}44`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: `2px solid #ef4444`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px #ef444466'
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: `conic-gradient(from 0deg, #ef4444 0deg, transparent 40deg, #ef4444 90deg, transparent 130deg, #ef4444 180deg, transparent 220deg, #ef4444 270deg, transparent 310deg)`,
                    opacity: 0.8
                  }} />
                </div>
                <span style={{ fontSize: '7px', color: '#ef4444', textAlign: 'center' }}>FAN<br/>↑OUT</span>
              </div>

              {/* Side Louvers - RIGHT WALL */}
              <div style={{
                position: 'absolute',
                right: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '200px',
                borderLeft: `1px solid ${neonColor}44`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 0'
              }}>
                {[...Array(12)].map((_, i) => (
                  <div key={i} style={{
                    width: '10px',
                    height: '3px',
                    background: '#3b82f6',
                    borderRadius: '1px',
                    boxShadow: '0 0 4px #3b82f6'
                  }} />
                ))}
                <span style={{
                  fontSize: '7px',
                  color: '#3b82f6',
                  writingMode: 'vertical-rl',
                  marginTop: '8px'
                }}>IN→</span>
              </div>

              {/* ========== UPPER ZONE ========== */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '60px',
                right: '30px',
                height: '60%',
                border: `1px solid ${neonColor}66`,
                borderRadius: '4px',
                background: 'rgba(0, 255, 136, 0.03)'
              }}>
                {/* Zone label */}
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '12px',
                  background: 'inherit',
                  padding: '0 8px',
                  fontSize: '10px',
                  fontWeight: '600',
                  color: neonColor,
                  letterSpacing: '1px',
                  textShadow: neonGlow
                }}>
                  UPPER ZONE — CONTROL
                </div>

                {/* Mounting hole pattern */}
                <div style={{
                  position: 'absolute',
                  inset: '20px 10px 10px 10px',
                  backgroundImage: `radial-gradient(circle, ${neonColor}22 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                  opacity: 0.4
                }} />

                {/* Components */}
                {Object.values(components)
                  .filter(c => c.zone === 'upper')
                  .map(comp => <ComponentBlock key={comp.id} component={comp} />)
                }
              </div>

              {/* ========== SHELF DIVIDER ========== */}
              <div style={{
                position: 'absolute',
                top: '65%',
                left: '60px',
                right: '30px',
                height: '16px',
                background: `linear-gradient(180deg, ${neonColor}33 0%, ${neonColor}11 100%)`,
                borderTop: `2px solid ${neonColor}`,
                borderBottom: `2px solid ${neonColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '15px',
                boxShadow: `0 0 12px ${neonColor}22`
              }}>
                {[...Array(16)].map((_, i) => (
                  <div key={i} style={{
                    width: '14px',
                    height: '5px',
                    background: 'rgba(0,0,0,0.5)',
                    borderRadius: '2px',
                    border: `1px solid ${neonColor}44`
                  }} />
                ))}
              </div>

              {/* Shelf brackets */}
              <div style={{
                position: 'absolute',
                top: 'calc(65% - 4px)',
                left: '56px',
                width: '8px',
                height: '24px',
                background: neonColor,
                borderRadius: '2px',
                boxShadow: neonGlow
              }} />
              <div style={{
                position: 'absolute',
                top: 'calc(65% - 4px)',
                right: '26px',
                width: '8px',
                height: '24px',
                background: neonColor,
                borderRadius: '2px',
                boxShadow: neonGlow
              }} />

              {/* ========== LOWER ZONE ========== */}
              <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '60px',
                right: '30px',
                height: '28%',
                border: `1px solid #f9731666`,
                borderRadius: '4px',
                background: 'rgba(249, 115, 22, 0.03)'
              }}>
                {/* Zone label */}
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '12px',
                  background: 'inherit',
                  padding: '0 8px',
                  fontSize: '10px',
                  fontWeight: '600',
                  color: '#f97316',
                  letterSpacing: '1px',
                  textShadow: '0 0 6px #f97316'
                }}>
                  LOWER ZONE — POWER
                </div>

                {/* Components */}
                {Object.values(components)
                  .filter(c => c.zone === 'lower')
                  .map(comp => <ComponentBlock key={comp.id} component={comp} />)
                }
              </div>

              {/* ========== CABLE GLANDS (Bottom) ========== */}
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '50px'
              }}>
                {cableGlands.map((gland, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      border: `2px solid ${gland.color}`,
                      background: 'rgba(0,0,0,0.3)',
                      margin: '0 auto 4px',
                      boxShadow: `0 0 8px ${gland.color}44, inset 0 0 4px ${gland.color}22`
                    }} />
                    <span style={{ fontSize: '7px', color: gland.color }}>{gland.label}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Enclosure label */}
          <div style={{
            marginTop: '12px',
            textAlign: 'center',
            fontSize: '10px',
            color: '#666',
            letterSpacing: '1px'
          }}>
            IP67 NEMA 4X ENCLOSURE — INTERIOR VIEW
          </div>
        </div>

        {/* Info Panel */}
        <div style={{ flex: 1 }}>

          {/* Component Details */}
          <div style={{
            background: hoveredData ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.2)',
            borderRadius: '6px',
            padding: '18px',
            marginBottom: '16px',
            minHeight: '140px',
            border: hoveredData ? `2px solid ${hoveredData.color}` : `1px solid rgba(0,255,136,0.2)`,
            boxShadow: hoveredData ? `0 0 20px ${hoveredData.color}22` : 'none',
            transition: 'all 0.15s ease',
            backdropFilter: 'blur(4px)'
          }}>
            {hoveredData ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '3px',
                    background: hoveredData.color,
                    boxShadow: `0 0 10px ${hoveredData.color}`
                  }} />
                  <h2 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: hoveredData.color }}>
                    {hoveredData.name}
                  </h2>
                </div>
                <p style={{ margin: '0 0 12px 0', color: '#999', fontSize: '12px', lineHeight: '1.6' }}>
                  {hoveredData.description}
                </p>
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '10px 12px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  color: neonColor,
                  border: `1px solid ${neonColor}22`,
                  fontFamily: 'monospace'
                }}>
                  {hoveredData.specs}
                </div>
              </>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#555',
                fontSize: '12px'
              }}>
                [ HOVER COMPONENT ]
              </div>
            )}
          </div>

          {/* Component List */}
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '6px',
            padding: '16px',
            border: '1px solid rgba(0,255,136,0.15)',
            marginBottom: '16px',
            backdropFilter: 'blur(4px)'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '9px', color: neonColor, marginBottom: '8px', letterSpacing: '2px' }}>
                ▲ UPPER ZONE
              </div>
              {Object.values(components).filter(c => c.zone === 'upper').map(comp => (
                <div
                  key={comp.id}
                  onMouseEnter={() => setHoveredComponent(comp.id)}
                  onMouseLeave={() => setHoveredComponent(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px',
                    marginBottom: '4px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: hoveredComponent === comp.id ? `${comp.color}15` : 'transparent',
                    borderLeft: hoveredComponent === comp.id ? `3px solid ${comp.color}` : '3px solid transparent',
                    transition: 'all 0.1s ease'
                  }}
                >
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '2px',
                    background: comp.color,
                    boxShadow: `0 0 6px ${comp.color}66`
                  }} />
                  <span style={{ fontSize: '11px', color: '#aaa' }}>{comp.name}</span>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: '9px', color: '#f97316', marginBottom: '8px', letterSpacing: '2px' }}>
                ▼ LOWER ZONE
              </div>
              {Object.values(components).filter(c => c.zone === 'lower').map(comp => (
                <div
                  key={comp.id}
                  onMouseEnter={() => setHoveredComponent(comp.id)}
                  onMouseLeave={() => setHoveredComponent(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px',
                    marginBottom: '4px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: hoveredComponent === comp.id ? `${comp.color}15` : 'transparent',
                    borderLeft: hoveredComponent === comp.id ? `3px solid ${comp.color}` : '3px solid transparent',
                    transition: 'all 0.1s ease'
                  }}
                >
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '2px',
                    background: comp.color,
                    boxShadow: `0 0 6px ${comp.color}66`
                  }} />
                  <span style={{ fontSize: '11px', color: '#aaa' }}>{comp.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Thermal Path */}
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '6px',
            padding: '16px',
            border: '1px solid rgba(0,255,136,0.15)',
            backdropFilter: 'blur(4px)'
          }}>
            <div style={{ fontSize: '9px', color: '#0ea5e9', marginBottom: '10px', letterSpacing: '2px' }}>
              AIRFLOW PATH
            </div>
            <div style={{ fontSize: '11px', color: '#888', lineHeight: '2.2' }}>
              <div><span style={{ color: '#3b82f6' }}>→</span> Cool air in via right louvers</div>
              <div><span style={{ color: '#f97316' }}>▣</span> Heat generated in lower zone</div>
              <div><span style={{ color: neonColor }}>⋮</span> Rises through perforated shelf</div>
              <div><span style={{ color: '#ef4444' }}>↑</span> Exhausted via left wall fan</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EnclosureLayout;

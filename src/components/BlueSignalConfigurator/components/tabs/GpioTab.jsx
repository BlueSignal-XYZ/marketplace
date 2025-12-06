// GPIO Tab Component
import React from "react";
import { SectionTitle, GpioSection, GpioTitle, GpioList, Table, Th, Td } from "../../styles";
import { GPIO_PINOUT, GPIO_TYPE_COLORS } from "../../data";

const GpioTab = ({ product }) => {
  const getTypeColor = (type) => GPIO_TYPE_COLORS[type] || "#94a3b8";

  return (
    <div>
      <SectionTitle>GPIO Pin Assignments</SectionTitle>

      {/* Product-specific connections */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginBottom: 24 }}>
        {product.gpio.i2c?.length > 0 && (
          <GpioSection>
            <GpioTitle>I2C Bus</GpioTitle>
            <GpioList>
              {product.gpio.i2c.map((pin, i) => (
                <li key={i}>{pin}</li>
              ))}
            </GpioList>
          </GpioSection>
        )}
        {product.gpio.uart?.length > 0 && (
          <GpioSection>
            <GpioTitle>UART</GpioTitle>
            <GpioList>
              {product.gpio.uart.map((pin, i) => (
                <li key={i}>{pin}</li>
              ))}
            </GpioList>
          </GpioSection>
        )}
        {product.gpio.oneWire?.length > 0 && (
          <GpioSection>
            <GpioTitle>1-Wire</GpioTitle>
            <GpioList>
              {product.gpio.oneWire.map((pin, i) => (
                <li key={i}>{pin}</li>
              ))}
            </GpioList>
          </GpioSection>
        )}
        {product.gpio.gpio?.length > 0 && (
          <GpioSection>
            <GpioTitle>Digital GPIO</GpioTitle>
            <GpioList>
              {product.gpio.gpio.map((pin, i) => (
                <li key={i}>{pin}</li>
              ))}
            </GpioList>
          </GpioSection>
        )}
        {product.gpio.sdi12?.length > 0 && (
          <GpioSection>
            <GpioTitle>SDI-12</GpioTitle>
            <GpioList>
              {product.gpio.sdi12.map((pin, i) => (
                <li key={i}>{pin}</li>
              ))}
            </GpioList>
          </GpioSection>
        )}
      </div>

      {/* Full 40-pin header reference */}
      <div style={{ marginTop: 24 }}>
        <SectionTitle>40-Pin Header Reference (Pi Zero 2 W)</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <Table>
            <thead>
              <tr>
                <Th>Pin</Th>
                <Th>Name</Th>
                <Th>GPIO</Th>
                <Th>Type</Th>
                <Th style={{ textAlign: "left" }}>Connection</Th>
                <Th style={{ textAlign: "left" }}>Notes</Th>
              </tr>
            </thead>
            <tbody>
              {GPIO_PINOUT.filter(p => p.type !== "ground" || p.pin <= 20).slice(0, 20).map((pin) => (
                <tr key={pin.pin}>
                  <Td>{pin.pin}</Td>
                  <Td style={{ fontFamily: "monospace" }}>{pin.name}</Td>
                  <Td>{pin.gpio !== null ? `GPIO${pin.gpio}` : "—"}</Td>
                  <Td>
                    <span style={{
                      background: `${getTypeColor(pin.type)}20`,
                      color: getTypeColor(pin.type),
                      padding: "2px 6px",
                      borderRadius: 3,
                      fontSize: 11,
                      fontWeight: 600,
                    }}>
                      {pin.type}
                    </span>
                  </Td>
                  <Td style={{ textAlign: "left", fontSize: 12 }}>{pin.connection}</Td>
                  <Td style={{ textAlign: "left", color: "#94a3b8", fontSize: 11 }}>{pin.notes}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <p style={{ fontSize: 11, color: "#64748b", marginTop: 8 }}>
          Showing first 20 pins. Full pinout available in documentation. Reserved pins (UART, SPI, EEPROM) should not be used.
        </p>
      </div>
    </div>
  );
};

export default GpioTab;

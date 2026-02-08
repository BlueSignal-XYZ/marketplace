import LegalLayout from '../components/LegalLayout';

const WarrantyPage = () => (
  <LegalLayout title="Warranty" lastUpdated="February 2026">
    <h2>Limited Hardware Warranty</h2>
    <p>
      BlueSignal warrants the WQM-1 hardware product against defects in materials and workmanship
      under normal use for a period of <strong>one (1) year</strong> from the date of delivery.
    </p>

    <h2>What Is Covered</h2>
    <ul>
      <li>Defects in materials or workmanship of the WQM-1 HAT board.</li>
      <li>Failure of on-board components (ADC, LoRa transceiver, relay, power regulator) under normal operating conditions.</li>
      <li>Manufacturing defects in included accessories (antenna, power cable, enclosure).</li>
    </ul>

    <h2>What Is Not Covered</h2>
    <ul>
      <li>Physical damage from drops, impacts, or improper handling.</li>
      <li>Water ingress beyond the rated IP67 enclosure specification (if enclosed).</li>
      <li>Damage from use outside the specified input voltage range (9&ndash;24&nbsp;V&nbsp;DC).</li>
      <li>Modifications, unauthorized repairs, or alterations to the hardware.</li>
      <li>Normal wear and tear.</li>
      <li>Software or firmware issues (covered by software updates, not hardware warranty).</li>
    </ul>

    <h2>Sensor Probes</h2>
    <p>
      Sensor probes (pH electrode, TDS probe, turbidity sensor, ORP electrode) are consumable items
      and carry a <strong>90-day warranty</strong> from date of delivery. Probes degrade naturally
      with use and exposure to measured media.
    </p>

    <h2>Temperature Sensor</h2>
    <p>
      The waterproof DS18B20 temperature probe is warranted for <strong>one (1) year</strong> under
      normal operating conditions (&minus;5&nbsp;to&nbsp;85&deg;C).
    </p>

    <h2>Warranty Claim Process</h2>
    <ol>
      <li>Email <a href="mailto:warranty@bluesignal.xyz">warranty@bluesignal.xyz</a> with your order number, device serial number, and a description of the issue.</li>
      <li>Our support team will respond within 2 business days with troubleshooting steps or a return authorization.</li>
      <li>If a return is authorized, ship the defective unit to the address provided. We cover return shipping within the US.</li>
      <li>Upon inspection, we will repair, replace, or refund the product at our discretion.</li>
    </ol>

    <h2>Resolution</h2>
    <p>
      At our sole discretion, we will resolve valid warranty claims by:
    </p>
    <ul>
      <li><strong>Repair:</strong> Repairing the defective unit and returning it to you.</li>
      <li><strong>Replacement:</strong> Sending a new or refurbished replacement unit.</li>
      <li><strong>Refund:</strong> Issuing a full or partial refund of the original purchase price.</li>
    </ul>

    <h2>Limitations</h2>
    <p>
      This warranty is the sole and exclusive warranty provided by BlueSignal for the WQM-1 hardware.
      To the maximum extent permitted by law, BlueSignal disclaims all other warranties, express or
      implied, including implied warranties of merchantability and fitness for a particular purpose.
    </p>

    <h2>Contact</h2>
    <p>
      For warranty questions or claims, email <a href="mailto:warranty@bluesignal.xyz">warranty@bluesignal.xyz</a>.
    </p>
  </LegalLayout>
);

export default WarrantyPage;

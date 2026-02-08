import LegalLayout from '../components/LegalLayout';

const TermsPage = () => (
  <LegalLayout title="Terms of Service" lastUpdated="February 2026">
    <h2>Agreement</h2>
    <p>
      By accessing or using bluesignal.xyz, BlueSignal Cloud, or any BlueSignal hardware product,
      you agree to be bound by these Terms of Service. If you do not agree, do not use our services.
    </p>

    <h2>Products &amp; Services</h2>
    <p>
      BlueSignal designs and manufactures the WQM-1 water quality monitoring hardware and provides
      the BlueSignal Cloud dashboard for data visualization and device management.
    </p>

    <h2>Pre-Orders</h2>
    <ul>
      <li>Pre-order reservations are non-binding expressions of interest.</li>
      <li>No payment is collected at the time of reservation.</li>
      <li>You will be charged only when your order ships.</li>
      <li>Full refund is available if the product is not delivered within the estimated timeline.</li>
      <li>Pricing is subject to change prior to order confirmation.</li>
    </ul>

    <h2>Cloud Services</h2>
    <ul>
      <li>BlueSignal Cloud is provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis.</li>
      <li>We target high availability but do not guarantee a specific uptime SLA during the pre-launch period.</li>
      <li>We reserve the right to modify, suspend, or discontinue any aspect of the service with reasonable notice.</li>
      <li>Your data remains your property. We do not claim ownership of sensor data transmitted by your devices.</li>
    </ul>

    <h2>Acceptable Use</h2>
    <p>You agree not to:</p>
    <ul>
      <li>Use BlueSignal products as the sole monitoring system for life-safety critical applications without redundant monitoring.</li>
      <li>Reverse engineer, decompile, or disassemble the firmware or cloud software.</li>
      <li>Use the service to transmit malicious code or interfere with other users.</li>
      <li>Resell or sublicense the cloud service without written authorization.</li>
    </ul>

    <h2>Intellectual Property</h2>
    <p>
      All content, trademarks, logos, and software associated with BlueSignal are our property or
      licensed to us. Hardware designs are proprietary. The WQM-1 device firmware source code
      availability is governed by its separate license.
    </p>

    <h2>Limitation of Liability</h2>
    <p>
      To the maximum extent permitted by law, BlueSignal shall not be liable for any indirect,
      incidental, special, consequential, or punitive damages arising from your use of our products
      or services, including but not limited to loss of data, revenue, or profits.
    </p>
    <p>
      Our total liability for any claim arising from these terms shall not exceed the amount you
      paid to BlueSignal in the twelve months preceding the claim.
    </p>

    <h2>Hardware Warranty</h2>
    <p>
      Hardware products are warranted under our separate <a href="/warranty">Warranty Policy</a>.
    </p>

    <h2>Governing Law</h2>
    <p>
      These terms are governed by the laws of the State of Texas, United States, without regard to
      conflict of law principles. Any disputes shall be resolved in the courts of Travis County, Texas.
    </p>

    <h2>Changes</h2>
    <p>
      We may update these Terms from time to time. Continued use of our services after changes
      constitutes acceptance of the updated terms.
    </p>

    <h2>Contact</h2>
    <p>
      Questions about these terms? Contact us at <a href="mailto:hello@bluesignal.xyz">hello@bluesignal.xyz</a>.
    </p>
  </LegalLayout>
);

export default TermsPage;

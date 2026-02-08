import LegalLayout from '../components/LegalLayout';

const PrivacyPage = () => (
  <LegalLayout title="Privacy Policy" lastUpdated="February 2026">
    <h2>Introduction</h2>
    <p>
      BlueSignal (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy.
      This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
      you visit our website at bluesignal.xyz, use the BlueSignal Cloud dashboard, or interact with
      our WQM-1 hardware products.
    </p>

    <h2>Information We Collect</h2>

    <h3>Information You Provide</h3>
    <ul>
      <li><strong>Pre-order information:</strong> Email address, name, use case, and quantity when you reserve a dev kit.</li>
      <li><strong>Account information:</strong> Email, name, and profile details when you create a BlueSignal Cloud account.</li>
      <li><strong>Contact information:</strong> Email address, location, and property details when you request an installation quote.</li>
    </ul>

    <h3>Information Collected Automatically</h3>
    <ul>
      <li><strong>Device telemetry:</strong> Water quality readings (pH, TDS, turbidity, ORP, temperature), GPS coordinates, device health metrics, and connectivity status transmitted by WQM-1 hardware.</li>
      <li><strong>Usage analytics:</strong> Page views, feature usage, and interaction data collected through Google Analytics or equivalent.</li>
      <li><strong>Technical data:</strong> Browser type, operating system, IP address, and device identifiers.</li>
    </ul>

    <h2>How We Use Your Information</h2>
    <ul>
      <li>To fulfill pre-orders and deliver products.</li>
      <li>To provide the BlueSignal Cloud dashboard service.</li>
      <li>To process installation quote requests.</li>
      <li>To send order confirmations and product updates.</li>
      <li>To improve our products and services.</li>
      <li>To detect and prevent fraud or security incidents.</li>
    </ul>

    <h2>Third-Party Services</h2>
    <p>We use the following third-party services to operate our platform:</p>
    <ul>
      <li><strong>Firebase (Google Cloud):</strong> Authentication, database, and hosting.</li>
      <li><strong>SendGrid:</strong> Transactional email delivery.</li>
      <li><strong>Cloudflare:</strong> CDN, DNS, and DDoS protection.</li>
      <li><strong>Google Analytics:</strong> Website usage analytics.</li>
    </ul>
    <p>
      These services may process your data as described in their respective privacy policies.
      We do not sell your personal information to third parties.
    </p>

    <h2>Data Retention</h2>
    <ul>
      <li><strong>Account data:</strong> Retained while your account is active. Deleted within 30 days of account deletion request.</li>
      <li><strong>Device telemetry:</strong> Retained for 2 years from date of collection.</li>
      <li><strong>Pre-order data:</strong> Retained until order fulfillment or cancellation.</li>
      <li><strong>Analytics data:</strong> Retained per Google Analytics default retention settings.</li>
    </ul>

    <h2>Your Rights</h2>
    <p>Depending on your jurisdiction, you may have the right to:</p>
    <ul>
      <li>Access the personal data we hold about you.</li>
      <li>Request correction of inaccurate data.</li>
      <li>Request deletion of your data.</li>
      <li>Request portability of your data.</li>
      <li>Opt out of marketing communications.</li>
    </ul>
    <p>
      To exercise any of these rights, contact us
      at <a href="mailto:privacy@bluesignal.xyz">privacy@bluesignal.xyz</a>.
    </p>

    <h2>Security</h2>
    <p>
      We implement industry-standard security measures including encrypted data transmission (TLS),
      secure authentication, and access controls. However, no method of electronic transmission or
      storage is 100% secure.
    </p>

    <h2>Changes to This Policy</h2>
    <p>
      We may update this Privacy Policy from time to time. We will notify you of material changes
      by posting the updated policy on this page with a new &ldquo;Last updated&rdquo; date.
    </p>

    <h2>Contact</h2>
    <p>
      For privacy-related questions or requests, contact us
      at <a href="mailto:privacy@bluesignal.xyz">privacy@bluesignal.xyz</a>.
    </p>
  </LegalLayout>
);

export default PrivacyPage;

// PDF Export Utility for Sales Configurator
// Uses jsPDF for direct PDF download with custom filename

import jsPDF from 'jspdf';

/**
 * Generate a professional PDF quote from quote items
 * Downloads a PDF file with proper filename
 */
export const generateQuotePDF = async (quoteItems, products, options = {}) => {
  const {
    companyName = "BlueSignal",
    customerName = "",
    quoteNumber = `QT-${Date.now().toString(36).toUpperCase()}`,
    validDays = 30,
  } = options;

  const today = new Date();
  const validUntil = new Date(today.getTime() + validDays * 24 * 60 * 60 * 1000);

  // Calculate totals
  let subtotal = 0;
  const lineItems = quoteItems.map((item) => {
    const product = products[item.productId];
    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;
    return {
      name: product.name,
      subtitle: product.subtitle,
      sku: product.sku,
      unitPrice: product.price,
      quantity: item.quantity,
      lineTotal,
      features: product.features.slice(0, 4), // Top 4 features
    };
  });

  // Generate PDF using jsPDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 54; // 0.75 inch margins
  const contentWidth = pageWidth - (margin * 2);
  let yPos = margin;

  // Helper functions
  const formatCurrency = (amount) => `$${amount.toLocaleString()}`;
  const formatDate = (date) => date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Header - Logo and Quote Info
  pdf.setFontSize(28);
  pdf.setTextColor(30, 64, 175); // Blue
  pdf.text('Blue', margin, yPos + 20);
  pdf.setTextColor(59, 130, 246); // Light blue
  const blueWidth = pdf.getTextWidth('Blue');
  pdf.text('Signal', margin + blueWidth, yPos + 20);

  // Quote number and date on the right
  pdf.setFontSize(14);
  pdf.setTextColor(59, 130, 246);
  pdf.text(quoteNumber, pageWidth - margin, yPos + 8, { align: 'right' });
  pdf.setFontSize(10);
  pdf.setTextColor(107, 114, 128);
  pdf.text(`Date: ${formatDate(today)}`, pageWidth - margin, yPos + 22, { align: 'right' });

  yPos += 40;

  // Blue line under header
  pdf.setDrawColor(59, 130, 246);
  pdf.setLineWidth(3);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 30;

  // Customer Section
  pdf.setFontSize(9);
  pdf.setTextColor(107, 114, 128);
  pdf.text('PREPARED FOR', margin, yPos);
  pdf.text('VALID UNTIL', pageWidth - margin - 100, yPos);

  yPos += 14;
  pdf.setFontSize(12);
  pdf.setTextColor(31, 41, 55);
  pdf.text(customerName || '[Customer Name]', margin, yPos);
  pdf.setTextColor(5, 150, 105);
  pdf.text(formatDate(validUntil), pageWidth - margin - 100, yPos);

  yPos += 30;

  // Line Items Table Header
  pdf.setFillColor(249, 250, 251);
  pdf.rect(margin, yPos - 4, contentWidth, 24, 'F');
  pdf.setFontSize(9);
  pdf.setTextColor(107, 114, 128);
  pdf.text('PRODUCT', margin + 8, yPos + 10);
  pdf.text('UNIT PRICE', margin + contentWidth * 0.55, yPos + 10);
  pdf.text('QTY', margin + contentWidth * 0.72, yPos + 10);
  pdf.text('TOTAL', margin + contentWidth * 0.85, yPos + 10);

  yPos += 30;

  // Draw line under header
  pdf.setDrawColor(229, 231, 235);
  pdf.setLineWidth(1);
  pdf.line(margin, yPos - 6, pageWidth - margin, yPos - 6);

  // Line Items
  lineItems.forEach((item, index) => {
    // Check if we need a new page
    if (yPos > 680) {
      pdf.addPage();
      yPos = margin;
    }

    // Product name
    pdf.setFontSize(11);
    pdf.setTextColor(31, 41, 55);
    pdf.text(item.name, margin + 8, yPos);

    // Subtitle
    pdf.setFontSize(9);
    pdf.setTextColor(107, 114, 128);
    pdf.text(item.subtitle, margin + 8, yPos + 12);

    // SKU
    pdf.setFontSize(8);
    pdf.setTextColor(156, 163, 175);
    pdf.text(item.sku, margin + 8, yPos + 23);

    // Features (top 2 only to save space)
    const featuresToShow = item.features.slice(0, 2);
    featuresToShow.forEach((feature, fi) => {
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`• ${feature}`, margin + 12, yPos + 35 + (fi * 10));
    });

    // Price columns
    pdf.setFontSize(10);
    pdf.setTextColor(31, 41, 55);
    pdf.text(formatCurrency(item.unitPrice), margin + contentWidth * 0.55, yPos + 8);
    pdf.text(String(item.quantity), margin + contentWidth * 0.75, yPos + 8);

    // Line total
    pdf.setTextColor(5, 150, 105);
    pdf.text(formatCurrency(item.lineTotal), margin + contentWidth * 0.85, yPos + 8);

    // Separator line
    const itemHeight = 60 + (featuresToShow.length > 0 ? featuresToShow.length * 10 : 0);
    yPos += itemHeight;

    if (index < lineItems.length - 1) {
      pdf.setDrawColor(243, 244, 246);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos - 8, pageWidth - margin, yPos - 8);
    }
  });

  yPos += 20;

  // Totals Section
  const totalsX = pageWidth - margin - 180;

  // Subtotal
  pdf.setFontSize(10);
  pdf.setTextColor(107, 114, 128);
  pdf.text('Subtotal', totalsX, yPos);
  pdf.setTextColor(31, 41, 55);
  pdf.text(formatCurrency(subtotal), pageWidth - margin, yPos, { align: 'right' });

  yPos += 18;

  // Shipping
  pdf.setTextColor(107, 114, 128);
  pdf.text('Shipping', totalsX, yPos);
  pdf.setTextColor(31, 41, 55);
  pdf.text('TBD', pageWidth - margin, yPos, { align: 'right' });

  yPos += 24;

  // Grand Total line
  pdf.setDrawColor(229, 231, 235);
  pdf.setLineWidth(2);
  pdf.line(totalsX - 10, yPos - 8, pageWidth - margin, yPos - 8);

  pdf.setFontSize(14);
  pdf.setTextColor(31, 41, 55);
  pdf.text('Quote Total', totalsX, yPos + 6);
  pdf.setFontSize(18);
  pdf.setTextColor(5, 150, 105);
  pdf.text(formatCurrency(subtotal), pageWidth - margin, yPos + 6, { align: 'right' });

  yPos += 40;

  // Terms & Conditions Box
  if (yPos > 620) {
    pdf.addPage();
    yPos = margin;
  }

  pdf.setFillColor(249, 250, 251);
  pdf.roundedRect(margin, yPos, contentWidth, 90, 8, 8, 'F');

  pdf.setFontSize(10);
  pdf.setTextColor(31, 41, 55);
  pdf.text('Terms & Conditions', margin + 16, yPos + 18);

  const terms = [
    `Quote valid for ${validDays} days from issue date`,
    'Prices in USD, exclusive of applicable taxes',
    'Standard lead time: 2-4 weeks from order confirmation',
    'Payment terms: Net 30 for approved accounts',
    'Warranty: 1 year limited warranty on hardware',
  ];

  pdf.setFontSize(9);
  pdf.setTextColor(107, 114, 128);
  terms.forEach((term, i) => {
    pdf.text(`• ${term}`, margin + 16, yPos + 34 + (i * 11));
  });

  yPos += 110;

  // Footer
  pdf.setDrawColor(229, 231, 235);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPos, pageWidth - margin, yPos);

  yPos += 18;
  pdf.setFontSize(9);
  pdf.setTextColor(156, 163, 175);
  pdf.text('BlueSignal Water Quality Monitoring Solutions', pageWidth / 2, yPos, { align: 'center' });
  pdf.text('Questions? Contact your sales representative', pageWidth / 2, yPos + 12, { align: 'center' });

  // Generate filename: BlueSignal_Quote_{CustomerName}_{YYYY-MM-DD}.pdf
  const sanitizedName = customerName ? customerName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30) : 'Customer';
  const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `BlueSignal_Quote_${sanitizedName}_${dateStr}.pdf`;

  // Download the PDF
  pdf.save(filename);

  return { success: true, filename };
};

/**
 * Legacy print-based PDF generation (fallback)
 * Opens a print dialog that can save as PDF
 */
export const generateQuotePDFPrint = (quoteItems, products, options = {}) => {
  const {
    companyName = "BlueSignal",
    customerName = "",
    quoteNumber = `QT-${Date.now().toString(36).toUpperCase()}`,
    validDays = 30,
  } = options;

  const today = new Date();
  const validUntil = new Date(today.getTime() + validDays * 24 * 60 * 60 * 1000);

  // Calculate totals
  let subtotal = 0;
  const lineItems = quoteItems.map((item) => {
    const product = products[item.productId];
    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;
    return {
      name: product.name,
      subtitle: product.subtitle,
      sku: product.sku,
      unitPrice: product.price,
      quantity: item.quantity,
      lineTotal,
      features: product.features.slice(0, 4), // Top 4 features
    };
  });

  const printWindow = window.open("", "_blank", "width=800,height=600");

  printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Quote ${quoteNumber} - ${companyName}</title>
  <style>
    @page {
      margin: 0.75in;
      size: letter;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1f2937;
      background: white;
    }

    .container {
      max-width: 7.5in;
      margin: 0 auto;
      padding: 0.5in 0;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 3px solid #3b82f6;
    }

    .logo {
      font-size: 28pt;
      font-weight: 700;
      color: #1e40af;
    }

    .logo span {
      color: #3b82f6;
    }

    .quote-info {
      text-align: right;
    }

    .quote-number {
      font-size: 14pt;
      font-weight: 600;
      color: #3b82f6;
      margin-bottom: 4px;
    }

    .quote-date {
      font-size: 10pt;
      color: #6b7280;
    }

    /* Customer Section */
    .customer-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 32px;
    }

    .section-title {
      font-size: 9pt;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    .customer-name {
      font-size: 12pt;
      font-weight: 600;
    }

    .validity {
      text-align: right;
    }

    .validity-date {
      font-size: 12pt;
      font-weight: 600;
      color: #059669;
    }

    /* Line Items Table */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }

    .items-table th {
      text-align: left;
      padding: 12px 8px;
      font-size: 9pt;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      border-bottom: 2px solid #e5e7eb;
    }

    .items-table th:last-child,
    .items-table td:last-child {
      text-align: right;
    }

    .items-table td {
      padding: 16px 8px;
      vertical-align: top;
      border-bottom: 1px solid #f3f4f6;
    }

    .item-name {
      font-weight: 600;
      color: #1f2937;
    }

    .item-subtitle {
      font-size: 9pt;
      color: #6b7280;
    }

    .item-sku {
      font-size: 9pt;
      color: #9ca3af;
      font-family: monospace;
    }

    .item-features {
      margin-top: 8px;
      padding-left: 12px;
    }

    .item-features li {
      font-size: 9pt;
      color: #6b7280;
      margin-bottom: 2px;
    }

    .unit-price,
    .quantity,
    .line-total {
      font-family: "SF Mono", Monaco, monospace;
    }

    .quantity {
      text-align: center;
    }

    .line-total {
      font-weight: 600;
      color: #059669;
    }

    /* Totals */
    .totals-section {
      margin-left: auto;
      width: 280px;
      margin-bottom: 32px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .total-row.grand-total {
      border-top: 2px solid #e5e7eb;
      border-bottom: none;
      padding-top: 12px;
      margin-top: 8px;
    }

    .total-label {
      color: #6b7280;
    }

    .total-value {
      font-family: "SF Mono", Monaco, monospace;
      font-weight: 600;
    }

    .grand-total .total-label {
      font-size: 12pt;
      font-weight: 600;
      color: #1f2937;
    }

    .grand-total .total-value {
      font-size: 16pt;
      color: #059669;
    }

    /* Terms */
    .terms {
      background: #f9fafb;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 32px;
    }

    .terms h4 {
      font-size: 10pt;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .terms ul {
      font-size: 9pt;
      color: #6b7280;
      padding-left: 16px;
    }

    .terms li {
      margin-bottom: 4px;
    }

    /* Footer */
    .footer {
      text-align: center;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      font-size: 9pt;
      color: #9ca3af;
    }

    .footer a {
      color: #3b82f6;
      text-decoration: none;
    }

    /* Print-specific */
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <div class="logo">Blue<span>Signal</span></div>
      <div class="quote-info">
        <div class="quote-number">${quoteNumber}</div>
        <div class="quote-date">Date: ${today.toLocaleDateString()}</div>
      </div>
    </header>

    <div class="customer-section">
      <div class="customer">
        <div class="section-title">Prepared For</div>
        <div class="customer-name">${customerName || "[Customer Name]"}</div>
      </div>
      <div class="validity">
        <div class="section-title">Valid Until</div>
        <div class="validity-date">${validUntil.toLocaleDateString()}</div>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 50%">Product</th>
          <th style="width: 15%">Unit Price</th>
          <th style="width: 10%">Qty</th>
          <th style="width: 15%">Total</th>
        </tr>
      </thead>
      <tbody>
        ${lineItems
          .map(
            (item) => `
          <tr>
            <td>
              <div class="item-name">${item.name}</div>
              <div class="item-subtitle">${item.subtitle}</div>
              <div class="item-sku">${item.sku}</div>
              <ul class="item-features">
                ${item.features.map((f) => `<li>${f}</li>`).join("")}
              </ul>
            </td>
            <td class="unit-price">$${item.unitPrice.toLocaleString()}</td>
            <td class="quantity">${item.quantity}</td>
            <td class="line-total">$${item.lineTotal.toLocaleString()}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <div class="totals-section">
      <div class="total-row">
        <span class="total-label">Subtotal</span>
        <span class="total-value">$${subtotal.toLocaleString()}</span>
      </div>
      <div class="total-row">
        <span class="total-label">Shipping</span>
        <span class="total-value">TBD</span>
      </div>
      <div class="total-row grand-total">
        <span class="total-label">Quote Total</span>
        <span class="total-value">$${subtotal.toLocaleString()}</span>
      </div>
    </div>

    <div class="terms">
      <h4>Terms & Conditions</h4>
      <ul>
        <li>Quote valid for ${validDays} days from issue date</li>
        <li>Prices in USD, exclusive of applicable taxes</li>
        <li>Standard lead time: 2-4 weeks from order confirmation</li>
        <li>Payment terms: Net 30 for approved accounts</li>
        <li>Warranty: 1 year limited warranty on hardware</li>
      </ul>
    </div>

    <footer class="footer">
      <p>BlueSignal Water Quality Monitoring Solutions</p>
      <p>Questions? Contact your sales representative</p>
    </footer>
  </div>

  <script>
    // Auto-trigger print dialog
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `);

  printWindow.document.close();
};

/**
 * Generate a product specification PDF
 */
export const generateSpecsPDF = (product) => {
  const bomTotal = product.bom.reduce((sum, item) => sum + item.cost, 0);

  const printWindow = window.open("", "_blank", "width=800,height=600");

  printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>${product.name} - Specifications</title>
  <style>
    @page {
      margin: 0.75in;
      size: letter;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #1f2937;
    }

    .container {
      max-width: 7.5in;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 16px;
      border-bottom: 3px solid #3b82f6;
      margin-bottom: 24px;
    }

    .product-title {
      font-size: 24pt;
      font-weight: 700;
      color: #1e40af;
    }

    .product-subtitle {
      font-size: 11pt;
      color: #6b7280;
      margin-top: 4px;
    }

    .price-badge {
      background: #ecfdf5;
      border: 2px solid #059669;
      border-radius: 8px;
      padding: 12px 20px;
      text-align: center;
    }

    .price-label {
      font-size: 9pt;
      color: #059669;
      text-transform: uppercase;
    }

    .price-value {
      font-size: 20pt;
      font-weight: 700;
      color: #059669;
    }

    h2 {
      font-size: 12pt;
      color: #1e40af;
      margin: 20px 0 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e5e7eb;
    }

    .specs-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .spec-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 10px;
    }

    .spec-label {
      font-size: 8pt;
      color: #6b7280;
      text-transform: uppercase;
    }

    .spec-value {
      font-size: 11pt;
      font-weight: 600;
    }

    .features-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
      padding-left: 0;
      list-style: none;
    }

    .features-list li {
      font-size: 9pt;
      padding-left: 16px;
      position: relative;
    }

    .features-list li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #059669;
      font-weight: bold;
    }

    .bom-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
    }

    .bom-table th {
      text-align: left;
      padding: 8px 6px;
      background: #f3f4f6;
      font-size: 8pt;
      text-transform: uppercase;
      border-bottom: 1px solid #e5e7eb;
    }

    .bom-table td {
      padding: 6px;
      border-bottom: 1px solid #f3f4f6;
    }

    .bom-table td:last-child {
      text-align: right;
      font-family: monospace;
    }

    .bom-total {
      background: #eff6ff;
      font-weight: 600;
    }

    .footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 8pt;
      color: #9ca3af;
    }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <div>
        <div class="product-title">${product.name}</div>
        <div class="product-subtitle">${product.subtitle} | SKU: ${product.sku}</div>
      </div>
      <div class="price-badge">
        <div class="price-label">Unit Price</div>
        <div class="price-value">$${product.price.toLocaleString()}</div>
      </div>
    </header>

    <p style="margin-bottom: 16px; font-size: 11pt;"><strong>${product.tagline}</strong></p>

    <h2>Specifications</h2>
    <div class="specs-grid">
      <div class="spec-card">
        <div class="spec-label">Deployment</div>
        <div class="spec-value">${product.deployment}</div>
      </div>
      <div class="spec-card">
        <div class="spec-label">Power</div>
        <div class="spec-value">${product.power.type}${product.solar ? ` (${product.solar.watts}W)` : ""}</div>
      </div>
      <div class="spec-card">
        <div class="spec-label">Sensors</div>
        <div class="spec-value">${product.sensors} parameters</div>
      </div>
      ${
        product.ultrasonic?.enabled
          ? `
      <div class="spec-card">
        <div class="spec-label">Ultrasonic</div>
        <div class="spec-value">${product.ultrasonic.watts}W @ ${product.ultrasonic.frequency}</div>
      </div>`
          : ""
      }
      ${
        product.battery
          ? `
      <div class="spec-card">
        <div class="spec-label">Battery</div>
        <div class="spec-value">${product.battery.voltage}V ${product.battery.capacity}Ah (${product.battery.wh}Wh)</div>
      </div>`
          : ""
      }
      <div class="spec-card">
        <div class="spec-label">Autonomy</div>
        <div class="spec-value">${product.autonomy}</div>
      </div>
      <div class="spec-card">
        <div class="spec-label">Weight</div>
        <div class="spec-value">${product.weight}</div>
      </div>
      <div class="spec-card">
        <div class="spec-label">Enclosure</div>
        <div class="spec-value">${product.enclosure}</div>
      </div>
    </div>

    <h2>Features</h2>
    <ul class="features-list">
      ${product.features.map((f) => `<li>${f}</li>`).join("")}
    </ul>

    <h2>Sensor Suite</h2>
    <ul class="features-list">
      ${product.sensorList.map((s) => `<li>${s}</li>`).join("")}
    </ul>

    <h2>Bill of Materials</h2>
    <table class="bom-table">
      <thead>
        <tr>
          <th>Category</th>
          <th>Item</th>
          <th>Qty</th>
          <th>Cost</th>
        </tr>
      </thead>
      <tbody>
        ${product.bom.map((item) => `
          <tr>
            <td>${item.category}</td>
            <td>${item.item}</td>
            <td>${item.qty}</td>
            <td>$${item.cost.toLocaleString()}</td>
          </tr>
        `).join("")}
        <tr class="bom-total">
          <td colspan="3"><strong>Total BOM Cost</strong></td>
          <td><strong>$${bomTotal.toLocaleString()}</strong></td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      <p>BlueSignal Water Quality Monitoring Solutions</p>
      <p>Generated on ${new Date().toLocaleDateString()} | Specifications subject to change</p>
    </div>
  </div>

  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>
  `);

  printWindow.document.close();
};

export default { generateQuotePDF, generateSpecsPDF };

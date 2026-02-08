/**
 * Pre-Order Capture Module
 *
 * Handles dev kit pre-order reservations from the landing page.
 * Writes to Firestore 'preorders' collection and optionally sends
 * confirmation email via SendGrid.
 */

const admin = require("firebase-admin");

/**
 * POST /preOrderCapture
 * Body: { email, name?, useCase?, quantity, source }
 */
const capturePreOrder = async (req, res) => {
  try {
    const { email, name, useCase, quantity, source } = req.body;

    // Validate required fields
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required" });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Build pre-order document
    const preorder = {
      email: email.toLowerCase().trim(),
      name: name?.trim() || null,
      useCase: useCase || null,
      quantity: quantity || "1",
      source: source || "landing",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    // Write to Firestore
    const db = admin.firestore();
    const docRef = await db.collection("preorders").add(preorder);

    console.log(`Pre-order captured: ${docRef.id} from ${preorder.email}`);

    // Send confirmation email (stub — wire SendGrid when ready)
    try {
      await sendConfirmationEmail(preorder.email, preorder.name);
    } catch (emailError) {
      // Don't fail the request if email fails
      console.error("Failed to send confirmation email:", emailError.message);
    }

    return res.status(200).json({
      success: true,
      id: docRef.id,
    });
  } catch (error) {
    console.error("Pre-order capture error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Send confirmation email via SendGrid
 * Requires SENDGRID_API_KEY secret to be configured.
 */
const sendConfirmationEmail = async (email, name) => {
  // Check if SendGrid is configured
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.log("SENDGRID_API_KEY not configured — skipping confirmation email");
    return;
  }

  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(apiKey);

  const greeting = name ? `Hi ${name},` : "Hi,";

  const msg = {
    to: email,
    from: {
      email: "hello@bluesignal.xyz",
      name: "BlueSignal",
    },
    subject: "Your BlueSignal Dev Kit reservation is confirmed",
    text: `${greeting}\n\nThanks for reserving a BlueSignal WQM-1 Dev Kit. We'll email you when dev kits are ready to ship (target: Q2 2026).\n\nYour reservation is non-binding — no charge until shipment.\n\nQuestions? Reply to this email.\n\n— The BlueSignal Team\nhttps://bluesignal.xyz`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #333;">
        <p style="margin-bottom: 16px;">${greeting}</p>
        <p style="margin-bottom: 16px;">Thanks for reserving a <strong>BlueSignal WQM-1 Dev Kit</strong>. We'll email you when dev kits are ready to ship (target: Q2 2026).</p>
        <p style="margin-bottom: 16px;">Your reservation is non-binding — no charge until shipment.</p>
        <p style="margin-bottom: 16px;">Questions? Reply to this email.</p>
        <p style="margin-top: 32px; color: #666;">— The BlueSignal Team<br><a href="https://bluesignal.xyz" style="color: #2d8cf0;">bluesignal.xyz</a></p>
      </div>
    `,
  };

  await sgMail.send(msg);
  console.log(`Confirmation email sent to ${email}`);
};

module.exports = {
  capturePreOrder,
};

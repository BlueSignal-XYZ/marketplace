/**
 * Account Linking — BlueSignal Cloud ↔ WaterQuality.Trading
 *
 * Since both platforms share the same Firebase project, "OAuth" simplifies
 * to a consent record in the database. The same Firebase Auth user ID
 * is valid on both platforms.
 *
 * POST   /v2/account/link-wqt    — mark user as WQT-linked, store consent
 * DELETE /v2/account/link-wqt    — revoke WQT data sharing
 * GET    /v2/account/link-status — check if WQT linked
 */

const admin = require("firebase-admin");

async function linkWQT(req, res) {
  try {
    const uid = req.user?.uid || req.body.userId;
    if (!uid) return res.status(401).json({ success: false, error: "Auth required" });

    const { device_ids } = req.body;
    const now = new Date().toISOString();

    const db = admin.database();
    await db.ref(`users/${uid}/wqtLink`).set({
      linked: true,
      linkedAt: now,
      consentedDevices: device_ids || [],
      revokedAt: null,
    });

    res.json({ success: true, data: { linked: true, linkedAt: now } });
  } catch (error) {
    console.error("v2/account/link-wqt POST error:", error);
    res.status(500).json({ success: false, error: "Failed to link WQT account" });
  }
}

async function unlinkWQT(req, res) {
  try {
    const uid = req.user?.uid || req.body.userId || req.query.userId;
    if (!uid) return res.status(401).json({ success: false, error: "Auth required" });

    const now = new Date().toISOString();
    const db = admin.database();
    await db.ref(`users/${uid}/wqtLink`).update({
      linked: false,
      revokedAt: now,
      consentedDevices: [],
    });

    res.json({ success: true });
  } catch (error) {
    console.error("v2/account/link-wqt DELETE error:", error);
    res.status(500).json({ success: false, error: "Failed to unlink WQT account" });
  }
}

async function getLinkStatus(req, res) {
  try {
    const uid = req.user?.uid || req.query.userId;
    if (!uid) return res.status(401).json({ success: false, error: "Auth required" });

    const db = admin.database();
    const snap = await db.ref(`users/${uid}/wqtLink`).once("value");
    const link = snap.val() || { linked: false, consentedDevices: [] };

    res.json({ success: true, data: link });
  } catch (error) {
    console.error("v2/account/link-status error:", error);
    res.status(500).json({ success: false, error: "Failed to check link status" });
  }
}

module.exports = { linkWQT, unlinkWQT, getLinkStatus };

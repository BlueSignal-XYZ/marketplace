/**
 * v2 Blockchain Endpoints
 * POST /v2/blockchain/mint   — Mint ERC-1155 credit certificate
 * POST /v2/wallet/link       — Link wallet address to user account
 * GET  /v2/blockchain/certificate/:id — Get certificate details
 */

const admin = require("firebase-admin");

async function mintCertificate(req, res) {
  try {
    const { transactionId, buyerUid, walletAddress } = req.body;

    if (!transactionId || !buyerUid) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    const db = admin.database();
    const txSnap = await db
      .ref(`marketplace/transactions/${transactionId}`)
      .once("value");
    const tx = txSnap.val();

    if (!tx) {
      return res
        .status(404)
        .json({ success: false, error: "Transaction not found" });
    }

    // In production: call ERC-1155 contract via ethers.js
    // For now, record the mint request and return placeholder
    const certRef = db.ref("marketplace/certificates").push();
    const certificate = {
      id: certRef.key,
      transactionId,
      buyerUid,
      walletAddress: walletAddress || "",
      tokenId: Math.floor(Math.random() * 100000),
      contractAddress: "0x0000000000000000000000000000000000000000", // Placeholder
      network: "polygon-amoy",
      status: "minted",
      mintedAt: admin.database.ServerValue.TIMESTAMP,
      metadata: {
        nutrientType: tx.nutrientType || "nitrogen",
        quantity: tx.quantity,
        region: tx.region || "",
      },
    };
    await certRef.set(certificate);

    // Update transaction with certificate info
    await db
      .ref(`marketplace/transactions/${transactionId}`)
      .update({
        status: "completed",
        certificateId: certRef.key,
        tokenId: certificate.tokenId,
      });

    res.json({
      success: true,
      data: {
        certificateId: certRef.key,
        tokenId: certificate.tokenId,
        status: "minted",
      },
    });
  } catch (error) {
    console.error("v2/blockchain/mint error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to mint certificate" });
  }
}

async function linkWallet(req, res) {
  try {
    const { uid, walletAddress, signature } = req.body;

    if (!uid || !walletAddress) {
      return res
        .status(400)
        .json({ success: false, error: "Missing uid or walletAddress" });
    }

    // TODO: Verify signature to prove wallet ownership
    const db = admin.database();
    await db.ref(`users/${uid}/wallet`).set({
      address: walletAddress,
      linkedAt: admin.database.ServerValue.TIMESTAMP,
      verified: !!signature,
    });

    res.json({
      success: true,
      data: { walletAddress, linked: true },
    });
  } catch (error) {
    console.error("v2/wallet/link error:", error);
    res.status(500).json({ success: false, error: "Failed to link wallet" });
  }
}

async function getCertificate(req, res) {
  try {
    const { id } = req.params;
    const db = admin.database();
    const snap = await db
      .ref(`marketplace/certificates/${id}`)
      .once("value");
    const cert = snap.val();

    if (!cert) {
      return res
        .status(404)
        .json({ success: false, error: "Certificate not found" });
    }

    res.json({ success: true, data: { id, ...cert } });
  } catch (error) {
    console.error("v2/blockchain/certificate error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch certificate" });
  }
}

module.exports = { mintCertificate, linkWallet, getCertificate };

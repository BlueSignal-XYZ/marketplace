/**
 * v2 Blockchain Endpoints — aligned with src/services/types/blockchain.ts
 * POST /v2/blockchain/mint             — MintRequest → MintResult
 * POST /v2/wallet/link                 — LinkWalletRequest → LinkWalletResult
 * GET  /v2/blockchain/certificate/:id  — → Certificate
 */

const admin = require("firebase-admin");

async function mintCertificate(req, res) {
  try {
    // MintRequest shape: { creditId, recipientAddress, metadata }
    const { creditId, recipientAddress, metadata } = req.body;

    if (!creditId || !recipientAddress) {
      return res.status(400).json({ success: false, error: "Missing creditId or recipientAddress" });
    }

    const db = admin.database();

    // In production: call ERC-1155 contract via ethers.js
    // For now, record mint and return placeholder on-chain data
    const tokenId = String(Math.floor(Math.random() * 100000));
    const contractAddress = "0x0000000000000000000000000000000000000000";
    const transactionHash = "0x" + [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
    const blockNumber = Math.floor(Math.random() * 50000000);
    const metadataUri = "";

    const certRef = db.ref("marketplace/certificates").push();
    const now = new Date().toISOString();
    const certificate = {
      id: certRef.key,
      creditId,
      recipientAddress,
      tokenId,
      contractAddress,
      transactionHash,
      blockNumber,
      network: "polygon-amoy",
      status: "confirmed",
      mintedAt: now,
      metadataUri,
      metadata: metadata || null,
    };
    await certRef.set(certificate);

    // MintResult shape
    res.json({
      success: true,
      data: {
        tokenId,
        contractAddress,
        transactionHash,
        blockNumber,
        status: "confirmed",
        metadataUri,
      },
    });
  } catch (error) {
    console.error("v2/blockchain/mint error:", error);
    res.status(500).json({ success: false, error: "Failed to mint certificate" });
  }
}

async function linkWallet(req, res) {
  try {
    // LinkWalletRequest shape: { userId, walletAddress, signature, message }
    const { userId, walletAddress, signature, message } = req.body;

    if (!userId || !walletAddress) {
      return res.status(400).json({ success: false, error: "Missing userId or walletAddress" });
    }

    // TODO: Verify signature proves wallet ownership
    const db = admin.database();
    const now = new Date().toISOString();
    await db.ref(`users/${userId}/wallet`).set({
      address: walletAddress,
      linkedAt: now,
      verified: !!(signature && message),
    });

    // LinkWalletResult shape
    res.json({
      success: true,
      data: {
        success: true,
        userId,
        walletAddress,
        linkedAt: now,
      },
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
    const snap = await db.ref(`marketplace/certificates/${id}`).once("value");
    const cert = snap.val();

    if (!cert) {
      return res.status(404).json({ success: false, error: "Certificate not found" });
    }

    // Certificate shape — fill what we can from DB, placeholder for rest
    const network = cert.network || "polygon-amoy";
    const explorerBase = network === "polygon" ? "https://polygonscan.com" : "https://amoy.polygonscan.com";

    res.json({
      success: true,
      data: {
        id,
        creditId: cert.creditId || "",
        tokenId: cert.tokenId || "",
        contractAddress: cert.contractAddress || "",
        transactionHash: cert.transactionHash || "",
        blockNumber: cert.blockNumber || 0,
        mintedAt: cert.mintedAt || "",
        network,
        explorerUrl: cert.transactionHash ? `${explorerBase}/tx/${cert.transactionHash}` : "",
        metadataUri: cert.metadataUri || "",
        credit: cert.credit || {
          nutrientType: cert.metadata?.nutrientType || "nitrogen",
          quantity: cert.metadata?.quantity || 0,
          region: cert.metadata?.region || "",
          vintage: cert.metadata?.vintage || "",
          verificationLevel: cert.metadata?.verificationLevel || "self-reported",
          status: "active",
        },
        owner: cert.owner || {
          address: cert.recipientAddress || "",
          displayName: undefined,
        },
        retirement: cert.retirement || undefined,
        qrCodeData: `${explorerBase}/token/${cert.contractAddress}?a=${cert.tokenId}#inventory`,
      },
    });
  } catch (error) {
    console.error("v2/blockchain/certificate error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch certificate" });
  }
}

module.exports = { mintCertificate, linkWallet, getCertificate };

/**
 * BlueSignal Authentication Cloud Functions
 * Handles user creation, deletion, and profile management
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

/**
 * Create user profile on Firebase Auth user creation
 */
const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const db = admin.database();
  const uid = user.uid;

  console.log(`Creating profile for new user: ${uid}`);

  const userProfile = {
    profile: {
      email: user.email || "",
      displayName: user.displayName || "",
      phone: user.phoneNumber || "",
      company: "",
      role: "buyer", // Default role
      createdAt: Date.now(),
      updatedAt: Date.now(),
      onboardingComplete: false,
    },
    settings: {
      notifications: { email: true, sms: false, push: true },
      timezone: "America/New_York",
      units: "imperial",
    },
    wallets: {
      polygon: { address: "", linked: false },
      stripe: { customerId: "", defaultPaymentMethod: "" },
    },
  };

  try {
    await db.ref(`users/${uid}`).set(userProfile);
    console.log(`Profile created for user: ${uid}`);

    // Log activity
    await db.ref(`users/${uid}/activity`).push({
      type: "account_created",
      timestamp: Date.now(),
      metadata: { source: "firebase_auth" },
    });

    return { success: true, uid };
  } catch (error) {
    console.error(`Failed to create profile for ${uid}:`, error);
    throw new functions.https.HttpsError("internal", "Failed to create user profile");
  }
});

/**
 * Cleanup user data on Firebase Auth user deletion
 */
const onUserDelete = functions.auth.user().onDelete(async (user) => {
  const db = admin.database();
  const uid = user.uid;

  console.log(`Cleaning up data for deleted user: ${uid}`);

  try {
    // Get user's owned devices
    const devicesSnapshot = await db.ref("devices")
      .orderByChild("ownership/ownerId")
      .equalTo(uid)
      .once("value");

    const devices = devicesSnapshot.val() || {};

    // Decommission owned devices
    const updates = {};
    Object.keys(devices).forEach((deviceId) => {
      updates[`devices/${deviceId}/installation/status`] = "decommissioned";
      updates[`devices/${deviceId}/ownership/ownerId`] = null;
    });

    // Remove user profile
    updates[`users/${uid}`] = null;

    await db.ref().update(updates);
    console.log(`Data cleaned up for user: ${uid}`);

    return { success: true };
  } catch (error) {
    console.error(`Failed to cleanup data for ${uid}:`, error);
    // Don't throw - we don't want to block user deletion
    return { success: false, error: error.message };
  }
});

/**
 * Update user profile
 */
const updateUserProfile = async (req, res) => {
  const { uid, profileData } = req.body;

  if (!uid || !profileData) {
    return res.status(400).json({ error: "Missing uid or profileData" });
  }

  // Verify the request is from the user themselves (via auth header)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (decodedToken.uid !== uid) {
      return res.status(403).json({ error: "Forbidden - can only update own profile" });
    }
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const db = admin.database();

  // Only allow updating specific fields
  const allowedFields = ["displayName", "phone", "company", "timezone", "units"];
  const filteredData = {};
  Object.keys(profileData).forEach((key) => {
    if (allowedFields.includes(key)) {
      if (key === "timezone" || key === "units") {
        filteredData[`settings/${key}`] = profileData[key];
      } else {
        filteredData[`profile/${key}`] = profileData[key];
      }
    }
  });

  filteredData["profile/updatedAt"] = Date.now();

  try {
    await db.ref(`users/${uid}`).update(filteredData);
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to update profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

/**
 * Get user profile
 */
const getUserProfile = async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "Missing uid" });
  }

  const db = admin.database();

  try {
    const snapshot = await db.ref(`users/${uid}`).once("value");
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = snapshot.val();
    // Don't expose sensitive wallet data
    delete userData.wallets?.stripe?.customerId;

    res.json(userData);
  } catch (error) {
    console.error("Failed to get profile:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
};

/**
 * Update user role (admin only)
 */
const updateUserRole = async (req, res) => {
  const { targetUid, role } = req.body;

  if (!targetUid || !role) {
    return res.status(400).json({ error: "Missing targetUid or role" });
  }

  const validRoles = ["buyer", "seller", "installer", "admin"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  // Verify admin authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const db = admin.database();

    // Check if requester is admin
    const requesterSnapshot = await db.ref(`users/${decodedToken.uid}/profile/role`).once("value");
    if (requesterSnapshot.val() !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Update target user's role
    await db.ref(`users/${targetUid}/profile`).update({
      role,
      updatedAt: Date.now(),
    });

    // Set custom claims for role-based access
    await admin.auth().setCustomUserClaims(targetUid, { role });

    res.json({ success: true, role });
  } catch (error) {
    console.error("Failed to update role:", error);
    res.status(500).json({ error: "Failed to update role" });
  }
};

/**
 * Complete user onboarding
 */
const completeOnboarding = async (req, res) => {
  const { uid, onboardingData } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "Missing uid" });
  }

  // Verify the request is from the user themselves
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (decodedToken.uid !== uid) {
      return res.status(403).json({ error: "Forbidden" });
    }
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const db = admin.database();

  try {
    const updates = {
      "profile/onboardingComplete": true,
      "profile/updatedAt": Date.now(),
    };

    if (onboardingData) {
      if (onboardingData.company) updates["profile/company"] = onboardingData.company;
      if (onboardingData.phone) updates["profile/phone"] = onboardingData.phone;
      if (onboardingData.timezone) updates["settings/timezone"] = onboardingData.timezone;
    }

    await db.ref(`users/${uid}`).update(updates);

    // Log activity
    await db.ref(`users/${uid}/activity`).push({
      type: "onboarding_complete",
      timestamp: Date.now(),
      metadata: {},
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to complete onboarding:", error);
    res.status(500).json({ error: "Failed to complete onboarding" });
  }
};

module.exports = {
  onUserCreate,
  onUserDelete,
  updateUserProfile,
  getUserProfile,
  updateUserRole,
  completeOnboarding,
};

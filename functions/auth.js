/**
 * BlueSignal Authentication Cloud Functions
 * Handles user creation, deletion, and profile management
 */

const functions = require("firebase-functions/v1");
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

  // Whitelists. Role is intentionally omitted from self-update — role changes
  // must go through updateUserRole (admin-only). Email is owned by Firebase Auth.
  const allowedProfileScalars = [
    "displayName",
    "phone",
    "company",
    "bio",
    "username",
    "photoURL",
    "onboardingComplete",
  ];
  const allowedProfileObjects = ["address", "privacy"];
  const allowedSettingsScalars = ["timezone", "units"];
  const allowedSettingsObjects = ["notifications"];

  const allAllowed = new Set([
    ...allowedProfileScalars,
    ...allowedProfileObjects,
    ...allowedSettingsScalars,
    ...allowedSettingsObjects,
  ]);

  // Reject unknown fields up front so callers discover silent-drop bugs.
  const unknownFields = Object.keys(profileData).filter((k) => !allAllowed.has(k));
  if (unknownFields.length > 0) {
    return res.status(400).json({
      error: `Unknown profile fields: ${unknownFields.join(", ")}`,
      allowed: Array.from(allAllowed),
    });
  }

  // Validation — mirrors database.rules.json constraints so callers get a
  // meaningful 400 instead of a generic RTDB permission-denied 500.
  const validationErrors = [];
  const checkStrLen = (key, val, max) => {
    if (val !== undefined && val !== null && typeof val === "string" && val.length > max) {
      validationErrors.push(`${key} exceeds ${max} characters`);
    }
  };
  checkStrLen("displayName", profileData.displayName, 100);
  checkStrLen("phone", profileData.phone, 20);
  checkStrLen("company", profileData.company, 200);
  checkStrLen("bio", profileData.bio, 1000);
  checkStrLen("username", profileData.username, 50);
  checkStrLen("photoURL", profileData.photoURL, 2048);

  if (profileData.username !== undefined && profileData.username !== null) {
    if (!/^[a-z0-9_-]{3,50}$/.test(profileData.username)) {
      validationErrors.push("username must be 3-50 chars of [a-z0-9_-]");
    }
  }
  if (profileData.privacy && typeof profileData.privacy === "object") {
    // Privacy sub-fields: profileVisibility is a string, the others are
    // booleans in the current UI. A formal enum for profileVisibility is
    // tracked as a follow-up item.
    const { profileVisibility, activityStatus, transactionPrivacy, dataUploadPrivacy } =
      profileData.privacy;
    if (profileVisibility !== undefined && typeof profileVisibility !== "string") {
      validationErrors.push("privacy.profileVisibility must be a string");
    }
    if (profileVisibility !== undefined && typeof profileVisibility === "string" && profileVisibility.length > 50) {
      validationErrors.push("privacy.profileVisibility exceeds 50 characters");
    }
    [
      ["activityStatus", activityStatus],
      ["transactionPrivacy", transactionPrivacy],
      ["dataUploadPrivacy", dataUploadPrivacy],
    ].forEach(([name, v]) => {
      if (v !== undefined && v !== null && typeof v !== "boolean") {
        validationErrors.push(`privacy.${name} must be boolean`);
      }
    });
  }
  if (profileData.notifications && typeof profileData.notifications === "object") {
    ["email", "sms", "push"].forEach((k) => {
      if (
        profileData.notifications[k] !== undefined &&
        typeof profileData.notifications[k] !== "boolean"
      ) {
        validationErrors.push(`notifications.${k} must be boolean`);
      }
    });
  }
  if (profileData.onboardingComplete !== undefined && typeof profileData.onboardingComplete !== "boolean") {
    validationErrors.push("onboardingComplete must be boolean");
  }
  if (validationErrors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: validationErrors });
  }

  // Build the RTDB multi-path update. Nested objects are flattened to
  // per-sub-field paths so partial updates don't clobber unprovided keys.
  const filteredData = {};
  allowedProfileScalars.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(profileData, key)) {
      filteredData[`profile/${key}`] = profileData[key];
    }
  });
  allowedSettingsScalars.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(profileData, key)) {
      filteredData[`settings/${key}`] = profileData[key];
    }
  });
  allowedProfileObjects.forEach((key) => {
    const obj = profileData[key];
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      Object.keys(obj).forEach((subKey) => {
        filteredData[`profile/${key}/${subKey}`] = obj[subKey];
      });
    }
  });
  allowedSettingsObjects.forEach((key) => {
    const obj = profileData[key];
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      Object.keys(obj).forEach((subKey) => {
        filteredData[`settings/${key}/${subKey}`] = obj[subKey];
      });
    }
  });

  filteredData["profile/updatedAt"] = Date.now();

  try {
    await db.ref(`users/${uid}`).update(filteredData);
    res.json({ success: true, updatedFields: Object.keys(filteredData) });
  } catch (error) {
    console.error("Failed to update profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

/**
 * Get user profile
 *
 * Returns a FLAT user object so frontend consumers can access fields
 * directly (e.g. data.role, data.company) without navigating nested
 * paths.  The RTDB stores data under users/{uid}/profile/* and
 * users/{uid}/settings/*, but this endpoint merges them into one
 * top-level object for convenience.
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

    // Flatten: spread profile fields to top level so the frontend can
    // read data.role, data.displayName, etc. directly.
    const response = {
      uid,
      ...(userData.profile || {}),
      settings: userData.settings || {},
      // Expose non-sensitive wallet data only
      wallets: userData.wallets
        ? {
            polygon: userData.wallets.polygon || {},
            stripe: {
              defaultPaymentMethod:
                userData.wallets.stripe?.defaultPaymentMethod || "",
            },
          }
        : {},
    };

    res.json(response);
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
      // Accept profile fields collected during the onboarding form.
      // Role is accepted here (but NOT in updateUserProfile) because role
      // is set exactly once during onboarding; subsequent changes must go
      // through updateUserRole (admin-only).
      if (onboardingData.displayName) updates["profile/displayName"] = onboardingData.displayName;
      if (onboardingData.company !== undefined) updates["profile/company"] = onboardingData.company;
      if (onboardingData.phone !== undefined) updates["profile/phone"] = onboardingData.phone;
      if (onboardingData.bio !== undefined) updates["profile/bio"] = onboardingData.bio;
      if (onboardingData.timezone) updates["settings/timezone"] = onboardingData.timezone;

      if (onboardingData.role) {
        // Exclude admin — admin role can only be set via seedAdmin or updateUserRole.
        const validSelfRoles = /^(buyer|seller|installer)$/;
        if (!validSelfRoles.test(String(onboardingData.role))) {
          return res.status(400).json({
            error: "role must be one of buyer|seller|installer (admin cannot be self-assigned)",
          });
        }
        // Additionally: if the user is already admin, refuse to downgrade via onboarding.
        const currentRoleSnap = await db.ref(`users/${uid}/profile/role`).once("value");
        if (currentRoleSnap.val() === "admin") {
          return res.status(403).json({ error: "Cannot change admin role via onboarding" });
        }
        updates["profile/role"] = onboardingData.role;
      }
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

/**
 * Seed the first admin user.
 *
 * This is a ONE-TIME bootstrap endpoint protected by a deploy-time
 * secret (ADMIN_SEED_SECRET environment variable or Firebase Functions
 * config admin.seed_secret).  It refuses to run if any admin already
 * exists in the system, preventing misuse after initial setup.
 *
 * Usage:
 *   curl -X POST "$SERVER_URL/admin/seed" \
 *     -H "Content-Type: application/json" \
 *     -d '{"uid":"<firebase-uid>","seedSecret":"<secret>"}'
 */
const seedAdmin = async (req, res) => {
  const { uid, seedSecret } = req.body;

  // 1. Verify seed secret
  const expectedSecret =
    process.env.ADMIN_SEED_SECRET ||
    (functions.config().admin && functions.config().admin.seed_secret);

  if (!expectedSecret || seedSecret !== expectedSecret) {
    return res.status(403).json({ error: "Invalid seed secret" });
  }

  if (!uid) {
    return res.status(400).json({ error: "Missing uid" });
  }

  const db = admin.database();

  try {
    // 2. Ensure no admin already exists
    const usersSnapshot = await db.ref("users").once("value");
    const users = usersSnapshot.val() || {};
    const existingAdmin = Object.entries(users).find(
      ([, u]) => u.profile?.role === "admin"
    );
    if (existingAdmin) {
      return res
        .status(409)
        .json({ error: "An admin user already exists. Seed aborted." });
    }

    // 3. Verify the target uid exists in Firebase Auth
    try {
      await admin.auth().getUser(uid);
    } catch (authErr) {
      return res
        .status(404)
        .json({ error: `No Firebase Auth user found for uid: ${uid}` });
    }

    // 4. Promote user to admin in RTDB + custom claims
    await db.ref(`users/${uid}/profile`).update({
      role: "admin",
      updatedAt: Date.now(),
    });
    await admin.auth().setCustomUserClaims(uid, { role: "admin" });

    // 5. Log activity
    await db.ref(`users/${uid}/activity`).push({
      type: "admin_seed",
      timestamp: Date.now(),
      metadata: { source: "seed_endpoint" },
    });

    console.log(`Admin seeded successfully for uid: ${uid}`);
    res.json({ success: true, message: `User ${uid} promoted to admin` });
  } catch (error) {
    console.error("Failed to seed admin:", error);
    res.status(500).json({ error: "Failed to seed admin" });
  }
};

module.exports = {
  onUserCreate,
  onUserDelete,
  updateUserProfile,
  getUserProfile,
  updateUserRole,
  completeOnboarding,
  seedAdmin,
};

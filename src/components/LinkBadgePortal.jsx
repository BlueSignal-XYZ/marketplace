import React from "react";

export default function LinkBadgePortal() {
  // This debug badge is hidden in production to avoid confusing end users.
  // It polls a local /api/v1/devices endpoint that doesn't exist in Firebase Hosting.
  if (import.meta.env.PROD) return null;

  return null;
}

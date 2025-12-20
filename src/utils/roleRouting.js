/**
 * Role-based routing utilities
 * Centralizes default landing routes and access control.
 *
 * Supports both:
 *  - Cloud (BlueSignal Monitoring Console)
 *  - Marketplace (WaterQuality.Trading)
 *
 * Safe for fallback use (handles missing roles, missing claims, etc.)
 */

/**
 * Extract a normalized role from Firebase user object.
 * SECURITY: Role must come from server - no client-side defaults
 */
const getUserRole = (user) => {
  if (!user) return null;

  // SECURITY: Only use roles explicitly set by the server
  // Do not default to any role if none is set
  return (
    user.role ||                     // explicit role on user object
    user?.claims?.role ||            // Firebase custom claim
    user?.roleId ||                  // alternate field
    null                             // No default - server must set role
  );
};

/**
 * Default dashboard routing for each platform mode.
 *
 * @param {Object} user - Firebase user with role/claims
 * @param {string} mode - 'cloud' | 'marketplace'
 * @returns {string} - route path
 */
export const getDefaultDashboardRoute = (user, mode = "marketplace") => {
  if (!user) return "/";

  const role = getUserRole(user);

  /* ----------------------------- CLOUD MODE ----------------------------- */
  if (mode === "cloud") {
    // ALL authenticated users go to /dashboard/main in Cloud mode
    // No role-based routing for Cloud (simplified for production)
    return "/dashboard/main";
  }

  /* -------------------------- MARKETPLACE MODE -------------------------- */
  if (mode === "marketplace") {
    // SECURITY: If no role is set, go to public marketplace
    if (!role) return "/marketplace";

    if (role === "buyer") return "/dashboard/buyer";
    if (role === "seller") return "/dashboard/seller";
    if (role === "farmer") return "/dashboard/seller";
    if (role === "installer") return "/dashboard/installer";
    if (role === "operator" || role === "admin") return "/marketplace";

    return "/marketplace";
  }

  /* ----------------------------- DEFAULT FALLBACK ----------------------------- */
  return "/";
};

/**
 * Determine if a user has access to a given route.
 *
 * @param {Object} user - Firebase user
 * @param {string} route - path being requested
 * @returns {boolean}
 */
export const hasRouteAccess = (user, route) => {
  if (!user) return false;

  const role = getUserRole(user);

  // Admin bypass
  if (role === "admin") return true;

  // Public areas
  const publicRoutes = [
    "/marketplace",
    "/registry",
    "/map",
    "/presale",
    "/recent-removals",
  ];
  if (publicRoutes.some((r) => route.startsWith(r))) return true;

  // Cloud routes: all authenticated users have access
  if (route.startsWith("/dashboard/main")) return true;
  if (route.startsWith("/cloud/")) return true;
  if (route.startsWith("/features/")) return true;

  // Buyer-specific
  if (route.startsWith("/dashboard/buyer") && role === "buyer") return true;

  // Seller/Farmer
  if (
    route.startsWith("/dashboard/seller") &&
    (role === "seller" || role === "farmer")
  )
    return true;

  // Installer
  if (route.startsWith("/dashboard/installer") && role === "installer")
    return true;

  // Marketplace Seller Tools
  if (
    route.startsWith("/marketplace/seller-dashboard") &&
    (role === "seller" || role === "farmer")
  )
    return true;

  return false;
};

/**
 * Human-readable role names
 */
export const getRoleDisplayName = (role) => {
  const roleNames = {
    buyer: "Credit Buyer",
    seller: "Credit Seller",
    installer: "Device Installer",
    farmer: "Farm Operator",
    operator: "Facility Operator",
    admin: "Administrator",
  };

  return roleNames[role] || "User";
};

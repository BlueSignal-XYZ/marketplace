/**
 * Role-based routing utilities
 * Determines which dashboard/route to show based on user role
 */

/**
 * Get default dashboard route for a user based on their role
 * @param {Object} user - User object with role property
 * @param {string} mode - 'cloud' or 'marketplace'
 * @returns {string} - Route path
 */
export const getDefaultDashboardRoute = (user, mode = 'marketplace') => {
  if (!user) return '/';

  const role = user.role || 'buyer'; // Default to buyer if no role

  // Cloud mode (BlueSignal) - installers and operators primarily
  if (mode === 'cloud') {
    if (role === 'installer') return '/dashboard/installer';
    if (role === 'operator' || role === 'admin') return '/dashboard/main';
    // Fallback
    return '/dashboard/main';
  }

  // Marketplace mode (WaterQuality.Trading) - buyers and sellers
  if (mode === 'marketplace') {
    if (role === 'buyer') return '/dashboard/buyer';
    if (role === 'seller' || role === 'farmer') return '/dashboard/seller';
    if (role === 'installer') return '/dashboard/installer';
    if (role === 'admin' || role === 'operator') return '/marketplace';
    // Default
    return '/marketplace';
  }

  return '/';
};

/**
 * Determine if a user has access to a specific route
 * @param {Object} user - User object
 * @param {string} route - Route path
 * @returns {boolean}
 */
export const hasRouteAccess = (user, route) => {
  if (!user) return false;

  const role = user.role || 'buyer';

  // Admin has access to everything
  if (role === 'admin') return true;

  // Public routes
  const publicRoutes = ['/marketplace', '/registry', '/map', '/presale', '/recent-removals'];
  if (publicRoutes.some((r) => route.startsWith(r))) return true;

  // Role-specific dashboard routes
  if (route.startsWith('/dashboard/buyer') && role === 'buyer') return true;
  if (route.startsWith('/dashboard/seller') && (role === 'seller' || role === 'farmer'))
    return true;
  if (route.startsWith('/dashboard/installer') && role === 'installer') return true;
  if (route.startsWith('/dashboard/main') && (role === 'operator' || role === 'admin'))
    return true;

  // Marketplace seller tools
  if (route.startsWith('/marketplace/seller-dashboard') && (role === 'seller' || role === 'farmer'))
    return true;

  return false;
};

/**
 * Get user-friendly role display name
 * @param {string} role - User role
 * @returns {string}
 */
export const getRoleDisplayName = (role) => {
  const roleNames = {
    buyer: 'Credit Buyer',
    seller: 'Credit Seller',
    installer: 'Device Installer',
    farmer: 'Farm Operator',
    operator: 'Facility Operator',
    admin: 'Administrator',
  };

  return roleNames[role] || 'User';
};

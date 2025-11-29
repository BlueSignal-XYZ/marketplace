// User roles in the WaterQuality.Trading / BlueSignal ecosystem
export type UserRole =
  | 'buyer'       // Purchases credits/offsets
  | 'seller'      // Lists and sells credits
  | 'installer'   // BlueSignal hardware tech, installs devices
  | 'farmer'      // Farm operator (seller + installer use case)
  | 'admin'       // Platform administrator
  | 'operator';   // Facility operator

export interface User {
  uid: string;
  email: string;
  username?: string;
  role?: UserRole;
  displayName?: string;
  accountID?: string;
  createdAt?: string;
  // Buyer-specific
  budget?: number;
  purchaseHistory?: string[];
  // Seller-specific
  listings?: string[];
  revenue?: number;
  // Installer-specific
  devices?: string[];
  sites?: string[];
  // Permissions
  isVerified?: boolean;
  isBlacklisted?: boolean;
}

export interface UserContextData {
  user: User | null;
  isLoading: boolean;
  updateUser: (uid: string, userdata?: Partial<User>) => Promise<boolean | null>;
}

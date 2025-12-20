// SECURITY: RPC URLs should use environment variables or backend proxy
// Never expose API keys in client-side code
const getEnvVar = (key, fallback = '') => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || fallback;
  }
  return fallback;
};

export default {
  server_url: getEnvVar('VITE_SERVER_URL', "https://us-central1-app-neptunechain.cloudfunctions.net/app"),
  blockchain: {
    MODE: getEnvVar('VITE_BLOCKCHAIN_MODE', "test"),
    NETWORKS: {
      testnet: {
        token: "MATIC",
        chainId: "80002",
        explorer: "https://amoy.polygonscan.com",
        // RPC should be proxied through backend or use public endpoint
        rpc: getEnvVar('VITE_POLYGON_TESTNET_RPC', "https://rpc-amoy.polygon.technology"),
      },
      mainnet: {
        token: "MATIC",
        chainId: "137",
        explorer: "https://polygonscan.com",
        // RPC should be proxied through backend or use public endpoint
        rpc: getEnvVar('VITE_POLYGON_MAINNET_RPC', "https://polygon-rpc.com"),
      },
    },
  },
};

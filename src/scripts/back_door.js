import axios from "axios";
import configs from "../../configs";

// Lightweight process polyfill for browser
if (typeof window !== "undefined" && typeof window.process === "undefined") {
  window.process = {
    env: {
      NODE_ENV: "production",
    },
  };
}

/*************************ACCOUNT_ENDPOINTS************************************* */
const createAccount = async (userdata) =>
  (await axios.post(`${configs.server_url}/account/create`, userdata))?.data;

const registerAccount = async (accountID, role, txAddress) =>
  (
    await axios.post(`${configs.server_url}/account/register`, {
      accountID,
      role,
      txAddress,
    })
  )?.data;

const verifyAccountRole = async (accountID, role) =>
  (
    await axios.post(`${configs.server_url}/account/verifyRole`, {
      accountID,
      role,
    })
  )?.data;

const verifyAccountIsRegistered = async (accountID) =>
  (
    await axios.post(`${configs.server_url}/account/isRegistered`, {
      accountID,
    })
  )?.data;

const verifyAccountIsNotBlacklisted = async (accountID) =>
  (
    await axios.post(`${configs.server_url}/account/isNotBlacklisted`, {
      accountID,
    })
  )?.data;

const getAccountData = async (accountID) =>
  (await axios.post(`${configs.server_url}/account/data`, { accountID }))?.data;

const AccountAPI = {
  create: createAccount,
  register: registerAccount,
  verify: {
    role: verifyAccountRole,
    isRegistered: verifyAccountIsRegistered,
    isNotBlacklisted: verifyAccountIsNotBlacklisted,
  },
  data: getAccountData,
};

/*************************USER_DATABASE_ENDPOINTS************************************* */

const getUserFromUID = async (uid) =>
  (
    await axios.post(`${configs.server_url}/db/user/get/from/uid`, {
      userUID: uid,
    })
  )?.data;

const getUserFromUsername = async (username) =>
  (
    await axios.post(`${configs.server_url}/db/user/get/from/username`, {
      username,
    })
  )?.data;

const getUIDFromUsername = async (username) =>
  (
    await axios.post(`${configs.server_url}/db/user/get/uid/from/username`, {
      username,
    })
  )?.data;

/** USER_MEDIA */
const getUserMedia = async (userUID) =>
  (
    await axios.post(`${configs.server_url}/db/user/get/media`, {
      userUID,
    })
  )?.data;

const getUserStreams = async (userUID) =>
  (
    await axios.post(`${configs.server_url}/db/user/get/streams`, {
      userUID,
    })
  )?.data;

/** USER_ASSETS */
const getUserAssets = async (userUID) =>
  (
    await axios.post(`${configs.server_url}/db/user/get/assets`, {
      userUID,
    })
  )?.data;

const getUserAssetDisputes = async (userUID) =>
  (
    await axios.post(`${configs.server_url}/db/user/get/asset/disputes`, {
      userUID,
    })
  )?.data;

const getUserAssetApprovals = async (userUID) =>
  (
    await axios.post(`${configs.server_url}/db/user/get/asset/approvals`, {
      userUID,
    })
  )?.data;

const UserAPI = {
  account: {
    getUserFromUID,
    getUserFromUsername,
    getUIDFromUsername,
  },
  media: {
    getUserMedia,
    getUserStreams,
  },
  assets: {
    getUserAssets,
    getUserAssetDisputes,
    getUserAssetApprovals,
  },
};

/*************************MEDIA_ENDPOINTS************************************* */

const getMedia = async (assetID) => {
  try {
    const response = await axios.post(`${configs.server_url}/db/media/get`, {
      assetID,
    });
    return response?.data;
  } catch (error) {
    console.error("Error fetching media:", error);
    throw error;
  }
};

const getMediaStream = async (streamID) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/db/media/get/stream`,
      { streamID }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching media stream:", error);
    throw error;
  }
};

const createMedia = async (newAssetPayload, userUID) => {
  try {
    const response = await axios.post(`${configs.server_url}/db/media/create`, {
      newAssetPayload,
      userUID,
    });
    return response?.data;
  } catch (error) {
    console.error("Error creating media:", error);
    throw error;
  }
};

const createMediaStream = async (userUID, streamData) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/db/media/create/stream`,
      { userUID, streamData }
    );
    return response?.data;
  } catch (error) {
    console.error("Error creating media stream:", error);
    throw error;
  }
};

const MediaAPI = {
  getMedia,
  getStream: getMediaStream,
  createMedia,
  createStream: createMediaStream,
};

/*************************ASSET_ENDPOINTS************************************* */
const addAssetMetadata = async (assetID, metadata) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/db/asset/create/metadata`,
      { assetID, metadata }
    );
    return response?.data;
  } catch (error) {
    console.error("Error adding asset metadata:", error);
    throw error;
  }
};

const submitAsset = async (userUID, assetID) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/db/asset/create/submit`,
      { userUID, assetID }
    );
    return response?.data;
  } catch (error) {
    console.error("Error submitting asset:", error);
    throw error;
  }
};

const disputeAsset = async (userUID, assetID, reason) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/db/asset/create/dispute`,
      { userUID, assetID, reason }
    );
    return response?.data;
  } catch (error) {
    console.error("Error disputing asset:", error);
    throw error;
  }
};

const closeAssetDispute = async (userUID, disputeID, solution, status) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/db/asset/create/dispute/close`,
      { userUID, disputeID, solution, status }
    );
    return response?.data;
  } catch (error) {
    console.error("Error closing asset dispute:", error);
    throw error;
  }
};

const approveAsset = async (userUID, assetID, params) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/db/asset/create/approve`,
      { userUID, assetID, params }
    );
    return response?.data;
  } catch (error) {
    console.error("Error approving asset:", error);
    throw error;
  }
};

const AssetAPI = {
  addMetadata: addAssetMetadata,
  submit: submitAsset,
  dispute: disputeAsset,
  closeDispute: closeAssetDispute,
  approve: approveAsset,
};

/*************************LIVEPEER_ENDPOINTS************************************* */

const getLivepeerKey = async () => {
  try {
    const response = await axios.post(`${configs.server_url}/livepeer/key`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching Livepeer key:", error);
    throw error;
  }
};

const createAsset = async (newAssetPaylaod, userUID) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/livepeer/asset/create`,
      { newAssetPaylaod, userUID }
    );
    return response?.data;
  } catch (error) {
    console.error("Error creating asset:", error);
    throw error;
  }
};

const getLivepeerOriginDetails = async () => {
  try {
    const response = await axios.post(`${configs.server_url}/livepeer/origin`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching Livepeer origin details:", error);
    throw error;
  }
};

const getLivepeerAsset = async (assetID) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/livepeer/asset/get`,
      { assetID }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching Livepeer asset:", error);
    throw error;
  }
};

const updateLivepeerAsset = async (assetID, updateData) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/livepeer/asset/update`,
      { assetID, updateData }
    );
    return response?.data;
  } catch (error) {
    console.error("Error updating Livepeer asset:", error);
    throw error;
  }
};

const deleteLivepeerAsset = async (assetID) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/livepeer/asset/delete`,
      { assetID }
    );
    return response?.data;
  } catch (error) {
    console.error("Error deleting Livepeer asset:", error);
    throw error;
  }
};

const getLivepeerAssetPlaybackInfo = async (playbackID) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/livepeer/asset/info/playback`,
      { playbackID }
    );
    return response?.data;
  } catch (error) {
    console.error(
      `Error fetching Livepeer playback info for ${playbackID}:`,
      error
    );
    throw error;
  }
};

const LivepeerAPI = {
  getKey: getLivepeerKey,
  createAsset,
  getOriginDetails: getLivepeerOriginDetails,
  getAsset: getLivepeerAsset,
  updateAsset: updateLivepeerAsset,
  deleteAsset: deleteLivepeerAsset,
  getPlaybackInfo: getLivepeerAssetPlaybackInfo,
};

/*************************MAPS_ENDPOINTS************************************* */

const getMapsKey = async () => {
  try {
    const response = await axios.post(`${configs.server_url}/maps/get/key`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching Maps key:", error);
    throw error;
  }
};

const getMapsAPI = async () => {
  try {
    const response = await axios.post(`${configs.server_url}/maps/get/api`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching Maps API:", error);
    throw error;
  }
};

const MapsAPI = {
  getKey: getMapsKey,
  getAPI: getMapsAPI,
};

/*************************MORALIS/ALCHEMY_ENDPOINTS************************************* */

const getWalletNFTs = async (address) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/alchemy/get/wallet_nfts`,
      { address }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching wallet NFTs:", error);
    throw error;
  }
};

const getNFTMetadata = async (address, tokenId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/alchemy/get/nft_metadata`,
      { address, tokenId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    throw error;
  }
};

const NFT_API = {
  get: {
    wallet_nfts: getWalletNFTs,
    nft_metadata: getNFTMetadata,
  },
};

/*************************NEPTUNE_CHAIN_CREDITS_ENDPOINTS************************************* */

const issueCredits = async (
  senderID,
  nftTokenId,
  producer,
  verifier,
  creditType,
  amount
) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/npc_credits/issue`,
      { senderID, nftTokenId, producer, verifier, creditType, amount }
    );
    return response?.data;
  } catch (error) {
    console.error("Error issuing credits:", error);
    throw error;
  }
};

const buyCredits = async (
  accountID,
  producer,
  verifier,
  creditType,
  amount,
  price
) => {
  try {
    const response = await axios.post(`${configs.server_url}/npc_credits/buy`, {
      accountID,
      producer,
      verifier,
      creditType,
      amount,
      price,
    });
    return response?.data;
  } catch (error) {
    console.error("Error buying credits:", error);
    throw error;
  }
};

const transferCredits = async (
  senderID,
  recipientID,
  producer,
  verifier,
  creditType,
  amount,
  price
) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/npc_credits/transfer`,
      { senderID, recipientID, producer, verifier, creditType, amount, price }
    );
    return response?.data;
  } catch (error) {
    console.error("Error transferring credits:", error);
    throw error;
  }
};

const donateCredits = async (
  senderID,
  producer,
  verifier,
  creditType,
  amount
) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/npc_credits/donate`,
      { senderID, producer, verifier, creditType, amount }
    );
    return response?.data;
  } catch (error) {
    console.error("Error donating credits:", error);
    throw error;
  }
};

const getNFTOwner = async (tokenId) => {
  try {
    const response = await axios.get(
      `${configs.server_url}/nft/owner/${tokenId}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching NFT owner:", error);
    throw error;
  }
};

const getCreditTypes = async (tokenId) => {
  try {
    const response = await axios.get(
      `${configs.server_url}/nft/credit-types/${tokenId}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching credit types:", error);
    throw error;
  }
};

const getCreditSupplyLimit = async (tokenId, creditType) => {
  try {
    const response = await axios.get(
      `${configs.server_url}/nft/credit-supply-limit/${tokenId}/${creditType}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching credit supply limit:", error);
    throw error;
  }
};

const getTotalCertificates = async () => {
  try {
    const response = await axios.get(
      `${configs.server_url}/npc_credits/total-certificates`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching total certificates:", error);
    throw error;
  }
};

const getTotalSold = async () => {
  try {
    const response = await axios.get(
      `${configs.server_url}/npc_credits/total-sold`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching total sold:", error);
    throw error;
  }
};

const isProducerRegistered = async (producer) => {
  try {
    const response = await axios.get(
      `${configs.server_url}/npc_credits/producer-registered/${producer}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error checking producer registration:", error);
    throw error;
  }
};

const isVerifierRegistered = async (producer, verifier) => {
  try {
    const response = await axios.get(
      `${configs.server_url}/npc_credits/verifier-registered/${producer}/${verifier}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error checking verifier registration:", error);
    throw error;
  }
};

const getProducerVerifiers = async (producer) => {
  try {
    const response = await axios.get(
      `${configs.server_url}/npc_credits/verifiers/${producer}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching producer verifiers:", error);
    throw error;
  }
};

const getSupply = async (producer, verifier, creditType) => {
  try {
    const response = await axios.get(
      `${configs.server_url}/npc_credits/supply/${producer}/${verifier}/${creditType}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching supply:", error);
    throw error;
  }
};

const getCertificateById = async (certificateId) => {
  try {
    const response = await axios.get(
      `${configs.server_url}/certificates/${certificateId}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching certificate:", error);
    throw error;
  }
};

const getAccountCertificates = async (accountID) => {
  try {
    const response = await axios.get(
      `${configs.server_url}/npc_credits/account-certificates/${accountID}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching account certificates:", error);
    throw error;
  }
};

const getAccountCreditBalance = async (
  accountID,
  producer,
  verifier,
  creditType
) => {
  try {
    const response = await axios.get(
      `${configs.server_url}/npc_credits/account-balance/${accountID}/${producer}/${verifier}/${creditType}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching account credit balance:", error);
    throw error;
  }
};

const getAllProducers = async () => {
  try {
    const response = await axios.get(
      `${configs.server_url}/npc_credits/all-producers`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching all producers:", error);
    throw error;
  }
};

const getRecoveryDuration = async () => {
  try {
    const response = await axios.get(
      `${configs.server_url}/npc_credits/recovery-duration`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching recovery duration:", error);
    throw error;
  }
};

const getNPCCreditEvents = async () =>
  (await axios.post(`${configs.server_url}/npc_credits/events`))?.data;

const NPCCreditsAPI = {
  issueCredits,
  buyCredits,
  transferCredits,
  donateCredits,
  getNFTOwner,
  getCreditTypes,
  getCreditSupplyLimit,
  getTotalCertificates,
  getTotalSold,
  isProducerRegistered,
  isVerifierRegistered,
  getProducerVerifiers,
  getSupply,
  getCertificateById,
  getAccountCertificates,
  getAccountCreditBalance,
  getAllProducers,
  getRecoveryDuration,
  getNPCCreditEvents,
};

/*************************STRIPE_ENDPOINTS************************************* */

const getStripeConfig = async () => {
  try {
    const response = await axios.post(`${configs.server_url}/stripe/config`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching Stripe config:", error);
    throw error;
  }
};

const createPaymentIntent = async (amount, currency, optional_params) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/stripe/create/payment_intent`,
      { amount, currency, optional_params }
    );
    return response?.data;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

const getStripePrice = async (priceID) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/stripe/get/price`,
      { priceID }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching Stripe price:", error);
    throw error;
  }
};

const StripeAPI = {
  getConfig: getStripeConfig,
  createPaymentIntent,
  getPrice: getStripePrice,
};

/*************************DEVICE_MANAGEMENT_ENDPOINTS************************************* */

const getDevices = async () => {
  try {
    const response = await axios.post(`${configs.server_url}/device/all`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching devices:", error);
    throw error;
  }
};

const addDevice = async (devicePayload) => {
  try {
    const response = await axios.post(`${configs.server_url}/device/add`, {
      devicePayload,
    });
    return response?.data;
  } catch (error) {
    console.error("Error adding device:", error);
    throw error;
  }
};

const editDevice = async (deviceID, updateData) => {
  try {
    const response = await axios.post(`${configs.server_url}/device/edit`, {
      deviceID,
      updateData,
    });
    return response?.data;
  } catch (error) {
    console.error("Error editing device:", error);
    throw error;
  }
};

const removeDevice = async (deviceID) => {
  try {
    const response = await axios.post(`${configs.server_url}/device/remove`, {
      deviceID,
    });
    return response?.data;
  } catch (error) {
    console.error("Error removing device:", error);
    throw error;
  }
};

const getDeviceDetails = async (deviceID) => {
  try {
    const response = await axios.post(`${configs.server_url}/device/details`, {
      deviceID,
    });
    return response?.data;
  } catch (error) {
    console.error("Error fetching device details:", error);
    throw error;
  }
};

const emulateDevice = async (deviceID, interval) => {
  try {
    const response = await axios.post(`${configs.server_url}/device/emulate`, {
      deviceID,
      interval,
    });
    return response?.data;
  } catch (error) {
    console.error("Error emulating device:", error);
    throw error;
  }
};

const getDeviceData = async (deviceID) => {
  try {
    const response = await axios.post(`${configs.server_url}/device/data`, {
      deviceID,
    });
    return response?.data;
  } catch (error) {
    console.error("Error fetching device data:", error);
    throw error;
  }
};

// Device lifecycle updates
const updateDeviceLifecycle = async (deviceId, lifecycle, metadata) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/device/update-lifecycle`,
      { deviceId, lifecycle, metadata }
    );
    return response?.data;
  } catch (error) {
    console.error("Error updating device lifecycle:", error);
    throw error;
  }
};

const assignDeviceToOrder = async (deviceId, orderId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/device/assign-to-order`,
      { deviceId, orderId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error assigning device to order:", error);
    throw error;
  }
};

const assignDeviceInstaller = async (deviceId, installerId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/device/assign-installer`,
      { deviceId, installerId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error assigning installer to device:", error);
    throw error;
  }
};

const getDevicesByOrder = async (orderId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/device/get-by-order`,
      { orderId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching devices by order:", error);
    throw error;
  }
};

const getDeviceInventory = async (filters = {}) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/device/inventory`,
      { filters }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching device inventory:", error);
    throw error;
  }
};

const getDevicesBySite = async (siteId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/device/get-by-site`,
      { siteId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching devices by site:", error);
    throw error;
  }
};

const getDevicesByInstaller = async (installerId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/device/get-by-installer`,
      { installerId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching devices by installer:", error);
    throw error;
  }
};

const DeviceAPI = {
  getDevices,
  addDevice,
  editDevice,
  removeDevice,
  getDeviceDetails,
  emulateDevice,
  getDeviceData,
  // Lifecycle management
  updateLifecycle: updateDeviceLifecycle,
  assignToOrder: assignDeviceToOrder,
  assignInstaller: assignDeviceInstaller,
  getByOrder: getDevicesByOrder,
  getBySite: getDevicesBySite,
  getByInstaller: getDevicesByInstaller,
  getInventory: getDeviceInventory,
};

/*************************CUSTOMER_ENDPOINTS************************************* */

const createCustomer = async (customerData) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/customer/create`,
      { customerData }
    );
    return response?.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

const getCustomer = async (customerId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/customer/get`,
      { customerId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
};

const updateCustomer = async (customerId, updateData) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/customer/update`,
      { customerId, updateData }
    );
    return response?.data;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

const getCustomerByEmail = async (email) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/customer/get-by-email`,
      { email }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching customer by email:", error);
    throw error;
  }
};

const listCustomers = async (filters = {}) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/customer/list`,
      { filters }
    );
    return response?.data;
  } catch (error) {
    console.error("Error listing customers:", error);
    throw error;
  }
};

const deleteCustomer = async (customerId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/customer/delete`,
      { customerId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

const CustomerAPI = {
  create: createCustomer,
  get: getCustomer,
  update: updateCustomer,
  getByEmail: getCustomerByEmail,
  list: listCustomers,
  delete: deleteCustomer,
};

/*************************SITE_ENDPOINTS************************************* */

const createSite = async (siteData) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/site/create`,
      { siteData }
    );
    return response?.data;
  } catch (error) {
    console.error("Error creating site:", error);
    throw error;
  }
};

const getSite = async (siteId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/site/get`,
      { siteId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching site:", error);
    throw error;
  }
};

const updateSite = async (siteId, updateData) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/site/update`,
      { siteId, updateData }
    );
    return response?.data;
  } catch (error) {
    console.error("Error updating site:", error);
    throw error;
  }
};

const listSitesByCustomer = async (customerId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/site/list-by-customer`,
      { customerId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error listing sites by customer:", error);
    throw error;
  }
};

const listSites = async (filters = {}) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/site/list`,
      { filters }
    );
    return response?.data;
  } catch (error) {
    console.error("Error listing sites:", error);
    throw error;
  }
};

const deleteSite = async (siteId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/site/delete`,
      { siteId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error deleting site:", error);
    throw error;
  }
};

const addDeviceToSite = async (siteId, deviceId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/site/add-device`,
      { siteId, deviceId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error adding device to site:", error);
    throw error;
  }
};

const removeDeviceFromSite = async (siteId, deviceId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/site/remove-device`,
      { siteId, deviceId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error removing device from site:", error);
    throw error;
  }
};

const SiteAPI = {
  create: createSite,
  get: getSite,
  update: updateSite,
  listByCustomer: listSitesByCustomer,
  list: listSites,
  delete: deleteSite,
  addDevice: addDeviceToSite,
  removeDevice: removeDeviceFromSite,
};

/*************************ORDER_ENDPOINTS************************************* */

const createOrder = async (orderData) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/order/create`,
      { orderData }
    );
    return response?.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

const getOrder = async (orderId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/order/get`,
      { orderId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

const updateOrder = async (orderId, updateData) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/order/update`,
      { orderId, updateData }
    );
    return response?.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

const listOrders = async (filters = {}) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/order/list`,
      { filters }
    );
    return response?.data;
  } catch (error) {
    console.error("Error listing orders:", error);
    throw error;
  }
};

const allocateDevicesToOrder = async (orderId, deviceIds) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/order/allocate-devices`,
      { orderId, deviceIds }
    );
    return response?.data;
  } catch (error) {
    console.error("Error allocating devices to order:", error);
    throw error;
  }
};

const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/order/update-status`,
      { orderId, status }
    );
    return response?.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

const convertQuoteToOrder = async (orderId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/order/convert-quote`,
      { orderId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error converting quote to order:", error);
    throw error;
  }
};

const getOrdersByCustomer = async (customerId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/order/list-by-customer`,
      { customerId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching orders by customer:", error);
    throw error;
  }
};

const getOrdersBySite = async (siteId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/order/list-by-site`,
      { siteId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching orders by site:", error);
    throw error;
  }
};

const cancelOrder = async (orderId, reason) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/order/cancel`,
      { orderId, reason }
    );
    return response?.data;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};

const OrderAPI = {
  create: createOrder,
  get: getOrder,
  update: updateOrder,
  list: listOrders,
  allocateDevices: allocateDevicesToOrder,
  updateStatus: updateOrderStatus,
  convertQuote: convertQuoteToOrder,
  getByCustomer: getOrdersByCustomer,
  getBySite: getOrdersBySite,
  cancel: cancelOrder,
};

/*************************COMMISSION_ENDPOINTS************************************* */

const createCommission = async (commissionData) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/commission/create`,
      { commissionData }
    );
    return response?.data;
  } catch (error) {
    console.error("Error creating commission:", error);
    throw error;
  }
};

const getCommission = async (commissionId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/commission/get`,
      { commissionId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching commission:", error);
    throw error;
  }
};

const updateCommission = async (commissionId, updateData) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/commission/update`,
      { commissionId, updateData }
    );
    return response?.data;
  } catch (error) {
    console.error("Error updating commission:", error);
    throw error;
  }
};

const submitCommissionChecklist = async (commissionId, checklistData) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/commission/submit-checklist`,
      { commissionId, checklistData }
    );
    return response?.data;
  } catch (error) {
    console.error("Error submitting commission checklist:", error);
    throw error;
  }
};

const runCommissionTests = async (commissionId, deviceId, tests) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/commission/run-tests`,
      { commissionId, deviceId, tests }
    );
    return response?.data;
  } catch (error) {
    console.error("Error running commission tests:", error);
    throw error;
  }
};

const completeCommission = async (commissionId, result) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/commission/complete`,
      { commissionId, result }
    );
    return response?.data;
  } catch (error) {
    console.error("Error completing commission:", error);
    throw error;
  }
};

const getCommissionByDevice = async (deviceId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/commission/get-by-device`,
      { deviceId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching commission by device:", error);
    throw error;
  }
};

const getCommissionsByInstaller = async (installerId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/commission/get-by-installer`,
      { installerId }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching commissions by installer:", error);
    throw error;
  }
};

const listCommissions = async (filters = {}) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/commission/list`,
      { filters }
    );
    return response?.data;
  } catch (error) {
    console.error("Error listing commissions:", error);
    throw error;
  }
};

const uploadCommissionPhoto = async (commissionId, photoData) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/commission/upload-photo`,
      { commissionId, photoData }
    );
    return response?.data;
  } catch (error) {
    console.error("Error uploading commission photo:", error);
    throw error;
  }
};

const submitCommissionSignature = async (commissionId, signatureData) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/commission/submit-signature`,
      { commissionId, signatureData }
    );
    return response?.data;
  } catch (error) {
    console.error("Error submitting commission signature:", error);
    throw error;
  }
};

const cancelCommission = async (commissionId, reason) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/commission/cancel`,
      { commissionId, reason }
    );
    return response?.data;
  } catch (error) {
    console.error("Error cancelling commission:", error);
    throw error;
  }
};

const CommissionAPI = {
  create: createCommission,
  get: getCommission,
  update: updateCommission,
  submitChecklist: submitCommissionChecklist,
  runTests: runCommissionTests,
  complete: completeCommission,
  getByDevice: getCommissionByDevice,
  getByInstaller: getCommissionsByInstaller,
  list: listCommissions,
  uploadPhoto: uploadCommissionPhoto,
  submitSignature: submitCommissionSignature,
  cancel: cancelCommission,
};

/*************************METRICS_API (STUB)************************************* */

const allMetrics = ["credit_balance", "credit_price", "equity", "tx_pending"];

const getMetric = async (metric, uid) => {
  // original behavior was just returning "10"
  return "10";
  // If you want to wire this later:
  // return String(
  //   (await axios.post(`${configs.server_url}/metrics`, { metric, uid }))
  //     ?.data || 10
  // );
};

const MetricsAPI = {
  allMetrics,
  getMetric,
};

/*************************MARKETPLACE_ENDPOINTS************************************* */

// Optional mock mode flag
const USE_MARKETPLACE_MOCKS =
  process.env.REACT_APP_USE_MARKETPLACE_MOCKS === "true";

const handleMarketplacePost = async (endpoint, body) => {
  if (USE_MARKETPLACE_MOCKS) {
    console.warn(
      `[MarketplaceAPI] Mock mode enabled, skipping ${endpoint} request`
    );
    // Basic shape so UI doesn't explode; you can extend this later
    if (endpoint === "events/listings") {
      return { nfts: [] };
    }
    return {};
  }

  try {
    const response = await axios.post(
      `${configs.server_url}/marketplace/${endpoint}`,
      body
    );
    return response?.data;
  } catch (error) {
    const status = error.response?.status;
    const serverMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      null;

    const message =
      serverMessage ||
      (status
        ? `Marketplace temporarily unavailable (HTTP ${status})`
        : "Marketplace temporarily unavailable (network error)");

    console.error(`[MarketplaceAPI] Error calling ${endpoint}:`, error);
    throw new Error(message);
  }
};

const MarketplaceAPI = {
  Seller: {
    approveAndListNFT: (tokenAddress, tokenId, price, value) =>
      handleMarketplacePost("seller/list_nft", {
        tokenAddress,
        tokenId,
        price,
        value,
      }),
    cancelListing: (listingId) =>
      handleMarketplacePost("seller/cancel_listing", { listingId }),
    acceptBid: (listingId) =>
      handleMarketplacePost("seller/accept_bid", { listingId }),
  },
  Buyer: {
    buyNFT: (listingId, value) =>
      handleMarketplacePost("buyer/buy_nft", { listingId, value }),
    placeBid: (listingId, value) =>
      handleMarketplacePost("buyer/place_bid", { listingId, value }),
  },
  Getters: {
    getListingFee: () => handleMarketplacePost("get/listing_fee", {}),
    getHighestBids: () => handleMarketplacePost("get/highest_bids", {}),
  },
  Events: {
    listAvailableNFTs: () => handleMarketplacePost("events/listings", {}),
    getAllEvents: () => handleMarketplacePost("events/all", {}),
    filtered: {
      listed: (fromBlock = 500, toblock = "latest") =>
        handleMarketplacePost("events/listed", { fromBlock, toblock }),
      sale: (fromBlock = 500, toblock = "latest") =>
        handleMarketplacePost("events/sale", { fromBlock, toblock }),
      delisted: (fromBlock = 500, toblock = "latest") =>
        handleMarketplacePost("events/delisted", { fromBlock, toblock }),
      bidded: (fromBlock = 500, toblock = "latest") =>
        handleMarketplacePost("events/bidded", { fromBlock, toblock }),
      bidAccepted: (fromBlock = 500, toblock = "latest") =>
        handleMarketplacePost("events/bidAccepted", { fromBlock, toblock }),
      bidWithdrawn: (fromBlock = 500, toblock = "latest") =>
        handleMarketplacePost("events/bidWithdrawn", { fromBlock, toblock }),
    },
  },
};

export {
  AccountAPI,
  UserAPI,
  MediaAPI,
  AssetAPI,
  LivepeerAPI,
  MapsAPI,
  NPCCreditsAPI,
  NFT_API,
  StripeAPI,
  DeviceAPI,
  MetricsAPI,
  MarketplaceAPI,
  // Commercial pipeline APIs
  CustomerAPI,
  SiteAPI,
  OrderAPI,
  CommissionAPI,
};
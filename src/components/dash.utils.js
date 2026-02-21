import { DeviceAPI, MetricsAPI } from "../scripts/back_door";
import { handleError } from "../scripts/lib";
import { theme } from "../styles/colors";

export const getMetric = async (metric, uid) => {
  if (!MetricsAPI.allMetrics.includes(metric) || !uid) {
    return;
  }

  try {
    const value = await MetricsAPI.getMetric(metric, uid);
    switch (metric) {
      case "credit_balance":
        return {
          title: "Credit Balance",
          value,
          unit: "credits",
          icon: "wallet",
        };

      case "credit_price":
        return {
          title: "Credit Price",
          value: `$${value}`,
          unit: "USD",
          icon: "money-bill-1",
        };

      case "equity":
        return {
          title: "Total Equity",
          value: `$${value}`,
          unit: "USD",
          icon: "sack-dollar",
        };

      case "tx_pending":
        return {
          title: "Pending Transactions",
          value,
          unit: "pending",
          icon: "hourglass-half",
        };

      default:
        break;
    }
  } catch (error) {
    handleError(error.message, error);
  }
};

/**
 * Adds id as key for obtained device data
 * @param {{id: number | string}} card
 * @param {React.Dispatch<React.SetStateAction<{}>>} setDeviceData
 */
export const fetchDeviceData = async (deviceID, setDeviceData) => {
  try {
    const { device } = (await DeviceAPI.getDeviceDetails(deviceID)) || {};
    // device data loaded
    if (device) {
      setDeviceData(device);
    } else {
      alert(`Device #${deviceID} Data Unavailable`);
    }
  } catch (error) {
    handleError(error.message, error);
  }
};

/**
 * Generates a random color in hex format.
 * @returns {string} A random color in the format #RRGGBB.
 */
export function getRandomColor() {
  // Generate random values for red, green, and blue
  /*   const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  // Convert the RGB values to a hexadecimal string
  const color = `#${red.toString(16).padStart(2, "0")}${green
    .toString(16)
    .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
 */
  return theme.colors.primary500;
}

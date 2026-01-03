import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ButtonPrimary } from "./shared/button/Button";
import { DashboardPage } from "./shared/DashboardPage/DashboardPage";
import FormSection from "./shared/FormSection/FormSection";
import { Input } from "./shared/input/Input";
import { Label } from "./shared/Label/Label";
import { Select } from "./shared/Select/Select";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LoadingIndicator = styled.div`
  display: ${({ loading }) => (loading ? "block" : "none")};
  text-align: center;
  margin-top: 10px;
`;

const ResultsWrapper = styled.div`
  @media (max-width: 767px) {
    margin-top: 24px;
    padding: 0 4px;
  }
`;

const Result = styled.div`
  background-color: #fff;
  width: 100%;
  margin-top: 20px;
  max-width: 100%;
  overflow-x: hidden;

  @media (min-width: 768px) {
    margin-top: 40px;
  }

  canvas {
    width: 100% !important;
    max-width: 100%;
    height: auto !important;
    touch-action: pan-y; /* Prevent horizontal scroll on touch */
  }
`;

const Footer = styled.footer`
  text-align: left;
  color: ${({ theme }) => theme.colors.ui600};
  font-size: 13px;
  margin-top: 16px;
  font-weight: 500;
  line-height: 1.5;
  padding: 0 4px;

  @media (min-width: 768px) {
    font-size: 0.8em;
    padding: 0;
  }

  p {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  a {
    word-break: break-word;
  }
`;

const StickyButtonWrapper = styled.div`
  @media (max-width: 767px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 16px;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
    z-index: 100;

    button {
      width: 100%;
      min-height: 48px;
      font-size: 16px;
    }
  }

  @media (min-width: 768px) {
    margin-top: 8px;
  }
`;

const StyledNutrientCalculator = styled.div`
  padding-bottom: 80px;

  @media (min-width: 768px) {
    padding-bottom: 0;
  }

  .header-text {
    max-width: 600px;
    width: 100%;
  }

  .form-section-wrapper {
    @media (min-width: 768px) {
      display: flex;
      gap: 40px;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;

    @media (min-width: 768px) {
      gap: 16px;
      width: 250px;
      min-width: 250px;
    }

    .form-section-inputs {
      display: flex;
      flex-direction: column;
      gap: 16px;

      @media (min-width: 768px) {
        gap: 8px;
        flex-direction: column;
      }
    }

    /* Ensure touch targets are at least 44px */
    input, select {
      min-height: 48px;
      font-size: 16px; /* Prevents iOS zoom on focus */

      @media (min-width: 768px) {
        min-height: auto;
        font-size: inherit;
      }
    }
  }
`;

const nutrientData = {
  "Corn Grain": {
    yields: {
      180: { N: 120.6, P2O5: 63, K2O: 45, S: 14.4, Mg: 14.4 },
      190: { N: 127.3, P2O5: 66.5, K2O: 47.5, S: 15.2, Mg: 15.2 },
      200: { N: 134, P2O5: 70, K2O: 50, S: 16, Mg: 16 },
      210: { N: 140.7, P2O5: 73.5, K2O: 52.5, S: 16.8, Mg: 16.8 },
      220: { N: 147.4, P2O5: 77, K2O: 55, S: 17.6, Mg: 17.6 },
      230: { N: 154.1, P2O5: 80.5, K2O: 57.5, S: 18.4, Mg: 18.4 },
      240: { N: 160.8, P2O5: 84, K2O: 60, S: 19.2, Mg: 19.2 },
      250: { N: 167.5, P2O5: 87.5, K2O: 62.5, S: 20, Mg: 20 },
      260: { N: 174.2, P2O5: 91, K2O: 65, S: 20.8, Mg: 20.8 },
      270: { N: 180.9, P2O5: 94.5, K2O: 67.5, S: 21.6, Mg: 21.6 },
      280: { N: 187.6, P2O5: 98, K2O: 70, S: 22.4, Mg: 22.4 },
      290: { N: 194.3, P2O5: 101.5, K2O: 72.5, S: 23.2, Mg: 23.2 },
      300: { N: 201, P2O5: 105, K2O: 75, S: 24, Mg: 24 },
    },
    unit: "bushels",
  },
  Alfalfa: {
    yields: {
      2.0: { N: 102, P2O5: 24, K2O: 98, S: 10.8, Mg: 10.4 },
      2.5: { N: 127.5, P2O5: 30, K2O: 122.5, S: 13.5, Mg: 13 },
      3.0: { N: 153, P2O5: 36, K2O: 147, S: 16.2, Mg: 15.6 },
      3.5: { N: 178.5, P2O5: 42, K2O: 171.5, S: 18.9, Mg: 18.2 },
      4.0: { N: 204, P2O5: 48, K2O: 196, S: 21.6, Mg: 20.8 },
      4.5: { N: 229.5, P2O5: 54, K2O: 220.5, S: 24.3, Mg: 23.4 },
      5.0: { N: 255, P2O5: 60, K2O: 245, S: 27, Mg: 26 },
      5.5: { N: 280.5, P2O5: 66, K2O: 269.5, S: 29.7, Mg: 28.6 },
      6.0: { N: 306, P2O5: 72, K2O: 294, S: 32.4, Mg: 31.2 },
      6.5: { N: 331.5, P2O5: 78, K2O: 318.5, S: 35.1, Mg: 33.8 },
      7.0: { N: 357, P2O5: 84, K2O: 343, S: 37.8, Mg: 36.4 },
      7.5: { N: 382.5, P2O5: 90, K2O: 367.5, S: 40.5, Mg: 39 },
      8.0: { N: 408, P2O5: 96, K2O: 392, S: 43.2, Mg: 41.6 },
    },
    unit: "tons",
  },
  "Corn Silage": {
    yields: {
      10: { N: 97, P2O5: 31, K2O: 73, S: 11, Mg: 23 },
      12: { N: 116.4, P2O5: 37.2, K2O: 87.6, S: 13.2, Mg: 27.6 },
      14: { N: 135.8, P2O5: 43.4, K2O: 102.2, S: 15.4, Mg: 32.2 },
      16: { N: 155.2, P2O5: 49.6, K2O: 116.8, S: 17.6, Mg: 36.8 },
      18: { N: 174.6, P2O5: 55.8, K2O: 131.4, S: 19.8, Mg: 41.4 },
      20: { N: 194, P2O5: 62, K2O: 146, S: 22, Mg: 46 },
      22: { N: 213.4, P2O5: 68.2, K2O: 160.6, S: 24.2, Mg: 50.6 },
      24: { N: 232.8, P2O5: 74.4, K2O: 175.2, S: 26.4, Mg: 55.2 },
      26: { N: 252.2, P2O5: 80.6, K2O: 189.8, S: 28.6, Mg: 59.8 },
      28: { N: 271.6, P2O5: 86.8, K2O: 204.4, S: 30.8, Mg: 64.4 },
      30: { N: 291, P2O5: 93, K2O: 219, S: 33, Mg: 69 },
      32: { N: 310.4, P2O5: 99.2, K2O: 233.6, S: 35.2, Mg: 73.6 },
      34: { N: 329.8, P2O5: 105.4, K2O: 248.2, S: 37.4, Mg: 78.2 },
    },
    unit: "tons",
  },
  Soybean: {
    yields: {
      40: { N: 130, P2O5: 29.2, K2O: 48, S: 7.2, Mg: 7.2 },
      45: { N: 146.3, P2O5: 32.9, K2O: 54, S: 8.1, Mg: 8.1 },
      50: { N: 162.5, P2O5: 36.5, K2O: 60, S: 9, Mg: 9 },
      55: { N: 178.8, P2O5: 40.2, K2O: 66, S: 9.9, Mg: 9.9 },
      60: { N: 195, P2O5: 43.8, K2O: 72, S: 10.8, Mg: 10.8 },
      65: { N: 211.3, P2O5: 47.5, K2O: 78, S: 11.7, Mg: 11.7 },
      70: { N: 227.5, P2O5: 51.1, K2O: 84, S: 12.6, Mg: 12.6 },
      75: { N: 243.8, P2O5: 54.8, K2O: 90, S: 13.5, Mg: 13.5 },
      80: { N: 260, P2O5: 58.4, K2O: 96, S: 14.4, Mg: 14.4 },
      85: { N: 276.3, P2O5: 62.1, K2O: 102, S: 15.3, Mg: 15.3 },
      90: { N: 292.5, P2O5: 65.7, K2O: 108, S: 16.2, Mg: 16.2 },
      95: { N: 308.8, P2O5: 69.4, K2O: 114, S: 17.1, Mg: 17.1 },
      100: { N: 325, P2O5: 73, K2O: 120, S: 18, Mg: 18 },
    },
    unit: "bushels",
  },
  Canola: {
    yields: {
      30: { N: 48, P2O5: 24, K2O: 12, S: 7.5, Mg: 9 },
      35: { N: 56, P2O5: 28, K2O: 14, S: 8.8, Mg: 10.5 },
      40: { N: 64, P2O5: 32, K2O: 16, S: 10, Mg: 12 },
      45: { N: 72, P2O5: 36, K2O: 18, S: 11.3, Mg: 13.5 },
      50: { N: 80, P2O5: 40, K2O: 20, S: 12.5, Mg: 15 },
      55: { N: 88, P2O5: 44, K2O: 22, S: 13.8, Mg: 16.5 },
      60: { N: 96, P2O5: 48, K2O: 24, S: 15, Mg: 18 },
      65: { N: 104, P2O5: 52, K2O: 26, S: 16.3, Mg: 19.5 },
      70: { N: 112, P2O5: 56, K2O: 28, S: 17.5, Mg: 21 },
      75: { N: 120, P2O5: 60, K2O: 30, S: 18.8, Mg: 22.5 },
      80: { N: 128, P2O5: 64, K2O: 32, S: 20, Mg: 24 },
      85: { N: 136, P2O5: 68, K2O: 34, S: 21.3, Mg: 25.5 },
      90: { N: 144, P2O5: 72, K2O: 36, S: 22.5, Mg: 27 },
    },
    unit: "bushels",
  },
  Cotton: {
    yields: {
      1.0: { N: 32, P2O5: 14, K2O: 19, S: 3.5, Mg: 0 },
      1.3: { N: 40, P2O5: 17.5, K2O: 23.8, S: 4.4, Mg: 0 },
      1.5: { N: 48, P2O5: 21, K2O: 28.5, S: 5.3, Mg: 0 },
      1.8: { N: 56, P2O5: 24.5, K2O: 33.3, S: 6.1, Mg: 0 },
      2.0: { N: 64, P2O5: 28, K2O: 38, S: 7, Mg: 0 },
      2.3: { N: 72, P2O5: 31.5, K2O: 42.8, S: 7.9, Mg: 0 },
      2.5: { N: 80, P2O5: 35, K2O: 47.5, S: 8.8, Mg: 0 },
      2.8: { N: 88, P2O5: 38.5, K2O: 52.3, S: 9.6, Mg: 0 },
      3.0: { N: 96, P2O5: 42, K2O: 57, S: 10.5, Mg: 0 },
      3.3: { N: 104, P2O5: 45.5, K2O: 61.8, S: 11.4, Mg: 0 },
      3.5: { N: 112, P2O5: 49, K2O: 66.5, S: 12.3, Mg: 0 },
      3.8: { N: 120, P2O5: 52.5, K2O: 71.3, S: 13.1, Mg: 0 },
      4.0: { N: 128, P2O5: 56, K2O: 76, S: 14, Mg: 0 },
    },
    unit: "bales", // Sulfur not provided
  },
  "Spring Wheat": {
    yields: {
      40: { N: 59.6, P2O5: 22.8, K2O: 13.2, S: 4, Mg: 6 },
      45: { N: 67.1, P2O5: 25.7, K2O: 14.9, S: 4.5, Mg: 6.8 },
      50: { N: 74.5, P2O5: 28.5, K2O: 16.5, S: 5, Mg: 7.5 },
      55: { N: 82, P2O5: 31.4, K2O: 18.2, S: 5.5, Mg: 8.3 },
      60: { N: 89.4, P2O5: 34.2, K2O: 19.8, S: 6, Mg: 9 },
      65: { N: 96.9, P2O5: 37.1, K2O: 21.5, S: 6.5, Mg: 9.8 },
      70: { N: 104.3, P2O5: 39.9, K2O: 23.1, S: 7, Mg: 10.5 },
      75: { N: 111.8, P2O5: 42.8, K2O: 24.8, S: 7.5, Mg: 11.3 },
      80: { N: 119.2, P2O5: 45.6, K2O: 26.4, S: 8, Mg: 12 },
      85: { N: 126.7, P2O5: 48.5, K2O: 28.1, S: 8.5, Mg: 12.8 },
      90: { N: 134.1, P2O5: 51.3, K2O: 29.7, S: 9, Mg: 13.5 },
      95: { N: 141.6, P2O5: 54.2, K2O: 31.4, S: 9.5, Mg: 14.3 },
      100: { N: 149, P2O5: 57, K2O: 33, S: 10, Mg: 15 },
    },
    unit: "bushels",
  },
  "Winter Wheat": {
    yields: {
      40: { N: 46.4, P2O5: 19.2, K2O: 11.6, S: 4, Mg: 6 },
      45: { N: 52.2, P2O5: 21.6, K2O: 13.1, S: 4.5, Mg: 6.8 },
      50: { N: 58, P2O5: 24, K2O: 14.5, S: 5, Mg: 7.5 },
      55: { N: 63.8, P2O5: 26.4, K2O: 16, S: 5.5, Mg: 8.3 },
      60: { N: 69.6, P2O5: 28.8, K2O: 17.4, S: 6, Mg: 9 },
      65: { N: 75.4, P2O5: 31.2, K2O: 18.9, S: 6.5, Mg: 9.8 },
      70: { N: 81.2, P2O5: 33.6, K2O: 20.3, S: 7, Mg: 10.5 },
      75: { N: 87, P2O5: 36, K2O: 21.8, S: 7.5, Mg: 11.3 },
      80: { N: 92.8, P2O5: 38.4, K2O: 23.2, S: 8, Mg: 12 },
      85: { N: 98.6, P2O5: 40.8, K2O: 24.7, S: 8.5, Mg: 12.8 },
      90: { N: 104.4, P2O5: 43.2, K2O: 26.1, S: 9, Mg: 13.5 },
      95: { N: 110.2, P2O5: 45.6, K2O: 27.6, S: 9.5, Mg: 14.3 },
      100: { N: 116, P2O5: 48, K2O: 29, S: 10, Mg: 15 },
    },
    unit: "bushels",
  },
};

const NutrientCalculator = ({ isOpen, onClose }) => {
  const [crop, setCrop] = useState("Corn Grain");
  const [yieldPerAcre, setYieldPerAcre] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const chartRef = useRef(null);

  useEffect(() => {
    const defaultChartResult = {
      N: 0,
      P2O5: 0,
      K2O: 0,
      S: 0,
      Mg: 0,
    };

    const chartResult = result?.removalRates || defaultChartResult;
    if (chartResult) {
      renderChart(chartResult);
    }
  }, [result]);

  const findClosestYield = (yieldData, yieldPerAcre) => {
    let closest = null;
    for (let yieldValue in yieldData) {
      yieldValue = parseFloat(yieldValue);
      if (
        closest === null ||
        Math.abs(yieldValue - yieldPerAcre) < Math.abs(closest - yieldPerAcre)
      ) {
        closest = yieldValue;
      }
    }
    return yieldData[closest];
  };

  const validateYield = (crop, yieldValue) => {
    let min, max;
    switch (crop) {
      case "Alfalfa":
        min = 2;
        max = 8;
        break;
      case "Corn Grain":
        min = 180;
        max = 300;
        break;
      case "Corn Silage":
        min = 10;
        max = 34;
        break;
      case "Soybean":
        min = 40;
        max = 100;
        break;
      case "Canola":
        min = 30;
        max = 90;
        break;
      case "Cotton":
        min = 1;
        max = 4;
        break;
      case "Spring Wheat":
        min = 40;
        max = 100;
        break;
      case "Winter Wheat":
        min = 40;
        max = 100;
        break;

      default:
        return { valid: false };
    }
    return { valid: yieldValue >= min && yieldValue <= max, min, max };
  };

  const calculateNutrientRemoval = (crop, yieldPerAcre) => {
    if (nutrientData.hasOwnProperty(crop)) {
      const cropData = nutrientData[crop];
      const closestYieldData = findClosestYield(cropData.yields, yieldPerAcre);
      return { removalRates: closestYieldData, unit: cropData.unit };
    }
    return {}; // Default return if crop type is not recognized
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const yieldAcre = parseFloat(yieldPerAcre);
    const yieldValidation = validateYield(crop, yieldAcre);

    if (!isNaN(yieldAcre) && yieldValidation.valid) {
      setErrorMessage("");
      setIsLoading(true);
      try {
        // Simulate an asynchronous operation (e.g., data fetching)
        setTimeout(() => {
          const nutrientRemovalResult = calculateNutrientRemoval(
            crop,
            yieldAcre
          );
          console.log("nutrientRemovalResult", nutrientRemovalResult);
          setResult(nutrientRemovalResult);
        }, 500); // Adjust the timeout as needed
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage(
        `Please enter a valid yield value within the accepted range for ${crop} (${yieldValidation.min} to ${yieldValidation.max} ${yieldValidation.unit}).`
      );
      setResult(null);
    }
  };

  // Ref to store the chart instance
  const chartInstanceRef = useRef(null);

  const renderChart = (nutrientValues) => {
    // Destroy the previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    // BlueSignal brand-aligned color palette
    const brandColors = [
      "#1D7072", // Primary teal
      "#38BDBE", // Light teal
      "#0284c7", // Sky blue
      "#059669", // Emerald
      "#6366f1", // Indigo
    ];

    chartInstanceRef.current = new ChartJS(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(nutrientValues),
        datasets: [
          {
            label: "lbs/acre removed",
            data: Object.values(nutrientValues),
            backgroundColor: brandColors,
            borderColor: brandColors.map(c => c + "dd"),
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Nutrient Removal by Harvest",
            font: {
              size: 16,
              weight: "600",
            },
            color: "#374151",
            padding: {
              bottom: 20,
            },
          },
          tooltip: {
            backgroundColor: "#1f2937",
            titleColor: "#ffffff",
            bodyColor: "#ffffff",
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return `${context.parsed.y.toFixed(1)} lbs/acre`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "lbs/acre",
              font: {
                size: 12,
                weight: "500",
              },
              color: "#6b7280",
            },
            grid: {
              color: "#e5e7eb",
            },
            ticks: {
              color: "#6b7280",
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#374151",
              font: {
                weight: "500",
              },
            },
          },
        },
      },
    });
  };

  return (
    <div>
      <StyledNutrientCalculator>
        <DashboardPage
          title={"Nutrient Removal Calculator"}
          description={`Each harvest depletes soil nutrients, varying by crop and yield.
              Identify what's lost with our Nutrient Removal Calculator by
              selecting your crop and yield.`}
        >
          <div className="form-section-wrapper">
            <form onSubmit={handleSubmit}>
              <div className="form-section-inputs">
                <FormSection>
                  <Label htmlFor="cropSelect">Crop type</Label>
                  <Select
                    id="cropSelect"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                  >
                    {Object.keys(nutrientData).map((cropName, index) => (
                      <option key={index} value={cropName}>
                        {cropName}
                      </option>
                    ))}
                  </Select>
                </FormSection>

                <FormSection error={errorMessage}>
                  <Label htmlFor="yieldInput">Yield per Acre</Label>
                  <Input
                    error={errorMessage}
                    type="number"
                    id="yieldInput"
                    placeholder="Enter yield"
                    value={yieldPerAcre}
                    onChange={(e) => setYieldPerAcre(e.target.value)}
                  />
                </FormSection>
              </div>

              <StickyButtonWrapper>
                <ButtonPrimary type="submit">Calculate</ButtonPrimary>
              </StickyButtonWrapper>
            </form>

            <LoadingIndicator loading={isLoading}>Loading...</LoadingIndicator>
            {/*             {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>} */}

            <ResultsWrapper>
              <Result>
                <canvas ref={chartRef}></canvas>
              </Result>
              <Footer>
                <p>
                  Based on <a href="http://www.ipni.net/article/IPNI-3346" target="_blank" rel="noopener noreferrer">IPNI Nutrient Removal Calculator</a>.
                  Values may vary by region—consult local data for precise recommendations.
                </p>
              </Footer>
            </ResultsWrapper>
          </div>
        </DashboardPage>
      </StyledNutrientCalculator>
    </div>
  );
};

export default NutrientCalculator;

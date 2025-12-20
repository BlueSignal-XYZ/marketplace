import React, { useEffect, useRef, useState } from "react";
import styled, { ThemeConsumer } from "styled-components";
import { motion } from "framer-motion";
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
  DoughnutController,
  ArcElement,
  Filler,
} from "chart.js";
import { CardContainer } from "../../lib/styled";
import "font-awesome/css/font-awesome.min.css";
import { fetchDeviceData, getRandomColor } from "../../dash.utils";
import { capitalizeFirstLetter, logDev } from "../../../scripts/helpers";
import { logoColors } from "../../../styles/colors";
import { Badge } from "../../shared/Badge/Badge";

const defaultModules = {
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
}; //Bar
const lineModules = { LineController, LineElement, PointElement };
const doughnutModules = { DoughnutController, ArcElement };
const interactionModules = { Filler };

const registerChartModules = (...moduleSets) => {
  const allModules = Object.values(moduleSets)
    .flat()
    .reduce((acc, moduleSet) => [...acc, ...Object.values(moduleSet)], []);
  Chart.register(...allModules);
};

registerChartModules(
  defaultModules,
  lineModules,
  doughnutModules,
  interactionModules
);

const transformDataToDatasets = (dataArray = []) => {
  const labels = [];
  dataArray.forEach((data) => {
    Object.keys(data)?.forEach((label) => {
      if (label !== "Timestamp") {
        labels.push(label);
      }
    });
  });
  return dataArray.map((dataset) => {
    const label = dataset?.Timestamp || "*";
    const sanitizedData = { ...dataset };
    delete sanitizedData?.Timestamp;
    return {
      label,
      data: Object.values(sanitizedData),
      backgroundColor: getRandomColor(),
    };
  });
};

const transformDataToLabels = (dataArray) => {
  const labels = [];
  dataArray.forEach((data) => {
    Object.keys(data)?.forEach((label) => {
      if (label !== "Timestamp") {
        labels.push(label);
      }
    });
  });
  return labels;
};

// SECURITY: Sanitize text to prevent XSS attacks
const sanitizeText = (text) => {
  if (text == null) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const renderTooltip = (tooltipModel) => {
  let tooltipEl = document.getElementById("chartjs-tooltip");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.id = "chartjs-tooltip";
    const table = document.createElement("table");
    tooltipEl.appendChild(table);
    document.body.appendChild(tooltipEl);
  }

  if (tooltipModel.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  tooltipEl.classList.remove("above", "below", "no-transform");
  if (tooltipModel.yAlign) {
    tooltipEl.classList.add(tooltipModel.yAlign);
  } else {
    tooltipEl.classList.add("no-transform");
  }

  if (tooltipModel.body) {
    const titleLines = tooltipModel.title || [];
    const bodyLines = tooltipModel.body.map((item) => item.lines);

    const tableRoot = tooltipEl.querySelector("table");
    // SECURITY: Clear content safely using DOM methods
    while (tableRoot.firstChild) {
      tableRoot.removeChild(tableRoot.firstChild);
    }

    // Build table structure with DOM methods to prevent XSS
    const thead = document.createElement("thead");
    titleLines.forEach((title) => {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.textContent = sanitizeText(title);
      tr.appendChild(th);
      thead.appendChild(tr);
    });
    tableRoot.appendChild(thead);

    const tbody = document.createElement("tbody");
    bodyLines.forEach((body, i) => {
      const colors = tooltipModel.labelColors[i] || {};
      const tr = document.createElement("tr");
      const td = document.createElement("td");

      const colorSpan = document.createElement("span");
      colorSpan.style.background = colors.backgroundColor || "transparent";
      colorSpan.style.borderColor = colors.borderColor || "transparent";
      colorSpan.style.borderWidth = "2px";
      colorSpan.style.display = "inline-block";
      colorSpan.style.width = "10px";
      colorSpan.style.height = "10px";
      colorSpan.style.marginRight = "5px";

      td.appendChild(colorSpan);
      td.appendChild(document.createTextNode(sanitizeText(body)));
      tr.appendChild(td);
      tbody.appendChild(tr);
    });
    tableRoot.appendChild(tbody);
  }

  const position = this._chart.canvas.getBoundingClientRect();

  tooltipEl.style.opacity = 1;
  tooltipEl.style.position = "absolute";
  tooltipEl.style.left =
    position.left + window.pageXOffset + tooltipModel.caretX + "px";
  tooltipEl.style.top =
    position.top + window.pageYOffset + tooltipModel.caretY + "px";
  tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
  tooltipEl.style.fontSize = tooltipModel.bodyFontSize + "px";
  tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
  tooltipEl.style.padding =
    tooltipModel.padding + "px " + tooltipModel.padding + "px";
};

const ChartCardComponent = ({
  deviceID,
  options = {},
  backgroundColor = ["#2E8BC0", "#B1D4E0", "#496F5E", "#1F2E2E", "#16262E"],
}) => {
  if (!(deviceID > 0)) {
    return;
  }

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 0 });
  const [type, setType] = useState("bar");
  const [data, setData] = useState(null);
  const [label, setLabel] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [labels, setLabels] = useState([]);

  const [deviceData, setDeviceData] = useState(null);

  const chartTypes = ["line", "bar", "doughnut"];

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, [containerRef]);

  useEffect(() => {
    if (deviceID) {
      logDev("ChartCard: deviceID", deviceID);
      fetchDeviceData(deviceID, setDeviceData);
    }
  }, [deviceID]);

  useEffect(() => {
    const { name, records } = deviceData || {};
    console.log(deviceData, records);
    if (records) {
      logDev(`ChartCard #${deviceID} device data`, { deviceData });

      setLabel(name);
      setData(Object.values(records));
    } else if (data) {
      alert(`Device #${deviceID} Data Unavailable`);
    }
  }, [deviceData]);

  useEffect(() => {
    if (data) {
      logDev(`Chart #${deviceID} Data`, { data });

      setDatasets(transformDataToDatasets(data));
      setLabels(transformDataToLabels(data));
    }
  }, [data]);

  useEffect(() => {
    if (labels.length > 0) {
      logDev(`Chart #${deviceID} Labels`, { labels });
    }
  }, [labels]);

  useEffect(() => {
    if (datasets.length > 0) {
      logDev(`Chart #${deviceID} Datasets`, { datasets });
    }
  }, [datasets]);

  useEffect(() => {
    if (!data) {
      return;
    }

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    const devicePixelRatio = window.devicePixelRatio;

    canvasRef.current.width = dimensions.width * devicePixelRatio;
    canvasRef.current.height = dimensions.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    chartRef.current = new Chart(ctx, {
      type,
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
          ...options.scales,
        },
        plugins: {
          tooltip: {
            enabled: true,
            custom: renderTooltip,
          },
          legend: {
            display: true,
            position: "top",
          },
        },
        ...{
          layout: { padding: { right: 10 } },
          maintainAspectRatio: false,
          legend: {
            display: false,
          },
          scales: {
            display: false,
            xAxes: [
              {
                gridLines: {
                  display: false,
                  drawBorder: false,
                },
                ticks: {
                  display: false,
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  display: false,
                  beginAtZero: false,
                },
                gridLines: {
                  display: false,
                  drawBorder: false,
                },
              },
            ],
          },
        },
        ...options,
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [data, label, type, options, backgroundColor, dimensions]);

  if (!data) {
    return <p>No Data for Device #{deviceID}</p>;
  }

  return (
    <SCardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <Header>
        <div>
          <i className="fa fa-bar-chart" aria-hidden="true"></i>
          {label}
        </div>
        <ChartOptions>
          {chartTypes.map((type, index) => (
            <Badge key={index} onClick={() => setType(type)}>
              {capitalizeFirstLetter(type)}
            </Badge>
          ))}
        </ChartOptions>
      </Header>
      <CanvasWrapper>
        <Canvas ref={canvasRef}></Canvas>
      </CanvasWrapper>
    </SCardContainer>
  );
};

const SCardContainer = styled(motion.div)`
  justify-content: flex-start;
  align-items: center;
  // min-height: 400px;
  padding: 5px;
  width: 100%;

  &:hover {
    transform: scale(1);
  }
`;

const Header = styled.div`
  font-weight: 600;
  box-sizing: border-box;
  text-align: center;
  width: 100%;
  color: ${({ theme }) => theme.colors.ui800};
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  i {
    margin-right: 10px;
    color: ${({ theme }) => theme.colors.ui800};
  }
`;

const ChartOptions = styled(motion.div)`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;

  button {
    font-size: 0.8rem;
  }
`;
const CanvasWrapper = styled(motion.div)`
  flex-grow: 1;
  display: flex;
  width: 100%;
  height: 500px;
  justify-content: center;
  align-items: center;
`;

const Canvas = styled.canvas``;

export default React.memo(ChartCardComponent);

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIcon } from "../../lib/icons";
import { AnimatePresence } from "framer-motion";
import { StreamItem, VideoItem } from "./data-card";
import { CardContainer } from "../../lib/styled";
import { DeviceAPI } from "../../../scripts/back_door";
import { logDev } from "../../../scripts/helpers";

/** @deprecated Legacy dashboard component — not used in any active route. */
const fetchDeviceData = async (deviceID, setDeviceData) => {
  try {
    const { device } = (await DeviceAPI.getDeviceDetails(deviceID)) || {};
    if (device) {
      setDeviceData(device);
    }
  } catch (error) {
    console.error("fetchDeviceData error:", error);
  }
};

const DataCard = ({ deviceID }) => {
  if (!(deviceID > 0)) {
    return;
  }

  const [deviceData, setDeviceData] = useState(null);

  useEffect(() => {
    fetchDeviceData(deviceID, setDeviceData);
  }, [deviceID]);

  useEffect(() => {
    if (deviceData) {
      logDev(`DataCard #${deviceID} Data`, { deviceData });
    }
  }, [deviceData]);

  if (!deviceData) {
    return <p>Data #{deviceID} Unavailable...</p>;
  }

  const { name, icon, records } = deviceData || {};

  const iconDef = getIcon(icon);

  if (!records) {
    return <p>No Data</p>;
  }

  logDev(`Device #${deviceID} Records`, {
    records,
    filter: Object.values(records),
  });

  return (
    <CardContainer>
      <DataCardHeader>
        <CardTitle>{name}</CardTitle>
        <CardIcon icon={iconDef} />
      </DataCardHeader>
      <AnimatePresence>
        <CardContent>
          <ContentList>
            {/* {Object.values(records)?.map((content, index) => (
              <Content key={index}>
                {typeof content === "object" && content?.id ? (
                  content?.kind === "stream" ? (
                    <StreamItem stream={content} />
                  ) : (
                    <VideoItem data={content} />
                  )
                ) : (
                  content
                )}
              </Content>
            ))} */}
          </ContentList>
        </CardContent>
      </AnimatePresence>
    </CardContainer>
  );
};

const DataCardHeader = styled.div`
  flex: 0 0 auto;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  justify-content: space-between;
`;

const CardTitle = styled.span`
  margin: 1rem;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.ui900 || "#18181b"};
`;

const CardIcon = styled(FontAwesomeIcon)`
  color: ${({ theme }) => theme.colors?.primary600 || "#196061"};
  width: auto;
  height: 80%;
  margin-right: 1rem;
`;

const CardContent = styled.div`
  flex: 0 0 auto;
  width: 100%;
  height: 80%;
  overflow: auto;
`;

const ContentList = styled.ul`
  height: auto;
  margin: 0;
  padding: 0;
  list-style: none;

  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const Content = styled.li``;

export default DataCard;

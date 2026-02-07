import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { logDev } from "../../../scripts/helpers";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { theme } from "../../../styles/colors";
import { ButtonSecondary } from "../../shared/button/Button";
import { useQuery } from "@tanstack/react-query";
import { DeviceAPI } from "../../../scripts/back_door";
import Spinner from "../../shared/Spinner/Spinner";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: -50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export const fetchDeviceData = async (deviceID) => {
  try {
    const { device } = await DeviceAPI.getDeviceDetails(deviceID);
    console.log("DEVICE DETTTAAAAAAAAAls", device)
    return device;
  } catch (error) {
    return error;
  }
};

const StatusCard = ({ deviceID, setRefFocus }) => {
  const { data, status } = useQuery({
    queryFn: () => fetchDeviceData(deviceID),
    queryKey: [deviceID],
  });

  /*   useEffect(() => {
    fetchDeviceData(deviceID, setDeviceData);
  }, [deviceID]);

  useEffect(() => {
    if (deviceData) {
      logDev(`StatusCard #${deviceID} Data`, { deviceData });
    }
  }, [deviceData]); */

  const handleClick = () => setRefFocus({ deviceID });

  // this removes the type error
  if (!(deviceID > 0)) {
    return;
  }

  return (
    <Container
      statusColor={status === "active" ? "green" : "green"}
      variants={cardVariants}
    >
      {status === "error" && (
        <div className="error">Couldn't fetch data for device #{deviceID}</div>
      )}
      {status === "loading" ? (
        <div className="loading-spinner">
          Loading.. <Spinner />
        </div>
      ) : data ? (
        <>
          <h5>{data.name}</h5>
          <div className="number-box">#{deviceID}</div>

          <ButtonSecondary onClick={handleClick}>View details</ButtonSecondary>
        </>
      ) : (
      <div className="error">Couldn't fetch data for device #{deviceID}</div>
      )} 
    </Container>
  );
};

const Container = styled(motion.div)`
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.ui200};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  padding: 24px 24px;
  width: 100%;
  text-align: left;
  background: ${({ theme }) => theme.colors.ui50};
  height: 100%;
  h5 {
    font-size: 1rem;
    font-weight: 800;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.ui800};
  }
  h6 {
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 0;
  }

  i {
    font-size: 35px;
    margin-bottom: 15px;
    color: ${({ statusColor }) => statusColor};
  }

  .number-box {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 16px;
    color: ${({ theme }) => theme.colors.ui700};
  }

  .error {
    color: ${({ theme }) => theme.colors.red500};
  }

  .loading-spinner {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  @media screen and (max-width: 991px) {
  }
  @media screen and (max-width: 769px) {
    // width: 100%;
  }
`;

export default StatusCard;

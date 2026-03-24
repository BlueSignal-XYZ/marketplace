import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import {
  EventData,
  ProducersData,
  AccountSearch,
  Line,
} from "../elements/index";
import { colors } from "../../data/styles";
import { NUMBERS } from "../../scripts/helpers";
import { NPCCreditsAPI } from "../../scripts/back_door";
import useFetchNPCCreditEvents from "../../hooks/useFetchNPCCreditEvents";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const breakpoints = [576, 768, 992, 1200];

// Custom hook to target the breakpoints for responsiveness
const useMediaQuery = (width) => {
  const [targetReached, setTargetReached] = useState(false);

  useEffect(() => {
    const updateTarget = () => {
      if (window.innerWidth < width) {
        setTargetReached(true);
      } else {
        setTargetReached(false);
      }
    };
    updateTarget();
    window.addEventListener("resize", updateTarget);
    return () => window.removeEventListener("resize", updateTarget);
  }, [width]);

  return targetReached;
};

const Container = styled(motion.div)`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 100%;
  animation: ${fadeIn} 0.5s ease-in-out;
  transition: 0.5s ease-in-out;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Content = styled(motion.div).attrs(() => ({
  initial: "hidden",
  variants: fadeIn,
}))`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
  overflow-x: hidden;
  align-items: flex-start; /* Align content to the top of the container */
  overflow-y: auto; // Add vertical scroll if content overflows

  @media (max-width: 768px) {
    width: 80%;
  }
`;

const Heading = styled.h1`
  font-size: ${(props) => (props.isSmallScreen ? "16px" : "24px")};
  font-weight: bold;
`;

const DynamicList = styled.div`
  width: 100%;
  padding: 0 10px;
  border-bottom: 1px solid #00000080;
`;

const Heading2 = styled.h2`
  width: 100%;
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-bottom: 20px;
  @media (max-width: ${breakpoints[1]}px) {
    font-size: 1.2em;
  }
  @media (max-width: ${breakpoints[0]}px) {
    font-size: 1em;
  }
`;

const StyledTable = styled.table`
  width: 80%;
  border-collapse: collapse;
  // background-color: ${colors.secondaryAccent};
  border-radius: 8px;
  margin: auto;
  margin-top: 100px;
  overflow: hidden;
  -webkit-box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.75);

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledTh = styled.th`
  padding: 10px;
  background: ${colors.accent};
  color: white;
  text-align: center;
  border-right: 2px solid #222;
  &:last-child {
    border-right: none;
  }
`;

const StyledTd = styled.td`
  padding: 8px;
  border-bottom: 1px solid #222;
  border-right: 2px solid #222;
  &:last-child {
    border-right: none;
  }
`;

const LoadingAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  margin: auto;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #568ca9;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: ${LoadingAnimation} 0.8s infinite linear;
`;

const MessageContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 10px;
  z-index: 999;
  display: flex;
  align-items: center;
  background-color: ${({ type }) => (type === "error" ? "#ff9a9a" : "#d8f5e9")};
  color: ${({ type }) => (type === "error" ? "#ff0000" : "#00b800")};
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.25);
`;

const CloseButton = styled.button`
  margin-left: 10px;
  background-color: transparent;
  border: none;
  color: ${({ type }) => (type === "error" ? "#ff0000" : "#00b800")};
  cursor: pointer;
`;

const AccountSearchButton = styled.button`
  border-radius: 10px;
  backdrop-filter: blur(20px);
  padding: 10px;
  border: 1px solid #333;
  background: #222;
  color: white;
  box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.75);
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    scale: 1.1;
  }

  @media (max-width: 600px) {
    font-size: 10px;
    padding: 5px;
  }
`;

const FixedTitle = styled.div`
  position: fixed;
  top: 7wh;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 2px solid #222;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  z-index: 1000;
`;

/******************** Caching **********************/
// Helper function to check if cache is stale
const isCacheStale = (key, expiryTime) => {
  const cachedItem = localStorage.getItem(key);
  if (!cachedItem) return true;

  const { timestamp } = JSON.parse(cachedItem);
  return Date.now() - timestamp > expiryTime;
};

const cacheExpiryTime = 600000; // Cache expiration time set to 10 minutes

function ExplorerPage() {
  const isSmallScreen = useMediaQuery(768);

  const [data, setData] = useState([]);
  const [producers, setProducers] = useState(null);
  const [producersData, setProducersData] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isAccountSearchOpen, setIsAccountSearchOpen] = useState(false);
  const [updateCache, setUpdateCache] = useState(true);
  const [liveCache, setLiveCache] = useState({});

  useEffect(() => {
    const handleEvent = (event) => {
      setUpdateCache(event);
      console.log(event.log);
    };

    NPCCreditsAPI.on("*", (e) => {
      handleEvent(e);
      e.removeListener();
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      const cacheKey = "REGISTRY_OVERVIEW_DATA";

      if (!isCacheStale(cacheKey, cacheExpiryTime) || !updateCache) {
        const cachedData = JSON.parse(localStorage.getItem(cacheKey));
        if (cachedData) {
          setData(cachedData.data);
          return;
        }
      }

      if (updateCache || !data) {
        try {
          //const totalSupply = await NPCCreditsAPI.getSupply(); //***FIX ****/
          const totalSupply = await NPCCreditsAPI.getTotalSold();
          const totalSold = await NPCCreditsAPI.getTotalSold();
          const totalBurnedSupply = await NPCCreditsAPI.getTotalSold(); //***FIX ****/
          const totalCertificates = await NPCCreditsAPI.getTotalCertificates();
          const _producers = await NPCCreditsAPI.getAllProducers();
          const creditTypes = await NPCCreditsAPI.getCreditTypes(
            1
          ); /** FIX ** */

          console.log("DATA STATES*****************************", {
            totalSupply: NUMBERS.toNumber(totalSupply),
            totalSold: NUMBERS.toNumber(totalSold),
            totalBurnedSupply: NUMBERS.toNumber(totalBurnedSupply),
            totalCertificates: NUMBERS.toNumber(totalCertificates),
            _producers,
            creditTypes,
          });

          //Append credit types to live cache for internal use by app
          setLiveCache({ ...liveCache, creditTypes });

          const newData = [
            {
              label: "Total Supply",
              value:
                totalSupply?.toString() +
                " " +
                `${NUMBERS.toNumber(totalSupply) > 0 ? "AWG Credits" : "AWG Credit"}`,
            },
            {
              label: "Total Sold",
              value:
                totalSold?.toString() +
                " " +
                `${NUMBERS.toNumber(totalSold) > 0 ? "AWG Credits" : "AWG Credit"}`,
            },
            {
              label: "Total Donated Credits",
              value:
                totalBurnedSupply?.toString() +
                " " +
                `${NUMBERS.toNumber(totalBurnedSupply) > 0 ? "AWG Credits" : "AWG Credit"}`,
            },
            { label: "Credit Types", value: creditTypes?.join(", ") },
            {
              label: "Total Certificates",
              value: totalCertificates?.toString(),
            },
            { label: "Total Farmers", value: _producers?.length },
          ];

          // Cache the fetched data
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: newData,
              timestamp: Date.now(),
            })
          );

          //To reduce CUPS for Alchemy API
          setTimeout(() => {
            //This will trigger the useEffect to fetch data of the set producers
            setProducers(_producers);
          }, 1000);

          //cache has already been updated so keep it false
          //This will rerun the useEffect and set data from cache due to the false condition
          setUpdateCache(null);
        } catch (error) {
          console.error(error);
          setErrorMessage(`${error.message}`);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchData();
  }, [updateCache]);

  useEffect(() => {
    const fetchProducerData = async () => {
      const cacheKey = "REGISTRY_PRODUCER_DATA";

      if (!isCacheStale(cacheKey, cacheExpiryTime) || !updateCache) {
        const cachedData = JSON.parse(localStorage.getItem(cacheKey));
        console.log("cacheDataProducer", { cachedData }, Boolean(cachedData));
        if (cachedData) {
          setProducersData(cachedData.data);
          return;
        }
      }

      if (updateCache || !producersData) {
        try {
          var { creditTypes } = liveCache;
          console.log("creditTypes", creditTypes);
          //Re-request if not available
          if (!creditTypes) {
            creditTypes = await NPCCreditsAPI.getCreditTypes(1);
            console.log("Re-request of creditTypes");
          }
          const _producersData = await Promise.all(
            producers.map(async (producer) => {
              const verifiers = await NPCCreditsAPI.getProducerVerifiers(
                producer
              );
              const verifiersData = await Promise.all(
                verifiers.map(async (verifier) => {
                  const Supplies = await Promise.all(
                    creditTypes.map(async (creditType) => {
                      const supply = await NPCCreditsAPI.getSupply(
                        producer,
                        verifier,
                        creditType
                      );
                      return {
                        creditType,
                        issuedSupply: NUMBERS.toNumber(supply?.issued),
                        availableSupply: NUMBERS.toNumber(supply?.available),
                        donatedSupply: NUMBERS.toNumber(supply?.donated),
                      };
                    })
                  );

                  return {
                    verifier,
                    Supplies,
                  };
                })
              );

              return {
                producer,
                verifiers: verifiersData,
              };
            })
          );

          // Cache the fetched data
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: _producersData,
              timestamp: Date.now(),
            })
          );

          setUpdateCache(false);
        } catch (error) {
          console.error(error);
          setErrorMessage("Failed to fetch producer data");
        }
      }
    };

    if (producers) {
      fetchProducerData();
    }
  }, [producers, updateCache]);

  // Event Management
  useEffect(() => {
    async function fetchEvents() {
      const cacheKey = "REGISTRY_EVENT_DATA";

      if (!isCacheStale(cacheKey, cacheExpiryTime) || !updateCache) {
        const cachedData = JSON.parse(localStorage.getItem(cacheKey));
        if (cachedData) {
          setEvents(cachedData.data);
          return;
        }
      }

      //FIX
      if (updateCache || !events) {
        const { eventsData, errorMessage, loading } =
          useFetchNPCCreditEvents(updateCache);

        if (errorMessage) {
          setErrorMessage(String(errorMessage));
          return;
        }
        // Cache the fetched data
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: eventsData,
            timestamp: Date.now(),
          })
        );

        setUpdateCache(false);
      }
    }

    if (producersData) {
      fetchEvents();
    }
  }, [producersData, updateCache]);

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  const handleAccountSearchToggle = () => {
    setIsAccountSearchOpen(!isAccountSearchOpen);
  };

  return (
    <Container>
      <Content animate="visible">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <FixedTitle>
              <Heading isSmallScreen={isSmallScreen}>
                - Credit Registry -
              </Heading>
              <AccountSearchButton onClick={handleAccountSearchToggle}>
                Account Search
              </AccountSearchButton>
            </FixedTitle>
            <br />
            <StyledTable>
              <thead>
                <tr>
                  <StyledTh>Data</StyledTh>
                  <StyledTh>Value</StyledTh>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <StyledTd>{item.label}</StyledTd>
                    <StyledTd>{item.value}</StyledTd>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
            <DynamicList>
              <Heading2>Farmers</Heading2>
              <Line width={"50%"} />
              <ProducersData producersData={producersData} />
              <Heading2>Events</Heading2>
              <Line width={"50%"} />
              {events.map((event, index) => (
                <EventData key={index} event={event} />
              ))}
            </DynamicList>
          </>
        )}
        {errorMessage && (
          <MessageContainer type="error">
            {errorMessage}
            <CloseButton type="error" onClick={clearErrorMessage}>
              Close
            </CloseButton>
          </MessageContainer>
        )}
        <AccountSearch
          isOpen={isAccountSearchOpen}
          setIsOpen={handleAccountSearchToggle}
        />
      </Content>
    </Container>
  );
}

export default ExplorerPage;

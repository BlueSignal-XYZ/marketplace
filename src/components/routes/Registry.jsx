import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import EventData from '../elements/EventData';
import ProducersData from '../elements/ProducersData';
import AccountSearch from '../elements/AccountSearch';
import Line from '../elements/Line';
import { NUMBERS } from '../../scripts/helpers';
import { NPCCreditsAPI } from '../../scripts/back_door';
import { media, safeAreaInsets } from '../../styles/breakpoints';

/* -------------------------------------------------------------------------- */
/*                              STYLED COMPONENTS                             */
/* -------------------------------------------------------------------------- */

const Container = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1280px;
  min-height: 100%;
  box-sizing: border-box;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px clamp(20px, 4vw, 32px);
  padding-bottom: calc(48px + ${safeAreaInsets.bottom});
  box-sizing: border-box;

  ${media.lg} {
    padding: 32px clamp(20px, 4vw, 32px) 64px;
  }
`;

const Heading = styled.h1`
  font-size: clamp(16px, 4vw, 24px);
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.ui900 || '#111827'};
  margin: 0;
  letter-spacing: -0.01em;
`;

const DynamicList = styled.div`
  width: 100%;
  padding: 0;
  margin-top: 32px;
`;

const Heading2 = styled.h2`
  width: 100%;
  font-size: clamp(1em, 3vw, 1.5em);
  font-weight: 700;
  text-align: center;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors?.ui900 || '#111827'};
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows?.sm || '0 1px 3px rgba(0,0,0,0.1)'};
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 320px;
`;

const StyledTh = styled.th`
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors?.ui900 || '#111827'};
  color: #ffffff;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  ${media.mobileOnly} {
    padding: 10px 12px;
  }
`;

const StyledTd = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.ui200 || '#e5e7eb'};
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui700 || '#374151'};

  ${media.mobileOnly} {
    padding: 10px 12px;
    font-size: 13px;
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  margin: 64px auto;
  border: 3px solid ${({ theme }) => theme.colors?.ui200 || '#e5e7eb'};
  border-left-color: ${({ theme }) => theme.colors?.primary500 || '#1D7072'};
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: ${spin} 0.8s infinite linear;
`;

const MessageContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 16px;
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${({ type, theme }) =>
    type === 'error' ? theme.colors?.red50 || '#fef2f2' : theme.colors?.success50 || '#ecfdf5'};
  color: ${({ type, theme }) =>
    type === 'error' ? theme.colors?.red700 || '#b91c1c' : theme.colors?.success700 || '#047857'};
  border: 1px solid
    ${({ type, theme }) =>
      type === 'error' ? theme.colors?.red200 || '#fecaca' : theme.colors?.success200 || '#a7f3d0'};
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows?.lg || '0 10px 15px -3px rgba(0,0,0,0.1)'};
  font-size: 14px;
  max-width: calc(100vw - 32px);
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s ease-out;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }
`;

const AccountSearchButton = styled.button`
  border-radius: 8px;
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || '#e5e7eb'};
  background: #ffffff;
  color: ${({ theme }) => theme.colors?.ui700 || '#374151'};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-out;
  min-height: 44px;

  &:hover {
    background: ${({ theme }) => theme.colors?.ui50 || '#fafafa'};
    border-color: ${({ theme }) => theme.colors?.ui300 || '#d1d5db'};
  }

  &:active {
    transform: scale(0.97);
  }

  ${media.mobileOnly} {
    font-size: 13px;
    padding: 6px 12px;
  }
`;

const FixedTitle = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid ${({ theme }) => theme.colors?.ui200 || '#e5e7eb'};
  padding: 0 16px;
  box-shadow: ${({ theme }) => theme.shadows?.xs || '0 1px 2px rgba(0,0,0,0.05)'};
  box-sizing: border-box;
  z-index: 10;
  border-radius: 12px 12px 0 0;
  margin-bottom: 24px;

  ${media.lg} {
    padding: 0 20px;
  }
`;

/* -------------------------------------------------------------------------- */
/*                                  CACHING                                   */
/* -------------------------------------------------------------------------- */

const isCacheStale = (key, expiryTime) => {
  const cachedItem = localStorage.getItem(key);
  if (!cachedItem) return true;

  const { timestamp } = JSON.parse(cachedItem);
  return Date.now() - timestamp > expiryTime;
};

const cacheExpiryTime = 600000; // 10 minutes

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

function ExplorerPage() {
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
    };

    NPCCreditsAPI.on('*', (e) => {
      handleEvent(e);
      e.removeListener();
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      const cacheKey = 'REGISTRY_OVERVIEW_DATA';

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
          const creditTypes = await NPCCreditsAPI.getCreditTypes(1); /** FIX ** */

          //Append credit types to live cache for internal use by app
          setLiveCache({ ...liveCache, creditTypes });

          const newData = [
            {
              label: 'Total Supply',
              value:
                totalSupply?.toString() +
                ' ' +
                `${NUMBERS.toNumber(totalSupply) > 0 ? 'AWG Credits' : 'AWG Credit'}`,
            },
            {
              label: 'Total Sold',
              value:
                totalSold?.toString() +
                ' ' +
                `${NUMBERS.toNumber(totalSold) > 0 ? 'AWG Credits' : 'AWG Credit'}`,
            },
            {
              label: 'Total Donated Credits',
              value:
                totalBurnedSupply?.toString() +
                ' ' +
                `${NUMBERS.toNumber(totalBurnedSupply) > 0 ? 'AWG Credits' : 'AWG Credit'}`,
            },
            { label: 'Credit Types', value: creditTypes?.join(', ') },
            {
              label: 'Total Certificates',
              value: totalCertificates?.toString(),
            },
            { label: 'Total Farmers', value: _producers?.length },
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
      const cacheKey = 'REGISTRY_PRODUCER_DATA';

      if (!isCacheStale(cacheKey, cacheExpiryTime) || !updateCache) {
        const cachedData = JSON.parse(localStorage.getItem(cacheKey));
        if (cachedData) {
          setProducersData(cachedData.data);
          return;
        }
      }

      if (updateCache || !producersData) {
        try {
          var { creditTypes } = liveCache;
          //Re-request if not available
          if (!creditTypes) {
            creditTypes = await NPCCreditsAPI.getCreditTypes(1);
          }
          const _producersData = await Promise.all(
            producers.map(async (producer) => {
              const verifiers = await NPCCreditsAPI.getProducerVerifiers(producer);
              const verifiersData = await Promise.all(
                verifiers.map(async (verifier) => {
                  const Supplies = await Promise.all(
                    creditTypes.map(async (creditType) => {
                      const supply = await NPCCreditsAPI.getSupply(producer, verifier, creditType);
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
          setErrorMessage('Failed to fetch producer data');
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
      const cacheKey = 'REGISTRY_EVENT_DATA';

      if (!isCacheStale(cacheKey, cacheExpiryTime) || !updateCache) {
        const cachedData = JSON.parse(localStorage.getItem(cacheKey));
        if (cachedData) {
          setEvents(cachedData.data);
          return;
        }
      }

      // TODO: replace with proper async fetch when backend is restored
      if (updateCache || !events) {
        const eventsData = [];

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
      <Content>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <FixedTitle>
              <Heading>Credit Registry</Heading>
              <AccountSearchButton onClick={handleAccountSearchToggle}>
                Account Search
              </AccountSearchButton>
            </FixedTitle>
            <TableWrapper>
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
            </TableWrapper>
            <DynamicList>
              <Heading2>Farmers</Heading2>
              <Line width={'100%'} />
              <ProducersData producersData={producersData} />
              <Heading2>Events</Heading2>
              <Line width={'100%'} />
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
        <AccountSearch isOpen={isAccountSearchOpen} setIsOpen={handleAccountSearchToggle} />
      </Content>
    </Container>
  );
}

export default ExplorerPage;

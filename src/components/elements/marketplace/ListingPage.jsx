import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { ethers } from "ethers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import PoSPopup from "./elements/PoSPopup";
import { formatLongString } from "../../../scripts/utils";
import placeholder from "../../../assets/icon.png";
import { ButtonPrimary, ButtonSecondary } from "../../shared/button/Button";
import { DashboardPage } from "../../shared/DashboardPage/DashboardPage";
import { MarketplaceAPI } from "../../../scripts/back_door";
import { useAppContext } from "../../../context/AppContext";

const logoColors = {
  primary: "#005A87",
  secondary: "#003F5E",
  accent: "#007BB5",
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.ui200};
  border-top: 4px solid ${({ theme }) => theme.colors.ui800};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${rotate} 0.8s linear infinite;
  margin: 20px auto;
`;

const ListingPageWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 24px 0px;
  width: 100%;
  box-sizing: border-box;
  animation: ${fadeIn} 0.6s ease-out;
  gap: 16px;

  @media (max-width: 900px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const BlurredBack = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const MainContent = styled.div`
  width: 80%;
  height: auto;
  margin-right: 20px;
  animation: ${fadeIn} 0.8s ease-out;

  border-radius: 4px;
  overflow: auto;

  @media (max-width: 900px) {
    width: 100%;
    margin-right: 0;
    overflow: visible;
  }
`;

const ButtonSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DrawerToggleButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 55px;
    right: 10px;
    z-index: 100;
    background: ${logoColors.primary};
    color: #fff;
  }
`;

const Section = styled.div`
  height: auto;
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 8px;

  transition: all 0.3s ease;
`;

const HeroSection = styled(Section)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: ${({ theme }) => theme.colors.ui200};
  .hero-section-info {
    display: flex;
    gap: 8px;
    align-items: center;
  }
`;

const TokenImage = styled(motion.img)`
  max-width: 80px;

  border: 1px solid ${({ theme }) => theme.colors.ui200};
  background: ${({ theme }) => theme.colors.ui50};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  padding: 24px;
  height: auto;
`;

const SectionTitle = styled.h2`
  margin-bottom: 4px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.ui800};
`;

const Item = styled.div``;

const ItemLabel = styled.span`
  font-weight: bold;
`;

const ItemData = styled.span`
  font-weight: 400;
  color: ${({ theme }) => theme.colors.ui600};
  font-size: 16px;
  font-weight: 500;
`;

//USE API
const ListingPage = () => {
  const { id } = useParams();
  const { STATES } = useAppContext();
  const { user } = STATES || {};
  const navigate = useNavigate();
  const [listingDetails, setListingDetails] = useState({});
  const [bidHistory, setBidHistory] = useState([]);
  const [saleHistory, setSaleHistory] = useState([]);
  const [actionType, setActionType] = useState("");
  const [showPoSPopup, setShowPoSPopup] = useState(false);
  const [userBidHistory, setUserBidHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const marketEvents = MarketplaceAPI.Events;

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  //   const [transferHistory, setTransferHistory] = useState([]);

  useEffect(() => {
    const fetchListingData = async () => {
      setIsLoading(true);
      try {
        const allEvents = (await marketEvents.getAllEvents())?.events;
        if (!allEvents) return;
        console.log({ allEvents });
        const listingEvents = allEvents.filter(
          (event) => event.listingId?.toString() === id
        );

        // Set the state based on the processed data
        setListingDetails(
          listingEvents.find((event) => event.type === "Listing") || {}
        );
        setBidHistory(
          listingEvents.filter(
            (event) =>
              event.type === "Bid Placed" || event.type === "Bid Accepted"
          )
        );
        setSaleHistory(listingEvents.filter((event) => event.type === "Sale"));
      } catch (error) {
        console.error("Error fetching listing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListingData();
  }, [id]);

  useEffect(() => {
    if (user) {
      fetchUserBids();
    }
  }, [user]);

  const fetchUserBids = async () => {
    const bidEvents = (await marketEvents.filtered.bidded())?.events;
    if (!bidEvents) return;
    //setUserBidHistory(bidEvents.filter(event => event.bidder === user.address && event.listingId === Number(id)));
    setUserBidHistory(
      bidEvents.filter((event) => event.listingId === Number(id))
    );
  };

  const openPoSPopup = (type) => {
    setActionType(type);
    setShowPoSPopup(true);
  };

  const closePoSPopup = () => {
    setShowPoSPopup(false);
  };

  const buyNFT = async (listingId, value) => {
    try {
      return await MarketplaceAPI.Buyer.buyNFT(
        listingId,
        ethers.parseUnits(value, "ether")
      );
    } catch (error) {
      console.error("Error buying NFT:", error);
      throw error; // Rethrow the error to handle it in the component
    }
  };

  const placeBid = async (listingId, value) => {
    try {
      return await MarketplaceAPI.Buyer.placeBid(
        listingId,
        ethers.parseUnits(value, "ether")
      );
    } catch (error) {
      console.error("Error placing bid:", error);
      throw error;
    }
  };

  const navigateBack = () => {
    navigate(-1);
  };

  if (!listingDetails) {
    return <p>Loading listing details...</p>;
  }

  return (
    <DashboardPage backHref={"/marketplace"} title={"Listing"}>
      <ListingPageWrapper>
        {isLoading ? (
          <Spinner />
        ) : (
          <MainContent>
            <HeroSection>
              <div className="hero-section-info">
                <TokenImage src={placeholder} />
                <div>
                  <SectionTitle>Listing #{id}</SectionTitle>
                  <Item>
                    <ItemData>${listingDetails.price}</ItemData>
                  </Item>
                </div>
              </div>
              <ButtonSection>
                <ButtonPrimary
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openPoSPopup("buy")}
                  disabled={isLoading}
                >
                  Buy Now
                </ButtonPrimary>
                <ButtonSecondary
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openPoSPopup("bid")}
                  disabled={isLoading}
                >
                  Make a Bid
                </ButtonSecondary>
                {/* Additional user actions */}
              </ButtonSection>
            </HeroSection>

            <Section>
              <SectionTitle>Bid History</SectionTitle>
              {bidHistory.map((bid, index) => (
                <Item key={index}>
                  <ItemLabel>
                    Action: <ItemData>{bid.type}</ItemData>
                  </ItemLabel>
                  <ItemLabel>
                    Bidder: <ItemData>{bid.bidder}</ItemData>
                  </ItemLabel>
                  <ItemLabel>
                    Amount: <ItemData>{bid.amount} Matic</ItemData>
                  </ItemLabel>
                  {/* ... Other bid details */}
                </Item>
              ))}
            </Section>

            <Section>
              <SectionTitle>Sale History</SectionTitle>
              {saleHistory.map((sale, index) => (
                <Item key={index}>
                  <ItemLabel>
                    Buyer: <ItemData>{sale.buyer}</ItemData>
                  </ItemLabel>
                  <ItemLabel>
                    Sale Price: <ItemData>{sale.price} Matic</ItemData>
                  </ItemLabel>
                  {/* ... Other sale details */}
                </Item>
              ))}
            </Section>
            <Section>
              <SectionTitle>Your Bid History</SectionTitle>
              {user ? (
                <>
                  {userBidHistory.length > 0 ? (
                    userBidHistory.map((bidEvent) => (
                      <Item key={bidEvent.blockNumber}>
                        <ItemLabel>
                          Block: <ItemData>{bidEvent.blockNumber}</ItemData>
                        </ItemLabel>
                        <ItemLabel>
                          Amount: <ItemData>{bidEvent.amount} Matic</ItemData>
                        </ItemLabel>
                        {/* ... Other bid details */}
                      </Item>
                    ))
                  ) : (
                    <p>
                      No Bids
                      {/* for {frmoatLongString(user)} */}
                    </p>
                  )}
                </>
              ) : (
                <p>User Not Connected</p>
              )}
            </Section>
          </MainContent>
        )}

        <DrawerToggleButton onClick={toggleDrawer}>
          <FontAwesomeIcon icon={isDrawerOpen ? faArrowLeft : faArrowRight} />
        </DrawerToggleButton>

        <Section></Section>

        {showPoSPopup && (
          <BlurredBack
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PoSPopup
              closePopup={closePoSPopup}
              actionType={actionType}
              listingId={id}
              listingPrice={listingDetails.price}
              buyNFT={buyNFT}
              placeBid={placeBid}
            />
          </BlurredBack>
        )}
      </ListingPageWrapper>
    </DashboardPage>
  );
};

export default ListingPage;

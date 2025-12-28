import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ethers } from "ethers";
import { NFTCard } from "./elements";
import { useNavigate } from "react-router-dom";
import { MarketplaceAPI } from "../../../scripts/back_door";
import { ListingCardSkeleton } from "../../shared/Skeleton/Skeleton";

export const NFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 20px 32px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
    padding: 0 16px 24px;
  }
`;

const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors?.red500 || "#EF4444"};
  text-align: center;
  padding: 24px;
  background: ${({ theme }) => theme.colors?.red50 || "#FEF2F2"};
  border-radius: 12px;
  margin: 0 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.ui600};
  font-size: 14px;
  padding: 48px 24px;
  grid-column: 1 / -1;

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.ui700};
    margin: 0 0 8px;
  }

  p {
    margin: 0;
  }
`;

const MarketBrowser = () => {
  const navigate = useNavigate();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const marketEvents = MarketplaceAPI.Events;

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await marketEvents?.listAvailableNFTs();
      setNfts(res?.nfts || []);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to load assets.");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <ErrorMsg>Error: {error}</ErrorMsg>;

  return (
    <NFTGrid>
      {loading ? (
        // Show skeleton cards while loading
        Array.from({ length: 6 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))
      ) : nfts?.length > 0 ? (
        nfts.map((nft, index) => (
          <NFTCard key={index} nft={nft} navigate={navigate} />
        ))
      ) : (
        <EmptyState>
          <h4>No listings available</h4>
          <p>Check back soon for new water quality credits.</p>
        </EmptyState>
      )}
    </NFTGrid>
  );
};

export default MarketBrowser;
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ethers } from "ethers";
import { NFTCard } from "./elements";
import { useNavigate } from "react-router-dom";
import { MarketplaceAPI } from "../../../scripts/back_door";

export const NFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  grid-gap: 20px;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding-bottom: 24px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const LoadingIndicator = styled.div`
  border: 5px solid ${({ theme }) => theme.colors.ui200};
  border-top: 5px solid ${({ theme }) => theme.colors.ui800};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 0.8s linear infinite;
  margin: auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMsg = styled.p`
  color: red;
  text-align: center;
`;

const StyledLoading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .loading-text {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.ui800};
    text-align: center;
    margin-top: 8px;
    font-size: 14px;
  }
`;

const EmptyState = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.ui600};
  font-size: 14px;
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

  if (loading)
    return (
      <StyledLoading>
        <LoadingIndicator />
        <div className="loading-text">Loading items…</div>
      </StyledLoading>
    );

  if (error) return <ErrorMsg>Error: {error}</ErrorMsg>;

  return (
    <NFTGrid>
      {nfts?.length > 0 ? (
        nfts.map((nft, index) => (
          <NFTCard key={index} nft={nft} navigate={navigate} />
        ))
      ) : (
        <EmptyState>No assets available.</EmptyState>
      )}
    </NFTGrid>
  );
};

export default MarketBrowser;
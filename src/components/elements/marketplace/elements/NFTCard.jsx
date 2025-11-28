import React from "react";
import styled from "styled-components";

import { formatLongString } from "../../../../scripts/utils";
import placeholderIMG from "../../../../assets/icon.png";
import { ButtonPrimary } from "../../../shared/button/Button";

const Card = styled.div`
  background-color: white;
  border: none;
  padding: 20px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  transition: transform 0.3s, box-shadow 0.3s;
  max-height: 400px;
  overflow: auto;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.ui50};
  border: 1px solid ${({ theme }) => theme.colors.ui200};

  .upper-section {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (max-width: 480px) {
    .upper-section {
      align-items: flex-start;
    }
  }
`;

export const NFTImage = styled.img`
  width: 64px;
  height: 64px;
  padding: 8px;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.ui200};
  border-radius: 10px;
  object-fit: cover;
  margin-bottom: 10px;
`;

const NFTInfo = styled.div`
  padding: 10px 0;
`;

const Title = styled.h3`
  font-size: 1rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.ui800};
  font-weight: 500;
`;

const Seller = styled.p`
  color: ${({ theme }) => theme.colors.ui600};
  font-size: 14px;
  margin: 5px 0;
  font-weight: 500;
`;

const Price = styled.p`
  color: ${({ theme }) => theme.colors.primary500};
  font-size: 1rem;
  font-weight: 600;
`;

const NFTCard = ({ nft, navigate }) => (
  <Card>
    <div className="upper-section">
      <NFTImage src={nft.image || placeholderIMG} alt={nft.name} />

      <div>
        <Title>
          {nft.name} #{Number(nft.tokenId)}
        </Title>
        <Price>${Math.round(nft.price * Math.random() * 100)}</Price>
      </div>
    </div>

    <NFTInfo>
      {/* <Seller>Seller: {formatLongString(nft.seller)}</Seller> */}
      <Seller>Seller: NeptuneChain*</Seller>
      <Seller>Available: {Math.round(Math.random() * 100)}</Seller>
    </NFTInfo>

    <ButtonPrimary onClick={() => navigate(`listing/${nft.listingId}`)}>
      Buy Now
    </ButtonPrimary>
  </Card>
);

export default NFTCard;
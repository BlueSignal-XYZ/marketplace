import React from "react";
import styled from "styled-components";

import { formatLongString } from "../../../../scripts/utils";
import placeholderIMG from "../../../../assets/icon.png";
import { ButtonPrimary } from "../../../shared/button/Button";
import { hoverLift } from "../../../../styles/animations";

const Card = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.ui200};
  border-radius: ${({ theme }) => theme.borderRadius.md || "16px"};
  padding: 18px;
  box-sizing: border-box;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  gap: 12px;

  /* Enhanced hover effect */
  ${hoverLift}

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary300 || "#5DC9CC"};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary400 || "#38BDBE"};
    outline-offset: 2px;
  }

  .upper-section {
    display: flex;
    align-items: center;
    gap: 12px;
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
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h3`
  font-size: 15px;
  margin: 0 0 2px 0;
  color: ${({ theme }) => theme.colors.ui900};
  font-weight: 600;
  line-height: 1.4;
`;

const Seller = styled.p`
  color: ${({ theme }) => theme.colors.ui600};
  font-size: 13px;
  margin: 0;
  font-weight: 400;
  line-height: 1.5;
`;

const Price = styled.p`
  color: ${({ theme }) => theme.colors.primary600};
  font-size: 16px;
  font-weight: 700;
  margin: 2px 0 0 0;
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
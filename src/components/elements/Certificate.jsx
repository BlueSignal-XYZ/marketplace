import React from "react";
import styled from "styled-components";

import Line from "./Line";
import { AppIcon } from "../../assets";

import { formatCertificateID, timestampToLocale } from "../../scripts/helpers";

const CertificateOutline = styled.div`
  box-sizing: border-box;
  flex-direction: column;
  width: 60%;
  padding: 40px;
  background-color: #fff;
  border: 2px solid #000;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  background: linear-gradient(145deg, #dee6de, #ffffff);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 5px solid #0d5b84;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  margin: auto;
  margin-bottom: 10px;
  span {
    color: #2b6987;
  }
  border: 5px solid #0d5b84;
  box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.75);

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Logo = styled.img`
  width: 150px;
  margin-bottom: 20px;
`;

const Heading1 = styled.h1`
  font-size: 28px;
  margin-bottom: 10px;
`;

const Heading4 = styled.h4`
  font-size: 18px;
  margin-bottom: 10px;
`;

const Heading2 = styled.h2`
  font-size: 14px;
  margin-bottom: 10px;
`;

const Signiture = styled.h2`
  font-size: 14px;
  font-style: italic;
  margin-bottom: 10px;
  font-family: "Dancing Script", cursive;
  font-size: 20px;
`;

const Heading6 = styled.h6`
  font-size: 14px;
  margin-bottom: 30px;
`;

const DivBlock = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const DivBlockInner = styled.div`
  flex: 1;
  text-align: center;

  @media (max-width: 700px) {
    margin-bottom: 20px;
  }
`;

const Certificate = ({ data }) => {
  const {
    id,
    buyer,
    producer,
    verifier,
    balance,
    timestamp,
    type,
    creditType,
    price,
  } = data ? data : {};
  const date = timestampToLocale(Number(timestamp));
  return (
    <CertificateOutline id="thin-scroll">
      <Logo
        src={AppIcon}
        loading="lazy"
        sizes="(max-width: 479px) 75.98958587646484px, (max-width: 767px) 83.99305725097656px, (max-width: 991px) 12vw, 120.00000762939453px"
        alt="WaterQuality.Trading AppIcon"
      />
      <Heading1>Nutrient Trading</Heading1>
      <Heading4>Nutrient Pollution Removal Certificate</Heading4>
      <Heading1>
        <span>{Number(balance)}</span> NPRCs
      </Heading1>
      {type === "transfer" ? (
        <Heading6>
          This certifies that the ownership of{" "}
          <span>{`${Number(balance)} ${creditType?.toUpperCase()} `}</span>
          Credits was transferred to <span>
            {buyer?.toUpperCase()}
          </span> from <span>{producer?.toUpperCase()}</span> on{" "}
          <span>{date}</span> at the price of <span>${Number(price)}</span>
          /Credit.
        </Heading6>
      ) : (
        <Heading6>
          This certifies that the buyer, <span>{buyer?.toUpperCase()}</span>,
          paid the producer, <span>{producer?.toUpperCase()}</span>, for the
          ownership of{" "}
          <span>{`${Number(balance)} ${creditType?.toUpperCase()} `}</span>
          Credits on <span>{date}</span> at the price of{" "}
          <span>${Number(price)}</span>
          /Credit.
        </Heading6>
      )}
      <DivBlock>
        <DivBlockInner>
          <Heading4>Supplied by:</Heading4>
          <Signiture>{producer}</Signiture>
          <Line width={"80%"} />
          <Heading2>{producer?.toUpperCase()}</Heading2>
        </DivBlockInner>
        <DivBlockInner>
          <Heading4>Verified by:</Heading4>
          <Signiture>{verifier}</Signiture>
          <Line width={"80%"} />
          <Heading2>{verifier?.toUpperCase()}</Heading2>
        </DivBlockInner>
        <DivBlockInner>
          <Heading4>Issued by:</Heading4>
          <Signiture>Jacques De Jean</Signiture>
          <Line width={"80%"} />
          <Heading2>BLUESIGNAL LLC</Heading2>
        </DivBlockInner>
      </DivBlock>
      <Heading4>ID: {formatCertificateID(id)}</Heading4>
    </CertificateOutline>
  );
};

export default Certificate;

import React from "react";
import styled from "styled-components";
import icon from "../../assets/icon.png";

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #dee6de, #ffffff);
  width: 100%;
  width: 600px;
  border-radius: 8px;
  padding: 16px;
  padding-bottom: 25px;
  cursor: pointer;
  border: 5px solid #0d5b84;
  box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.75);
  margin-bottom: 25px;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px,
    rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px,
    rgba(0, 0, 0, 0.09) 0px 32px 16px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
  }

  @media (max-width: 768px) {
    width: 80%;
    max-width: 250px;
  }

  @media (max-width: 480px) {
    width: 90%;
    max-width: 200px;
  }
`;

const Logo = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const Title = styled.h3`
  font-size: 18px;
  margin-top: 12px;
  margin-bottom: 8px;
  text-align: center;
`;

const Description = styled.p`
  color: #777777;
  margin-bottom: 8px;
  text-align: center;
`;

const Value = styled.p`
  font-weight: bold;
  text-align: center;
  color: #2b6987;
`;

const Card = styled.a`
  text-decoration: none;
  color: black;
`;

const formatCertificateID = (number) =>
  "NPRC-" + String(number).padStart(7, "0");

const CertificateThumbnail = ({ certificate }) => {
  const { id, producer, balance } = certificate ? certificate : {};
  const certID = formatCertificateID(id);
  return (
    <Card href={`/certificate?id=${id}`} target="blank">
      <CardWrapper>
        <Logo src={icon} alt="WaterQuality.Trading Icon" loading="lazy" />
        <Title>WATERQUALITY.TRADING</Title>
        <Description>Nutrient Pollution Removal Certificate</Description>
        <p>{producer?.toUpperCase()}</p>
        <Value>{balance} NPCs</Value>
        <h5>ID: {certID}</h5>
      </CardWrapper>
    </Card>
  );
};

export default CertificateThumbnail;

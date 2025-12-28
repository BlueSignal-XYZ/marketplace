import React from "react";
import styled from "styled-components";
import Logo from "../../../assets/icon.png";

const StyledCertificate = styled.div`
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.ui200};
  border-radius: 20px;
  padding: 40px 24px;
  max-width: 800px;
  margin: 0 auto;
  .certificate-icon {
    max-width: 60px;
    margin-bottom: 24px;
  }
  .certificate-domain {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.primary500};
  }
  .certificate-description {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    color: ${({ theme }) => theme.colors.ui600};
  }
  .certificate-nprc {
    font-weight: 700;
  }

  .certificate-nprc-unit {
    font-size: 64px;
    color: ${({ theme }) => theme.colors.primary500};
  }

  .certificate-long-description {
    font-size: 18px;
    max-width: 600px;
    margin: 16px auto;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.ui800};
  }

  .certificate-long-description--highlighted {
    color: ${({ theme }) => theme.colors.primary500};
  }

  .certificate-signatures {
    display: flex;
    margin-top: 40px;
    justify-content: space-between;
  }
  .certificate-signatures-label {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.ui800};
    margin-bottom: 4px;
  }
  .certificate-signature {
    font-family: "Brush Script MT", cursive;
    font-size: 32px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.ui200};
  }
  .certificate-name {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.ui800};
    margin-top: 4px;
  }
  .certificate-id {
    margin-top: 24px;
    color: ${({ theme }) => theme.colors.ui600};
  }
`;

function Certificate() {
  return (
    <StyledCertificate>
      <img className="certificate-icon" src={Logo} />
      <div className="certificate-domain">WaterQuality.Trading</div>
      <div className="certificate-description">
        Nutrient Pollution Removal Certificate
      </div>
      <div className="certificate-nprc">
        <span className="certificate-nprc-unit">1</span>NPRCs
      </div>
      <div className="certificate-long-description">
        This certifies that the buyer,{" "}
        <span className="certificate-long-description--highlighted">
          Jack J
        </span>{" "}
        paid the producer{" "}
        <span className="certificate-long-description--highlighted">Don</span>
        for the ownership of{" "}
        <span className="certificate-long-description--highlighted">
          1
        </span>{" "}
        Phosphorus credits on 2024-01-01. at the price of{" "}
        <span className="certificate-long-description--highlighted">$60</span>
        /credit.
      </div>
      <div className="certificate-signatures">
        <div>
          <div className="certificate-signatures-label">Supplied by</div>
          <div className="certificate-signature">John Appleseed</div>
          <div className="certificate-name">John Appleseed</div>
        </div>
        <div>
          <div className="certificate-signatures-label">Verified by</div>
          <div className="certificate-signature">John Appleseed</div>
          <div className="certificate-name">John Appleseed</div>
        </div>
        <div>
          <div className="certificate-signatures-label">Issued by</div>
          <div className="certificate-signature">John Appleseed</div>
          <div className="certificate-name">John Appleseed</div>
        </div>
      </div>
      <div className="certificate-id"> ID: NPRC-0000031</div>
    </StyledCertificate>
  );
}

export default Certificate;

/**
 * Presale Component for the initial offering of credit offsets
 * 
 * Purpose:
 * Retrieves data about the featured producer including producerUsername, verifierUsername, type, location, supply, totalLandArea, priceId
 * Creates a lineItems with the featured producer's item/priceID and quantity
 * Load checkout process if isPaying.
 */
import React, { useState } from "react";
import { useTransition } from "react-spring";
import Payment from "../payment/Payment";

import { NUMBERS } from "../../scripts/helpers";

import { FaCertificate, FaLeaf } from "react-icons/fa6";
import MapBox from "../elements/MapBox";
import { ProductDisplay } from "../payment";
import { presaleProducer } from "../payment/data";
import { CARD_SECTION, CARD_WRAPPER, FULL_PAGE_CONTAINER } from "../payment/styled";



const Presale = () => {
 const [amount, setAmount] = useState(1);

  const [loading, setLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  //#Animation
  const transitions = useTransition(isPaying, {
    from: { opacity: 0 },
    enter: { opacity: 1 },

  });

  // Initialize checkout cart
  const checkoutItems = [
    {
      priceID: presaleProducer.priceId,
      quantity: NUMBERS.toNumber(amount),
    },
  ];

  const handlePayment = async () => {
    setIsPaying(true);
  };

  return (
    <FULL_PAGE_CONTAINER
 
    >
      <div id="checkout"></div>

      <MapBox />
      <CARD_WRAPPER>
        <CARD_SECTION>
        </CARD_SECTION>

        {/* Loads payment processing component if isPaying, otherwise load ProductPage. */}
        {transitions((style, isPaying) =>
          !isPaying ? (
            <ProductDisplay supplyManagement={{amount, setAmount}} handlePayment={handlePayment} />
          ) : (
            <CARD_SECTION style={style}>
              <Payment setIsPaying={setIsPaying} checkoutItems={checkoutItems} />
            </CARD_SECTION>
          )
        )}
      </CARD_WRAPPER>

      <div className="features">

      <div className="features-section">
        <FaLeaf />
        {/* REVIEW: Was "Eliminate Pollution" — credits offset, not eliminate */}
        <div className="features-section-title">Offset Pollution</div>
        <div className="features-section-paragraph">
          Enhance water quality and reduce pollution. Each purchase includes a
          tracking certificate with verified digital impact records.
        </div>
      </div>
      <div className="features-section">
        <FaCertificate />
        <div className="features-section-title">
          Nutrient Pollution Certificates
        </div>
        <div className="features-section-paragraph">
          Each credit offsets 1 pound of mixed nutrient pollutants in the
          watershed, supporting vital environmental conservation and restoration
          efforts.
        </div>
      </div>
</div>
    </FULL_PAGE_CONTAINER>
  );
};



export default Presale;

/**
 * Main Component to confirm and process order
 * 
 * Purpose:
 * gets checkout item from priceID which is retrieved from the first item within the checkout items. (Single item support)
 * Calculates how much user has to currently pay based on custimized discounts and payment plans.
 * On progression, checkout item and pay value is set into a checkout item  which triggers the checkout form
 */
import { useState, useEffect } from "react";
import { colors } from "../../data/styles";
import { logoColors } from "../../styles/colors";
import styled from 'styled-components';
import configs from "../../../configs";
import { ButtonPrimary } from "../shared/button/Button";
import { Label } from "../shared/Label/Label";
import { FaCheck } from "react-icons/fa6";

const StyledDiv = styled.div`
  background-color: ${colors.background};


h2 { 
  font-size: 24px;
  color: ${({theme}) => theme.colors.ui800};
  font-weight: 600; 
}

.info-text {
  color: ${({theme}) => theme.colors.ui600};
  font-weight: 500;
  font-size: 14px;
  margin-top: 16px;
}


${ButtonPrimary} { 
  margin-top: 24px;
}

.form-value {
   color: ${({theme}) => theme.colors.ui800};
   font-weight: 500; 
}


.form-section { 
  margin-top: 16px;
}


.stripe-confirm{ 
  margin-bottom: 16px;
  margin-top: 16px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({theme}) => theme.colors.primary500};
  svg {
    margin-right: 2px;
  }
}
`;



const DISCOUT_PERCENTAGE = 50;

export const unitToString = (unit) => String((unit / 100).toFixed(2));

function OrderConfirmation({ proceedToPayment, checkoutItems }) {
  const [item, setItem] = useState(null);
  const [payAmount, setPayAmount] = useState(null);
  const [error, setError] = useState(null);
  const serverUrl = configs.server_url;
  /**
   * Retrieve the first line item
   * ##TO-DO Support for more items later
   */
  const checkoutItem = checkoutItems?.[0] || {};

  /**
   * Retrieve checkout item from priceID
   */
  useEffect(() => {
    //#REQ# SERVER URL AND PRICE_ID IS DEFINED.
    const priceID = checkoutItem.priceID;
    if (serverUrl && priceID) {
      fetch(`${serverUrl}/stripe/get/price`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceID,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          const { price } = data;
          setItem({
            name: price.nickname,
            unit_amount: price.unit_amount,
            string_amount: unitToString(price.unit_amount), 
            currency: price.currency.toUpperCase(),
          });
        })
        .catch((error) =>
          setError({message: `Failed to fetch item details: ${error.message}`})
        );
    }
  }, []);

  useEffect(() => {
    const { unit_amount } = item || {};
    if (unit_amount) {
      const toPay = unit_amount - (DISCOUT_PERCENTAGE / 100) * unit_amount;
      setPayAmount(toPay);
    }
  }, [item]);

  if (error?.message) {
    return <div>{error.message}</div>; // Ideally, show a better loading state
  }

  if (!item) {
    return <div>Loading...</div>; // Ideally, show a better loading state
  }

  //Proceed to payment with item data and pay amount.
  const _proceedToPayment = () => {
    proceedToPayment?.(item, payAmount);
  };

  return (
    <StyledDiv>
      <h2>Order Confirmation</h2>
      <div className="form-section">

      <Label>
      Name: 
      </Label>
      <p className="form-value">{item.name}</p>
      </div>
      <div className="form-section">

      <Label>
      Price:
      </Label>
      <p className="form-value">
        {item.currency} {item.string_amount}
      </p>
      </div>
      <p className="stripe-confirm" style={{textAlign: "left"}}>
        <FaCheck />
        Purchase is accepted via Stripe.</p>
        <hr />

        <p className="info-text"> 

        Stripe will retain the card information, whereas we will retain the
        First and Last Name, Email Address, Quantity, Whether or not purchase is
        for a business, if so, what the business is named.
        </p>
        <p className="info-text">
          During presale, we hold 50% of the payment total. The other 50% will
          be processed upon the release of our initial supply.
        </p>

      <ButtonPrimary onClick={_proceedToPayment}>
        Proceed to Pay {item.currency} {unitToString(payAmount)}
        </ButtonPrimary>
    </StyledDiv>
  );
}

export default OrderConfirmation;

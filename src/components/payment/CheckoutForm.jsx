/**
 * Checkout component
 * 
 * Purpose:
 * Handle and process transactions
 * Only triggered when a checkoutItem is set
 * 
 */
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import Spinner from "./Spinner";
import configs from "../../../configs";
import { unitToString } from "./OrderConfirmation";
import {presaleProducer} from "./data";
import { ButtonPrimary } from "../shared/button/Button";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import {NPCCreditsAPI} from "../../scripts/back_door";
import { useAppContext } from "../../context/AppContext";




const Form = ({ item }) => {
  const stripe = useStripe();
  const elements = useElements();
  const naviagte = useNavigate();
  const { STATES } = useAppContext();
  const { user } = STATES;

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const { payAmount } = item || {};

  const amount = 1; //Test

  useEffect(() => {
    // Logic to enable/disable the submit button
    setCanSubmit(stripe !== null && elements !== null && !isProcessing);
  }, [stripe, elements, isProcessing]);

  const onSuccess = async () => {
    let certReturn = 0;
    try {
      const { producer, verifier, type } = presaleProducer;

      if (!user?.uid) {
        throw new Error("User not authenticated");
      }

      const data = await NPCCreditsAPI.buyCredits({
        accountID: user.uid,
        producer,
        verifier,
        creditType: type,
        amount,
        price: payAmount,
      });
  
      console.log("Data", data);
  
      const { certID } = data.response;
      if (certID > 0) {
        certReturn = certID;
      }
  
      console.log({ certReturn });
  
    } catch (error) {
      if (error?.shortMessage) {
        console.log("ERROR", error);
        // handle Message
      } else {
        console.log({ message: `Failed to fetch item details: ${error.message}` });
      }
      throw error; // Re-throw the error after handling it
    }
  
    return certReturn;
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsProcessing(true);
    setMessage(null); // Clear previous messages

      const { error } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required'
      });

      if (error) {
        const message =
          error.type === "card_error" || error.type === "validation_error"
            ? error.message
            : "An unexpected error occurred.";
        setMessage(message);
      } else {
        // Successful Payment
        setMessage("Payment Successful");
        const newCert = await onSuccess();
        console.log({newCert});
        if (newCert > 0) {
          naviagte(`/certificate/${newCert}`);
        } else {
          setMessage("Certificate Error");
        }
      }

    setIsProcessing(false);
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    disabled: { opacity: 0.5 },
  };

  return (
    <StyledPayment>

    <form
      id="payment-form"
      onSubmit={handleSubmit}
      style={{ maxWidth: "400px", margin: "0 auto", position: "relative" }}
      >
      <p className="stripe-title">Payments are handled by Stripe</p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        id="payment-element-container"
        >
        <PaymentElement id="payment-element" />
      </motion.div>

      <ButtonPrimary
        variants={buttonVariants}
        
        animate={isProcessing ? "disabled" : ""}
        disabled={!canSubmit}
        id="submit"
        >
        {isProcessing ? (
          <Spinner />
        ) : (
          `Pay ${item?.item?.currency?.toUpperCase?.()} ${unitToString(
            payAmount
          )}`
        )}
      </ButtonPrimary>

      {message && (
        <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        id="payment-message"
        style={{ marginTop: "20px", color: "red", textAlign: "center" }}
        >
          {message}
        </motion.div>
      )}
    </form>
</StyledPayment>
  );
};

const CheckoutForm = ({ item }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  
  const serverUrl = configs.server_url;
  const stripe_config = { stripePromise, clientSecret };
  
  const { payAmount } = item || {};

  useEffect(() => {
    console.log("stripe_config", stripe_config);
  }, [stripe_config]);

  // Load Stripe
  useEffect(() => {
    fetch(`${serverUrl}/stripe/config`, {
      method: "POST",
    }).then(async (r) => {
      const { publishableKey } = await r.json();
      console.log("publishableKey", publishableKey);
      setStripePromise(loadStripe(publishableKey));
    });
  }, [serverUrl]);

  // Create Payment Intent
  useEffect(() => {
    //#REQ# SERVER, STRIPE, AND PAY AMOUNT (ABOVE $0.50 [50 CENTS]) SHOULD BE DEFINED.
    console.log(
      "isIntentful",
      serverUrl && stripePromise && payAmount >= 50,
      serverUrl,
      stripePromise,
      payAmount
    );
    if (serverUrl && stripePromise && payAmount >= 50) {
      fetch(`${serverUrl}/stripe/create/payment_intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currency: "USD",
          amount: payAmount,
        }),
      }).then(async (result) => {
        const { payment_intent } = await result.json();
        setClientSecret(payment_intent?.clientSecret);
      });
    }
  }, [stripePromise, item]);

  //#REQ# STRIPE, CLIENT SECRET AND ITEM SHOULD BE DEFINED.
  if (!stripePromise || !clientSecret || !item) {
    return;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <Form item={item} />
    </Elements>
  );
};

export default CheckoutForm;


const StyledPayment = styled.div`
  
.stripe-title {
  font-size: 16px;
  margin-bottom: 16px;
  color: ${({theme}) => theme.colors.ui800};
}
  
`
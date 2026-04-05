/**
 * Payment Processing Component
 *
 * Purpose: Handles the payment processing process.
 */
import { useState, useEffect, useRef } from 'react';
import CheckoutForm from './CheckoutForm';
import CustomerInfoForm from './CustomerInfoForm';
import { FaTimes } from 'react-icons/fa';
import OrderConfirmation from './OrderConfirmation';
import './Payment.css';
import { FormWrapper } from './styled';

/**
 *
 * @param {function} setIsPaying set wheather paying or not
 * @param {Array} checkoutItems
 * @returns
 */
function Payment({ setIsPaying, checkoutItems }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutItem, setCheckoutItem] = useState(null);

  const numSteps = 2; // Number of steps in the form slideshow.
  const formRef = useRef(null);

  useEffect(() => {
    if (checkoutItem) {
      setCurrentStep(3);
    }
  }, [checkoutItem]);

  //Exit Payment
  const exitSteps = () => {
    setIsPaying?.(false);
  };

  const goToNextStep = () => {
    if (currentStep < numSteps) {
      setCurrentStep(currentStep + 1);
      formRef.current.classList.add('slide-left');
      setTimeout(() => {
        formRef.current.classList.remove('slide-left');
      }, 500);
    }
  };

  /**
   *
   * @param {Object} item
   * @param {number || null} payAmount
   * @returns
   */
  const proceedToPayment = (item, payAmount) => setCheckoutItem({ item, payAmount });

  return (
    <FormWrapper>
      <div className="form-container" ref={formRef}>
        {currentStep === 1 && <CustomerInfoForm onNextClick={goToNextStep} />}
        {currentStep === 2 && (
          <OrderConfirmation proceedToPayment={proceedToPayment} checkoutItems={checkoutItems} />
        )}
        {currentStep === 3 && checkoutItem && <CheckoutForm item={checkoutItem} />}
      </div>
      <div className="navigation">
        <FaTimes onClick={exitSteps} />
      </div>
    </FormWrapper>
  );
}

export default Payment;

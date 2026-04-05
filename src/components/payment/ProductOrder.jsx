/**
 * Product Order Component
 * 
 * Purpose: Provides order details about credits and allows users to enter quantity for purchase given the supply is available.
 */
import {Description, FormInfo, FormInputs, FormWrapper, InputBox, Title} from "./styled";
import {Button} from "react-bootstrap";

const NPC_PRODUCT_DATA = {
  title:
  `Offset Pollution`, // REVIEW: Was "Eliminate Pollution" — credits offset, not eliminate
  description:
  `Enhance water quality and reduce pollution. Each purchase includes a tracking certificate with verified digital impact records.`,
  formTitle:
  `Nutrient Pollution Certificates`,
  formText:
  `Each credit offsets 1 pound of mixed nutrient pollutants in the watershed, supporting vital environmental conservation and restoration efforts.`,
}

const ProductOrder = ({isLoading, supplyManagement, handlePayment}) => {
  const {amount, setAmount} = supplyManagement || {};
  const { title, description, formTitle, formText } = NPC_PRODUCT_DATA || {};
  return (
    <>
      <Title>{title}</Title>

      <Description>{description}</Description>

      <FormWrapper>
        <FormInfo>
          <h3>{formTitle}</h3>
          {formText}
        </FormInfo>

        <FormInputs>
          <InputBox
            type="number"
            value={amount}
            onChange={(e) => setAmount?.(e.target.value)}
            placeholder="Enter your amount"
          />
        </FormInputs>

        <Button
          id="remove-carbon-button"
          className="py-1.5 px-6 text-sm md:py-2.5 md:px-7 font-bold rounded focus:ring-4 focus:ring-teal-700 focus:ring-opacity-50 text-center text-gray-900 bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 w-full"
          onClick={handlePayment}
        >
          {isLoading ? "Processing..." : "Buy Offsets"}
        </Button>
      </FormWrapper>
    </>
  );
};

export default ProductOrder;

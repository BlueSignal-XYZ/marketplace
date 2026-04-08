import { motion } from 'framer-motion';
import { animated } from 'react-spring';
import styled from 'styled-components';
import { colors } from '../../data/styles';

export const FULL_PAGE_CONTAINER = styled(motion.div)`
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  max-width: 800px;
  padding: 2rem 1rem;
  box-sizing: border-box;

  overflow: auto;
  overflow-x: hidden;

  transition: 0.5s ease-in-out;
  .features {
    display: grid;
    gap: 32px;
    margin-top: 64px;

    @media (min-width: 672px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .features-section {
    border: 1px solid ${({ theme }) => theme.colors.ui200};
    border-radius: 10px;
    padding: 24px;
    svg {
      font-size: 40px;
      color: ${({ theme }) => theme.colors.primary500};
      margin-bottom: 24px;
    }
    .features-section-title {
      font-size: 16px;
      color: ${({ theme }) => theme.colors.ui800};
      font-weight: 600;
    }
    .features-section-paragraph {
      font-size: 14px;
      color: ${({ theme }) => theme.colors.ui700};
      font-weight: 500;
      margin-top: 8px;
    }
  }
`;

export const CARD_WRAPPER = styled.div`
  box-sizing: border-box;

  ${({ popup }) => popup && 'filter: blur(20px);'}

  overflow: hidden;

  border-radius: 10px;
  width: 100%;
  // box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: auto;
  }
`;

export const CARD_SECTION = styled(animated.div)`
  flex: 1;

  box-sizing: border-box;

  border-radius: 10px;
  // box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;

  @media (max-width: 767px) {
    width: 100%;
    padding: 0.5rem;
  }
`;

export const Flex = styled.div`
  width: ${({ width }) => (width ? width : '50%')};
  display: flex;
  flex-direction: ${({ direction }) => (direction ? direction : 'row')};
  align-items: ${({ align }) => (align ? align : 'flex-start')};
  justify-content: ${({ justify }) => (justify ? justify : 'flex-start')};
`;

export const InfoBox = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  border-radius: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  text-align: left;

  .disclaimer {
    margin-top: 12px;
  }

  h3 {
    margin: 0 0 10px;
    font-size: 20px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.ui800};
  }

  p {
    margin: 0;
  }
`;

export const CardContent = styled.div`
  margin-top: 40px;
  font-size: 0.8rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;

  .card-stats {
    display: flex;
    margin-top: 8px;
    gap: 16px;
  }
  .card-stat {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.ui600};
    svg {
      color: ${({ theme }) => theme.colors.primary500};
    }
  }

  h3 {
    margin: 0;
  }

  .subtext {
    margin: 0;
  }

  .link {
    color: ${colors.accent};
    font-weight: 500;
    margin: 0;
    font-size: 0.9rem;
    transition: 0.3s ease;
    cursor: pointer;
  }

  .link:hover {
    text-decoration: underline;
  }
`;

export const ErrorMessage = styled.div`
  color: red;
  margin: 10px 0;
`;

/*******************Product Order Component Styles***************************** */

export const Title = styled.h1`
  font-size: 1.7rem;
  color: #123456;
`;

export const Description = styled.p`
  margin: 0;
  text-align: justify;
  font-size: 0.9rem;
`;

export const FormWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: justify;

  overflow: auto;

  margin: 0;
  box-sizing: border-box;
`;

export const FormInfo = styled(Description)`
  text-align: justify;
  width: 80%;
  font-style: italic;
  font-size: 0.8rem;
  margin: 0;
`;

export const FormInputs = styled.div`
  width: 100%;
  padding: 0.5rem 1rem;

  box-sizing: border-box;
`;

export const inputGlobalStyles = `
width: 95%;
display: block;

font-family: inherit;
font-size: 0.8rem;
line-height: 1.5rem;
font-weight: 700;
color: rgba(31, 33, 35, 1);

outline: none;
appearance: none;
background-color: rgb(255, 255, 255);
border: 1px solid rgba(228, 231, 233, 1);
box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
border-radius: 0.25rem;

margin: 0.2rem 0;
padding: 0.75rem;
box-sizing: border-box;
`;

export const InputBox = styled.input`
  ${inputGlobalStyles}
`;

export const Button = styled.button`
  border: 0px solid;
  box-sizing: border-box;
  border-color: rgba(250, 251, 251, 1);
  margin: 0px;
  font-family: inherit;
  text-transform: none;
  background-image: none;
  cursor: pointer;
  padding: 0px;
  appearance: button;
  //width: 90%;
  border-radius: 0.25rem;
  background: ${colors.accent};
  text-align: center;
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 700;
  color: white;
  padding-left: 1.75rem;
  padding-right: 1.75rem;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
  margin-top: 20px;
  transition: 0.3s ease-in-out;

  &:hover {
    scale: 1.1;
  }
`;

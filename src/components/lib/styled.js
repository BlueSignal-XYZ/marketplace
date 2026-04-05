import styled from 'styled-components';
import { motion } from 'framer-motion';

export const WELCOME_LOGO = styled.img``;

export const WELCOME_HEADING = styled.h1``;

export const INPUT = styled.input``;

export const CardContainer = styled.div`
  width: 100%;
`;

export const LOADING_ANIMATION = styled(motion.div)``;

export const PROMPT_CARD = styled.div``;

export const PROMPT_FORM = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .register-button {
    margin-top: 24px;
  }
`;

export const BUTTON = styled(motion.button)``;

export const TEXT_LINK = styled.button`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.ui800};
  font-size: 0.875rem;
`;

import styled from 'styled-components';
import { logoColors } from '../../../../styles/colors';

export const MARKETPLACE_HEADER = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: ${logoColors.secondary};
  padding: 10px 40px;
  box-sizing: border-box;
  max-height: 50px;
  text-align: center;
  font-size: 1em;
  font-family: 'Pacifico', cursive;
  color: #ffffff;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); // Adds depth
  transition: background-color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 1.5em;
    padding: 15px 0;
  }
`;

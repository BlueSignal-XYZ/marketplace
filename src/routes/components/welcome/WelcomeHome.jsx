import React from "react";
import styled from "styled-components";
import { BUTTON, PROMPT_CARD } from "../../../components/lib/styled";
import { logoImage } from "../../Welcome";
const Title = styled.h1`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.ui800};

  text-align: left;
  margin-bottom: 1rem;
`;

const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.ui600};
  text-align: left;
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export const contentVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1, delay: 0.2 } },
};

export const StyledWelcomeHome = styled.div`
  background: url("https://images.unsplash.com/photo-1498408040764-ab6eb772a145?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");

  background-size: cover;
  background-position: center;
  position: relative;
  padding: 40px 24px;
  > * {
    color: White;
    position: relative;
    z-index: 2;
    max-width: 400px;
    @media (min-width: 1024px) {
      color: inherit;
    }
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    height: 100%;
    background: rgba(
      0,
      0,
      0,
      0.4
    ); // Adjust the rgba value for different overlay colors and opacities
    z-index: 0; // Ensure the overlay is on top of the background image
    @media (min-width: 1024px) {
      background: none;
    }
  }
  margin-bottom: 40px;

  @media (min-width: 1024px) {
    background: none;
    padding: 0px;
    padding-left: 0px;
  }

  .logo-white {
    background: white;
    width: auto;
    max-width: 180px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 24px;
    margin-bottom: 16px;
    @media (min-width: 1024px) {
      padding: 0px;
      margin-bottom: 40px;
    }
    img {
      width: 100%;
    }
  }
`;

const getDynamicWelcomeMessage = (username) => {
  const hours = new Date().getHours();
  let timeOfDay = "Day";
  if (hours < 12) {
    timeOfDay = "Morning";
  } else if (hours < 18) {
    timeOfDay = "Afternoon";
  } else {
    timeOfDay = "Evening";
  }
  return `Good ${timeOfDay}, ${username}`;
};

const WelcomeHome = ({ user, setCardState, enterDash }) => {
  const { username } = user || {};

  return (
    <StyledWelcomeHome
      variants={contentVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="logo-white">
        <img src={logoImage} alt="WQT Logo" />
      </div>
      <Title>
        {username
          ? getDynamicWelcomeMessage(username)
          : "Powered by BlueSignal LTD"}
      </Title>
      <Paragraph>
        Collaborate with your neighbors, utilities, and local organizations to strengthen water quality, restore ecosystems, and support healthy watersheds.
      </Paragraph>
    </StyledWelcomeHome>
  );
};

export default WelcomeHome;

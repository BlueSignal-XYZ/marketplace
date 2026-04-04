import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { getDefaultDashboardRoute } from "../utils/roleRouting";

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors?.ui100 || "#f4f4f5"};
`;

const Title = styled.h1`
  font-size: 48px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors?.ui900 || "#18181b"};

  @media (max-width: 480px) {
    font-size: 36px;
  }
`;

const Description = styled.p`
  font-size: 18px;
  margin-bottom: 32px;
  color: ${({ theme }) => theme.colors?.ui600 || "#52525b"};
  max-width: 400px;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const Button = styled(Link)`
  background-color: ${({ theme }) => theme.colors?.primary500 || "#1D7072"};
  color: white;
  padding: 12px 24px;
  border-radius: ${({ theme }) => theme.borderRadius?.default || "12px"};
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  transition: all 0.15s ease-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors?.primary600 || "#196061"};
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors?.primary500 || "#1D7072"};
    outline-offset: 2px;
  }
`;

const variants = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
};

const NotFound = () => {
  const { STATES } = useAppContext();
  const { user, isLoading } = STATES || {};

  // Detect mode based on hostname
  const host = window.location.hostname;
  const mode =
    host === "cloud.bluesignal.xyz" ||
    host.endsWith(".cloud.bluesignal.xyz") ||
    host === "cloud-bluesignal.web.app"
      ? "cloud"
      : "marketplace";

  // Determine home route based on user and mode
  const getHomeRoute = () => {
    if (user?.uid) {
      return getDefaultDashboardRoute(user, mode);
    }
    return "/"; // Login page for both modes
  };

  const homeRoute = getHomeRoute();

  return (
    <Container
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      {isLoading ? (
        <>
          <Description>Loading...</Description>
        </>
      ) : user?.uid ? (
        <>
          <Title>404 - Not Found</Title>
          <Description>The page you're looking for doesn't exist.</Description>
          <Button to={homeRoute}>Go Home</Button>
        </>
      ) : (
        <>
          <Title>404 - Not Found</Title>
          <Description>
            The page you're looking for doesn't exist or you do not have access.
          </Description>
          <Button to={homeRoute}>Go Home</Button>
        </>
      )}
    </Container>
  );
};

export default NotFound;

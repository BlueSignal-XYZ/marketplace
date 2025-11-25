import React from "react";
import styled from "styled-components";

const Shell = styled.div`
  min-height: 100vh;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eef2f5;
  color: #222;
`;

const Box = styled.div`
  background: white;
  padding: 32px;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
`;

const WelcomeShell = () => {
  return (
    <Shell>
      <Box>
        <h1>Welcome Shell</h1>
        <p>This is the safe intermediate layer after WelcomeMinimal.</p>
        <p>Nothing heavy is loaded yet.</p>
      </Box>
    </Shell>
  );
};

export default WelcomeShell;
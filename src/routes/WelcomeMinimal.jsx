import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  min-height: 100vh;
  padding: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eef2f5;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  .box {
    background: white;
    padding: 32px;
    border-radius: 12px;
    text-align: center;
    max-width: 360px;
    width: 100%;
    box-shadow: 0px 12px 32px rgba(0, 0, 0, 0.08);
  }

  button {
    margin-top: 16px;
    padding: 12px 16px;
    background: #0052cc;
    border-radius: 6px;
    border: none;
    color: white;
    font-weight: 600;
    cursor: pointer;
  }
`;

const WelcomeMinimal = () => {
  return (
    <Wrapper>
      <div className="box">
        <h2>WelcomeMinimal.jsx</h2>
        <p>This is the testing version of the welcome screen.</p>
        <p><code>{window.location.origin}</code></p>
      </div>
    </Wrapper>
  );
};

export default WelcomeMinimal;
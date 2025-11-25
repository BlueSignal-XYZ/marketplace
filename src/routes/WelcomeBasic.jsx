import React from "react";
import styled from "styled-components";
import { WelcomeHome } from "./components/welcome";
import Footer from "../components/shared/Footer/Footer";

const backgroundImage = new URL(
  "../assets/wallpapers/welcome_wallpaper.jpg",
  import.meta.url
).href;

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .content {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 1024px) {
      flex-direction: column;
    }
  }

  .section-left {
    width: 100%;
    display: none;

    @media (min-width: 1024px) {
      display: block;
      max-width: 45vw;
      height: calc(100vh - 24px);
    }

    img {
      border-radius: 32px;
      width: 100%;
      height: 100%;
      padding: 24px;
      object-fit: cover;
    }
  }
`;

const WelcomeBasic = () => {
  return (
    <Wrapper>
      <div className="content">
        {/* LEFT SIDE (IMAGE) */}
        <div className="section-left">
          <img src={backgroundImage} />
        </div>

        {/* RIGHT SIDE (WelcomeHome) */}
        <div style={{ padding: "40px", maxWidth: "500px" }}>
          <WelcomeHome
            key="welcome-basic"
            user={null}
            setCardState={() => {}}
            enterDash={() => {}}
          />
        </div>
      </div>

      <Footer />
    </Wrapper>
  );
};

export default WelcomeBasic;
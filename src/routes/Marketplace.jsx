// /src/routes/Marketplace.jsx
import React, { useState } from "react";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faSearch } from "@fortawesome/free-solid-svg-icons";

import { useAppContext } from "../context/AppContext";
import Footer from "../components/shared/Footer/Footer";
import { MarketBrowser } from "../components/elements/marketplace";
import EventsPopup from "../components/elements/marketplace/EventsPopup";
import { Input } from "../components/shared/input/Input";
import { ButtonSecondary } from "../components/shared/button/Button";

// Wraps route content + footer, keeps footer at bottom
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Main Marketplace area (between header and footer)
const MarketplaceShell = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px 16px 48px;

  @media (min-width: 1024px) {
    padding: 40px 0 64px;
  }

  .signed-in {
    font-size: 13px;
    margin-bottom: 12px;
    color: ${({ theme }) => theme.colors.ui600};
  }
`;

const HeaderBlock = styled.header`
  margin-bottom: 24px;

  h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.ui900};
  }

  p {
    margin: 6px 0 0;
    font-size: 14px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.ui600};
    max-width: 640px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 28px;

    h1 {
      font-size: 24px;
    }
  }
`;

// Search + buttons bar with responsive behavior
const TopBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 20px;

  ${Input} {
    max-width: 420px;
    width: 100%;
  }

  .button-wrapper {
    display: flex;
    gap: 8px;
  }

  /* Desktop */
  @media (min-width: 901px) {
    .button-wrapper {
      width: auto;
    }
  }

  /* Tablet */
  @media (max-width: 900px) and (min-width: 601px) {
    flex-direction: column;
    align-items: stretch;

    .button-wrapper {
      width: 100%;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
  }

  /* Mobile */
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;

    .button-wrapper {
      width: 100%;
      flex-direction: column;
    }

    ${ButtonSecondary} {
      width: 100%;
    }
  }
`;

const BottomBar = styled.section`
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.ui200};
`;

const SearchIcon = styled(FontAwesomeIcon)`
  margin-left: 8px;
  font-size: 0.85rem;
`;

const CalendarIcon = styled(FontAwesomeIcon)`
  margin-right: 6px;
  font-size: 0.9rem;
`;

const Marketplace = () => {
  const { STATES } = useAppContext();
  const { user } = STATES || {};

  const [showEventsPopup, setShowEventsPopup] = useState(false);
  const toggleEventsPopup = () => setShowEventsPopup((prev) => !prev);

  return (
    <PageWrapper>
      <MarketplaceShell>
        {user?.email && (
          <div className="signed-in">
            Signed in as <strong>{user.email}</strong>
          </div>
        )}

        <HeaderBlock>
          <h1>WaterQuality.Trading Marketplace</h1>
          <p>
            Discover, review, and verify nutrient pollution certificates.
            Search live listings, explore recent removals, and track how
            clean-water projects are performing over time.
          </p>
        </HeaderBlock>

        <TopBar>
          <Input placeholder="Search for NPCs, projects, or locations..." />

          <div className="button-wrapper">
            <ButtonSecondary>
              Search
              <SearchIcon icon={faSearch} />
            </ButtonSecondary>

            <ButtonSecondary onClick={toggleEventsPopup}>
              <CalendarIcon icon={faCalendar} />
              View all Events
            </ButtonSecondary>
          </div>
        </TopBar>

        <BottomBar>
          <MarketBrowser />
        </BottomBar>

        {showEventsPopup && <EventsPopup onClose={toggleEventsPopup} />}
      </MarketplaceShell>

      <Footer />
    </PageWrapper>
  );
};

export default Marketplace;
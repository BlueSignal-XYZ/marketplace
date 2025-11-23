import React, { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { Sidebar_MenuItem } from "../../elements";
import { FaChevronDown } from "react-icons/fa6";
import {
  faBroadcastTower,
  faCalculator,
  faCheckCircle,
  faDollarSign,
  faLeaf,
  faShop,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { ProfileDropMenu } from "../../elements/navbar/elements";

const StyledSidebarContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;

  @media (min-width: 1200px) {
    padding: 40px 0px 40px 0px;
  }
`;

const sidebarItems = [
  {
    route: "environmental",
    cta: "Environment",
    icon: faLeaf,
    hasSubMenu: true,
  },
  {
    route: "/marketplace",
    cta: "Marketplace",
    icon: faShop,
  },
  {
    route: "financial",
    cta: "Finance",
    icon: faDollarSign,
  },
  {
    route: "/marketplace/seller-dashboard",
    cta: "Dashboard",
    icon: faStore,
  },
];

const environmentRoutes = [
  {
    route: "/dashboard/environmental",
    cta: "Dashboard",
    icon: faLeaf,
    hasSubMenu: true,
  },
  {
    route: "/features/nutrient-calculator",
    cta: "Nutrient Calculator",   // ✅ RESTORED TO ORIGINAL
    onclick: null,
    icon: faCalculator,
  },
  {
    route: "/features/stream",
    cta: "Broadcast Live",
    icon: faBroadcastTower,
  },
  {
    route: "/features/upload-media",
    cta: "Upload Media",
    icon: faLeaf,
  },
  {
    route: "/features/verification",
    cta: "Verification",
    onclick: null,
    icon: faCheckCircle,
  },
];

function SidebarContent() {
  const [openSection, setOpenSection] = useState("");
  return (
    <StyledSidebarContent>
      <StyledAccordion
        value={openSection}
        onValueChange={(value) => {
          setOpenSection(value);
        }}
        type="single"
        collapsible
      >
        {sidebarItems?.map((data, index) => {
          const { route, cta, icon, hasSubMenu } = data || {};
          return hasSubMenu ? (
            <Accordion.Item value="environmental" key={index}>
              <StyledAccordionTrigger className="trigger">
                <Sidebar_MenuItem
                  icon={icon}
                  itemName={cta}
                  isAccordionTrigger
                />
                <FaChevronDown className="AccordionChevron" aria-hidden />
              </StyledAccordionTrigger>
              <StyledAccordionContent className="content">
                {environmentRoutes.map((subData, subIndex) => {
                  const { route, cta, icon, onclick } = subData || {};
                  return (
                    <Link to={route} className="cta" key={cta}>
                      {cta}
                    </Link>
                  );
                })}
              </StyledAccordionContent>
            </Accordion.Item>
          ) : (
            <Accordion.Item
              onClick={() => {
                setOpenSection(data.cta);
              }}
              key={index}
              value={data.cta}
            >
              <Sidebar_MenuItem icon={icon} itemName={cta} route={route} />
            </Accordion.Item>
          );
        })}
      </StyledAccordion>
      <ProfileDropMenu />
    </StyledSidebarContent>
  );
}

export default SidebarContent;

const slideUp = keyframes`
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
`;

const slideDown = keyframes`
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
`;

const StyledAccordion = styled(Accordion.Root)`
  width: 100%;

  .content[data-state="open"] {
    animation: ${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1);
  }
  .content[data-state="closed"] {
    animation: ${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1);
  }
`;

const StyledAccordionTrigger = styled(Accordion.Trigger)`
  width: 100%;
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  text-align: left;

  font-weight: 500;
  .cta {
    font-weight: 500;
  }
  &[data-state="open"] {
    .AccordionChevron {
      transform: rotate(180deg);
    }
  }

  .AccordionChevron {
    transition: transform 300ms cubic-bezier(0.87, 0, 0.13, 1);
    font-size: 14px;
  }
`;

const StyledAccordionContent = styled(Accordion.Content)`
  padding-left: 38px;
  margin-left: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.ui600};
  font-size: 14px;
  overflow: hidden;

  border-bottom: 1px solid ${({ theme }) => theme.colors.ui300};
  .cta {
    padding: 8px 0px;
    display: block;
    color: ${({ theme }) => theme.colors.ui700};
    text-decoration: none;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
      color: ${({ theme }) => theme.colors.ui800};
    }
  }
`;
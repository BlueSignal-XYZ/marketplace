import styled from "styled-components";
import LogoWhite from "../../../assets/logo.png";
import SidebarPhone from "./SidebarPhone";
import SidebarContent from "./SidebarContent";
import {useAppContext} from "../../../context/AppContext";

const Sidebar = () => {
  const { STATES } = useAppContext();
  const { user } = STATES || {};
  const path = window.location.pathname.replace(/^\//, "");
  const isMarketplace = path.startsWith("marketplace");

  if(!user){
    return;
  }

  return (
    <>
      <SidebarPhone />
      <StyledSidebar isMarketplace={isMarketplace}>
        <LogoWrap>
          <img className="logo" src={LogoWhite} />
        </LogoWrap>
        <SidebarContent />
      </StyledSidebar>
    </>
  );
};
const StyledSidebar = styled.aside`
  width: 400px;
  background: ${({ theme }) => theme.colors.ui50};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  display: none;

  @media (min-width: 1200px) {
    display: block;
  }
`;

const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  img {
    width: 125px;
  }
  h1 {
    font-size: 16px;
    color: ${({ theme }) => theme.colors.ui800};
  }
`;

export default Sidebar;

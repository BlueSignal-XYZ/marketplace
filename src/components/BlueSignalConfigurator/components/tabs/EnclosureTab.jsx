// Enclosure Tab Component - Interactive enclosure view with component details
import styled from "styled-components";
import { EnclosureView } from "../diagrams";

// Dark wrapper for neon-styled enclosure view
const DarkWrapper = styled.div`
  background: #0a0a0a;
  border-radius: 12px;
  margin: -24px;
  padding: 24px;
`;

const EnclosureTab = ({ product }) => (
  <DarkWrapper>
    <EnclosureView product={product} />
  </DarkWrapper>
);

export default EnclosureTab;

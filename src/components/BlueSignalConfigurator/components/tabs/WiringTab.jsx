// Wiring Tab Component
import React from "react";
import { SectionTitle, SvgContainer } from "../../styles";
import { WiringDiagram } from "../diagrams";

const WiringTab = ({ product }) => (
  <div>
    <SectionTitle>Electrical Wiring</SectionTitle>
    <SvgContainer>
      <WiringDiagram product={product} />
    </SvgContainer>
  </div>
);

export default WiringTab;

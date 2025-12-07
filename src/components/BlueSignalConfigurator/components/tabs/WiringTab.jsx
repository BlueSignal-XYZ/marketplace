// Wiring Tab Component - Enhanced with detailed wire runs and test points
import React from "react";
import { SectionTitle } from "../../styles";
import { EnhancedWiringDiagram } from "../diagrams";

const WiringTab = ({ product }) => (
  <div>
    <SectionTitle>Electrical Wiring</SectionTitle>
    <EnhancedWiringDiagram product={product} />
  </div>
);

export default WiringTab;

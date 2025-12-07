// Enclosure Tab Component - Interactive enclosure view with component details
import React from "react";
import { SectionTitle } from "../../styles";
import { EnclosureView } from "../diagrams";

const EnclosureTab = ({ product }) => (
  <div>
    <SectionTitle>Enclosure Components</SectionTitle>
    <EnclosureView product={product} />
  </div>
);

export default EnclosureTab;

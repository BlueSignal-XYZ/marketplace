// Layout Tab Component
import React from "react";
import { SectionTitle, SvgContainer } from "../../styles";
import { LayoutDiagram } from "../diagrams";

const LayoutTab = ({ product }) => (
  <div>
    <SectionTitle>Physical Layout</SectionTitle>
    <SvgContainer>
      <LayoutDiagram product={product} />
    </SvgContainer>
  </div>
);

export default LayoutTab;

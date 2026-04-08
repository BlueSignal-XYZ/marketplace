import styled from 'styled-components';

const LineWrapper = styled.div`
  width: ${({ width }) => width || '100%'};
  height: 2px;
  background-color: #ccc;
  margin: auto;
`;

const Line = ({ width }) => {
  return <LineWrapper width={width} />;
};

export default Line;

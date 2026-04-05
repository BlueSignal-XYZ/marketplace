import styled from 'styled-components';

const ErrorComponent = styled.div`
  color: red;
`;

const Error = ({ error }) => {
  return <ErrorComponent>{error}</ErrorComponent>;
};

export default Error;

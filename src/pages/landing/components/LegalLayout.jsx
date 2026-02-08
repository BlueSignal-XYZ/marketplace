import styled from 'styled-components';
import Nav from './Nav';
import Footer from './Footer';

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  max-width: 720px;
  margin: 0 auto;
  padding: 140px 24px 80px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 110px 16px 48px;
  }
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 8px;
`;

const DateLine = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.w50};
  margin-bottom: 40px;
`;

const Content = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 16px;
  font-weight: 400;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.w70};

  h2 {
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.white};
    margin-top: 40px;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 17px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.w90};
    margin-top: 28px;
    margin-bottom: 12px;
  }

  p {
    margin-bottom: 16px;
  }

  ul, ol {
    padding-left: 24px;
    margin-bottom: 16px;
  }

  li {
    margin-bottom: 8px;
  }

  a {
    color: ${({ theme }) => theme.colors.blue};
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover {
      color: ${({ theme }) => theme.colors.blueB};
    }
  }

  strong {
    color: ${({ theme }) => theme.colors.w90};
    font-weight: 600;
  }
`;

const LegalLayout = ({ title, lastUpdated, children }) => (
  <Wrapper>
    <Nav />
    <Main>
      <Title>{title}</Title>
      <DateLine>Last updated: {lastUpdated}</DateLine>
      <Content>{children}</Content>
    </Main>
    <Footer />
  </Wrapper>
);

export default LegalLayout;

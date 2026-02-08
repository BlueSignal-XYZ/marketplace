import styled from 'styled-components';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 140px 24px 80px;

  @media (max-width: 768px) {
    padding: 110px 16px 48px;
  }
`;

const Code = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 12px;
`;

const Message = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.w50};
  margin-bottom: 32px;
  max-width: 400px;
`;

const HomeBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white};
  padding: 14px 28px;
  border-radius: 100px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 0 24px rgba(255,255,255,0.15);
  }
`;

const NotFoundPage = () => (
  <Wrapper>
    <Nav />
    <Main>
      <Code>404 — Page not found</Code>
      <Message>
        The page you&rsquo;re looking for doesn&rsquo;t exist or has been&nbsp;moved.
      </Message>
      <HomeBtn href="/">
        Back to Home
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </HomeBtn>
    </Main>
    <Footer />
  </Wrapper>
);

export default NotFoundPage;

/**
 * Global Error Boundary — catches render errors and shows branded fallback.
 * Prevents white-screen crashes and offers recovery actions.
 */

import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background: ${({ theme }) => theme?.colors?.background || '#f8f9fa'};
`;

const Card = styled.div`
  background: ${({ theme }) => theme?.colors?.surface || '#ffffff'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e5e7eb'};
  border-radius: 16px;
  padding: 48px;
  max-width: 520px;
  width: 100%;
  text-align: center;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
`;

const Icon = styled.div`
  font-size: 56px;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme?.colors?.text || '#111827'};
  margin: 0 0 12px;
`;

const Message = styled.p`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme?.colors?.textSecondary || '#6b7280'};
  margin: 0 0 32px;
  line-height: 1.6;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Btn = styled.button`
  padding: 10px 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover { opacity: 0.85; }
`;

const PrimaryBtn = styled(Btn)`
  background: ${({ theme }) => theme?.colors?.primary || '#0052CC'};
  color: #fff;
  border: none;
`;

const SecondaryBtn = styled(Btn)`
  background: transparent;
  color: ${({ theme }) => theme?.colors?.text || '#111827'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e5e7eb'};
`;

const Details = styled.details`
  margin-top: 24px;
  text-align: left;
`;

const Summary = styled.summary`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 12px;
  color: ${({ theme }) => theme?.colors?.textMuted || '#9ca3af'};
  cursor: pointer;
  margin-bottom: 8px;
`;

const ErrorDetail = styled.pre`
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, monospace;
  font-size: 11px;
  color: ${({ theme }) => theme?.colors?.textSecondary || '#6b7280'};
  background: ${({ theme }) => theme?.colors?.background || '#f3f4f6'};
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 200px;
  overflow-y: auto;
`;

function ErrorFallback({ error, resetError, platform }) {
  const brandName = platform === 'cloud' ? 'BlueSignal Cloud' : 'WaterQuality.Trading';

  return (
    <Wrapper>
      <Card>
        <Icon>⚠️</Icon>
        <Title>Something went wrong</Title>
        <Message>
          {brandName} encountered an unexpected error.
          This has been logged and our team will investigate.
          You can try again or return to the home page.
        </Message>
        <ButtonRow>
          <SecondaryBtn onClick={() => { window.location.href = '/'; }}>
            Return to Home
          </SecondaryBtn>
          <PrimaryBtn onClick={resetError}>
            Try Again
          </PrimaryBtn>
        </ButtonRow>
        {error && (
          <Details>
            <Summary>Error details</Summary>
            <ErrorDetail>
              {error.message || 'Unknown error'}
              {error.stack && `\n\n${error.stack}`}
            </ErrorDetail>
          </Details>
        )}
      </Card>
    </Wrapper>
  );
}

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Uncaught render error:', error, errorInfo);
    console.error('[ErrorBoundary] Stack trace:', error?.stack);
    console.error('[ErrorBoundary] Component stack:', errorInfo?.componentStack);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetError={this.resetError}
          platform={this.props.platform}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

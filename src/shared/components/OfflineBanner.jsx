import styled from 'styled-components';

const Banner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: #dc2626;
  color: #fff;
  text-align: center;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
`;

export function OfflineBanner() {
  return (
    <Banner>
      You are offline. Some features may be unavailable until your connection is restored.
    </Banner>
  );
}

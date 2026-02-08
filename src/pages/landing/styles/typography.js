import styled from 'styled-components';

export const SectionLabel = styled.span`
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.colors.blueB};
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(28px, 3.8vw, 48px);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 20px;
  text-wrap: balance;

  ${({ theme }) => theme.media.md} {
    margin-bottom: 16px;
  }
`;

export const SectionDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(14px, 1.4vw, 17px);
  font-weight: 400;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.w50};
  max-width: 540px;
`;

export const SpecValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  white-space: nowrap;
`;

export const Container = styled.div`
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 24px;

  ${({ theme }) => theme.media.md} {
    padding: 0 16px;
  }
`;

export const Section = styled.section`
  padding: 120px 0;

  ${({ theme }) => theme.media.md} {
    padding: 64px 0;
  }

  ${({ theme }) => theme.media.sm} {
    padding: 48px 0;
  }
`;

import styled from "styled-components";

const Button = styled.button`
  height: ${({ theme }) => theme.formHeightMd};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0px 24px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  font-size: 14px;
  font-weight: 600;
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
  transition: all 0.15s ease-out;
  border: none;
`;

export const ButtonPrimary = styled(Button)`
  background: ${({ theme }) => theme.colors.primary500};
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary600};
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.ui200};
    color: ${({ theme }) => theme.colors.ui500};
    box-shadow: none;
  }
`;

export const ButtonSecondary = styled(Button)`
  border: 1px solid ${({ theme }) => theme.colors.ui200};
  color: ${({ theme }) => theme.colors.primary500};
  background: white;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.ui100};
    border-color: ${({ theme }) => theme.colors.ui300};
  }

  &:active:not(:disabled) {
    background: ${({ theme }) => theme.colors.ui200};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.ui400};
    border-color: ${({ theme }) => theme.colors.ui200};
  }
`;

export const ButtonLink = styled(Button)`
  text-decoration: underline;
  color: ${({ theme }) => theme.colors.primary500};
  padding: 0px;
  background: transparent;
  box-shadow: none;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.primary600};
    background: transparent;
  }

  svg {
    color: ${({ theme }) => theme.colors.ui600};
    font-size: 12px;
  }
`;

export const ButtonIcon = styled(Button)`
  height: 40px;
  width: 40px;
  font-size: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  background: ${({ theme }) => theme.colors.ui50};
  color: ${({ theme }) => theme.colors.ui800};
  border: 1px solid ${({ theme }) => theme.colors.ui200};
  padding: 0px;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.ui100};
    border-color: ${({ theme }) => theme.colors.ui300};
  }

  &:active:not(:disabled) {
    background: ${({ theme }) => theme.colors.ui200};
  }
`;

export const ButtonDanger = styled(Button)`
  background: ${({ theme }) => theme.colors.red500};
  color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.red600};
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.ui200};
    color: ${({ theme }) => theme.colors.ui500};
    box-shadow: none;
  }
`;

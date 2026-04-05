import styled from 'styled-components';
import { ButtonIcon } from '../button/Button';
import { FaChevronLeft } from 'react-icons/fa6';

const Dashboard = styled.main`
  width: 100%;
  height: 100%;
`;

const TitleContent = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.ui800};
  letter-spacing: -0.2px;
`;

const TitleDescription = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.ui600};
  font-weight: 500;
`;

const DashboardTop = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 8px;
  padding: 1rem;

  gap: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.ui200};
`;

export const DashboardPage = ({ children, title, backHref, description }) => {
  return (
    <Dashboard>
      <DashboardTop>
        {typeof backHref !== 'undefined' && (
          <ButtonIcon href={backHref} as="a">
            <FaChevronLeft />
          </ButtonIcon>
        )}
        <div>
          <TitleContent>{title}</TitleContent>
          <TitleDescription>{description}</TitleDescription>
        </div>
      </DashboardTop>
      {children}
    </Dashboard>
  );
};

import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import 'font-awesome/css/font-awesome.min.css';

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'green';
    case 'pending':
      return 'orange';
    case 'failed':
      return 'red';
    default:
      return 'gray';
  }
}

const RecordsCard = ({ title, records, width }) => {
  return (
    <AnimatePresence>
      <CardContainer width={width}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentList>
            {records?.map((record, index) => (
              <Content key={index}>
                <span>{record.date}</span>
                <span>{record.amount}</span>
                <Status>
                  <i className={`fa ${record.status === 'completed' ? 'fa-check-circle' : record.status === 'pending' ? 'fa-clock-o' : 'fa-times-circle'}`} style={{ color: getStatusColor(record.status) }} />
                  <Tooltip>{record.status}</Tooltip>
                </Status>
              </Content>
            ))}
          </ContentList>
        </CardContent>
      </CardContainer>
    </AnimatePresence>
  );
};

const CardContainer = styled(motion.div)`
    flex: 0 0 auto;
    width: ${({ width }) => width ? width : '90%'};
    height: 400px;
    margin: auto;
    display: flex;
    padding: 0.5rem;
    min-width: 300px;
    position: relative;
    box-shadow: 0px 0px 10px 0px #d4d4d4;
    box-sizing: border-box;
    align-items: flex-start;
    border-radius: 4px;
    flex-direction: column;
    background-color: #ffffff;
  
    @media (max-width: 768px) {
      width: 100%;
    }
  `;

const CardHeader = styled.div`
    flex: 0 0 auto;
    width: 100%;
    height: 15%;
    display: flex;
    align-items: center;
    padding-top: 0.5rem;
    justify-content: space-between;
  `;

const CardTitle = styled.span`
    margin: 1rem;
    font-size: 1.1rem;
    font-style: normal;
    font-family: inherit;
    font-weight: 500;
  `;

const CardContent = styled.div`
    flex: 0 0 auto;
    width: 100%;
    height: 85%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
  `;

const ContentList = styled.ul`
    height: 100%;
    margin: 0px;
    padding-top: 1rem;
    padding-right: 1rem;
    list-style-position: outside;
  `;

const Content = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const Status = styled.span`
  position: relative;
  cursor: pointer;

  &:hover > div {
    display: block;
  }
`;

const Tooltip = styled.div`
  display: none;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 5px;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
`;

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.01, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" },
};

CardContainer.defaultProps = {
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
  variants: cardVariants,
  whileHover: "hover",
  transition: { type: "spring", stiffness: 100 },
};

RecordsCard.propTypes = {
  title: PropTypes.string,
  records: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      amount: PropTypes.number,
      status: PropTypes.string,
    })
  ),
};

RecordsCard.defaultProps = {
  title: "Transaction History",
  records: [],
};

export default RecordsCard;

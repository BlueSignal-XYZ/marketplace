import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../data/styles';
import { motion } from 'framer-motion';
import { formatCertificateID } from '../../scripts/helpers';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideDown = keyframes`
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: auto;
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    height: auto;
    opacity: 1;
  }
  to {
    height: 0;
    opacity: 0;
  }
`;

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 10px auto;
  min-height: 50px;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0px 0.5px 1.25px 0.5px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  overflow-wrap: break-word;
  margin-bottom: 15px;

  &:hover {
    box-shadow: 0px 1px 2.5px 1px rgba(0, 0, 0, 0.75);
  }
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  font-size: 1em;
  padding-left: 10px;
  padding-right: 10px;
  transition: 0.3s ease-in-out;

  @media (max-width: 768px) {
    font-size: 0.62em;
  }
`;

const Event = styled(Row)`
  background: ${colors.accent};
  border-radius: 0;
  color: white;
  cursor: pointer;
`;

const Key = styled.span`
  font-weight: bold;
  margin-right: 10px;
`;

const Value = styled.span`
  flex-grow: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArgsContainer = styled.div`
  overflow: hidden;
  height: ${({ expanded }) => (expanded ? 'auto' : '0')};
  animation: ${({ expanded }) => (expanded ? slideDown : slideUp)} 0.5s ease-in-out;
  opacity: ${({ expanded }) => (expanded ? '1' : '0')};
`;

const ViewReceiptsButton = styled.button`
  background-color: #222;
  border: none;
  background: ${colors.accent};
  color: #ffffff80;
  border-bottom: 0px solid ${colors.secondaryAccent};
  //box-shadow: 1.25px 1.25px 2.5px #223844, -2.5px -2.5px 5px #223844;
  padding: 5px 0px;
  margin-right: 50px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.5s ease-in-out;

  &:hover {
    transform: scale(1.1);
    border-bottom: 2px solid ${colors.secondaryAccent};
    padding: 5px 10px;
    color: #fff;
    font-size: 1rem;
  }

  @media (max-width: 700px){
    display: none;
  }
};
`;
const ViewCertificateIcon = styled(FontAwesomeIcon)`
  display: none;
  font-size: 14px;
  margin-right: 25px;

  @media (max-width: 700px) {
    display: block;
  }
`;

function EventData({ event }) {
  const [expanded, setExpanded] = useState(false);
  const { args } = event;
  const formattedArgs = formatArgs(args);

  const handleViewCertificate = () => {
    const txURL = `/certificate?id=${formattedArgs[0].value}`;
    window.open(txURL, '_blank');
  };

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const containerVariants = {
    expanded: { height: 'auto', opacity: 1 },
    collapsed: { height: '0', opacity: 0 },
  };

  return (
    <Container
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: [1, 1.05, 1] }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
    >
      <Event onClick={handleExpand}>
        <Value>
          {event.event.replace(/([a-z])([A-Z])/g, '$1 $2')} | {event.timestamp}
        </Value>
        {event.event === 'CertificateCreated' && (
          <>
            <ViewReceiptsButton onClick={handleViewCertificate}>
              View Certificate
            </ViewReceiptsButton>
            <ViewCertificateIcon onClick={handleViewCertificate} icon={faEye} />
          </>
        )}
      </Event>
      <motion.div
        animate={expanded ? 'expanded' : 'collapsed'}
        variants={containerVariants}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {formattedArgs.map((arg, index) => (
          <Row key={index}>
            <Key>{arg.key}: </Key>
            <Value>
              {arg.key === 'CERTIFICATEID' ? formatCertificateID(arg.value) : arg.value}
            </Value>
          </Row>
        ))}
      </motion.div>
    </Container>
  );
}

function formatArgs(args) {
  const formattedArgs = [];

  for (let key in args) {
    if (!args.hasOwnProperty(key) || !isNaN(Number(key))) {
      continue;
    }

    formattedArgs.push({
      key: key.toLocaleUpperCase(),
      value: formatValue(args[key]),
    });
  }
  return formattedArgs;
}

function formatValue(value) {
  if (value == null) return '—';
  return String(value).toUpperCase();
}

export default EventData;

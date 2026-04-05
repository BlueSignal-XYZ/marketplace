import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ObjectViewer Component
 * The main component to render the object.
 *
 * @param {Object} props.data - The object data to render.
 */
const ObjectViewer = ({ data }) => {
  return (
    <Container>
      <ObjectDisplay data={data} />
    </Container>
  );
};

/**
 * ObjectItem Component
 * Renders individual key-value pairs.
 *
 * @param {Object} props
 * @param {string} props.keyName - The key of the object pair.
 * @param {any} props.value - The value of the object pair.
 * @param {number} props.level - Nesting level.
 */
const ObjectItem = ({ keyName, value, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isObject = typeof value === 'object' && value !== null;

  return (
    <>
      <Item level={level} isObject={isObject} onClick={() => isObject && setIsOpen(!isOpen)}>
        {keyName}: {isObject ? (isOpen ? '▼' : '▶') : String(value)}
      </Item>
      <AnimatePresence>
        {isObject && isOpen && (
          <Dropdown initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}>
            <ObjectDisplay data={value} level={level + 1} />
          </Dropdown>
        )}
      </AnimatePresence>
    </>
  );
};

/**
 * ObjectDisplay Component
 * Iterates over an object and renders its keys and values.
 *
 * @param {Object} props.data - The object to display.
 * @param {number} props.level - Nesting level.
 */
const ObjectDisplay = ({ data, level = 0 }) => {
  return (
    <>
      {Object.keys(data).map((key) => (
        <ObjectItem key={key} keyName={key} value={data[key]} level={level} />
      ))}
    </>
  );
};

/**
 * Container Styled Component
 * Provides a scrollable container for the object viewer.
 */
const Container = styled.div`
  height: 300px;
  max-height: 100vh;
  overflow: auto;
`;

/**
 * Item Styled Component
 * Styles individual items within the object, including nesting.
 */
const Item = styled(motion.div)`
  margin-left: ${(props) => props.level * 20}px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: ${(props) => (props.isObject ? 'pointer' : 'default')};
`;

/**
 * Dropdown Styled Component
 * Provides a collapsible container for nested objects.
 */
const Dropdown = styled(motion.div)`
  overflow: hidden;
`;

export default ObjectViewer;

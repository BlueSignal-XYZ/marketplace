import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "../../shared/Badge/Badge";
import { FaChevronDown } from "react-icons/fa";
import Spinner from "../../shared/Spinner/Spinner";
import { MarketplaceAPI } from "../../../scripts/back_door";
import {FaX} from "react-icons/fa6";

const FullScreenWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 100;
`;

const PopupWrapper = styled.div`
  position: fixed;
  top: 10vh;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  max-width: 1000px;
  height: 80vh;
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  box-sizing: border-box;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
  z-index: 101;
  overflow-y: auto;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  @media (max-width: 768px) {
    width: 95%;
    padding: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0px;
  right: 0px;
  cursor: pointer;
  border: none;
  background: none;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.ui400};
  transition: color 0.2s, transform 0.2s;
  font-size: 16px;
  &:hover {
    color: ${({ theme }) => theme.colors.ui800};
    transform: translateY(-2px);
  }
`;

const EventDetailWrapper = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.ui100};
  border-bottom: 1px solid ${({ theme }) => theme.colors.ui100};
  padding: 16px 0px;
`;

const EventSummary = styled(motion.div)`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.ui800};
`;

const EventTable = styled(motion.table)`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  margin-top: 12px;
  text-transform: capitalize;

  th {
    background-color: #f4f4f4;
    color: #333;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const NoEventsMessage = styled.p`
  color: #826251;
  font-style: italic;
`;

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  text-transform: capitalize;
  width: 100%;
  justify-content: flex-start;
`;

const ScrollableEventContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  margin-top: 40px;
  padding-bottom: 10px;
`;

const Event = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  svg {
    color: ${({ theme }) => theme.colors.ui600};
    font-size: 12px;
  }
`;

const variants = {
  open: { opacity: 1, height: "auto" },
  collapsed: { opacity: 0, height: 0 },
};

const EventDetail = ({ event, filterType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  const mainInfo =
    filterType === "all"
      ? { "": event.type || "unnamed" }
      : { "Listing #": event.listingId || "Not Available" };

  return (
    <EventDetailWrapper>
      <EventSummary
        onClick={toggleOpen}
        initial="initial"
        animate={isOpen ? "open" : "collapsed"}
      >
        {Object.entries(mainInfo).map(([_key, value], idx) => (
          <Event key={idx}>
            <p key={idx}>{value}</p>
            <FaChevronDown />
          </Event>
        ))}
      </EventSummary>

      <AnimatePresence>
        {isOpen && (
          <EventTable
            variants={variants}
            initial="initial"
            animate="open"
            exit="collapsed"
          >
            <tbody>
              {Object.entries(event).map(([key, value], idx) => (
                <tr key={idx}>
                  <td>{key}</td>
                  <td>
                    {typeof value === "string" ? value : JSON.stringify(value)}{" "}
                    {(key === "price" || key === "amount") && "$"}
                  </td>
                </tr>
              ))}
            </tbody>
          </EventTable>
        )}
      </AnimatePresence>
    </EventDetailWrapper>
  );
};

const EventsPopup = ({ onClose }) => {
  const [events, setEvents] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const marketEvents = MarketplaceAPI.Events;

  useEffect(() => {
    fetchData();
  }, [filterType]);

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const fetchEvents = async (
    filterType,
    rangeFilter = 500,
    toBlock = "latest"
  ) => {
    let _events;
    if (filterType in marketEvents.filtered) {
      _events = (await marketEvents.filtered[filterType](rangeFilter, toBlock))
        ?.events;
    } else {
      _events = (await marketEvents.getAllEvents(rangeFilter, toBlock))?.events;
    }

    if (Array.isArray(_events)) {
      setEvents(_events);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await fetchEvents(filterType);
    } catch (error) {
      setError(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FullScreenWrapper>
      <PopupWrapper>
        <CloseButton onClick={onClose}>✖ </CloseButton>
        <FilterSection>
          <Badge onClick={() => handleFilterChange("all")}>All Events</Badge>
          {Object.keys(marketEvents?.filtered ?? {}).map(
            (eventFunction, index) => (
              <Badge
                key={index}
                onClick={() => handleFilterChange(eventFunction)}
              >
                {eventFunction.replace(/([A-Z])/g, " $1").trim()} Events
              </Badge>
            )
          )}
        </FilterSection>

        <ScrollableEventContainer>
          {error && (
            <>
              <NoEventsMessage style={{ color: "red", display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <FaX onClick={() => setError(null)} />{error}
              </NoEventsMessage>
              
            </>
          )}
          {isLoading ? (
            <Spinner text="Loading Events..." />
          ) : events?.length === 0 ? (
            <NoEventsMessage>No events to display</NoEventsMessage>
          ) : (
            <AnimatePresence>
              {events?.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <EventDetail event={event} filterType={filterType} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </ScrollableEventContainer>
      </PopupWrapper>
    </FullScreenWrapper>
  );
};

export default EventsPopup;

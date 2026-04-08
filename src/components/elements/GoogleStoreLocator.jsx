import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import { MapsAPI } from '../../scripts/back_door';

const colorScheme = {
  background: '#FFFFFF',
  accent: '#0C5B84',
  secondaryAccent: '#90CAF9',
};

const containerStyle = {
  width: '100%',
  height: '100%',
};

const StoreListContainer = styled.div`
  width: ${(props) => (props.open ? '25%' : '0')};
  overflow-x: hidden;
  padding: ${(props) => (props.open ? '15px' : '0')};
  border-right: 1px solid ${colorScheme.secondaryAccent};
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  transition: 0.3s;

  @media (max-width: 768px) {
    width: ${(props) => (props.open ? '70%' : '0')};
  }
`;

const StoreList = styled.ul`
  width: 70%;
  height: 100vh;
  overflow-y: scroll;
  padding: 15px;
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const ListItem = styled.li`
  cursor: pointer;
  width: 90%;
  padding: 10px;
  margin: 0 auto;
  margin-bottom: 10px;
  border: 1px solid ${colorScheme.secondaryAccent};
  border-radius: 5px;
  // text-align: left;
  display: flex;
  flex-direction: column;
  // flex-wrap: wrap;
  // justify-content: space-between;
  align-items: flex-start;
  font-size: 0.8rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  oveflow: hidden;
  max-width: 100%;

  & > p {
    margin: 5px 0;
  }

  span {
    display: block;
    margin-bottom: 5px;
    font-size: 0.9rem;
    color: ${colorScheme.accent};
  }
`;

const MapContainer = styled.div`
  flex: 2;
`;

function GoogleStoreLocator({ storesData }) {
  const [_selectedStore, setSelectedStore] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStores, setFilteredStores] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [apiKey, setApiKey] = useState(null);

  const [isMobile, setIsMobile] = useState(false);

  const checkViewpoint = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    getKey();
    checkViewpoint();
    window.addEventListener('resize', checkViewpoint);
    return () => {
      window.removeEventListener('resize', checkViewpoint);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const stores = storesData.Database.map((store) => ({
    name: store.CompanyName,
    location: {
      lat: store.geometry?.coordinates?.[1],
      lng: store.geometry?.coordinates?.[0],
    },
    website: store.Website,
    email: store.Email,
    address: store['Address'],
    city: store['City'],
    states: store['States'],
    zipCode: store['Zip Code'],
  }));

  //const center = { lat: 37.926868, lng: -78.024902 };

  const center = { lat: 27.6648, lng: -81.5158 };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStores(stores);
    } else {
      const filtered = stores.filter((store) =>
        (store.name || '').toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
      setFilteredStores(filtered);
    }
  }, [searchTerm]);

  const getKey = async () => setApiKey((await MapsAPI.getAPI()) || null);

  const mapOptions = {
    styles: [
      {
        featureType: 'poi', // "poi" stands for points of interest
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
    ],
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        boxSizing: 'border-box',
        background: colorScheme.background,
      }}
    >
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          backgroundColor: colorScheme.accent,
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          padding: '10px',
          position: 'fixed',
          bottom: '15px',
          left: '15px',
          transform: 'translateY(-50%)',
          zIndex: '100',
        }}
      >
        {sidebarOpen ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
      </button>
      <StoreListContainer open={sidebarOpen}>
        <input
          type="text"
          placeholder="Search stores..."
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '80%',
            padding: '10px',
            borderRadius: '5px',
            border: `2px solid ${colorScheme.accent}`,
            outline: 'none',
            marginBottom: '20px',
          }}
        />
        <StoreList>
          {filteredStores.length > 0 ? (
            filteredStores.map((store, index) => (
              <ListItem key={index} onClick={() => setSelectedStore(store)}>
                <CompanyInfo>
                  <h4>{store.name}</h4>
                  {store.website && (
                    <p>
                      <span>Website:</span> {store.website}
                    </p>
                  )}
                  {store.address && (
                    <p>
                      <span>Address:</span> {store.address}, {store.city}, {store.states}{' '}
                      {store.zipCode}
                    </p>
                  )}
                  {store.email && (
                    <p>
                      <span>Email:</span> {store.email}
                    </p>
                  )}
                </CompanyInfo>
              </ListItem>
            ))
          ) : (
            <p>No Matches Found</p>
          )}
        </StoreList>
      </StoreListContainer>
      {apiKey ? (
        <MapContainer>
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={7}
              options={mapOptions}
            >
              {/* {stores.map((store, index) => (
              <Marker
                key={index}
                position={store.location}
                onClick={() => setSelectedStore(store)}
              />
            ))}
            {selectedStore && (
              <InfoWindow
                position={selectedStore.location}
                onCloseClick={() => setSelectedStore(null)}
              >
                <InfoWindowContent>
                  <h4>
                    {selectedStore.name}
                  </h4>
                  {selectedStore.address && <p>{selectedStore.address}, {selectedStore.city}, {selectedStore.states} {selectedStore.zipCode}</p>}
                  {selectedStore.website && <p><a href={selectedStore.website} target="_blank" rel="noreferrer">Visit Website</a></p>}
                  {selectedStore.email && <p><a href={`mailto:${selectedStore.email}`}>Email</a></p>}
                </InfoWindowContent>
              </InfoWindow>
            )} */}
            </GoogleMap>
          </LoadScript>
        </MapContainer>
      ) : (
        <div>KEY INVALID</div>
      )}
    </div>
  );
}

export default GoogleStoreLocator;

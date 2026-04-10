import GoogleStoreLocator from '../elements/GoogleStoreLocator';
import storeData from '../../data/companyData_Florida.json';

const Map = () => {
  return <GoogleStoreLocator storesData={storeData} />;
};

export default Map;

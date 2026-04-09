import { GoogleStoreLocator } from '../elements';
import storeData from '../../data/companyData_Florida.json';

const Map = () => {
  return <GoogleStoreLocator storesData={storeData} />;
};

export default Map;

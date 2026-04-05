import { GoogleStoreLocator } from "../elements";
import storeData from "../../data/companyData_Florida.json";

// const LoadingSpinner = styled(motion.div)`
//   display: inline-block;
//   margin: auto;
//   border: 4px solid rgba(0, 0, 0, 0.1);
//   border-left-color: #568ca9;
//   border-radius: 50%;
//   width: 30px;
//   height: 30px;
//   animation: ${spin} 2s linear infinite;
// `;

const Map = () => {
  return <GoogleStoreLocator storesData={storeData} />;
};

export default Map;

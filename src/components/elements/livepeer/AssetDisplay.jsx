import { motion } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import {UploadButton} from "./MediaUpload";

const AssetCard = styled(motion.div)`
  border: 1px solid #ccc;
  padding: 20px;
  margin: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h2 {
    margin-top: 0;
  }

  .asset-details {
    margin-top: 20px;
  }

  .asset-details p {
    margin: 5px 0;
  }

  button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
`;

const AssetDisplay = ({ asset }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <AssetCard
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>{asset.name}</h2>
      <p>
        <strong>ID:</strong> {asset.id}
      </p>
      <p>
        <strong>Playback ID:</strong> {asset.playbackId}
      </p>
      <UploadButton onClick={handleToggleDetails}>{showDetails ? "Hide Details" : "Show Details"}</UploadButton>
      {showDetails && (
        <div className="asset-details">
          <p>
            <strong>Source Type:</strong> {asset.source.type}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(asset.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {new Date(asset.status.updatedAt).toLocaleString()}
          </p>
        </div>
      )}
    </AssetCard>
  );
};

export default AssetDisplay;

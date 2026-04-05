import styled from 'styled-components';
import { motion } from 'framer-motion';

const stages = ['Submitted', 'Disputed', 'Approved', 'Denied'];

const AssetCard = ({ metadata, onClick }) => {
  const { thumbnailUrl, name, description, tags, status } = metadata || {};

  const generateCta = (stage) => {
    switch (stage) {
      case 'Submitted':
        return 'Dispute Submission';
      case 'Disputed':
        return 'Resolve Dispute';
      case 'Approved':
        return 'View Approval';
      case 'Denied':
        return 'Dispute Denial';
      default:
        return 'Contact Support';
    }
  };

  const getStageClass = (stage) => {
    const currentIndex = stages.indexOf(status);
    const stageIndex = stages.indexOf(stage);
    if (currentIndex === stageIndex) return 'current';
    if (currentIndex > stageIndex) return 'completed';
    return '';
  };

  const cta = generateCta(status);

  return (
    <AssetCardContainer>
      <div className="thumbnail-container">
        <img src={thumbnailUrl} alt="Asset Thumbnail" className="thumbnail" />
      </div>
      <div className="details-container">
        <div className="header">
          <span className="title">{name}</span>
          <i className="icon">🔗</i>
        </div>
        <div className="asset-details">
          <div className="detail">{description}</div>
          {tags?.map((tag, index) => (
            <div key={index} className="detail">
              {tag}
            </div>
          ))}
        </div>
        <div className="status-container">
          {stages.map((stage, index) => (
            <div key={index} className={`status-circle ${getStageClass(stage)}`}>
              {index !== stages.length - 1 && <div className="status-line"></div>}
            </div>
          ))}
        </div>
      </div>
      <button className="cta-button" onClick={onClick}>
        {cta}
      </button>
    </AssetCardContainer>
  );
};

const AssetCardContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background-color: #fff;

  .thumbnail-container {
    flex: 1;
    height: 50%;
    overflow: hidden;
  }

  .thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .details-container {
    padding: 16px;
    display: flex;
    flex-direction: column;
    height: 50%;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .title {
    font-size: 1.2rem;
    font-weight: bold;
  }

  .icon {
    font-size: 1.2rem;
  }

  .asset-details {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
  }

  .detail {
    text-align: left;
    margin-bottom: 4px;
  }

  .status-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-bottom: 3rem;
  }

  .status-circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #ddd;
    position: relative;
  }

  .status-circle.completed {
    background-color: #4caf50;
  }

  .status-circle.current {
    background-color: #ff9800;
  }

  .status-line {
    position: absolute;
    width: calc(100% + 20px);
    height: 2px;
    background-color: #ddd;
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
  }

  .cta-button {
    position: absolute;
    bottom: 16px;
    right: 16px;
    padding: 8px 16px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .cta-button:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    max-width: 100%;

    .thumbnail {
      height: 200px;
    }

    .cta-button {
      bottom: 8px;
      right: 8px;
    }
  }
`;

export default AssetCard;

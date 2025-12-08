import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

//#BACK_END
import { UserAPI } from "../../../scripts/back_door";
import { NoVideosState } from "../../shared/EmptyState/EmptyState";

const Container = styled.div`
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
`;

const UploadCard = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors?.ui50 || "#f9fafb"};
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 8px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const UploadTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.ui800 || "#1f2937"};
  margin: 0 0 8px 0;
`;

const UploadMeta = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};
  margin: 0;
`;

const UploadsTab = ({ userId }) => {
  const [uploads, setUploads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, [userId]);

  const fetchVideos = async () => {
    const { videos, error } = await UserAPI.get.videos(userId);

    if (error) {
      console.error(videos);
    }

    if (videos) {
      setUploads(videos);
    }
  };

  const handleUpload = () => {
    navigate("/features/live/upload-media");
  };

  return (
    <Container>
      {uploads.length > 0 ? (
        uploads.map((upload, index) => (
          <UploadCard key={index}>
            <UploadTitle>{upload?.name || `Upload ${index + 1}`}</UploadTitle>
            <UploadMeta>
              {upload?.createdAt
                ? new Date(upload.createdAt).toLocaleDateString()
                : "Date unknown"}
            </UploadMeta>
          </UploadCard>
        ))
      ) : (
        <NoVideosState onUpload={handleUpload} />
      )}
    </Container>
  );
};

export default UploadsTab;

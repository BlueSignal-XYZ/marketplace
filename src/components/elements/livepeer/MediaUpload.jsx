import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, isSupported } from "tus-js-client";
//import { colors } from "../../../styles/colors";
import { MediaAPI, LivepeerAPI, AssetAPI } from "../../../scripts/back_door";
import { logDev, proxyLivepeerOriginEndpoint } from "../../../scripts/helpers";
import configs from "../../../../configs";
import AssetDisplay from "./AssetDisplay";
import { Player } from "@livepeer/react";
import { Input } from "../../shared/input/Input";
import FormSection from "../../shared/FormSection/FormSection";
import { ButtonPrimary } from "../../shared/button/Button";
import ButtonLoading from "../../shared/button/ButtonLoading";
import { DashboardPage } from "../../shared/DashboardPage/DashboardPage";
import { logoColors } from "../../../styles/colors";
import { useAppContext } from "../../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { isCloudMode } from "../../../utils/modeDetection";

const colors = {
  primaryBlue: "#1B3B6F",
  accentBlue: "#62B6F1",
  white: "#FFFFFF",
  lightGrey: "#F0F0F0",
  darkGrey: "#333333",
};

const DropZoneContainer = styled(motion.div)`
width: 50%;
  border: 1px dashed ${({ theme }) => theme.colors.ui300};
  padding: 40px 24px;
  height: 250px;
  border-radius: ${({ theme }) => theme.borderRadius};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  background: ${({ theme }) => theme.colors.ui50};
  border-radius: ${({ theme }) => theme.borderRadius.default};

  margin-bottom: 40px;
  .drag-n-drop-title {
    text-align: center;
    color: ${({ theme }) => theme.colors.ui800};
    font-weight: 500;
  }
`;

const AssetContainer = styled.div`
  width: 90%;
  height: 300px;
  margin: 0 auto;
  overflow-y: auto;

  .video-link {
    margin: 10px;
    padding: 5px 10px;
    border: 1px solid ${colors.darkGrey};
    border-radius: 5px;
    text-decoration: none;
    color: ${colors.white};
    background: ${colors.accentBlue};
    transition: transform 0.3s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }
  }

  .btn-more-data {
    margin: 5px;
    padding: 5px 10px;
    border: 1px solid ${colors.darkGrey};
    border-radius: 5px;
    color: ${colors.white};
    background: ${colors.primaryBlue};
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

const InputPreviewContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  .flex-col {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;

    .flex-col {
      padding: 1rem;
      box-sizing: border-box;
    }
  }
`;

const VideoInputContainer = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0 auto;
`;

const previewStyles = `
  width: 100%;
  height: 30rem;
  padding: 1rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  }
`;

const VideoPreview = styled.video`
  ${previewStyles}
`;

const AssetPlayer = styled(Player)`
  ${previewStyles}
`;

const DocPreview = styled.iframe`
  ${previewStyles}
`;

const ConcludeButton = styled.div`
  background: ${logoColors.primary};
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    padding: 0.8rem 1.3rem;
    background: ${logoColors.primary};
    color: #fff;
  }

  background: #000;
  width: 60%;
  margin: auto;
`;

export const UploadButton = styled.div`
 background: ${logoColors.primary};
 color: #fff;
 padding: 0.5rem 1rem;
 border-radius: 0.5rem;
 transition: 0.3s ease-in-out;
 display: flex;
 justify-content: center;
 margin: auto;
 margin-bottom: 1rem;
 cursor: pointer;

 &:hover {
 padding: 0.8rem 1.3rem;
 background: ${logoColors.primary};
 color: #fff;
 }
`;

 const UploadedMediaButton = styled(UploadButton)`
 width: 20%;
`;

const renderPreview = (previewURL, fileType) => {
  if (!(previewURL?.length > 0)) return null;

  if (fileType === "video/mp4") {
    return (
      <VideoPreview controls>
        <source src={previewURL} type="video/mp4" />
        Your browser does not support the video tag.
      </VideoPreview>
    );
  } else if (fileType === "application/pdf") {
    return (
      <DocPreview src={previewURL} title="PDF Preview">
        This browser does not support PDFs. Please download the PDF to view it.
      </DocPreview>
    );
  } else {
    return null;
  }
};

const DEFAULT_THUMBNAIL = [
  "https://www.ncl.ac.uk/mediav8/newcastle-university-in-singapore/images/key-water.jpg",
];

const MediaUpload = () => {
  const { STATES } = useAppContext();
  const [file, setFile] = useState(null);
  const [uploadName, setUploadName] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadPercentage, setuploadPercentage] = useState(0);
  const [asset, setAsset] = useState(null);
  const navigate = useNavigate();

  const { user } = STATES || {};

  const { activeFile, previewURL } = file || {};

  useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  useEffect(() => {
    if (activeFile?.name && uploadName.length === 0) {
      setUploadName(activeFile.name);
    }
  }, [activeFile]);

  const onDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles.filter(
      (file) => file.type === "video/mp4" || file.type === "application/pdf"
    );

    if (validFiles.length === 0) {
      alert("No valid files. Only MP4 videos and PDF files are allowed.");
      return;
    }

    setFile({
      activeFile: validFiles[0],
      previewURL: URL.createObjectURL(validFiles[0]),
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "video/mp4": [".mp4"],
      "application/pdf": [".pdf"],
    },
  });

  const handleOpenUploads = () => {
    const verificationPath = isCloudMode()
      ? "/cloud/tools/verification"
      : "/features/verification";
    navigate(verificationPath);
  };

  const handleUpload = async () => {
    if (!activeFile) {
      alert("No file selected for upload.");
      return;
    }

    setIsLoading(true);
    try {
      // Make an API call to get the tus endpoint
      const { result } =
        (await LivepeerAPI.createAsset(
          {
            name: uploadName,
            staticMp4: activeFile.type === "video/mp4",
            storage: {
              ipfs: true,
              metadata: {
                name: uploadName,
                description: uploadDescription,
              },
            },
          },
          user?.uid
        )) || {};
      const { tusEndpoint, asset } = result || {};

      logDev("Media Upload", { result, tusEndpoint });

      if (!isSupported) {
        alert(
          "This browser does not support uploads. Please use a modern browser instead."
        );
      }

      if (tusEndpoint) {
        const endpoint = `${configs.server_url}${proxyLivepeerOriginEndpoint(
          tusEndpoint
        )}`;
        console.log("proxy-endpoint", endpoint);

        //https://github.com/tus/tus-js-client/blob/main/docs/api.md
        const upload = new Upload(activeFile, {
          endpoint: tusEndpoint,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          metadata: {
            filename: uploadName,
            filetype: activeFile.type,
          },
          uploadSize: activeFile.size,
          overridePatchMethod: true,
          onError(err) {
            console.error("Error uploading file:", err);
            setuploadPercentage(0);
          },
          onProgress(bytesUploaded, bytesTotal) {
            setuploadPercentage(Math.round((bytesUploaded / bytesTotal) * 100));
          },
          onSuccess() {
            console.log("Upload finished:", upload.url, asset);
            setTimeout(() => {
              handleUploadSuccess(asset);
            }, 5000);
          },
        });

        const previousUploads = await upload.findPreviousUploads();

        if (previousUploads.length > 0) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }

        upload.start();
      } else {
        throw new Error("Could not get upload endpoint");
      }
    } catch (error) {
      console.error("Error uploading the asset:", error);
      alert("Error uploading the asset. Please try again.");
    } finally {
      setIsLoading(false);
    }

    async function getThumbnailUrls(playbackInfo) {
      if (!playbackInfo) {
        return DEFAULT_THUMBNAIL;
      }
      const jpegSource = playbackInfo.meta.source.find(
        (source) =>
          source.type === "image/jpeg" ||
          (source.hrn === "Thumbnail (JPEG)" && source.type.includes("image"))
      );

      if (jpegSource) {
        // If JPEG thumbnail is found, return it as a single-item array
        return [jpegSource.url];
      } else {
        const vttSource = playbackInfo.meta.source.find(
          (source) => source.type === "text/vtt"
        );

        if (vttSource) {
          // If VTT file is found, parse it to get thumbnail URLs
          const vttUrl = vttSource.url;
          return await parseVttFile(vttUrl);
        } else {
          // If no thumbnail source is found
          console.warn("No thumbnail source found in playback info");
          return DEFAULT_THUMBNAIL;
        }
      }
    }

    async function parseVttFile(vttUrl) {
      const response = await fetch(vttUrl);
      const vttText = await response.text();

      // Parse VTT content
      const lines = vttText.split("\n");
      const thumbnailUrls = [];

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].endsWith(".jpg")) {
          thumbnailUrls.push(new URL(lines[i], vttUrl).toString());
        }
      }

      return thumbnailUrls;
    }

    const handleUploadSuccess = async (asset) => {
      if (asset?.id) {
        var _playbackInfo;
        try {
          // *TO-DO Listen When playback is ready
          const { playbackInfo } = await LivepeerAPI.getPlaybackInfo(asset.playbackId);

          logDev("playbackInfo", {
            playbackInfo,
            playbackID: asset.playbackId,
          });
          _playbackInfo = playbackInfo;
        } catch (error) {
          console.error(error);
        }

        const { result } = await AssetAPI.addMetadata(asset.id, {
          name: uploadName,
          description: uploadDescription,
          tags: ["NPC"],
          thumbnailUrl: _playbackInfo
            ? await getThumbnailUrls(_playbackInfo)
            : DEFAULT_THUMBNAIL,
        });

        setAsset(asset);
        setuploadPercentage(0);
      }
    };
  };

  const concludeUpload = () => {
    setFile(null);
    setUploadName("");
    setUploadDescription("");
    setAsset(null);
  };

  return (
    <DashboardPage title={"Media Upload"}>
      <UploadedMediaButton onClick={handleOpenUploads}>My Uploads</UploadedMediaButton>
      <AssetContainer isLoading={isLoading || uploadPercentage > 0}>
        {/*     <UploadProgress progress={50} />
         */}{" "}
        {/* {(isLoading || uploadPercentage > 0) && (
  {uploadPercentage > 0 && (
    <UploadProgress progress={uploadPercentage} />
    )}
    )} */}
        <InputPreviewContainer>
          {asset ? (
            <div className="flex-col">
              <AssetPlayer title={asset.name} playbackId={asset.playbackId} />
            </div>
          ) : previewURL?.length > 0 && activeFile?.type === "video/mp4" ? (
            <div className="flex-col">
              {renderPreview(previewURL, activeFile.type)}
            </div>
          ) : (
            <></>
          )}
          {!asset && (
            <DropZoneContainer {...getRootProps()} isPreview={previewURL}>
            <input {...getInputProps()} />
            <p className="drag-n-drop-title">
              Drag & drop a MP4 or PDF file here. <br />
              Or click to select one
            </p>
          </DropZoneContainer>
          )}
        </InputPreviewContainer>
        {asset ? (
          <AnimatePresence>
            <div className="flex-col">
              <AssetDisplay asset={asset} />
              <ConcludeButton onClick={concludeUpload}>Conclude</ConcludeButton>
            </div>
          </AnimatePresence>
        ) : (
          activeFile && (
            <AnimatePresence>
              <VideoInputContainer
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FormSection label={"File name"}>
                  <Input
                    type="text"
                    placeholder="Enter file name"
                    value={uploadName}
                    onChange={(e) => setUploadName(e.target.value)}
                  />
                </FormSection>

                <FormSection label={"File description"}>
                  <Input
                    type="text"
                    placeholder="Enter file description"
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                  />
                </FormSection>
                <ButtonPrimary
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpload}
                  disabled={isLoading}
                >
                  {isLoading ? <ButtonLoading /> : "Upload"}
                </ButtonPrimary>
              </VideoInputContainer>
            </AnimatePresence>
          )
        )}
      </AssetContainer>
    </DashboardPage>
  );
};

export default MediaUpload;

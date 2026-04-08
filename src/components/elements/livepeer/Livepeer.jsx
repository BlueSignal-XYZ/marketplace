import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Stream } from './Stream';
import { MediaPlayer, BasicStreamPlayer } from './elements';
import { LivepeerAPI } from '../../../scripts/back_door';
import MediaUpload from './MediaUpload';
import {
  LoadingState,
  ClientUnavailableState,
  ServiceUnavailableState,
} from '../../shared/EmptyState/EmptyState';

//livepeer github docs: https://github.com/livepeer/livepeer-js?tab=readme-ov-file

function Livepeer() {
  const { serviceID, playbackID, liveID } = useParams();
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLivepeerAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkLivepeerAvailability = async () => {
    try {
      const key = await LivepeerAPI.getKey();
      setIsReady(!!key);
    } catch {
      setIsReady(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const renderService = (serviceID) => {
    switch (serviceID) {
      case 'stream':
        return <Stream />;
      case 'upload-media':
        return <MediaUpload />;
      default:
        return <ServiceUnavailableState onRetry={handleRetry} />;
    }
  };

  if (!isReady) {
    return isLoading ? <LoadingState /> : <ClientUnavailableState onRetry={handleRetry} />;
  }

  return (
    <>
      {serviceID && renderService(serviceID)}
      {playbackID && <MediaPlayer playbackID={playbackID} />}
      {liveID && <BasicStreamPlayer playbackId={liveID} />}
    </>
  );
}

export default Livepeer;

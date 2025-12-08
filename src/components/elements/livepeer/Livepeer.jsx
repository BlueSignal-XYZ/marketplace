import React,  { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';
import { Stream } from './Stream';
import { MediaPlayer, BasicStreamPlayer } from './elements';
import {LivepeerAPI} from '../../../scripts/back_door';
import MediaUpload from './MediaUpload';
import {
  LoadingState,
  ClientUnavailableState,
  ServiceUnavailableState,
} from '../../shared/EmptyState/EmptyState';

//livepeer github docs: https://github.com/livepeer/livepeer-js?tab=readme-ov-file

function Livepeer() {
  const { serviceID, playbackID, liveID } = useParams();
  const [livepeerClient, setLivepeerClient] = useState(null);
  const [key, setKey] = useState();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchKey()
  }, [])

  useEffect(() => {
    if(key){
      const client = createReactClient({
        provider: studioProvider(key)
      })
      console.log('client', {client});
      setLivepeerClient(client);
    }
  }, [key])
  

  const fetchKey =  async () => {
     try {
      setKey(await LivepeerAPI.getKey());
     } catch (error) {
      throw error;
     } finally {
      setIsLoading(false);
     }
  }

  const handleRetry = () => {
    window.location.reload();
  };

  const renderService = (serviceID) => {
    switch (serviceID) {
      case 'stream':
        return (
          <Stream />
        )
      case 'upload-media':
        return (
          <MediaUpload/>
        )
      default:
        return (
          <ServiceUnavailableState onRetry={handleRetry} />
        )
    }
  }

  if(livepeerClient===null){
    return isLoading ? (
      <LoadingState />
    ) : (
      <ClientUnavailableState onRetry={handleRetry} />
    );
  }



  return (
    <LivepeerConfig client={livepeerClient}>
      {serviceID && renderService(serviceID)}
      {playbackID && <MediaPlayer playbackID={playbackID} />}
      {liveID && <BasicStreamPlayer playbackId={liveID} />}
    </LivepeerConfig>
  );
}

export default Livepeer;
import { useMemo, useState, useEffect } from 'react';
import { useCreateStream } from '@livepeer/react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

import { StreamPlayer } from './elements';

// #BACKEND
import { MediaAPI } from '../../../scripts/back_door';
import { ButtonPrimary } from '../../shared/button/Button';
import { Input } from '../../shared/input/Input';
import FormSection from '../../shared/FormSection/FormSection';
import { Label } from '../../shared/Label/Label';
import {useAppContext} from '../../../context/AppContext';

const StreamContainer = styled.div`
height: 100%;
width: 100%;
max-width: 400px;
margin: 0 auto; 
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;

${ButtonPrimary} { 
  margin-top: 12px;
}
`;


const ActionContainer = styled.div`
width: 100%;
`;




export const Stream = () => {
  const { STATES, ACTIONS } = useAppContext();
  const [streamName, setStreamName] = useState('');
  const { mutate: createStream, data: stream, status } = useCreateStream(streamName ? { name: streamName } : null);

  const isLoading = useMemo(() => status === 'loading', [status]);
  const { user } = STATES || {};
  useEffect(() => {
    if (stream?.playbackId) {
      _saveStream();
    }
  }, [stream]);

  const _saveStream = async () => {
    if (!user?.uid) {
      return false;
    }
    const {result, error} = await MediaAPI.create.stream(stream, user?.uid);

    if(error){
      console.error(error)
      ACTIONS?.logNotification('error', error.message);
    }

    if (result) {
      ACTIONS?.logNotification('', "Stream Created");
      return result;
    }

    ACTIONS?.logNotification('alert', "Could Not Save Stream");
  }

  return (
    <StreamContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {!stream?.playbackId && (
        <FormSection>
        <Label>
        Stream name
        </Label>
        <Input
        type="text"
        onChange={(e) => setStreamName(e.target.value)}
        />
        </FormSection>
      )}
    
      <ActionContainer>
        {!stream && (
          <ButtonPrimary
            onClick={() => {
              createStream?.();
            }}
            disabled={isLoading || !createStream}
          >
            Create Stream
          </ButtonPrimary>
        )}
        
      </ActionContainer>

      <AnimatePresence>
        {(stream?.playbackId && stream?.streamKey) && (
          <StreamPlayer stream={stream} />
        )}
      </AnimatePresence>
    </StreamContainer>
  );
};
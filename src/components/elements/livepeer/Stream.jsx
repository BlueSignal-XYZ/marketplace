import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';

import { StreamPlayer } from './elements';

// #BACKEND
import { LivepeerAPI, MediaAPI } from '../../../scripts/back_door';
import { ButtonPrimary } from '../../shared/button/Button';
import { Input } from '../../shared/input/Input';
import FormSection from '../../shared/FormSection/FormSection';
import { Label } from '../../shared/Label/Label';
import { useAppContext } from '../../../context/AppContext';

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
  const [stream, setStream] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = STATES || {};

  const createStream = async () => {
    if (!streamName) return;
    setIsLoading(true);
    try {
      const result = await LivepeerAPI.createStream({ name: streamName });
      setStream(result);
    } catch (error) {
      console.error('Error creating stream:', error);
      ACTIONS?.logNotification('error', 'Failed to create stream');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (stream?.playbackId) {
      _saveStream();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);

  const _saveStream = async () => {
    if (!user?.uid) {
      return false;
    }
    const { result, error } = await MediaAPI.create.stream(stream, user?.uid);

    if (error) {
      console.error(error);
      ACTIONS?.logNotification('error', error.message);
    }

    if (result) {
      ACTIONS?.logNotification('', 'Stream Created');
      return result;
    }

    ACTIONS?.logNotification('alert', 'Could Not Save Stream');
  };

  return (
    <StreamContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {!stream?.playbackId && (
        <FormSection>
          <Label>Stream name</Label>
          <Input type="text" onChange={(e) => setStreamName(e.target.value)} />
        </FormSection>
      )}

      <ActionContainer>
        {!stream && (
          <ButtonPrimary onClick={createStream} disabled={isLoading || !streamName}>
            Create Stream
          </ButtonPrimary>
        )}
      </ActionContainer>

      <AnimatePresence>
        {stream?.playbackId && stream?.streamKey && <StreamPlayer stream={stream} />}
      </AnimatePresence>
    </StreamContainer>
  );
};

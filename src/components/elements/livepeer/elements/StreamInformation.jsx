import { useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import ObjectViewer from "../../../elements/display/DisplayObject";

const StreamInformationContainer = styled(motion.div)`
width: 50%;
padding: 20px;
background-color: #f4f4f4;
border-radius: 8px;
box-sizing: border-box;
text-align: center;

@media (max-width: 768px) {
    width: 100%;
}
`;

const StreamBasicInfo = styled.table`
width: 100%;
margin-bottom: 20px;

th,
td {
  padding-left: 4px;
  text-align: left;
  border-bottom: 1px solid #ddd;

  @media (max-width: 768px) {
    width: 50%;
}
}
`;

const ExtendedData = styled(motion.div)`
border-top: 1px solid #ccc;
padding-top: 20px;
overflow: hidden;
`;

const ViewButton = styled(motion.button)`
padding: 8px 16px;
margin-top: 10px;
margin-bottom: 10px;
cursor: pointer;
border: none;
background-color: #007bff;
color: white;
border-radius: 4px;
`;


const StreamInformation = ({ stream }) => {
    const [isExtendedData, setIsExtendedData] = useState(false);

    return (
        <StreamInformationContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <StreamBasicInfo>
                <tbody>
                    <tr>
                        <th>Stream Name</th>
                        <td>{stream?.name}</td>
                    </tr>
                    <tr>
                        <th>Stream Status</th>
                        <td>{stream?.isActive ? 'Active' : 'Not Active'}</td>
                    </tr>
                    <tr>
                        <th>Stream Key</th>
                        <td>{stream?.streamKey}</td>
                    </tr>
                    <tr>
                        <th>PlaybackId</th>
                        <td>{stream?.playbackId}</td>
                    </tr>
                </tbody>
            </StreamBasicInfo>
            <ViewButton onClick={() => setIsExtendedData(!isExtendedData)}>
                {!isExtendedData ? 'View More' : 'View Less'}
            </ViewButton>
            <AnimatePresence>
                {isExtendedData && (
                    <ExtendedData initial={{ height: 0 }} animate={{ height: '300px' }} exit={{ height: 0 }}>
                        <ObjectViewer data={stream} />
                    </ExtendedData>
                )}
            </AnimatePresence>
        </StreamInformationContainer>
    );
};

export default StreamInformation;
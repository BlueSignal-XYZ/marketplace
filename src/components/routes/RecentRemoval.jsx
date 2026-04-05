import { useState, useEffect, lazy, Suspense } from "react";
import styled, { keyframes } from "styled-components";
import { Loading, Error } from "../elements";
import { NUMBERS, formatCertificate } from "../../scripts/helpers";
import {NPCCreditsAPI} from "../../scripts/back_door";

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HomeWrapper = styled.div`
margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100vw;
  height: 100vh;
  animation: ${fadeIn} 0.5s ease-in-out;
  transition: 0.5s ease-in-out;
  overflow-y: auto;
  overflow-x: hidden;
`;

const FixedTitle = styled.div`

  position: fixed;
  width: 100%;
  max-height: 100px;
  background: #fff;
  top: 0;
  left: 0;
  border-bottom: 2px solid black;
  z-index: 999;
`;

const Title = styled.h1`
font-size: 2rem;
font-weight: bold;
margin: auto;
text-align: center;
color: black;
padding: 10px;
letter-spacing: 2px;
`;

const CertificateList = styled.ul`
position: absolute;
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  padding: 20px;
  padding-top: 90px;
  top: 0;
`;

const LazyCertificateThumbnail = lazy(() =>
  import("../elements/CertificateThumbnail")
);

const RecentRemoval = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const totalCertificates = await NPCCreditsAPI.getTotalCertificates();
        const certificatePromises = [];

        for (
          let i = NUMBERS.toNumber(totalCertificates);
          i > Math.max(NUMBERS.toNumber(totalCertificates) - 10, 0);
          i--
        ) {
          const certificatePromise = await NPCCreditsAPI.getCertificateById(i);
          certificatePromises.push(certificatePromise);
        }

        const certificates = await Promise.all(certificatePromises);
        const formattedCertificates = certificates.map((certificate) =>
          formatCertificate(certificate)
        );
        setCertificates(formattedCertificates);
      } catch (error) {
        console.error(error);
        setError(`Failed to fetch data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <HomeWrapper id="invisible-scroll">
      <FixedTitle>
        <Title>Recent</Title>
      </FixedTitle>
      <CertificateList id="invisible-scroll">
        <Suspense fallback={<Loading />}>
          {certificates.map((certificate) => (
            <LazyCertificateThumbnail
              key={certificate.id}
              certificate={certificate}
            />
          ))}
        </Suspense>
      </CertificateList>
    </HomeWrapper>
  );
};

export default RecentRemoval;
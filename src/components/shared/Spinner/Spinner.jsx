import styled from 'styled-components';


const AnimatedSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid ${({theme}) => theme.colors.primary500};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin: auto;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SpinnerWrap = styled.div`
display: flex;
flex-direction: column;
align-items: center;
gap:4px;
`

const AnimatedSpinnerText = styled.div`
color: ${({theme}) => theme.colors.ui600};
font-weight: 600; 
font-size: 12px;

`

function Spinner({text = "Loading..."}) {
    return (
        <SpinnerWrap>
        <AnimatedSpinner></AnimatedSpinner>
        <AnimatedSpinnerText>
                {text}
        </AnimatedSpinnerText>      
        </SpinnerWrap>
    )
}

export default Spinner

import { Spinner } from 'react-bootstrap';

function ButtonLoading(props) {
  const { text = 'Loading' } = props;

  return (
    <div>
      {text} <Spinner color="white" />
    </div>
  );
}

export default ButtonLoading;

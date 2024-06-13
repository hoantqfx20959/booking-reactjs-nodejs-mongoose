import { useLocation } from 'react-router-dom';

import Frame from '../components/UI/Frame/Frame';

import DetailData from '../components/user/Detail/DetailList';

const Detail = () => {
  const { state } = useLocation();
  return (
    <Frame>
      <DetailData state={state} />
    </Frame>
  );
};

export default Detail;

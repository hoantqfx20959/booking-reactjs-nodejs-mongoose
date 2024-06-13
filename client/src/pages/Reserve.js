import { useEffect, useState } from 'react';
import axios from '../untils/axios';

import Frame from '../components/UI/Frame/Frame';

import ReserveP from '../components/user/Reserve/Reserve';

const Reserve = () => {
  const [user, setUser] = useState();

  const FetchUrl = (url, func) => {
    useEffect(() => {
      async function fetchData() {
        const request = await axios.get(url);
        func(request.data.items || request.data.item || request.data.user);
        return request;
      }
      fetchData();
    }, [url, func]);
  };

  FetchUrl(`/api/reserve`, setUser);

  return (
    <Frame>
      <ReserveP user={user} />
    </Frame>
  );
};

export default Reserve;

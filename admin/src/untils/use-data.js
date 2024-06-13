import { useEffect, useState } from 'react';
import axios from './axios';

const useData = () => {
  const [user, setUser] = useState();
  const [property, setProperty] = useState();
  const [room, setRoom] = useState();
  const [transaction, setTransaction] = useState();
  const [city, setCity] = useState();

  const FetchUrl = (url, func) => {
    useEffect(() => {
      async function fetchData() {
        const request = await axios.get(url, { withCredentials: true });
        func(request.data.item || request.data.items || request.data.user);
        return request;
      }
      fetchData();
    }, [url, func]);
  };

  FetchUrl(`/api/admin/user`, setUser);
  FetchUrl(`/api/admin/transaction`, setTransaction);
  FetchUrl(`/api/properties`, setProperty);
  FetchUrl(`/api/rooms`, setRoom);
  FetchUrl(`/api/cities`, setCity);

  return { user, transaction, property, room, city };
};

export default useData;

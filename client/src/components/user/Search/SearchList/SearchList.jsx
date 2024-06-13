import { useEffect, useState } from 'react';
import axios from '../../../../untils/axios';

import styles from './SearchList.module.css';

import SearchListItem from './SearchListItem';

// định hình cấu trúc search
const SearchList = ({ searchValue }) => {

  const [properties, setProperties] = useState([]);

  const url = `/api/search?destination=${searchValue.destination}&start_date=${searchValue.date[0].startDate}&end_date=${searchValue.date[0].endDate}&min=${searchValue.options.min}&max=${searchValue.options.max}&adult=${searchValue.options.adult}&children=${searchValue.options.children}&room=${searchValue.options.room}`;

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(url);
      setProperties(request.data.propertyIsAvailable);

      return request;
    }
    if (
      searchValue.destination !== '' ||
      searchValue.date[0].startDate ||
      searchValue.date[0].endDate ||
      searchValue.options.min ||
      searchValue.options.max ||
      searchValue.options.adult >= 1 ||
      searchValue.options.children >= 0 ||
      searchValue.options.room >= 1
    ) {
      fetchData();
    }
  }, [url, searchValue]);

  let content = <h2>There are no available rooms as you requested.</h2>;
  if (properties.length > 0) {
   
    content = properties.map(property => (
      <SearchListItem
        key={property._id}
        propertyId={property._id}
        // roomId={rooms[i]._id}
        name={property.name}
        distance={property.distance}
        address={property.address}
        type={property.type}
        description={property.desc}
        free_cancel={property.free_cancel}
        price={property.cheapestPrice}
        rate={property.rating}
        rate_text={property.rate_text}
        image_url={property.photos}
        startDate={searchValue.date[0].startDate}
        endDate={searchValue.date[0].endDate}
      />
    ));

  }

  return <div className={styles.list}>{content}</div>;
};

export default SearchList;

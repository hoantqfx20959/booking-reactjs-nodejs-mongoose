import { useEffect, useState } from 'react';
import axios from '../../../untils/axios';

import styles from './DetailList.module.css';

import DetailItem from './DetailItem';
import List from '../../UI/List/List';

// định hình cấu trúc detail
const DetailList = ({ state }) => {

  const [property, setProperty] = useState();

  const FetchUrl = (url, func) => {
    useEffect(() => {
      async function fetchData() {
        const request = await axios.get(url);
        func(request.data.item);
        return request;
      }
      fetchData();
    }, [url, func]);
  };

  FetchUrl(`/api/property/${state.propertyId}`, setProperty);


  return (
    <List className={styles.list}>
      {property && (
        <DetailItem
          name={property.name}
          propertyId={state.propertyId}
    
          address={property.address}
          distance={property.distance}
          price={property.cheapestPrice}
          photos={property.photos}
          title={property.title}
          description={property.desc}
          startDate={state.startDate}
          endDate={state.endDate}
        />
      )}
    </List>
  );
};

export default DetailList;

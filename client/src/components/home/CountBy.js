import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useAxios from '../../untils/use-axios';

import styles from './CountBy.module.css';

import Card from '../UI/Crad/Card';
import Button from '../UI/Button/Button';
import Tick from '../UI/Tick/Tick';
import List from '../UI/List/List';
import Frame from '../UI/Frame/Frame';

// định hình cấu trúc detail
const Reserve = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { FetchURL: FetchUrl } = useAxios();

  const [properties, setProperties] = useState();
  const [citiesNav, setCitiesNav] = useState();

  FetchUrl({
    url: `/api/cities`,
    func: setCitiesNav,
  });

  FetchUrl({
    url: `/api/properties-by-${
      params.city ? `city/${params.city}` : `type/${params.type}`
    }`,
    func: setProperties,
  });

  return (
    <List>
      <Frame>
        <div className={styles.div}>
          <div className={styles.nav}>
            <h3>{params.city ? 'CITY' : 'TYPE'}</h3>
            {params.city && (
              <ul>
                {citiesNav &&
                  citiesNav.map(city => (
                    <li key={city._id}>
                      <a
                        href={`/property-by-city/${city.title.replaceAll(
                          ' ',
                          '-'
                        )}`}>
                        {city.name}
                      </a>
                    </li>
                  ))}
              </ul>
            )}
            {params.type && (
              <ul>
                <li>
                  <a
                    href={`/property-by-type/hotel`}
                    className={params.type === 'hotel' ? styles.active : ''}>
                    Hotel
                  </a>
                </li>
                <li>
                  <a
                    href={`/property-by-type/apartment`}
                    className={
                      params.type === 'apartment' ? styles.active : ''
                    }>
                    Apartment
                  </a>
                </li>
                <li>
                  <a
                    href={`/property-by-type/resort`}
                    className={params.type === 'resort' ? styles.active : ''}>
                    Resort
                  </a>
                </li>
                <li>
                  <a
                    href={`/property-by-type/villa`}
                    className={params.type === 'villa' ? styles.active : ''}>
                    Villa
                  </a>
                </li>
                <li>
                  <a
                    href={`/property-by-type/cabin`}
                    className={params.type === 'cabin' ? styles.active : ''}>
                    Cabin
                  </a>
                </li>
              </ul>
            )}
          </div>
          <div className={styles.main}>
            {properties &&
              properties.map((property, index) => (
                <Card className={styles.property} key={property._id}>
                  <img
                    src={
                      property.photos[
                        Math.floor(Math.random() * property.photos.length)
                      ]
                    }
                    alt={`property-${index}`}
                    className={styles.img}
                  />

                  <div className={styles['property-title']}>
                    <div className={styles['property-title_title']}>
                      <h3 className={styles.name}>{property.name}</h3>
                      <p className={styles.distance}>
                        <i className='fa-solid fa-location-dot'></i>
                        {property.distance}m from center
                      </p>
                      <p className={styles.address}>{property.address}</p>
                      <p className={styles.desc}>{property.desc}</p>
                      <p className={styles.type}>
                        {property.type.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: '#51cf66' }}>
                        <strong>Free cancellation</strong>
                      </p>
                      <p style={{ color: '#69db7c' }}>
                        You can cancel later, so lock in this great price today!
                      </p>
                    </div>
                  </div>
                  <div className={styles['property-rate_price']}>
                    <div className={styles['property-rate']}>
                      <p className={styles.rate}>{property.rate_text}</p>
                      <Tick>{property.rate}</Tick>
                    </div>
                    <div className={styles['property-price']}>
                      <p className={styles.price}>${property.cheapestPrice}</p>
                      <p style={{ fontSize: '10px', color: '#868e96' }}>
                        Includes taxes and fees
                      </p>
                      <Button
                        className={styles['property-button']}
                        onClick={() => {
                          navigate(`/detail`, {
                            state: {
                              propertyId: property._id,
                              startDate: new Date(),
                              endDate: new Date(),
                            },
                          });
                        }}>
                        See availability
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </Frame>
    </List>
  );
};

export default Reserve;

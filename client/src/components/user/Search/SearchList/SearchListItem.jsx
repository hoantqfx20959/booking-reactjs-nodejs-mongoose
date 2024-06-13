import { useNavigate } from 'react-router-dom';

import styles from './SearchListItem.module.css';

import Card from '../../../UI/Crad/Card';
import Button from '../../../UI/Button/Button';
import Tick from '../../../UI/Tick/Tick';

import FreeCancel from './FreeCancel';

// định hình cấu trúc search list
const SearchListItem = props => {
  const navigate = useNavigate();
  const handleDetail = () => {
    navigate(`/detail`, {
      state: {
        propertyId: props.propertyId,
     
        startDate: props.startDate,
        endDate: props.endDate,
      },
    });
  };

  return (
    <Card className={styles.search}>
      <img src={props.image_url} alt='search-list' className={styles.img} />

      <div className={styles['search-title']}>
        <div className={styles['search-title_title']}>
          <h3 className={styles.name}>{props.name}</h3>
          <p className={styles.distance}>
            <i className='fa-solid fa-location-dot'></i>
            {props.distance}m from center
          </p>
          <p className={styles.address}>{props.address}</p>
          <p className={styles.description}>{props.description}</p>
          <p className={styles.type}>{props.type.toUpperCase()}</p>
        </div>
        <FreeCancel />
      </div>

      <div className={styles['search-rate_price']}>
        <div className={styles['search-rate']}>
          <p className={styles.rate}>{props.rate_text}</p>
          <Tick>{props.rate}</Tick>
        </div>
        <div className={styles['search-price']}>
          <p className={styles.price}>${props.price}</p>
          <p style={{ fontSize: '10px', color: '#868e96' }}>
            Includes taxes and fees
          </p>
          <Button className={styles['search-button']} onClick={handleDetail}>
            See availability
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SearchListItem;

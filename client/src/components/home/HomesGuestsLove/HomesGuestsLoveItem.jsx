import { useNavigate } from 'react-router-dom';

import styles from './HomesGuestsLoveItem.module.css';

import Tick from '../../UI/Tick/Tick';

// định hình cấu trúc hotel
const HomesGuestsLoveItem = props => {
  const navigate = useNavigate();

  const random = Math.floor(Math.random() * props.image_url.length);
  return (
    <div
      className={styles.item}
      onClick={() => {
        navigate(`/detail`, {
          state: {
            propertyId: props.id,
            startDate: new Date(),
            endDate: new Date(),
          },
        });
      }}>
      <img src={props.image_url[random]} alt='hotel' className={styles.img} />
      <h5 className={styles.name}>{props.name}</h5>
      <p className={styles.city}>{props.city}</p>
      <p className={styles.price}>Starting from ${props.price}</p>
      <div className={styles.rate}>
        <Tick>{props.rate}</Tick>
        <p>{props.type.toUpperCase()}</p>
      </div>
    </div>
  );
};

export default HomesGuestsLoveItem;

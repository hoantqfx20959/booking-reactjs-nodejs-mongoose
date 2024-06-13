import { useNavigate } from 'react-router-dom';

import styles from './CityItem.module.css';

// định hình cấu trúc city
const CityItem = props => {
  const navigate = useNavigate();

  const title = props.title.replaceAll(' ', '-');

  return (
    <div
      className={styles.item}
      onClick={event => {
        event.preventDefault();
        navigate(`/property-by-city/${title}`);
      }}>
      <img src={props.image} alt={title} className={styles.img} />
      <div className={styles.title}>
        <h2>{props.name}</h2>
        <h3>{props.properties} properties</h3>
      </div>
    </div>
  );
};

export default CityItem;

import { useNavigate } from 'react-router-dom';

import styles from './PropertyTypeItem.module.css';

// định hình cấu trúc type
const PropertyTypeItem = props => {
  const navigate = useNavigate();

  return (
    <div
      className={styles.item}
      onClick={event => {
        event.preventDefault();

        navigate(`/property-by-type/${props.title}`);
      }}>
      <img src={props.image} alt={props.title} className={styles.img} />
      <div className='title'></div>
      <p>
        {props.count} {props.title}s
      </p>
    </div>
  );
};

export default PropertyTypeItem;

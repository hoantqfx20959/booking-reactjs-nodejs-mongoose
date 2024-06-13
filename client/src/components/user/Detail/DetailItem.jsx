import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from '../../../untils/axios';

import styles from './DetailItem.module.css';

import Button from '../../UI/Button/Button';

// định hình cấu trúc detail
const DetailItem = props => {
  const [cookies] = useCookies([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!cookies.jwt) {
      // navigate('/auth?mode=login');
    }
  }, [cookies, navigate]);

  const [values, setValues] = useState({
    propertyId: '',
    roomId: '',
    startDate: '',
    endDate: '',
  });

  const handleInput = () => {
    setValues({
      propertyId: props.propertyId,

      startDate: props.startDate,
      endDate: props.endDate || props.startDate,
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!cookies.jwt) {
      const check = window.confirm('Please log in to make a reservation!');
      if (check) {
        navigate('/auth?mode=login');
      } else {
        navigate('/');
      }
    } else {
      try {
        await axios.post(`api/reserve`, {
          ...values,
        });
        navigate('/reserve');
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.flex}>
        <div>
          <h2>{props.name}</h2>
          <p>
            <i className='fa fa-map-marker'></i>
            {props.address}
          </p>
          <p className={styles.distance}>
            Excellent location - {props.distance}m from center
          </p>
          <p className={styles.price}>
            Book a stay over ${props.price} at this property and get a free
            airport taxi
          </p>
        </div>
        <div>
          <Button onClick={handleInput} className={styles.button}>
            Reserve or Book Now!
          </Button>
        </div>
      </div>
      <div className={styles.img}>
        {props.photos.map(photo => (
          <img src={photo} alt='detail' key={photo.toString()}></img>
        ))}
      </div>
      <div className={styles.flex}>
        <div style={{ flexBasis: '75%', marginRight: '1rem' }}>
          <h3>{props.title}</h3>
          <p>{props.description}</p>
        </div>
        <div className={styles.card}>
          <p style={{ fontSize: '20px' }}>
            <strong>${props.price}</strong> (1 nights)
          </p>
          <Button onClick={handleInput} className={styles.button}>
            Reserve or Book Now!
          </Button>
        </div>
      </div>
    </form>
  );
};

export default DetailItem;

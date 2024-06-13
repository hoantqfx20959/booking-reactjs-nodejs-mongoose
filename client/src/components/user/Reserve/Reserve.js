import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from '../../../untils/axios';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import styles from './Reserve.module.css';

import List from '../../UI/List/List';
import Button from '../../UI/Button/Button';
import Frame from '../../UI/Frame/Frame';

const paymentOption = [
  { value: '', label: 'Select Payment Method' },
  { value: 'credit', label: 'Credit Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'transfer', label: 'Transfer' },
];

// định hình cấu trúc detail
const Reserve = () => {
  const [cookies] = useCookies([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!cookies.jwt) {
      navigate('/auth?mode=login');
    }
  }, [cookies, navigate]);

  const [contentError, setContentError] = useState();
  const [user, setUser] = useState();

  const [payment, setPayment] = useState('');
  const [checkbox, setCheckbox] = useState({ checkRoom: [] });
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [values, setValues] = useState({
    property: '',
    checkRoom: '',
    dateStart: '',
    dateEnd: '',
    dates: '',
    price: '',
    payment: '',
  });

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

  const reserve = user && user.reserve.items.at(-1);

  useEffect(() => {
    if (user) {
      user.reserve.items.at(-1) &&
        setDate([
          {
            startDate: new Date(`${user.reserve.items.at(-1).startDate}`),
            endDate: new Date(`${user.reserve.items.at(-1).endDate}`),
            key: 'selection',
          },
        ]);
    }
  }, [user]);

  const handleCheckbox = event => {
    const { alt, id, value, title, checked } = event.target;
    const { checkRoom } = checkbox;

    if (checked) {
      setCheckbox({
        checkRoom: [
          ...checkRoom,
          { roomId: alt, id: id, roomNumber: value, price: title },
        ],
      });
    } else {
      setCheckbox({
        checkRoom: checkRoom.filter(e => e.id !== id),
      });
    }
  };

  const getPrice = (sd, ed) => {
    const nsd = new Date(sd);
    const ned = new Date(ed);
    const price = checkbox.checkRoom
      .map(e => Number(e.price))
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return (
      Math.ceil(
        (ned.getTime() - nsd.getTime() + 24 * 60 * 60 * 1000) /
          (24 * 60 * 60 * 1000)
      ) * price
    );
  };

  const getDateInDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());
    let dates = [];

    while (date <= end) {
      dates.push(new Date(date.getTime()));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const dates = getDateInDateRange(
    date[0].startDate,
    date[0].endDate || date[0].startDate
  );

  const isAvailable = roomNumber => {
    const dateRange = [];
    dates.map(date => dateRange.push(new Date(date).toDateString()));
    const isFound = roomNumber.unavailableDates.some(date =>
      dateRange.includes(new Date(date).toDateString())
    );
    return !isFound;
  };

  const property = reserve && reserve.propertyId;

  const contentSelectRooms = (
    <div className={styles.reserves}>
      {property &&
        property.rooms.map(room => (
          <div key={room.roomId._id} className={styles.reserve}>
            <h5>{room.roomId.title}</h5>
            <div className={styles.infor}>
              <div className={styles.desc}>
                <p>{room.roomId.desc}</p>
                <p>
                  Max People:
                  <strong> {room.roomId.maxPeople}</strong>
                </p>
              </div>
              <div className={styles.roomNumbers}>
                {room.roomId.roomNumbers
                  .sort((a, b) => a.roomNumberId.number - b.roomNumberId.number)
                  .map(roomNumber => (
                    <div key={roomNumber._id} className={styles.roomNumber}>
                      <label>{roomNumber.roomNumberId.number}</label>
                      <input
                        type='checkbox'
                        name='roomNumber'
                        alt={room.roomId._id}
                        id={roomNumber.roomNumberId._id}
                        title={room.roomId.price}
                        value={roomNumber.roomNumberId.number}
                        onChange={handleCheckbox}
                        disabled={!isAvailable(roomNumber.roomNumberId)}
                      />
                    </div>
                  ))}
              </div>
            </div>
            <h5>
              $
              {checkbox.checkRoom.filter(e => e.roomId === room.roomId._id)
                .length * room.roomId.price}
            </h5>
          </div>
        ))}
    </div>
  );

  const handleInput = () => {
    setValues({
      property: user && reserve.propertyId,
      checkRoom: checkbox.checkRoom,
      dateStart: date[0].startDate,
      dateEnd: date[0].endDate || date[0].startDate,
      dates: dates,
      price: getPrice(date[0].startDate, date[0].endDate),
      payment: payment,
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (values.checkRoom.length <= 0) {
      setContentError(<p>Please select a room</p>);
    } else if (!values.payment) {
      setContentError(<p>Please select a payment method</p>);
    } else {
      try {
        await axios.post(`api/transaction`, {
          ...values,
        });

        navigate('/transaction');
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <List className={styles.list}>
      <Frame>
        <form onSubmit={handleSubmit} className={styles.form}>
          {property && (
            <div className={styles.listItem}>
              <div className={styles.property}>
                <h3>{property.name}</h3>
                <p>{property.desc}</p>
              </div>
              <div className={styles.card}>
                <p style={{ fontSize: '20px' }}>
                  <strong>${property.cheapestPrice}</strong> (1 nights)
                </p>
                <Button onClick={handleInput} className={styles.cardButton}>
                  Reserve or Book Now!
                </Button>
              </div>
            </div>
          )}
          <div className={styles.listItem}>
            <div className={styles.date}>
              <h3>Dates</h3>
              <DateRange
                editableDateInputs={true}
                onChange={item => {
                  setDate([item.selection]);
                }}
                moveRangeOnFirstSelection={false}
                ranges={date}
                className={styles.date}
                minDate={new Date()}
              />
            </div>
            <div className={styles.reserveInfo}>
              <h3>Reserve Info</h3>
              <div className={styles.input}>
                <label>Your Full Name</label>
                <input
                  type='text'
                  name='fullName'
                  placeholder='Full Name'
                  defaultValue={user && user.fullName}
                />
              </div>
              <div className={styles.input}>
                <label>Your Email</label>
                <input
                  type='email'
                  name='email'
                  placeholder='Email'
                  defaultValue={user && user.email}
                />
              </div>
              <div className={styles.input}>
                <label>Your Phone Number</label>
                <input
                  type='number'
                  name='phone'
                  placeholder='Phone Number'
                  defaultValue={user && '0' + user.phoneNumber}
                />
              </div>
              <div className={styles.input}>
                <label>Your Identity Card Number</label>
                <input
                  type='text'
                  name='idCard'
                  placeholder='Card Number'
                  defaultValue={user && user.cardNumer ? user.cardNumer : null}
                />
              </div>
            </div>
          </div>
          <div className={styles.listItem}>
            <div className={styles.item}>
              <h3>Select Rooms</h3>

              <div className={styles.reserves}>{contentSelectRooms}</div>
            </div>
          </div>
          <div className={styles.listItem}>
            <div className={styles.item}>
              <h3>
                Total Bill: {getPrice(date[0].startDate, date[0].endDate)}
              </h3>
              <div className={styles.bill}>
                <select
                  name='payment'
                  onChange={e => setPayment(e.target.value)}>
                  {paymentOption.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className={styles.billAction}>
                  <Button onClick={handleInput} className={styles.button}>
                    Reserve Now
                  </Button>
                  <div className={styles.error}>{contentError}</div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Frame>
    </List>
  );
};

export default Reserve;

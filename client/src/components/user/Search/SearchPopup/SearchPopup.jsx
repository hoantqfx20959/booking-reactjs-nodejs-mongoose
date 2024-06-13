import { useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import styles from './SearchPopup.module.css';

import Card from '../../../UI/Crad/Card';
import Button from '../../../UI/Button/Button';

// định hình cấu trúc search popup
const SearchPopup = ({ state, onSearch }) => {
  const [destination, setDestination] = useState(state.destination);
  const [date, setDate] = useState([state.date[0]]);
  const [checkDate, setCheckDate] = useState(false);
  const [options, setOptions] = useState(state.options);

  // lấy dữ liệu lưu vào input
  const formatDate = data => {
    const format = `${
      data.getMonth() + 1
    }/${data.getDate()}/${data.getFullYear()}`;
    return format;
  };

  const onSubmit = event => {
    event.preventDefault();
    onSearch({ destination: destination, date: date, options: options });
  };

  return (
    <Card className={styles['search-card']}>
      <div className={styles.search}>
        <form onSubmit={onSubmit}>
          <h2>Search</h2>
          <div>
            <h4>Destination</h4>
            <input
              type='text'
              value={destination}
              onChange={event => {
                setDestination(event.target.value);
              }}
              className={styles.input}
            />
          </div>
          <div>
            <h4>Check-in Date</h4>
            <div className={styles.input}>
              <span onClick={() => setCheckDate(!checkDate)}>{`${formatDate(
                date[0].startDate
              )} to ${
                date[0].endDate
                  ? formatDate(date[0].endDate)
                  : formatDate(date[0].startDate)
              }`}</span>
              {checkDate ? (
                <DateRange
                  editableDateInputs={true}
                  onChange={item => {
                    setDate([item.selection]);
                    if (
                      item.selection.endDate &&
                      item.selection.endDate !== item.selection.startDate
                    ) {
                      setCheckDate(prevShow => !prevShow);
                    }
                  }}
                  moveRangeOnFirstSelection={false}
                  ranges={date}
                  className={styles.date}
                  minDate={new Date()}
                />
              ) : null}
            </div>
          </div>
          <div>
            <h4>Options</h4>
            <div className={styles.row}>
              <p>Min price per right</p>
              <input
                type='text'
                onChange={event => {
                  setOptions({
                    min: Number(event.target.value),
                    max: options.max,
                    adult: options.adult,
                    children: options.children,
                    room: options.room,
                  });
                }}
                className={styles.optionInput}
              />
            </div>
            <div className={styles.row}>
              <p>Max price per right</p>
              <input
                type='text'
                onChange={event => {
                  setOptions({
                    min: options.min,
                    max: Number(event.target.value),
                    adult: options.adult,
                    children: options.children,
                    room: options.room,
                  });
                }}
                className={styles.optionInput}
              />
            </div>

            <div className={styles.row}>
              <p>Adult</p>
              <input
                type='text'
                value={options.adult}
                onChange={event => {
                  setOptions({
                    min: options.min,
                    max: options.max,
                    adult: Number(event.target.value),
                    children: options.children,
                    room: options.room,
                  });
                }}
                className={styles.optionInput}
              />
            </div>
            <div className={styles.row}>
              <p>Chidren</p>
              <input
                type='text'
                value={options.children}
                onChange={event => {
                  setOptions({
                    min: options.min,
                    max: options.max,
                    adult: options.adult,
                    children: Number(event.target.value),
                    room: options.room,
                  });
                }}
                className={styles.optionInput}
              />
            </div>
            <div className={styles.row}>
              <p>Room</p>
              <input
                type='text'
                value={options.room}
                onChange={event => {
                  setOptions({
                    min: options.min,
                    max: options.max,
                    adult: options.adult,
                    children: options.children,
                    room: Number(event.target.value),
                  });
                }}
                className={styles.optionInput}
              />
            </div>
          </div>
          <Button className={styles['search-button']}>Search</Button>
        </form>
      </div>
    </Card>
  );
};

export default SearchPopup;

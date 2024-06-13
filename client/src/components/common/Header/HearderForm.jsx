import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import styles from './HearderForm.module.css';

import Button from '../../UI/Button/Button';
import Frame from '../../UI/Frame/Frame';

// đường dẫn đến web

// định hình cấu trúc form trong header
const HeaderForm = props => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');

  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);
  const [checkDate, setCheckDate] = useState(false);

  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  const [checkOptions, setCheckOptions] = useState(false);

  const destinationChangeHandler = event => {
    setDestination(event.target.value);
  };

  // lấy dữ liệu lưu vào input
  const formatDate = data => {
    const format = `${
      data.getMonth() + 1
    }/${data.getDate()}/${data.getFullYear()}`;
    return format;
  };

  const handleOption = (name, operation) => {
    setOptions(data => {
      return {
        ...data,
        [name]: operation === 'i' ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  // lưu dữ liệu từ input (chưa dùng đến)
  const handleSearch = () => {
    navigate('/search', { state: { destination, date, options } });
  };

  return (
    <Frame>
      <div className={styles.search}>
        <div className={styles.input}>
          <i className='fa fa-hotel'></i>
          <input
            type='text'
            value={destination}
            onChange={destinationChangeHandler}
            placeholder='Where are you going?'
            className={styles.input}
          />
        </div>
        <div className={styles.input}>
          <i className='fa fa-calendar'></i>
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
        <div className={styles.input}>
          <i className='fa fa-user'></i>
          <span
            onClick={() =>
              setCheckOptions(!checkOptions)
            }>{`${options.adult} adult · ${options.children} children · ${options.room} room`}</span>
          {checkOptions && (
            <div className={styles.options}>
              <div className={styles.optionItem}>
                <span className={styles.optionText}>Adult</span>
                <div className={styles.optionCounter}>
                  <button
                    disabled={options.adult <= 1}
                    className={styles.optionCounterButton}
                    onClick={() => handleOption('adult', 'd')}>
                    -
                  </button>
                  <span className={styles.optionCounterNumber}>
                    {options.adult}
                  </span>
                  <button
                    className={styles.optionCounterButton}
                    onClick={() => handleOption('adult', 'i')}>
                    +
                  </button>
                </div>
              </div>
              <div className={styles.optionItem}>
                <span className={styles.optionText}>Children</span>
                <div className={styles.optionCounter}>
                  <button
                    disabled={options.children <= 0}
                    className={styles.optionCounterButton}
                    onClick={() => handleOption('children', 'd')}>
                    -
                  </button>
                  <span className={styles.optionCounterNumber}>
                    {options.children}
                  </span>
                  <button
                    className={styles.optionCounterButton}
                    onClick={() => handleOption('children', 'i')}>
                    +
                  </button>
                </div>
              </div>
              <div className={styles.optionItem}>
                <span className={styles.optionText}>Room</span>
                <div className={styles.optionCounter}>
                  <button
                    disabled={options.room <= 1}
                    className={styles.optionCounterButton}
                    onClick={() => handleOption('room', 'd')}>
                    -
                  </button>
                  <span className={styles.optionCounterNumber}>
                    {options.room}
                  </span>
                  <button
                    className={styles.optionCounterButton}
                    onClick={() => handleOption('room', 'i')}>
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <Button className={styles.button} onClick={handleSearch}>
          Search
        </Button>
      </div>
    </Frame>
  );
};

export default HeaderForm;

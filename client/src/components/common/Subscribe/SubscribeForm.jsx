import { useState } from 'react';

import styles from './SubscribeForm.module.css';
import Button from '../../UI/Button/Button';

// định hình cấu trúc subscribe form
const SubscribeForm = props => {
  // lấy dữ liệu từ input (chưa dùng đến)
  const [enteredEmail, setEnteredEmail] = useState('');

  const emailChangeHandler = event => {
    setEnteredEmail(event.target.value);
  };

  const submitHandler = event => {
    event.preventDefault();

    const emailData = {
      email: enteredEmail,
    };

    props.onSaveEmail(emailData);
    setEnteredEmail('');
  };

  return (
    <form onSubmit={submitHandler}>
      <div>
        <input
          className={`${styles['sub-entered']}`}
          type='email'
          value={enteredEmail}
          onChange={emailChangeHandler}
          placeholder='  Your mail'
        />
        <Button className={`${styles['sub-button']}`}>Subscribe</Button>
      </div>
    </form>
  );
};

export default SubscribeForm;

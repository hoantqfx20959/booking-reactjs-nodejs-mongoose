import styles from './Subscribe.module.css';

import SubscribeForm from './SubscribeForm';

// định hình cấu trúc subscribe
const Subscribe = props => {
  // thêm dữ liệu từ input (chưa dùng đến)
  const saveEmail = enteredEmail => {
    const emails = { ...enteredEmail, id: Math.random().toString() };
    props.onAddEmail(emails);
  };

  return (
    <div className={styles.sub}>
      <div className={styles.item}>
        <h2>Save time, save money!</h2>
        <p>Sign up and we'll send the best deals to you</p>
        <SubscribeForm onSaveEmail={saveEmail} />
      </div>
    </div>
  );
};

export default Subscribe;

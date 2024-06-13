import useData from '../../../untils/use-data';

import styles from './Header.module.css';

const AdminMain = () => {
  const { user, transaction } = useData();

  const getPrice = data => {
    return (
      data &&
      data
        .map(e => Number(e.price))
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    );
  };

  return (
    <div className={styles.nav}>
      <div className={styles.navItem}>
        <h3>USER</h3>
        <p>{user && user.filter(user => user.isAdmin !== true).length}</p>
        <div className={styles.navItemI}>
          <i
            className={'fa-solid fa-user'}
            style={{ backgroundColor: '#ffe066', color: '#f59f00' }}></i>
        </div>
      </div>
      <div className={styles.navItem}>
        <h3>ORDER</h3>
        <p>{transaction && transaction.length}</p>
        <div className={styles.navItemI}>
          <i
            className={'fa-solid fa-cart-shopping'}
            style={{ backgroundColor: '#ffa8a8', color: '#f03e3e' }}></i>
        </div>
      </div>
      <div className={styles.navItem}>
        <h3>EARNINGS</h3>
        <p>${getPrice(transaction)}</p>
        <div className={styles.navItemI}>
          <i
            className={'fa-solid fa-sack-dollar'}
            style={{ backgroundColor: '#74c0fc', color: '#1c7ed6' }}></i>
        </div>
      </div>
      <div className={styles.navItem}>
        <h3>BALANCE</h3>
        <p>${getPrice(transaction)}</p>
        <div className={styles.navItemI}>
          <i
            className={'fa-solid fa-wallet'}
            style={{ backgroundColor: '#8ce99a', color: '#37b24d' }}></i>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;

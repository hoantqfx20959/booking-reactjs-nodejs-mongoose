import { useState } from 'react';

import useData from '../../untils/use-data';

import styles from './Table.module.css';

import Content from '../UI/Content/Content';
import Checkbox from '../UI/Checkbox/Checkbox';

import Header from '../common/page/Header';
import Navbar from '../common/page/Navbar';

function Transaction() {
  const { transaction } = useData();

  const checkStatus = (sd, ed) => {
    const today = new Date().getTime();
    const startDate = new Date(sd).getTime();
    const endDate = new Date(ed).getTime();

    let status = 'Booked';
    if (startDate < today && today < endDate) status = 'Checkin';
    if (endDate < today) status = 'Checkout';

    return (
      <span
        className={`${status === 'Booked' && styles.booked}
      ${status === 'Checkin' && styles.checkin}
      ${status === 'Checkout' && styles.checkout}`}>
        {status}
      </span>
    );
  };

  const toUpperCase = word => {
    const characters = [...word];
    const index = characters.indexOf(' ');

    characters[0] = characters[0].toUpperCase();
    characters[index + 1] = characters[index + 1].toUpperCase();

    word = characters.join('');

    return word;
  };

  const formatDate = d => {
    const nd = new Date(d);
    return `${
      nd.getMonth() < 9 ? `0${nd.getMonth() + 1}` : nd.getMonth() + 1
    }/${
      nd.getDate() < 10 ? `0${nd.getDate()}` : nd.getDate()
    }/${nd.getFullYear()}`;
  };

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const handleSelectAll = e => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(transaction && transaction.map(property => property._id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const handleClick = e => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter(item => item !== id));
    }
  };

  const transactions = (
    <div className={styles.card}>
      <h3>Latest Transactions</h3>
      <table>
        <thead>
          <tr>
            <th>
              <Checkbox
                type='checkbox'
                name='selectAll'
                id='selectAll'
                handleClick={handleSelectAll}
                isChecked={isCheckAll}
              />
            </th>
            <th>ID</th>
            <th>User</th>
            <th>Stay</th>
            <th>Room</th>
            <th>Date</th>
            <th>Price</th>
            <th>Payment Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transaction &&
            transaction.map(item => (
              <tr key={item._id}>
                <td>
                  <Checkbox
                    key={item._id}
                    type='checkbox'
                    name={item.userId}
                    id={item._id}
                    handleClick={handleClick}
                    isChecked={isCheck.includes(item._id)}
                  />
                </td>
                <td>{item.user.userId}</td>
                <td>{item.user.username}</td>
                <td>{item.property}</td>
                <td>{item.room.toString()}</td>
                <td>{`${formatDate(item.dateStart)} - ${formatDate(
                  item.dateEnd
                )}`}</td>
                <td>${item.price}</td>
                <td>{toUpperCase(item.payment)}</td>
                <td>{checkStatus(item.dateStart, item.dateEnd)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <Navbar />
      <Content>
        <Header />
        {transactions}
      </Content>
    </>
  );
}

export default Transaction;

import { useEffect, useState } from 'react';
import axios from '../../../untils/axios';

import styles from './Transaction.module.css';

import List from '../../UI/List/List';
import Frame from '../../UI/Frame/Frame';

const Transaction = () => {
  const [transaction, setTransaction] = useState();

  const FetchUrl = (url, func) => {
    useEffect(() => {
      async function fetchData() {
        const request = await axios.get(url);
        func(request.data.items || request.data.user);
        return request;
      }
      fetchData();
    }, [url, func]);
  };

  FetchUrl(`/api/transaction`, setTransaction);

  const formatDate = d => {
    const nd = new Date(d);
    return `${
      nd.getMonth() < 9 ? `0${nd.getMonth() + 1}` : nd.getMonth() + 1
    }/${
      nd.getDate() < 10 ? `0${nd.getDate()}` : nd.getDate()
    }/${nd.getFullYear()}`;
  };

  const checkStatus = (sd, ed) => {
    const today = new Date().getTime();
    const startDate = new Date(sd).getTime();
    const endDate = new Date(ed).getTime() + 24 * 60 * 60 * 1000;

    let status = 'Booked';
    if (startDate <= today && today <= endDate) status = 'Checkin';
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

  return (
    <List className={styles.list}>
      <Frame>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr className={styles.tr}>
              <th className={styles.th}>#</th>
              <th className={styles.th}>Stay</th>
              <th className={styles.th}>Room</th>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Price</th>
              <th className={styles.th}>Payment Method</th>
              <th className={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {transaction &&
              transaction.map((item, index) => (
                <tr className={styles.tr} key={item._id}>
                  <td
                    className={styles.col}
                    style={{ width: '2rem', textAlign: 'center' }}>
                    {index < 9 ? `0${index + 1}` : index + 1}
                  </td>
                  <td className={styles.td}>{item.property}</td>
                  <td className={styles.td}>{item.room.toString()}</td>
                  <td className={styles.td}>{`${formatDate(
                    item.dateStart
                  )} - ${formatDate(item.dateEnd)}`}</td>
                  <td className={styles.td}>${item.price}</td>
                  <td className={styles.td}>{item.payment}</td>
                  <td className={styles.td}>
                    {checkStatus(item.dateStart, item.dateEnd)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Frame>
    </List>
  );
};

export default Transaction;

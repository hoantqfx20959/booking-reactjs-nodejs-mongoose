import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

import useData from '../../untils/use-data';

import Content from '../UI/Content/Content';

import Header from '../common/page/Header';
import Navbar from '../common/page/Navbar';

function HoomPage() {
  Chart.register(...registerables);
  const { user, transaction } = useData();
  const [year, setYear] = useState(`${new Date().getFullYear()}`);

  const yearOption = [
    { value: new Date().getFullYear(), label: new Date().getFullYear() },
    {
      value: new Date().getFullYear() - 1,
      label: new Date().getFullYear() - 1,
    },
    {
      value: new Date().getFullYear() - 2,
      label: new Date().getFullYear() - 2,
    },
    {
      value: new Date().getFullYear() - 3,
      label: new Date().getFullYear() - 3,
    },
    {
      value: new Date().getFullYear() - 4,
      label: new Date().getFullYear() - 4,
    },
    {
      value: new Date().getFullYear() - 5,
      label: new Date().getFullYear() - 5,
    },
  ];
  let userData = [];
  let orderData = [];
  let earningData = [];
  let balanceData = [];

  for (let i = 0; i < 12; i++) {
    userData.push(
      user &&
        user
          .filter(user => user.isAdmin !== true)
          .filter(
            user => new Date(user.createdAt).getFullYear().toString() === year
          )
          .filter(user => new Date(user.createdAt).getMonth() === i).length
    );
    orderData.push(
      transaction &&
        transaction
          .filter(
            user => new Date(user.dateStart).getFullYear().toString() === year
          )
          .filter(user => new Date(user.dateStart).getMonth() === i).length
    );
    earningData.push(
      transaction &&
        transaction
          .filter(
            user => new Date(user.dateStart).getFullYear().toString() === year
          )
          .filter(user => new Date(user.dateStart).getMonth() === i)
          .map(e => Number(e.price))
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    );
    balanceData.push(
      transaction &&
        transaction
          .filter(
            user => new Date(user.dateStart).getFullYear().toString() === year
          )
          .filter(user => new Date(user.dateStart).getMonth() === i)
          .map(e => Number(e.price))
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    );
  }

  const dashboard = (
    <div>
      <select name='year' onChange={e => setYear(e.target.value)}>
        {yearOption.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Line
        data={{
          labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          datasets: [
            {
              data: userData,
              label: 'User',
              borderColor: '#ffe066',
              fill: false,
            },
            {
              data: orderData,
              label: 'Order',
              borderColor: '#ff8787',
              fill: false,
            },
          ],
        }}
        options={{
          title: {
            display: true,
            text: '',
          },
          legend: {
            display: true,
            position: 'bottom',
          },
        }}
      />
      <Line
        data={{
          labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          datasets: [
            {
              data: earningData,
              label: 'Earning',
              borderColor: '#4dabf7',
              fill: false,
            },
            {
              data: balanceData,
              label: 'Balance',
              borderColor: '#69db7c',
              fill: false,
            },
          ],
        }}
        options={{
          title: {
            display: true,
            text: '',
          },
          legend: {
            display: true,
            position: 'bottom',
          },
        }}
      />
    </div>
  );

  return (
    <>
      <Navbar />
      <Content>
        <Header />
        {dashboard}
      </Content>
    </>
  );
}

export default HoomPage;

import { NavLink } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import styles from './Navbar.module.css';
import { useEffect } from 'react';
import axios from '../../../untils/axios';

const AdminNavbar = () => {
  const [cookies, setCookies, removeCookie] = useCookies([]);

  const logOut = () => {
    removeCookie('jwt');
    window.location = '/auth?mode=login';
  };

  return (
    <div className={styles.navbar}>
      <div>
        <h3>MAIN</h3>
        <ul>
          <NavLink
            to='/'
            className={({ isActive }) => (isActive ? styles.active : undefined)}
            end>
            <i className='fa-solid fa-chart-line'></i>Dashboard
          </NavLink>
        </ul>
      </div>
      <div>
        <h3>LISTS</h3>
        <ul>
          <NavLink
            to='/users'
            className={({ isActive }) =>
              isActive ? styles.active : undefined
            }>
            <i className={'fa-solid fa-user'}></i>Users
          </NavLink>
          <NavLink
            to='/properties'
            className={({ isActive }) =>
              isActive ? styles.active : undefined
            }>
            <i className={'fa-solid fa-hotel'}></i>Properties
          </NavLink>
          <NavLink
            to='/rooms'
            className={({ isActive }) =>
              isActive ? styles.active : undefined
            }>
            <i className={'fa-regular fa-hard-drive'}></i>Rooms
          </NavLink>
          <NavLink
            to='/transactions'
            className={({ isActive }) =>
              isActive ? styles.active : undefined
            }>
            <i className={'fa-solid fa-truck-moving'}></i>Transactions
          </NavLink>
        </ul>
      </div>
      <div>
        <h3>NEW</h3>
        <ul>
          <NavLink
            to='/new-property'
            className={({ isActive }) =>
              isActive ? styles.active : undefined
            }>
            <i className={'fa-solid fa-hotel'}></i>New Property
          </NavLink>
          <NavLink
            to='/new-room'
            className={({ isActive }) =>
              isActive ? styles.active : undefined
            }>
            <i className={'fa-regular fa-hard-drive'}></i>New Room
          </NavLink>
        </ul>
      </div>
      <div>
        <h3>USER</h3>
        <ul>
          <button onClick={logOut}>
            <i className={'fa-solid fa-arrow-right-from-bracket'}></i>
            Logout
          </button>
        </ul>
      </div>
    </div>
  );
};

export default AdminNavbar;

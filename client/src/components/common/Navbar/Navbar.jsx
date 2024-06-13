import { useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from '../../../untils/axios';

import styles from './Navbar.module.css';

import Button from '../../UI/Button/Button';
import List from '../../UI/List/List';
import Frame from '../../UI/Frame/Frame';

// định hình cấu trúc navbar
const Navbar = () => {
  const navigate = useNavigate();
  const [cookies, setCookies, removeCookie] = useCookies([]);
  const location = useLocation();

  const [
    searchParams,
    // setSearchParams
  ] = useSearchParams();

  const isResetPass = location.pathname === '/reset-password';
  const isNewPass = location.pathname.includes(`/reset/`);

  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
        if (
          searchParams.get('mode') === 'register' ||
          isNewPass ||
          isResetPass
        ) {
          return;
        }
        navigate('/auth?mode=login');
      } else {
        const { data } = await axios.post(
          'check-user',
          {},
          {
            withCredentials: true,
          }
        );
        if (!data.status) {
          removeCookie('jwt');
          navigate('/auth?mode=login');
        }
      }
    };
    verifyUser();
  }, [cookies, isNewPass, isResetPass, navigate, removeCookie, searchParams]);

  const logOut = () => {
    removeCookie('jwt');
    window.location = '/auth?mode=login';
  };

  return (
    <Frame className={styles.navbar}>
      <List>
        <div className={`${styles['container']}`}>
          <div className={styles['navbar-title']}>
            <h4>Booking Website</h4>
            <div className={styles['navbar-button']}>
              {!cookies.jwt && (
                <Button className={`${styles.marginRight} ${styles.navBtn}`}>
                  <a href='/auth?mode=register'>Register</a>
                </Button>
              )}

              {!cookies.jwt && (
                <Button className={styles.navBtn}>
                  <a href='/auth?mode=login'>Login</a>
                </Button>
              )}

              {cookies.jwt && (
                <Button onClick={logOut} className={styles.navBtn}>
                  Logout
                </Button>
              )}
            </div>
          </div>

          <div className={`${styles['navbar-menu']}`}>
            <ul>
              <li>
                <a href='/'>
                  <i className={`fa fa-bed`}></i>Stays
                </a>
              </li>
              <li>
                <a href='/'>
                  <i className={`fa fa-plane`}></i>Flights
                </a>
              </li>
              <li>
                <a href='/'>
                  <i className={`fa fa-car`}></i>Car rentals
                </a>
              </li>
              <li>
                <a href='/'>
                  <i className={`fa fa-bed`}></i>Attractions
                </a>
              </li>
              <li>
                <a href='/'>
                  <i className={`fa fa-taxi`}></i>Airport taxis
                </a>
              </li>
            </ul>
          </div>

          {cookies.jwt && (
            <div className={`${styles['navbar-menu']}`}>
              <ul>
                <li>
                  <a href='/reserve'>
                    <i className={`fa fa-calendar-check`}></i>Reserve
                  </a>
                </li>
                <li>
                  <a href='/transaction'>
                    <i className={`fa fa-calendar-alt`}></i>Transaction
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </List>
    </Frame>
  );
};

export default Navbar;

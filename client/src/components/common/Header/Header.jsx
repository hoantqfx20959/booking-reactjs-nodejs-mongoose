import { useCookies } from 'react-cookie';

import styles from './Hearder.module.css';

import Button from '../../UI/Button/Button';

import HeaderForm from './HearderForm';

import Frame from '../../UI/Frame/Frame';
import List from '../../UI/List/List';

// định hình cấu trúc header
const Header = props => {
  const [cookies, setCookies, removeCookie] = useCookies([]);
  return (
    <Frame className={`${styles.header}`}>
      <List>
        <Frame>
          {!cookies.jwt && (
            <div className={`${styles['container']}`}>
              <h2>A lifetime of discounts? It's Genius.</h2>
              <p>
                Get rewarded for you travels - unlock instant savings of 10%
                more with a free account
              </p>
              <Button type='submit' className={`${styles['header-button']}`}>
                Sign in / Register
              </Button>
            </div>
          )}
          <HeaderForm />
        </Frame>
      </List>
    </Frame>
  );
};

export default Header;

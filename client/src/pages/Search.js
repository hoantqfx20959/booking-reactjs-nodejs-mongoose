import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import List from '../components/UI/List/List';

import SearchPopup from '../components/user/Search/SearchPopup/SearchPopup';
import SearchList from '../components/user/Search/SearchList/SearchList';
import Frame from '../components/UI/Frame/Frame';

const Search = () => {
  const { state } = useLocation();
  const [searchValue, setSearchValue] = useState(state);
  const onSearch = value => {
    setSearchValue(value);
  };

  return (
    <Frame>
      <List
        style={{
          margin: '3rem 0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}>
        <SearchPopup state={state} onSearch={onSearch} />
        <SearchList searchValue={searchValue} />
      </List>
    </Frame>
  );
};

export default Search;

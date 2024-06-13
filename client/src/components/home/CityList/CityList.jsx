import styles from './CityList.module.css';

import CityItem from './CityItem';
import List from '../../UI/List/List';

// định hình cấu trúc city
const CityList = ({ cityData }) => {
  return (
    <List className={styles.list}>
      {/* láy dữ liệu từ data */}
      {cityData &&
        cityData.map(city => (
          <CityItem
            key={city.name}
            name={city.name}
            title={city.title}
            properties={city.properties.length}
            image={city.photos}
          />
        ))}
    </List>
  );
};

export default CityList;

// import styles from './HomesGuestsLoveList.module.css';

import HomesGuestsLoveItem from './HomesGuestsLoveItem';
import List from '../../UI/List/List';

// định hình cấu trúc hotel
const HomesGuestsLoveList = ({ homesGuestsLove }) => {
  return (
    <List>
      {/* láy dữ liệu từ data */}
      {homesGuestsLove &&
        homesGuestsLove.map(property => (
          <HomesGuestsLoveItem
            key={property._id}
            id={property._id}
            name={property.name}
            city={property.city}
            price={property.cheapestPrice}
            rate={property.rating}
            type={property.type}
            image_url={property.photos}
          />
        ))}
    </List>
  );
};

export default HomesGuestsLoveList;

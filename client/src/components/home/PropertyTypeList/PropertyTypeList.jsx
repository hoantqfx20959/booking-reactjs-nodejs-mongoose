// import styles from './PropertyTypeList.module.css';

import PropertyTypeItem from './PropertyTypeItem';
import List from '../../UI/List/List';

// định hình cấu trúc type
const PropertyTypeList = ({ propertyData }) => {
  let hotel;
  let apartment;
  let resort;
  let villa;
  let cabin;

  if (propertyData) {
    hotel = propertyData.filter(item => ['hotel'].includes(item.type));
    apartment = propertyData.filter(item => ['apartment'].includes(item.type));
    resort = propertyData.filter(item => ['resort'].includes(item.type));
    villa = propertyData.filter(item => ['villa'].includes(item.type));
    cabin = propertyData.filter(item => ['cabin'].includes(item.type));
  }

  return (
    propertyData && (
      <List>
        <PropertyTypeItem
          title='hotel'
          count={hotel.length}
          image={
            'https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg'
          }
        />
        <PropertyTypeItem
          title='apartment'
          count={apartment.length}
          image={
            'https://media.istockphoto.com/id/1165384568/photo/europe-modern-complex-of-residential-buildings.jpg?s=612x612&w=0&k=20&c=iW4NBiMPKEuvaA7h8wIsPHikhS64eR-5EVPfjQ9GPOA='
          }
        />
        <PropertyTypeItem
          title='resort'
          count={resort.length}
          image={
            'https://vntimetravel.com/media/wysiwyg/Intercontinantal-Phu-Quoc-r.jpg'
          }
        />
        <PropertyTypeItem
          title='villa'
          count={villa.length}
          image={
            'https://www.kientructhanhphat.com.vn/app/webroot/uploads/images/18-02-2022/villa/2.jpg'
          }
        />
        <PropertyTypeItem
          title='cabin'
          count={cabin.length}
          image={
            'https://t4.ftcdn.net/jpg/05/75/66/45/360_F_575664510_p3VZPFfdqZtzCAjfJ4kJuU5OUYR4NsSx.jpg'
          }
        />
      </List>
    )
  );
};

export default PropertyTypeList;

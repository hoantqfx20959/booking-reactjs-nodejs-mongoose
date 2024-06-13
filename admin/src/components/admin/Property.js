import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../untils/axios';

import useData from '../../untils/use-data';

import styles from './Table.module.css';

import Content from '../UI/Content/Content';
import Checkbox from '../UI/Checkbox/Checkbox';

import Header from '../common/page/Header';
import Navbar from '../common/page/Navbar';

function Property() {
  const { property, city } = useData();

  const [propertyId, setPropertyId] = useState();
  const [cityId, setCityId] = useState();
  const valus = { propertyId, cityId };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const propertyElement = document.getElementById(`${propertyId}`);

      await axios.delete(`/api/property`, {
        data: valus,
      });

      propertyElement.parentNode.removeChild(propertyElement);
    } catch (err) {
      console.log(err);
    }
  };

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const handleSelectAll = e => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(property && property.map(property => property._id));
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

  const properties = (
    <div className={styles.card}>
      <div className={styles.title}>
        <h3>Properties</h3>
        <div>
          <Link to={`/new-property`} className={`${styles.btn} ${styles.link}`}>
            Add New
          </Link>
        </div>
      </div>
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
            <th>Name</th>
            <th>Type</th>
            <th>Title</th>
            <th>City</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {property &&
            property.map(item => (
              <tr key={item._id} id={item._id}>
                <td>
                  <Checkbox
                    key={item._id}
                    type='checkbox'
                    name={item.name}
                    id={item._id}
                    handleClick={handleClick}
                    isChecked={isCheck.includes(item._id)}
                  />
                </td>
                <td>{item._id}</td>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.title}</td>
                <td>{item.city}</td>
                <td>
                  <form onSubmit={handleSubmit} className={styles.action}>
                    <div>
                      <Link
                        className={`${styles.btn} ${styles.link}`}
                        to={`/edit-property/${item._id}`}>
                        Edit
                      </Link>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          setPropertyId(item._id);
                          const handleCity =
                            city &&
                            city.filter(city =>
                              city.properties.some(property =>
                                property.propertyId.includes(item._id)
                              )
                            );
                          setCityId(handleCity[0]._id);
                        }}
                        className={styles.btn}>
                        Delete
                      </button>
                    </div>
                  </form>
                </td>
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
        {properties}
      </Content>
    </>
  );
}

export default Property;

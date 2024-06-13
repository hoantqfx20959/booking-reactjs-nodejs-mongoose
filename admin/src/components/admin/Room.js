import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../untils/axios';

import useData from '../../untils/use-data';

import styles from './Table.module.css';

import Content from '../UI/Content/Content';
import Checkbox from '../UI/Checkbox/Checkbox';

import Header from '../common/page/Header';
import Navbar from '../common/page/Navbar';

function Room() {
  const { room, property } = useData();

  const [roomId, setRoomId] = useState();
  const [propertyId, setPropertyId] = useState();
  const valus = { roomId, propertyId };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const roomElement = document.getElementById(`${roomId}`);

      await axios.delete(`/api/room`, {
        data: valus,
      });

      roomElement.parentNode.removeChild(roomElement);
    } catch (err) {
      console.log(err);
    }
  };

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const handleSelectAll = e => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(room && room.map(property => property._id));
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

  const rooms = (
    <div className={styles.card}>
      <div className={styles.title}>
        <h3>Rooms</h3>
        <Link to={`/new-room`} className={`${styles.btn} ${styles.link}`}>
          Add New
        </Link>
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
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Max People</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {room &&
            room.map(item => (
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
                <td>{item.title}</td>
                <td>{item.desc}</td>
                <td>{item.price}</td>
                <td>{item.maxPeople}</td>
                <td>
                  <form onSubmit={handleSubmit} className={styles.action}>
                    <div>
                      <Link
                        className={styles.btn}
                        to={`/edit-room/${item._id}`}>
                        Edit
                      </Link>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          setRoomId(item._id);
                          const handleProperty =
                            property &&
                            property.filter(ppt =>
                              ppt.rooms.some(room =>
                                room.roomId.includes(item._id)
                              )
                            );
                          setPropertyId(handleProperty[0]._id);
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
        {rooms}
      </Content>
    </>
  );
}

export default Room;

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../../../untils/axios';

import styles from './Form.module.css';

import Content from '../../UI/Content/Content';
import ImageInput from './InputImage';
import Button from '../../UI/Button/Button';

import Header from '../../common/page/Header';
import Navbar from '../../common/page/Navbar';

const generateError = error =>
  toast.error(error, {
    position: 'bottom-right',
  });

const AdminPropertyForm = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [propertyList, setPropertyList] = useState([]);
  const [editRoom, setEditRoom] = useState();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [maxPeople, setMaxPeople] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [property, setProperty] = useState('');
  const [photos, setPhotos] = useState('');
  const [values, setValues] = useState({
    id: null,
    title: '',
    desc: '',
    price: '',
    maxPeople: '',
    roomNumbers: '',
    property: '',
    photos: '',
  });

  const FetchUrl = (url, func) => {
    useEffect(() => {
      async function fetchData() {
        const { data } = await axios.get(url,);

        func(data.items || data.item || data.user);
        return data;
      }
      fetchData();
    }, [url, func]);
  };

  FetchUrl(`/api/properties`, setPropertyList);
  //
  if (params.id) {
    FetchUrl(`/api/room/${params.id}`, setEditRoom);
  }

  let propertyEditRoom;

  if (editRoom) {
    propertyEditRoom = propertyList
      .filter(property =>
   
        property.rooms.some(room => room.roomId === editRoom._id)
      )
      .filter(lol => lol.rooms.length > 0);
  }

  const typeProperty = [{ value: '', label: 'Select Property' }];

  propertyList.map(property =>
    typeProperty.push({ value: property._id, label: property.name })
  );

  let roomNumbers = editRoom && editRoom.roomNumbers;

  const callbackChild = data => {
    setPhotos(data);
  };

  const handleInput = () => {
    setValues({
      id: editRoom ? editRoom._id : null,
      title: title || (editRoom && editRoom.title),
      desc: desc || (editRoom && editRoom.desc),
      price: price || (editRoom && editRoom.price),
      maxPeople: maxPeople || (editRoom && editRoom.maxPeople),
      roomNumbers:
        roomNumber ||
        (editRoom &&
          roomNumbers &&
          roomNumbers.map(roomNumber => roomNumber.roomNumberId.number)),
      propertyId:
        property ||
        (editRoom && propertyEditRoom.length > 0 && propertyEditRoom[0]._id),
      photos: photos || (editRoom && editRoom.photos),
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const { data } = await axios[editRoom ? 'put' : 'post'](
        `api/${editRoom ? `room/${params.id}` : 'rooms'}`,
        {
          ...values,
        },
       
      );

      if (data) {
        if (data.errors) {
          const {
            title,
            desc,
            price,
            maxPeople,
        
            propertyId,
       
          } = data.errors;
          if (title) generateError(title);
          else if (desc) generateError(desc);
          else if (price) generateError(price);
          else if (maxPeople) generateError(maxPeople);
    
          else if (propertyId) generateError(propertyId);
  
        } else {
          navigate('/rooms');
        }
      }
  
    } catch (err) {
      console.log(err);
      generateError(err.response.data.errorMessage);
    }
  };

  return (
    <>
      <Navbar />
      <Content>
        <Header />
        <form onSubmit={handleSubmit}>
          <div className={styles.formItem}>
            <div className={styles.formRow}>
              <div className={styles.formCol}>
                <div className={styles.formColItem}>
                  <label>Title</label>
                  <input
                    type='text'
                    name='title'
                    placeholder='Title'
                    onChange={e => setTitle(e.target.value)}
                    defaultValue={editRoom ? editRoom.title : ''}
                  />
                </div>
                <div className={styles.formColItem}>
                  <label>Price</label>
                  <input
                    type='number'
                    name='price'
                    placeholder='Price'
                    onChange={e => setPrice(e.target.value)}
                    defaultValue={editRoom ? editRoom.price : ''}
                  />
                </div>
                <div className={styles.formColItem}>
                  <label>Room Number</label>
                  <input
                    type='text'
                    name='roomNumber'
                    placeholder='Room Number'
                    onChange={e => setRoomNumber(e.target.value.split(','))}
                    defaultValue={
                      editRoom
                        ? roomNumbers &&
                          roomNumbers
                            .map(roomNumber => roomNumber.roomNumberId.number)
                            .sort((a, b) => a - b)
                        : ''
                    }
                  />
                </div>
              </div>
              <div className={styles.formCol}>
                <div className={styles.formColItem}>
                  <label>Description</label>
                  <input
                    type='text'
                    name='desc'
                    // rows='5'
                    placeholder='Description'
                    onChange={e => setDesc(e.target.value)}
                    defaultValue={editRoom ? editRoom.desc : ''}
                  />
                </div>
                <div className={styles.formColItem}>
                  <label>Max People</label>
                  <input
                    type='text'
                    name='maxPeople'
                    placeholder='Max People'
                    onChange={e => setMaxPeople(e.target.value)}
                    defaultValue={editRoom ? editRoom.maxPeople : ''}
                  />
                </div>
                <div className={styles.formColItem}>
                  <label>Choose a property</label>
                  {editRoom ? (
                    propertyEditRoom.length > 0 && (
                      <select
                        name='property'
                        onChange={e => setProperty(propertyEditRoom[0]._id)}>
                        <option value={propertyEditRoom[0]._id}>
                          {propertyEditRoom[0].name}
                        </option>
                      </select>
                    )
                  ) : (
                    <select
                      name='property'
                      onChange={e => setProperty(e.target.value)}>
                      {typeProperty.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <ImageInput editItem={editRoom} parentCallback={callbackChild} />
          </div>

          <div>
            <Button onClick={handleInput}>Save</Button>
          </div>
        </form>
        <ToastContainer />
      </Content>
    </>
  );
};

export default AdminPropertyForm;

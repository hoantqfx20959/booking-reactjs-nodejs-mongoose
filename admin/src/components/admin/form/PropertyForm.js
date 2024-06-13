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

const typeOption = [
  { value: '', label: 'Select Type' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'resort', label: 'Resort' },
  { value: 'villa', label: 'Villa' },
  { value: 'cabin', label: 'Cabin' },
];

const AdminPropertyForm = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [editProperty, setEditProperty] = useState();

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [distance, setDistance] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [cheapestPrice, setCheapestPrice] = useState('');
  const [photos, setPhotos] = useState();
  const [featured, setFeatured] = useState(false);

  const [values, setValues] = useState({
    id: null,
    name: '',
    type: '',
    city: '',
    address: '',
    distance: '',
    title: '',
    desc: '',
    cheapestPrice: '',
    photos: '',
    featured: '',
    rooms: null,
    rate_text: '',
  });

  const FetchUrl = (url, func) => {
    useEffect(() => {
      async function fetchData() {
        const request = await axios.get(url);
        func(request.data.items || request.data.item || request.data.user);
        return request;
      }
      fetchData();
    }, [url, func]);
  };

  //
  if (params.id) {
    FetchUrl(`/api/property/${params.id}`, setEditProperty);
  }

  const callbackChild = data => {
    setPhotos(data);
  };

  const handleInput = () => {
    setValues({
      id: editProperty ? editProperty._id : null,
      name: name || (editProperty && editProperty.name),
      type: type || (editProperty && editProperty.type),
      city: city || (editProperty && editProperty.city),
      address: address || (editProperty && editProperty.address),
      distance: distance || (editProperty && editProperty.distance),
      title: title || (editProperty && editProperty.title),
      desc: desc || (editProperty && editProperty.desc),
      cheapestPrice:
        cheapestPrice || (editProperty && editProperty.cheapestPrice),
      photos: photos || (editProperty && editProperty.photos),
      featured: featured || (editProperty && editProperty.featured),

      rate_text: 'Excellent',
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const { data } = await axios[editProperty ? 'put' : 'post'](
        `api/${editProperty ? `property/${params.id}` : 'properties'}`,
        {
          ...values,
        }
      );

      if (data) {
        if (data.errors) {
          const {
            name,

            city,
            address,
            distance,
            title,
            desc,
            cheapestPrice,
          } = data.errors;
          if (name) generateError(name);
          else if (city) generateError(city);
          else if (address) generateError(address);
          else if (distance) generateError(distance);
          else if (title) generateError(title);
          else if (desc) generateError(desc);
          else if (cheapestPrice) generateError(cheapestPrice);
        } else {
          navigate('/properties');
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
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formItem}>
            <div className={styles.formRow}>
              <div className={styles.formCol}>
                <div className={styles.formColItem}>
                  <label>Name</label>
                  <input
                    type='text'
                    name='name'
                    placeholder='Name'
                    onChange={e => setName(e.target.value)}
                    defaultValue={editProperty ? editProperty.name : ''}
                  />
                </div>
                <div className={styles.formColItem}>
                  <label>City</label>
                  <input
                    type='text'
                    name='city'
                    placeholder='City'
                    onChange={e => setCity(e.target.value)}
                    defaultValue={editProperty ? editProperty.city : ''}
                  />
                </div>
                <div className={styles.formColItem}>
                  <label>Distance from City Center</label>
                  <input
                    type='text'
                    name='distance'
                    placeholder='Distance'
                    onChange={e => setDistance(e.target.value)}
                    defaultValue={editProperty ? editProperty.distance : ''}
                  />
                </div>
                <div className={styles.formColItem}>
                  <label>Description</label>
                  <input
                    type='text'
                    name='desc'
                    // rows='5'
                    placeholder='Description'
                    onChange={e => setDesc(e.target.value)}
                    defaultValue={editProperty ? editProperty.desc : ''}
                  />
                </div>
              </div>
              <div className={styles.formCol}>
                <div className={styles.formColItem}>
                  <label>Type</label>
                  <select
                    name='type'
                    onChange={e =>
                      setType(editProperty ? editProperty.type : e.target.value)
                    }>
                    {typeOption.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formColItem}>
                  <label>Address</label>
                  <input
                    type='text'
                    name='address'
                    placeholder='Address'
                    onChange={e => setAddress(e.target.value)}
                    defaultValue={editProperty ? editProperty.address : ''}
                  />
                </div>
                <div className={styles.formColItem}>
                  <label>Title</label>
                  <input
                    type='text'
                    name='title'
                    placeholder='Title'
                    onChange={e => setTitle(e.target.value)}
                    defaultValue={editProperty ? editProperty.title : ''}
                  />
                </div>
                <div className={styles.formColItem}>
                  <label>Cheapest Price</label>
                  <input
                    type='text'
                    name='cheapestPrice'
                    placeholder='Cheapest Price'
                    onChange={e => setCheapestPrice(e.target.value)}
                    defaultValue={
                      editProperty ? editProperty.cheapestPrice : ''
                    }
                  />
                </div>
                <div className={styles.formColItem}>
                  <label>Featured</label>
                  <select
                    name='featured'
                    onChange={e => setFeatured(e.target.value)}>
                    <option value='false'>False</option>
                    <option value='true'>True</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <ImageInput
                editItem={editProperty}
                parentCallback={callbackChild}
              />
            </div>
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

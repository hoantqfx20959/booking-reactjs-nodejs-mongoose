import { useEffect, useState } from 'react';
import validator from 'validator';

import styles from './Form.module.css';

const ImageInput = props => {
  const inputImage = [
    {
      type: 'url',
      id: 'image',
      value: '',
    },
  ];

  const [inputArr, setInputArr] = useState(inputImage);

  useEffect(() => {
    const imageAvailable = [];

    props.editItem &&
      props.editItem.photos.map((item, i) => {
        imageAvailable.push({ type: 'url', id: `image-${i++}`, value: item });
        return item;
      });

    setInputArr(() => {
      return [
        ...imageAvailable,
        {
          type: 'url',
          id: '',
          value: '',
        },
      ];
    });
  }, [props.editItem]);

  const addInput = () => {
    setInputArr(s => {
      return [
        ...s,
        {
          type: 'url',
          id: '',
          value: '',
        },
      ];
    });
  };

  const uploadImage = event => {
    event.preventDefault();

    const index = event.target.id;

    if (validator.isURL(event.target.value)) {
      setInputArr(s => {
        const newArr = s.slice();
        newArr[index].id = `image-${index}`;
        newArr[index].value = event.target.value;

        return newArr;
      });
      addInput();
    }
  };

  const removeImg = event => {
    event.preventDefault();

    const updatedImg = [...inputArr];
    const imgRemoveIndex = updatedImg.findIndex(
      img => img.value === event.target.id
    );

    updatedImg.splice(imgRemoveIndex, 1);

    setInputArr(() => {
      return [...updatedImg];
    });
  };

  useEffect(() => {
    const urlInputArr = [...inputArr];

    urlInputArr.pop();

    const photos = urlInputArr.map(item => {
      if (validator.isURL(item.value)) {
        return item.value;
      }
      return item;
    });

    props.parentCallback(photos);
  }, [inputArr]);

  return (
    <>
      <div className={styles.formColItem}>
        <label>Image</label>
        {inputArr.map((item, i) => {
          return (
            <div className={styles.imgInput} key={i}>
              {!item.value && (
                <input
                  onChange={uploadImage}
                  value={item.value}
                  id={i}
                  type={item.type}
                  placeholder='Photos'
                />
              )}
            </div>
          );
        })}

        <div className={styles.imgArr}>
          {inputArr.map((item, i) => {
            const alt = `${
              props.editItem &&
              (props.editItem.name?.toLowerCase().replaceAll(' ', '-') ||
                props.editItem.title.toLowerCase().replaceAll(' ', '-'))
            }--image-${i}`;

            return (
              <div key={i} className={styles.imgItem}>
                {item.value && (
                  <>
                    <span
                      onClick={removeImg}
                      className={styles.imgX}
                      id={item.value}>
                      X
                    </span>

                    <img alt={alt} src={item.value} />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ImageInput;

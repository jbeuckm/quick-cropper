import { useCallback, useEffect, useState, useRef } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Croppr from 'croppr';
import './croppr.min.css';

const { ipcRenderer } = window.electron;

export default function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState();
  const [croppr, setCroppr] = useState();
  const [box, setBox] = useState();

  const cropAndSave = useCallback(() => {
    console.log({ box });

    ipcRenderer.on('CROP_COMPLETE', (newImage) => {
      // console.log(newImage.data);
      // setImages([newImage]);
    });
    ipcRenderer.sendMessage('PERFORM_CROP', { selectedImage, box });
  }, [box, selectedImage]);

  useEffect(() => {
    const remove = ipcRenderer.on('CROP_AND_SAVE', cropAndSave);

    return () => {
      remove();
    };
  }, [box]);

  const receiveImages = (event, args) => {
    setImages(event);
  };

  useEffect(() => {
    const remove = ipcRenderer.on('FILE_OPEN', receiveImages);

    return () => {
      remove();
    };
  }, []);

  useEffect(() => {
    if (selectedImage) {
      const newCroppr = new Croppr('#croppr', {
        startSize: [50, 50],
        // minSize: [512, 512, 'px'],
        aspectRatio: 1,

        // onInitialize: (instance) => console.log(instance),
        onCropEnd: function (value) {
          setBox(value);
        },
      });

      setBox(newCroppr.getValue());
      setCroppr(newCroppr);
    }
  }, [selectedImage, setBox]);

  return (
    <div>
      {images.map((image) => (
        <img
          key={image.path}
          height="100"
          src={image.data}
          onClick={() => {
            try {
              croppr?.destroy();
              setSelectedImage(image);
            } catch (e) {
              console.log(e);
            }
          }}
        />
      ))}

      {!!selectedImage && (
        <img id="croppr" width="100%" src={selectedImage.data} />
      )}
    </div>
  );
}

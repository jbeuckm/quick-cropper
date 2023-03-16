import { useEffect, useState, useRef } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Croppr from 'croppr';
import './croppr.min.css';

export default function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState();
  const [croppr, setCroppr] = useState();
  const cropprImg = useRef();

  useEffect(() => {
    window.electron.ipcRenderer.on('FILE_OPEN', (event, args) => {
      setImages(event);
    });
  }, []);

  useEffect(() => {
    if (cropprImg.current) {
      setCroppr(
        new Croppr(cropprImg.current, {
          startSize: [50, 50],
          aspectRatio: 1,
        })
      );
    }
  }, [cropprImg.current]);

  return (
    <div>
      {images.map((image) => (
        <img
          key={image.path}
          height="100"
          src={image.data}
          onClick={() => setSelectedImage(image)}
        />
      ))}

      {selectedImage && (
        <img ref={cropprImg} width="100%" src={selectedImage.data} />
      )}
    </div>
  );
}

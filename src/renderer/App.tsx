import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

export default function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    window.electron.ipcRenderer.on('FILE_OPEN', (event, args) => {
      setImages(event);
    });
  }, []);

  return (
    <div>
      {images.map((image) => (
        <img key={image.path} height="100" src={image.data} />
      ))}
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CategoriesPage.css';

import mobileImg from '../img/mb.jpg';
import laptopImg from '../img/lap.jpg';
import printerImg from '../img/printer.jpg';
import speakerImg from '../img/sp.jpg';
import watchImg from '../img/sw.jpg';
import cameraImg from '../img/cam.jpg';
import desktopImg from '../img/desktop1.jpg';
const categories = [
  { name: 'Mobile', image: mobileImg },
  { name: 'Laptop', image: laptopImg },
  { name: 'Printer', image: printerImg },
  { name: 'Speaker', image: speakerImg },
  { name: 'Smartwatch', image: watchImg },
  { name: 'Camera', image: cameraImg },
  { name: 'Desktop', image: desktopImg },
];


const CategoriesPage = () => {
  const navigate = useNavigate();

  const handleClick = (category) => {
    navigate(`/category/${category.toLowerCase()}`);
  };

  return (
    <div className="category-container">
      <h2>Shop by Category</h2>
      <div className="category-grid">
        {categories.map((cat, index) => (
          <div key={index} className="category-card" onClick={() => handleClick(cat.name)}>
            <img src={cat.image} alt={cat.name} />
            <h3>{cat.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;

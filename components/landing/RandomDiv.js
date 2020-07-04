import React from 'react';

function RandomDiv({ size, color, x, y, gif }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        top: `${x}px`,
        left: `${y}px`,
        position: 'absolute',
        backgroundImage: `url(https://i.giphy.com/media/${gif}/giphy.webp)`,
        backgroundSize: `cover`,
      }}
    ></div>
  );
}

export default RandomDiv;

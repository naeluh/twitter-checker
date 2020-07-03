import React from 'react';

function RandomDiv({ size, color, x, y }) {
  console.log({ size, color, x, y });
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        top: `${x}px`,
        left: `${y}px`,
        position: 'absolute',
      }}
    ></div>
  );
}

export default RandomDiv;

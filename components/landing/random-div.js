import React, { useRef, useEffect, useState } from 'react';
import styles from './random-div.module.css';

function RandomDiv({ size, color, x, y, gif }) {
  const targetRef = useRef();
  const duration = (Math.random() * 10 + 1).toFixed();

  function handleResize() {
    let divsize = (Math.random() * 15 + 10).toFixed();
    let posx = (Math.random() * window.innerHeight - targetRef.current.clientHeight).toFixed();
    let posy = (Math.random() * window.innerWidth - targetRef.current.clientHeight).toFixed();
    targetRef.current.style.top = `${posx}px`;
    targetRef.current.style.left = `${posy}px`;
    targetRef.current.style.height = `${divsize}vh`;
    targetRef.current.style.width = `${divsize}vw`;
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);
    };
  }, []);

  return (
    <div
      className={styles.images}
      ref={targetRef}
      style={{
        width: `${size}vw`,
        height: `${size}vh`,
        backgroundColor: color,
        top: `${y}px`,
        left: `${x}%`,
        position: 'absolute',
        backgroundImage: `url(https://i.giphy.com/media/${gif}/giphy.webp)`,
        backgroundSize: `cover`,
        backgroundPosition: `center center`,
        animationDuration: `${duration}s`,
      }}
    ></div>
  );
}

export default RandomDiv;

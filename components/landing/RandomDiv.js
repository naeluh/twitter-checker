import React, { useRef, useEffect } from 'react';

function RandomDiv({ size, color, x, y, gif }) {
  const targetRef = useRef();

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
      ref={targetRef}
      style={{
        width: `${size}vw`,
        height: `${size}vh`,
        backgroundColor: color,
        top: `${x}px`,
        left: `${y}px`,
        position: 'absolute',
        backgroundImage: `url(https://i.giphy.com/media/${gif}/giphy.webp)`,
        backgroundSize: `cover`,
        backgroundPosition: `center center`,
      }}
    ></div>
  );
}

export default RandomDiv;

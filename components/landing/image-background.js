import React, { useEffect, useState } from 'react';
import RandomDiv from './random-div';

export default function ImageBackground({ amount, gifs }) {
  const divData = [];
  const [divs, setDivs] = useState('');
  const [loaded, setLoaded] = useState(false);

  const buildDivs = () => {
    const divArr = [];

    for (let index = 0; index < amount; index++) {
      let divsize = (Math.random() * 15 + 10).toFixed();
      let color = '#' + Math.round(0xffffff * Math.random()).toString(16);
      let posx = (Math.random() * 100 + 0).toFixed();
      let posy = (Math.random() * window.innerWidth - divsize).toFixed();
      let gif = gifs.gifs[index].id;
      divData.push({ index: index, size: divsize, color: color, x: posx, y: posy, gif: gif });
    }

    divData.map(({ index, size, color, x, y, gif }) => {
      divArr.push(
        <RandomDiv key={index.toString()} size={size} color={color} x={x} y={y} gif={gif} />
      );
    });

    setDivs(divArr);
    setLoaded(true);
  };

  useEffect(() => {
    buildDivs();
    return () => {};
  }, []);

  return <div>{loaded ? divs : 'no divs'}</div>;
}

import React, { useEffect, useState } from 'react';
import RandomDiv from './RandomDiv';

export default function ImageBackground({ amount }) {
  const divData = [];
  const [divs, setDivs] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const divArr = [];

    for (let index = 0; index < amount; index++) {
      let divsize = (Math.random() * 100 + 50).toFixed();
      let color = '#' + Math.round(0xffffff * Math.random()).toString(16);
      let posx = (Math.random() * window.innerHeight - divsize).toFixed();
      let posy = (Math.random() * window.innerWidth - divsize).toFixed();
      divData.push({ index: index, size: divsize, color: color, x: posx, y: posy });
    }

    divData.map(({ index, size, color, x, y }) => {
      divArr.push(<RandomDiv key={index.toString()} size={size} color={color} x={x} y={y} />);
    });

    setDivs(divArr);
    setLoaded(true);

    return () => {};
  }, []);

  console.log(divs);

  return <div>{loaded ? divs : 'no divs'}</div>;
}

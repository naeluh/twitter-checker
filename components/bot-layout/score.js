import React, { useState, useEffect } from 'react';
import components from '../../components/twitter-layout/components';
import Button from './button';
import styles from './button.module.css';

export default function Score({ screen_name }) {
  if (typeof screen_name === 'string') {
    return screen_name;
  }

  const [twitterData, setTwitterData] = useState(false);

  const DIV = components.div;

  useEffect(() => {
    setTwitterData(true);
    return () => {
      setTwitterData(false);
    };
  }, [screen_name.data.username]);

  return (
    <DIV className={styles.centerCol}>
      {twitterData ? (
        <Button
          username={screen_name.data.username}
          setTwitterData={setTwitterData}
          twitterData={twitterData}
        />
      ) : (
        <></>
      )}
    </DIV>
  );
}

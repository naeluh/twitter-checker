import React, { useState, useEffect } from 'react';
import botometer from '../../pages/api/botornot';
import components from '../../components/twitter-layout/components';
import RandomTweet from '../../components/landing/random-tweet';
import Button from './button';

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
    <DIV className="center center-col">
      {twitterData ? (
        <Button
          username={screen_name.data.username}
          setTwitterData={setTwitterData}
          twitterData={twitterData}
        />
      ) : (
        <></>
      )}
      <style jsx>{`
        span {
          line-height: 1.5;
        }
        .center {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .center-col {
          text-align: center;
          flex-direction: column;
        }
        .large {
          font-size: 3rem;
          line-height: 1;
        }
        .m {
          margin-top: 0.5rem;
        }
        .blink {
          animation: blinker 1s linear infinite;
        }

        @keyframes blinker {
          50% {
            opacity: 0;
          }
        }

        @import url('https://fonts.googleapis.com/css?family=Inconsolata:400,700');

        .tweet-button {
          /*placement for code pen*/
          margin: 10% 40%;
          /*Button Text Style*/
          font-family: 'Inconsolata', 'Helvetica', 'Arial', sans-serif;
          font-size: inherit;
          text-align: center;
          font-weight: bold;
          letter-spacing: 3px;
          text-transform: uppercase;
          text-decoration: none;
          /*Button Color & Border*/
          border: 4px solid #3c14d0;
          color: #3c14d0;
          background: #fff;
          outline: none;
          /*Position, Display, Size*/
          position: relative;
          display: inline-block;
          padding: 15px 10px 14px;
          cursor: pointer;
          width: auto;
        }

        .tweet-button:after {
          /*Make a:after be as big as button*/
          position: absolute;
          width: 100%;
          height: 100%;
          /*Give a:after Border & Background color*/
          border: 2px solid #3c14d0;
          background-color: #3c14d0;
          /*Decide Location of a:after..this gives a           bottom right shadow*/
          left: 4px;
          top: 4px;
          /*Place a:after behind button*/
          z-index: -1;
          content: '';
          /*Animation/Transition Speed*/
          -webkit-transition: all 0.5s;
          -moz-transition: all 0.5s;
          -o-transition: all 0.5s;
        }

        .tweet-button:hover {
          top: 2px;
          left: 2px;
        }

        .tweet-button:hover:after {
          top: -2px;
          left: -2px;
        }
      `}</style>
    </DIV>
  );
}

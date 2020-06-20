import React, { useState, useEffect } from 'react';
import botometer from '../../pages/api/botornot';
import components from '../../components/twitter-layout/components';
import RandomTweet from '../../components/landing/random-tweet';

export default function Score({ screen_name }) {
  if (typeof screen_name === 'string') {
    return screen_name;
  }

  const [loaded, setLoaded] = useState(false);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState('');

  const B = new botometer({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    x_rapid_api_host: process.env.X_RAPID_API_HOST,
    x_rapid_api_key: process.env.X_RAPID_API_KEY,
    app_only_auth: true,
    rate_limit: 0,
    log_progress: true,
    include_user: true,
    include_timeline: false,
    include_mentions: false,
  });

  const P = components.p;
  const DIV = components.div;

  async function checkAccount(screen_name) {
    setLoaded(false);
    await B.getBatchBotScores([screen_name], data => {
      setUser(data[0].user.screen_name);
      setScore(data[0].botometer.scores.universal);
    });
    setLoaded(true);
  }

  useEffect(() => {
    checkAccount(screen_name.data.username);
    return () => {};
  }, [screen_name]);

  return (
    <DIV>
      {loaded ? (
        <DIV className="center center-col">
          {user} has a score of {score}
          <br />
          {score >= 2.5 ? (
            <span>
              Most likely a <span className="large">🤖</span>
            </span>
          ) : (
            <span>
              Most likely{' '}
              <strong>
                <em>not</em>
              </strong>{' '}
              a <span className="large">🤖</span>
            </span>
          )}
        </DIV>
      ) : (
        <DIV className="center">
          loading <span className="large">&nbsp;🤖&nbsp;</span> bot score for{' '}
          {screen_name.data.username} <span className="blink">&nbsp;...</span>{' '}
        </DIV>
      )}
      <DIV className="center center-col">
        <RandomTweet initialId="1274080589310824450" loadNewTweet={loaded} />
      </DIV>{' '}
      <style jsx>{`
        .center {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .center-col {
          flex-direction: column;
        }
        .large {
          font-size: 3rem;
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

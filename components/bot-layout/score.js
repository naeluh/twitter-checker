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
          loading <span className="large">🤖</span> bot score for {screen_name.data.username}{' '}
          <span className="blink">...</span>{' '}
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
      `}</style>
    </DIV>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import botometer from '../../pages/api/botornot';
import RandomTweet from '../../components/landing/random-tweet';

export default function button({ username, setTwitterData, twitterData }) {
  const [didClickButton, setDidClickButton] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState('');
  const [choice, setChoice] = useState('bot');
  const not = useRef(null);
  const bot = useRef(null);

  // console.log(twitterData);

  useEffect(() => {
    setLoaded(false);
    return () => {};
  }, []);

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

  async function checkBot() {
    setLoading(true);
    setChoice(event.target.value);
    await B.getBatchBotScores([username], data => {
      setUser(data[0].user.screen_name);
      setScore(data[0].botometer.scores.universal);
    });
    setLoading(false);
    setLoaded(true);
  }

  return (
    <div>
      {loading ? (
        <>
          <span>
            <strong>
              <span className={`blink`}>loading ...</span>
            </strong>
          </span>{' '}
        </>
      ) : loaded ? (
        <>
          <span>
            You chose <strong>{choice}</strong>
          </span>
          <br />
          <br />
          <span>
            <strong>@{user}</strong> has a score of <strong>{score}</strong>
          </span>
          <br />
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
          <div className="center center-col m">
            <RandomTweet
              initialId="1274080589310824450"
              loaded={loaded}
              setLoaded={setLoaded}
              setTwitterData={setTwitterData}
              twitterData={twitterData}
            />
          </div>{' '}
        </>
      ) : (
        <>
          <button
            value="bot"
            type="button"
            blank={`false`}
            className={`tweet-button`}
            onClick={checkBot}
            ref={bot}
          >
            Bot
          </button>
          <strong>&nbsp; &nbsp; or &nbsp; &nbsp;</strong>
          <button
            value="not"
            type="button"
            blank={`false`}
            className={`tweet-button`}
            onClick={checkBot}
            ref={not}
          >
            Not
          </button>
        </>
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
        .tweet-button {
          background-color: rgb(29, 161, 242);
          border-bottom-left-radius: 9999px;
          border-bottom-right-radius: 9999px;
          border-top-left-radius: 9999px;
          border-top-right-radius: 9999px;
          border: 0 solid black;
          box-sizing: border-box;
          color: #fff;
          -webkit-text-decoration: none;
          text-decoration: none;
          display: inline;
          font-size: 1rem;
          font-weight: 700;
          padding: 15px 20px;
          margin-top: 15px;
        }

        .tweet-button:hover {
          filter: brightness(80%);
        }
      `}</style>
    </div>
  );
}

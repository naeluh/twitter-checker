import React, { useState, useEffect, useRef } from 'react';
import botometer from '../../pages/api/botornot';
import RandomTweet from '../../components/landing/random-tweet';
import styles from './button.module.css';

export default function button({ username, setTwitterData, twitterData }) {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState('');
  const [choice, setChoice] = useState('bot');
  const not = useRef(null);
  const bot = useRef(null);

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
      setScore(data[0].botometer.display_scores.universal.overall);
    });
    setLoading(false);
    setLoaded(true);
  }

  return (
    <div>
      {loading ? (
        <>
          <span className={styles.span}>
            <strong>
              <span className={styles.blink}>loading ...</span>
            </strong>
          </span>{' '}
        </>
      ) : loaded ? (
        <>
          <span className={styles.span}>
            You chose <strong>{choice}</strong>
          </span>
          <br />
          <br />
          <span className={styles.span}>
            <strong>@{user}</strong> has a score of <strong>{score}</strong>
          </span>
          <br />
          <br />
          {score >= 2.5 ? (
            <span className={styles.span}>
              Most likely a <span className={styles.large}>🤖</span>
            </span>
          ) : (
            <span className={styles.span}>
              Most likely{' '}
              <strong>
                <em>not</em>
              </strong>{' '}
              a <span className={styles.large}>🤖</span>
            </span>
          )}
          <div className={styles.centerCol}>
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
            className={styles.tweetbutton}
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
            className={styles.tweetbutton}
            onClick={checkBot}
            ref={not}
          >
            Not
          </button>
        </>
      )}
    </div>
  );
}

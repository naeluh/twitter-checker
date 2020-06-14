import React, { useState, useEffect, useRef } from 'react';
import botometer from '../api/botornot';
import Page from '../../components/landing/page';
import components from '../../components/twitter-layout/components';

export default function botornot() {
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState('');

  const inputEl = useRef(null);

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
  const Code = components.code;
  const Ul = components.ul;
  const Li = components.li;
  const H2 = components.h2;
  const Hr = components.hr;

  async function checkAccount() {
    console.log(inputEl.current.value);
    await B.getBatchBotScores([inputEl.current.value], data => {
      console.log(data);
      setUser(data[0].user.screen_name);
      setScore(data[0].botometer.scores.universal);
      setLoading(true);
    });
  }

  return (
    <Page
      title="Bot or Not test"
      description="A demo showing off ahead-of-time and incremental static generation by using Tweets as the datasource"
    >
      {loading ? (
        <Code>
          {user} has a score of {score}
        </Code>
      ) : (
        'loading'
      )}
      <P>
        <label>
          username: <input ref={inputEl} type="text" id="screen_name" />
        </label>
      </P>

      <P>
        <button onClick={checkAccount}>Is it a bot ?</button>
      </P>
    </Page>
  );
}

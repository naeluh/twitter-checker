import React, { useState, useEffect } from 'react';
import botometer from '../../pages/api/botornot';
import components from '../../components/twitter-layout/components';

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
  const Code = components.code;

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
    <P>
      {loaded ? (
        <Code>
          {user} has a score of {score}
          <br />
          {score >= 2.5 ? `Most likely a bot` : `Most likely not a bot`}
        </Code>
      ) : (
        <Code>loading bot score for {screen_name.data.username}...</Code>
      )}
    </P>
  );
}

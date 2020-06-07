import React, { useState } from 'react';
import botometer from '../api/botornot';

export default function botornot() {
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

  return <div>here</div>;
}

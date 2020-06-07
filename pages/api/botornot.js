import fetch from 'isomorphic-fetch';
require('es6-promise').polyfill();
import Twitter from 'twitter-lite';

const botometer = function (config) {
  (async function botdata() {
    // botometer api credentials
    // const mashape_key = config.mashape_key;

    //rapid api credentials
    const x_rapid_api_host = config.x_rapid_api_host;

    const x_rapid_api_key = config.x_rapid_api_key;

    // delay for twitter API calls
    const rate_limit = config.rate_limit || 0;

    // whether to console log names as they're collected
    const log_progress = config.log_progress || true;

    // whether to include user data in output
    const include_user = config.include_user || true;

    // whether to include timeline data in output
    const include_timeline = config.include_timeline || false;

    // whether to include mentions data in output
    const include_mentions = config.include_mentions || false;

    const client = new Twitter({
      consumer_key: config.consumer_key, // from Twitter.
      consumer_secret: config.consumer_secret, // from Twitter.
      access_token_key: config.access_token, // from your User (oauth_token)
      access_token_secret: config.access_token_secret, // from your User (oauth_token_secret)
    });

    // Example POST method implementation:
    async function postData(url = '', data = {}) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'x-rapidapi-host': x_rapid_api_host,
          'x-rapidapi-key': x_rapid_api_key,
          'content-type': 'application/json',
          accept: 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),
      });
      return response.json();
    }

    // get botometer score
    async function getBotometer(data) {
      new Promise((resolve, reject) => {
        setTimeout(() => {
          postData('https://botometer-pro.p.rapidapi.com/2/check_account', data)
            .then(data => {
              console.log(data);
              resolve(data);
            })
            .catch(error => {
              console.error(error);
              reject(error);
            });
        }, rate_limit);
      });
    }

    // returns a user object, their latest tweets and mentions, and bot score
    async function getBotScore(screen_name) {
      const data = {
        timeline: await getlatestTweets(screen_name),
        mentions: await getlatestMentions(screen_name),
        user: await getIds(screen_name),
      };

      return new Promise((resolve, reject) => {
        console.log(`here`);
        getBotometer(data)
          .then(botometer => {
            console.log(botometer);
            // since we already save full user object,
            // overwrite botometer user prop to keep basic user data
            if (
              data.user &&
              data.user.hasOwnProperty('screen_name') &&
              data.user.hasOwnProperty('user_id')
            ) {
              botometer.user = {
                screen_name: data.user.screen_name,
                user_id: data.user.user_id,
              };
            }
            // save botometer scores to data
            data.botometer = botometer;
            // delete any data not requested in config and resolve
            if (!include_user && data.hasOwnProperty('user')) delete data.user;
            if (!include_timeline && data.hasOwnProperty('timeline')) delete data.timeline;
            if (!include_mentions && data.hasOwnProperty('mentions')) delete data.mentions;
            resolve(data);
          })
          .catch(error => {
            console.error(error);
            reject(error);
          });
      });
    }

    // takes like six seconds per account to complete
    async function getBatchBotScores(names, cb) {
      const scores = [];
      for (let name of names) {
        writeLog(`Awaiting score for ${name}`);
        const data = await getBotScore(name);
        if (data && typeof data.botometer.scores !== 'undefined') {
          scores.push(data);
          writeLog(`${name} is a ${data.botometer.scores.universal}`);
        } else {
          writeLog(`No score found for ${name}`);
        }
      }
      cb(scores);
    }

    async function getIds(username) {
      const user = await client.post('users/lookup', {
        screen_name: username,
      });
      return user[0];
    }

    async function getlatestTweets(username) {
      const data = await client.get('statuses/user_timeline', {
        screen_name: username,
        count: 10,
      });
      return data.map(d => d);
    }

    async function getlatestMentions(username) {
      const data = await client.get('search/tweets', { q: `@${username}`, count: 10 });
      return data.statuses.map(d => d);
    }

    try {
      // const ids = await getIds(names);
      // console.log(ids);
      const data = await getBotScore(`realDonaldTrump`);
      // const tweets = data.map(data => data.text);
      console.log(data);
      return;
    } catch (error) {
      console.error(error);
    }
  })();
};

export default botometer;

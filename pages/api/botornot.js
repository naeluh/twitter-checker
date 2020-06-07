// import fetch from '../../lib/fetch';
// import unirest from 'unirest';
// import Promise from 'bluebird';
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

    const names = ['collinskeith', 'usinjuries', 'actual_ransom'];

    // get botometer score
    function getBotometer(screen_name) {
      new Promise((resolve, reject) => {
        setTimeout(() => {
          unirest
            .post('https://osome-botometer.p.mashape.com/2/check_account')
            // .header('X-Mashape-Key', mashape_key)
            .header('x-rapidapi-host', x_rapid_api_host)
            .header('x-rapidapi-key', x_rapid_api_key)
            .header('content-type', 'application/json')
            .header('accept', 'application/json')
            .send(data)
            .then(({ body }) => {
              // writeLog(result.status, result.headers, result.body);
              resolve(body);
            });
        }, rate_limit);
      });
    }

    // returns a user object, their latest tweets and mentions, and bot score
    async function getBotScore(screen_name) {
      const data = { user: null, timeline: null, mentions: null };
      return new Promise((resolve, reject) => {
        // get this user's timeline - latest 200 tweets
        this.searchTwitter('statuses/user_timeline', { screen_name, count: 200 })
          .catch(e => {
            // if error collecting timeline resolve with null
            resolve(null);
          })
          .then(timeline => {
            // save user and timeline data
            data.user = timeline[0].user;
            data.timeline = timeline;
            // get latest 100 mentions of this user by search screen name
            return this.searchTwitter('search/tweets', { q: `@${screen_name}`, count: 100 });
          })
          .catch((
            e // if error finding mentions move on with empty array
          ) =>
            // because having zero mentions is meaningful
            []
          )
          .then(mentions => {
            // save mentions
            data.mentions = mentions;
            // get botometer scores
            return this.getBotometer(data);
          })
          .catch(e => {
            // if error on botometer resolve with null
            resolve(null);
          })
          .then(botometer => {
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

    async function getIds(names) {
      const users = await client.post('users/lookup', {
        screen_name: names,
      });
      return users.map(user => user.id);
    }

    async function getlatestTweets(username) {
      const data = await client.get('statuses/user_timeline', {
        screen_name: username,
        count: 200,
      });
      return data.map(s => ({ id: s.id, text: s.text }));
    }

    async function getlatestMentions(username) {
      const data = await client.get('search/tweets', { q: `@${username}`, count: 100 });
      return data.statuses.map(s => ({ id: s.id, text: s.text }));
    }

    try {
      const ids = await getIds(names);
      console.log(ids);
      const mentions = await getlatestMentions(`realDonaldTrump`);
      // const tweets = data.map(data => data.text);
      console.log(mentions);
    } catch (error) {
      console.error(error);
    }
  })();
};

export default botometer;

/* import unirest from 'unirest';
import Promise from 'bluebird';
import Twit from 'twit';

const botometer = function (config) {
  // twitter api credentials
  const T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    app_only_auth: config.app_only_auth,
  });

  // all logging here
  const writeLog = message => {
    if (log_progress) console.log(message);
  };

  // search with multiple endpoints
  this.searchTwitter = (ep, opts) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        T.get(ep, opts, (e, data, { statusCode }) => {
          if (e || statusCode !== 200) reject(new Error(e));
          data = ep == 'search/tweets' ? data.statuses : data;
          resolve(data);
        });
      }, rate_limit);
    });

  // get botometer score
  this.getBotometer = data =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        unirest
          .post('https://osome-botometer.p.mashape.com/2/check_account')
          // .header('X-Mashape-Key', mashape_key)
          .header('x-rapidapi-host', x_rapid_api_host)
          .header('x-rapidapi-key', x_rapid_api_key)
          .header('content-type', 'application/json')
          .header('accept', 'application/json')
          .send(data)
          .then(({ body }) => {
            // writeLog(result.status, result.headers, result.body);
            resolve(body);
          });
      }, rate_limit);
    });


};

export default botometer;
 */

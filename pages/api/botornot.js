import Twitter from 'twitter-lite';

const botometer = function (config) {
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

  // all logging here
  const writeLog = function (message) {
    if (log_progress) console.log(message);
  };

  // Example POST method implementation:
  async function postData(url, data) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        headers: {
          'x-rapidapi-host': 'botometer-pro.p.rapidapi.com',
          'x-rapidapi-key': '6202dbe116mshba3ce7e627eec90p12a7dfjsn494908e87998',
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      return error;
    }
  }

  // get botometer score
  this.getBotometer = function (data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        postData('https://botometer-pro.p.rapidapi.com/4/check_account', data)
          .then(data => {
            resolve(data);
            return data;
          })
          .catch(error => {
            reject(error);
          });
      }, rate_limit);
    });
  };

  // returns a user object, their latest tweets and mentions, and bot score
  this.getBotScore = async function (screen_name) {
    const timelineRes = await fetch(`/api/tweet?q=${screen_name}`);
    const mentionsRes = await fetch(`/api/mention?q=${screen_name}`);
    const userRes = await fetch(`/api/user?q=${screen_name}`);

    const timelineJson = await timelineRes.json();
    const mentionsJson = await mentionsRes.json();
    const userJson = await userRes.json();

    const data = {
      timeline: timelineJson.timeline,
      mentions: mentionsJson.mentions,
      user: userJson.user[0],
    };

    return new Promise((resolve, reject) => {
      this.getBotometer(data)
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
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  // takes like six seconds per account to complete
  this.getBatchBotScores = async function (names, cb) {
    return new Promise(async (resolve, reject) => {
      const scores = [];
      for (let name of names) {
        writeLog(`Awaiting score for ${name}`);
        try {
          const data = await this.getBotScore(name);
          if (data && typeof data.botometer.display_scores !== 'undefined') {
            scores.push(data);
            resolve(data);
            writeLog(`${name} is a ${data.botometer.display_scores.universal.overall}`);
          } else {
            reject();
            writeLog(`No score found for ${name}`);
          }
        } catch (error) {
          reject();
          writeLog(error);
        }
      }
      cb(scores);
    });
  };
};

module.exports = botometer;

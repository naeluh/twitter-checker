import { useState, useEffect } from 'react';
import Link from 'next/link';
import A from './anchor';
import styles from './random-tweet.module.css';

const APP_URL = 'https://twitter-checker.vercel.app';
const cn = arr => arr.filter(Boolean).join(' ');

function getRandomId(id, tweets) {
  let i = 0;
  while (true) {
    const randomId = tweets[Math.floor(Math.random() * tweets.length)];
    if (randomId !== id) return randomId;
    // Make sure to not create an infinite loop
    i++;
    if (i >= tweets.length) return id;
  }
}

async function getError(res) {
  if (res.headers.get('Content-Type').includes('application/json')) {
    const data = await res.json();
    return data.errors[0];
  }
  return { message: (await res.text()) || res.statusText };
}

export default function RandomTweet({ initialId, loaded, setLoaded, setTwitterData, twitterData }) {
  const [{ id, loading, error, success }, setState] = useState({ id: initialId, loading: false });
  const fetchTweet = async e => {
    if (e) {
      e.preventDefault();
    }
    setState({ id, loading: true });

    const res = await fetch('/api/tweets');

    if (res.ok) {
      const { tweets } = await res.json();
      return setState({ id: getRandomId(id, tweets), loading: false, success: true });
    }

    const error = await getError(res);
    setState({ id, loading: false, error });
  };

  function updateLoaded() {
    if (setLoaded instanceof Function && setTwitterData instanceof Function) {
      setLoaded(false);
      setTwitterData(false);
    }
  }

  useEffect(() => {
    if (loaded) {
      fetchTweet();
    }
    return () => {};
  }, [loaded]);

  return (
    <>
      {!loaded ? (
        <></>
      ) : (
        <div className={cn([styles.centerCol])}>
          {' '}
          <Link href="/[tweet]" as={`/${id}`} passHref>
            <a
              blank={`false`}
              className={cn([styles.centerCol, styles.tweetbutton, styles.m])}
              onClick={updateLoaded}
            >
              Load a new tweet !!!
            </a>
          </Link>
        </div>
      )}

      <div className={styles['random-tweet']}>
        <button
          className={cn([styles['generate-tweet-button'], loading && styles['tweet-loading']])}
          type="button"
          onClick={fetchTweet}
        >
          {loading ? (
            <>
              <i></i>
            </>
          ) : (
            <></>
          )}
        </button>
        {error && <span>⚠️ Error: {error.message}. Please try again</span>}
      </div>
    </>
  );
}

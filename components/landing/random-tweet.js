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

export default function RandomTweet({ initialId, loadNewTweet }) {
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

  useEffect(() => {
    if (loadNewTweet) {
      fetchTweet();
    }
    return () => {};
  }, [loadNewTweet]);

  return (
    <>
      {!loadNewTweet ? (
        <></>
      ) : (
        <>
          {' '}
          <Link href="/[tweet]" as={`/${id}`} passHref>
            <a blank={`false`} className={`tweet-button`}>
              Load a new tweet !!!
              {/* {APP_URL}/<span className={success ? styles.id : null}>{id}</span> */}
            </a>
          </Link>
        </>
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
          font-weight: 700;
          padding: 15px 20px;
          margin-top: 15px;
        }

        .tweet-button:hover {
          filter: brightness(80%);
        }
      `}</style>
    </>
  );
}

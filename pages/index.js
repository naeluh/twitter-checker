import fetchTweetAst from '../lib/fetchTweetAst';
import components from '../components/twitter-layout/components';
import Page from '../components/landing/page';
import A from '../components/landing/anchor';
import Tweet from '../components/landing/tweet';
import RandomTweet from '../components/landing/random-tweet';
import { Score, Gauge } from '../components/landing/lighthouse-score';

const P = components.p;
const Code = components.code;
const Ul = components.ul;
const Li = components.li;
const H2 = components.h2;
const Hr = components.hr;

export async function getStaticProps() {
  const tweet = await fetchTweetAst('1249937011068129280');

  return { props: { tweet } };
}

export default function Index({ tweet }) {
  return (
    <Page className="center center-col m" title="Bot or not" description="Bot or not">
      <main>
        <P>
          <div className="center center-col m">
            <RandomTweet
              initialId="1274080589310824450"
              loaded={true}
              setLoaded={false}
              setTwitterData={false}
              twitterData={true}
            />
          </div>{' '}
        </P>
        <P>
          <strong className="center center-col m">
            <A href="https://twitter.com/luis_fades">Built on static tweet by Luis Alvarez</A>
          </strong>
        </P>
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
      </main>
    </Page>
  );
}

import fetchTweetAst from '../lib/fetchTweetAst';
import components from '../components/twitter-layout/components';
import Page from '../components/landing/page';
import A from '../components/landing/anchor';
import RandomTweet from '../components/landing/random-tweet';

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
    <Page title="Bot or not" description="Bot or not">
      <main>
        <RandomTweet
          initialId="1274080589310824450"
          loaded={true}
          setLoaded={false}
          setTwitterData={false}
          twitterData={true}
        />

        <P>
          <Code>
            <A href="https://twitter.com/luis_fades">Built on static tweet by Luis Alvarez</A>
          </Code>
        </P>
      </main>
    </Page>
  );
}

import Head from 'next/head';

export default function TweetMeta() {
  // TODO: Use real tweet metadata here
  return (
    <Head>
      <title>Bot or Not</title>
      <meta name="description" content="A demo showing showing how to use SWR with multiple apis" />
      <meta property="og:title" content="Bot or Not" />
      <meta property="og:site_name" content="Bot or Not" />
      <meta
        property="og:description"
        content="A demo showing showing how to use SWR with multiple apis"
      />
      <meta property="og:image" content="/assets/twitter-card.png" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
}

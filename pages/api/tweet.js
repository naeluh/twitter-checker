import fetch from '../../lib/fetch';
const LANG = 'en';

export default async function getTimeline(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  if (!process.env.TWITTER_API_TOKEN) {
    return res.status(401).json({
      errors: [{ message: 'A Twitter API token is required to execute this request' }],
    });
  }

  const QUERY = req.query.q;

  const response = await fetch(
    `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${QUERY}&lang=${LANG}&count=200&include_rts=true`,
    {
      headers: {
        authorization: `Bearer ${process.env.TWITTER_API_TOKEN}`,
      },
    }
  );

  if (response.ok) {
    const timeline = await response.json();
    // Cache the Twitter response for 3 seconds, to avoid hitting the Twitter API limits
    // of 450 requests every 15 minutes (with app auth)
    res.setHeader('Cache-Control', 's-maxage=3, stale-while-revalidate');
    res.status(200).json({ timeline });
  } else {
    res.status(400).json({
      errors: [{ message: `Fetch to the Twitter API failed with code: ${response.status}` }],
    });
  }
}

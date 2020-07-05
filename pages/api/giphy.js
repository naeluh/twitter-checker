import fetch from '../../lib/fetch';
const LANG = 'en';

export default async function getGifs(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  if (!process.env.GIPHY_API_TOKEN) {
    return res.status(401).json({
      errors: [{ message: 'A Giphy API token is required to execute this request' }],
    });
  }

  const QUERY = req.query.q;

  console.log(QUERY);

  const response = await fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_TOKEN}&q=${QUERY}&limit=45&offset=0&rating=G&lang=${LANG}`
  );

  if (response.ok) {
    const gifs = await response.json();
    // Cache the Twitter response for 3 seconds, to avoid hitting the Giphy API limits
    // of 450 requests every 15 minutes (with app auth)
    res.setHeader('Cache-Control', 's-maxage=3, stale-while-revalidate');
    res.status(200).json({ gifs: gifs.data });
  } else {
    res.status(400).json({
      errors: [{ message: `Fetch to the Giphy API failed with code: ${response.status}` }],
    });
  }
}

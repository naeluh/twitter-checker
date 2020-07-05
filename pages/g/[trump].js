import Page from '../../components/landing/page';
import ImgBk from '../../components/landing/image-background';
import absoluteUrl from 'next-absolute-url';

export default function Trump({ gifJson }) {
  return (
    <Page title="Trump Image Tester" description="Trump Image Tester">
      <main>
        <ImgBk amount={40} gifs={gifJson} />
      </main>
    </Page>
  );
}

Trump.getInitialProps = async ({ req, res, pathname, query, context }) => {
  console.log(pathname, query.trump, context);
  const { origin } = absoluteUrl(req, 'localhost:3000');
  const gifRes = await fetch(`${origin}/api/giphy?q=${query.trump}`);
  const gifJson = await gifRes.json();
  return { gifJson };
};

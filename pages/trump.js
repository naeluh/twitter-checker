import Page from '../components/landing/page';
import ImgBk from '../components/landing/image-background';

export default function Trump({ gifJson }) {
  return (
    <Page title="" description="">
      <main>
        <ImgBk amount={40} gifs={gifJson} />
      </main>
    </Page>
  );
}

Trump.getInitialProps = async () => {
  const gifRes = await fetch(`/api/giphy?q=donaldtrump`);
  const gifJson = await gifRes.json();
  return { gifJson };
};

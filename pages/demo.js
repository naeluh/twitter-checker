import components from '../components/twitter-layout/components';
import Page from '../components/landing/page';
import A from '../components/landing/anchor';
import ImgBk from '../components/landing/image-background';

const P = components.p;
const Code = components.code;
const Ul = components.ul;
const Li = components.li;
const H2 = components.h2;
const Hr = components.hr;

export default function Demo({ gifJson }) {
  return (
    <Page title="Image Tester" description="Image Tester">
      <main>
        <ImgBk amount={100} gifs={gifJson} />
      </main>
    </Page>
  );
}

export async function getStaticProps() {
  const gifRes = await fetch(`${process.env.BASE_URL}/api/giphy`);
  const gifJson = await gifRes.json();

  return {
    props: {
      gifJson,
    },
  };
}
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

export default function Trump({ gifJson }) {
  return (
    <Page title="Trump Image Tester" description="Trump Image Tester">
      <main>
        <ImgBk amount={100} gifs={gifJson} />
      </main>
    </Page>
  );
}

// https://codeconqueror.com/blog/get-the-current-url-in-next-js

export async function getStaticProps() {
  const gifRes = await fetch(`https://twitter-checker.naeluh.vercel.app/api/giphy`);
  const gifJson = await gifRes.json();

  return {
    props: {
      gifJson,
    },
  };
}

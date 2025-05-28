import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import AppGlDetails from 'src/sections/overview/app/app-gl-details';

// ----------------------------------------------------------------------

const metadata = { title: `GL Details | Dashboard - ${CONFIG.appName}` };

const ALL = true;

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
        <AppGlDetails />
    </>
  );
}

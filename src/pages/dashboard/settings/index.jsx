import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import AppSettings from 'src/sections/overview/app/app-settings';



// ----------------------------------------------------------------------

const metadata = { title: `Main Settings | Dashboard - ${CONFIG.appName}` };

const ALL = true;

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
        <AppSettings />
    </>
  );
}

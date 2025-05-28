import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import AppTellerDetails from 'src/sections/overview/app/app-teller-details';

// ----------------------------------------------------------------------

const metadata = { title: `Teller Details | Dashboard - ${CONFIG.appName}` };

const ALL = true;

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
        <AppTellerDetails />
    </>
  );
}

import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import AppLoans from 'src/sections/overview/app/app-loans';



// ----------------------------------------------------------------------

const metadata = { title: `Loans Management | Dashboard - ${CONFIG.appName}` };

const ALL = true;

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

        <AppLoans />
    </>
  );
}

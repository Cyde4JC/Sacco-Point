import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import AppGlAccounts from 'src/sections/overview/app/app-gl-accounts';


// ----------------------------------------------------------------------

const metadata = { title: `GL Accounts | Dashboard - ${CONFIG.appName}` };

const ALL = true;

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

        <AppGlAccounts />
    </>
  );
}

import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import AppMembers from 'src/sections/overview/app/app-members';

// ----------------------------------------------------------------------

const metadata = { title: `Members | Dashboard - ${CONFIG.appName}` };

const ALL = true;

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

        <AppMembers />
    </>
  );
}

import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import AppMembersDetails from 'src/sections/overview/app/app-members-details';


// ----------------------------------------------------------------------

const metadata = { title: `Members Details | Dashboard - ${CONFIG.appName}` };

const ALL = true;

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

        <AppMembersDetails />
    </>
  );
}

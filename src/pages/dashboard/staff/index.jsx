import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import AppStaff from 'src/sections/overview/app/app-staff';


// ----------------------------------------------------------------------

const metadata = { title: `Staff | Dashboard - ${CONFIG.appName}` };

const ALL = true;

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

        <AppStaff />
    </>
  );
}

import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import AppAllLoansDetails from 'src/sections/overview/app/app-all-loans-details';

// ----------------------------------------------------------------------

const metadata = { title: `Loan Details | Dashboard - ${CONFIG.appName}` };

const ALL = true;

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

        <AppAllLoansDetails />
    </>
  );
}

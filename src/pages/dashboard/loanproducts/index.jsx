import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import AppLoanProducts from 'src/sections/overview/app/app-loan-products';

// ----------------------------------------------------------------------

const metadata = { title: `Loans Products | Dashboard - ${CONFIG.appName}` };

const ALL = true;

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

        <AppLoanProducts />
    </>
  );
}

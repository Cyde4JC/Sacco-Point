import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { ApiRequests } from 'src/sections/overview/app/app-api-requests';

// ----------------------------------------------------------------------

const metadata = { title: `Transactions | Dashboard - ${CONFIG.appName}` };

const ALL = true;

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="Transactions"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Transactions', href: paths.dashboard.general.transactions },
            { name: 'List' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <ApiRequests viewAll={ALL} title="Transactions" />
      </DashboardContent>
    </>
  );
}

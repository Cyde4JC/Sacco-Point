import { Helmet } from 'react-helmet-async';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { ApiRequests } from 'src/sections/overview/app/app-api-requests';

// ----------------------------------------------------------------------

const metadata = { title: `API | Dashboard - ${CONFIG.appName}` };

const ALL = true;

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="API"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'API Requests', href: paths.dashboard.general.api },
            { name: 'List' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <ApiRequests viewAll={ALL} title="All API Requests" />
      </DashboardContent>
    </>
  );
}

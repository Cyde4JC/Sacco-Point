import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/config-global';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  api: icon('api'),
  users: icon('users'),
  transactions: icon('transactions'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

const commonNav = [
  { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
  { title: 'Members', path: paths.dashboard.general.members, icon: ICONS.users },
  { title: 'Loan Products', path: paths.dashboard.general.loanproducts, icon: ICONS.product },
]

export const navData = [
  {
    subheader: 'Overview',
    items: [
      ...commonNav,
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
      { title: 'Loan Products', path: paths.dashboard.general.loanproducts, icon: ICONS.product },
      // { title: 'Loan Management', path: paths.dashboard.general.loans, icon: ICONS.banking },
      // { title: 'Finance', path: paths.dashboard.general.gl, icon: ICONS.analytics },
      // { title: 'Staff', path: paths.dashboard.general.staff, icon: ICONS.user },
      // { title: 'Teller Settings', path: paths.dashboard.general.settings, icon: ICONS.parameter },  
    ],
  },
];

export const navTeller = [
  {
    subheader: 'Overview',
    items: [
      ...commonNav,
      { title: 'Loan Management', path: paths.dashboard.general.loans, icon: ICONS.banking },
      { title: 'Finance', path: paths.dashboard.general.gl, icon: ICONS.analytics },
      { title: 'Teller Settings', path: paths.dashboard.general.settings, icon: ICONS.parameter },  
    ],
  },
];

export const navAdmin = [
  {
    subheader: 'Overview',
    items: [
      ...commonNav,
      { title: 'Loan Management', path: paths.dashboard.general.loans, icon: ICONS.banking },
      { title: 'Finance', path: paths.dashboard.general.gl, icon: ICONS.analytics },
      { title: 'Staff', path: paths.dashboard.general.staff, icon: ICONS.user },
      { title: 'Teller Settings', path: paths.dashboard.general.settings, icon: ICONS.parameter },  
    ],
  },
];

export const navLoanOfficer = [
  {
    subheader: 'Overview',
    items: [
      ...commonNav,
      { title: 'Loan Management', path: paths.dashboard.general.loans, icon: ICONS.banking },
    ],
  },
];

export const navLoanAdmin = [
  {
    subheader: 'Overview',
    items: [
      ...commonNav,
      { title: 'Loan Management', path: paths.dashboard.general.loans, icon: ICONS.banking },
    ],
  },
];


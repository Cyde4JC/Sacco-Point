import axios from 'axios';

import { CONFIG } from 'src/config-global';
import { TextMaxLine } from 'src/sections/_examples/extra/utilities-view/text-max-line';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  staff: '/auth/staff/',
  staff_action: (id)=>`/auth/staff/${id}/status/`,
  updateMobile: (id)=>`/members/${id}/`,
  reset: (id)=>`/members/${id}/reset-operations/`,
  api: '/transactions/api-requests/',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  
  dashboard:'/dashboard/',
  members:'/members/',
  addmembers:'/members/onboarding/', 
  addcorporatemembers:'/members/onboarding/corporate/', 
  memberprofile:(id)=> `/members/${id}/`,
  memberaccounts:(id)=> `/members/${id}/accounts/`,
  membertransactions:(id)=> `/members/${id}/transactions/`,

  loanproducts: '/sacco/loan-products/',
  loanapprovals:(id)=> `/sacco/loans/${id}/approval/`,
  disburseapprovals:(id)=> `/sacco/loans/${id}/disburse/`,
  searchmember: '/members/search/',
  loanapplication:(id)=> `/members/${id}/loan-application/`,
  allloans:'/sacco/loans/',
  allloansview: (id)=> `/sacco/loans/${id}/`,

  glaccounts: '/sacco/sacco-accounts/',
  gldeposit: '/payments/sacco-accounts/deposit/',
  gltransfer: '/payments/sacco-accounts/transfer/',
  glbillpayment: '/payments/sacco-accounts/bill-payments/',
  gltransactions: '/transactions/',

  branches: '/tellers/branches/',
  tellers: '/tellers/accounts/',
  tellerdashboard:(id)=> `/tellers/accounts/${id}/dashboard/`,

  auth: {                                                                                                                  
    me: '/auth/profile/',
    signIn: '/auth/login/',
    validateOtp: '/auth/login/otp/',
    signUp: '/api/auth/sign-up',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};

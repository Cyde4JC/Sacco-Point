import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
  Card, Table, TableRow, TableBody, TableCell, CardHeader, Typography, Divider,
  TableContainer, TableHead, TableSortLabel, IconButton, Collapse, Avatar,
  Button
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import axios, { endpoints } from 'src/utils/axios';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { Label } from 'src/components/label';
import { AppLoansAccount } from './app-loans-account';
import AppAccountDeposit from './app-account-deposit';

const accountHeaders = [
  { id: 'account_number', label: 'Account Number' },
  { id: 'account_balance', label: 'Balance' },
  { id: 'currency_code', label: 'Currency' },
  { id: 'can_withdraw', label: 'Can Withdraw?' },
  { id: 'status', label: 'Status' },
  { id: 'date_created', label: 'Date Created' },
  { id: 'deposit_action', label: 'Deposit' },
  { id: 'expand_action', label: 'View Transactions' },
];

const transactionHeaders = [
  { id: 'transaction_type_enum', label: '' },
  { id: 'description', label: 'Description' },
  { id: 'amount', label: 'Amount' },
  { id: 'charge_amount', label: 'Charges' },
  { id: 'third_party_transaction_code', label: '3rd Party Trsc Code' },
  { id: 'party_b_account_number', label: 'Party B Acc No' },
  { id: 'party_b_account_name', label: 'Party B Acc Name' },
  { id: 'status', label: 'Status' },
  { id: 'date_created', label: 'Date Created' }
];

export default function AppMembersDetails({ ...other }) {
  const { id = '' } = useParams();
  const [accounts, setAccounts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState({});
  const [expanded, setExpanded] = useState({});
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(endpoints.memberaccounts(id));
        if (response.status === 200) {
          setAccounts(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
    fetchAccounts();
  }, [id]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(endpoints.memberprofile(id));
        if (response.status === 200) {
          setProfile(response.data.data || null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [id]);

  const handleExpandClick = async (accountNumber) => {
    setExpanded((prev) => ({ ...prev, [accountNumber]: !prev[accountNumber] }));
    if (!transactions[accountNumber]) await fetchTransactions(accountNumber);
  };

  const fetchTransactions = async (accountNumber) => {
    try {
      const response = await axios.get(endpoints.membertransactions(id), {
        params: { account_number: accountNumber }
      });
      if (response.status === 200) {
        setTransactions((prev) => ({
          ...prev,
          [accountNumber]: response.data.data || []
        }));
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const getTransactionAvatar = (type) => (
    <Avatar sx={{ bgcolor: '#800080', width: 50, height: 50, color: 'white', fontWeight: 'bold' }}>
      {type === 1 ? 'D' : 'W'}
    </Avatar>
  );

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Member Accounts"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Members', href: paths.dashboard.general.members },
          { name: 'List' }
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ p: 2, mt: 2 }} {...other}>
        {profile && (
          <Card sx={{ p: 3, mb: 4, border: '1px solid #800080', borderRadius: 2, boxShadow: 3 }}>
            <CardHeader title={<Typography variant="h6" sx={{ color: '#800080' }}>Member Profile</Typography>} />
            <Divider sx={{ mt: 2, backgroundColor: '#800080' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 24 }}>
              <Avatar
                src={profile.avatar_url || '/assets/Avatar.jpg'}
                alt={profile.display_name}
                sx={{ width: 84, height: 84, fontSize: 48, bgcolor: '#800080' }}
              >
                {profile.avatar_url ? '' : profile.display_name?.charAt(0)}
              </Avatar>

              <div>
                <Typography variant="h4">{profile.display_name}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Member No:</strong> {profile.member_number}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Mobile:</strong> {profile.mobile_number}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Document:</strong> {profile.document_type} - {profile.document_number}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Member Type:</strong> {profile.member_type}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Date Created:</strong> {fDate(profile.date_created)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Status:</strong>
                  <Label variant="soft" color={profile.status === 'ACTIVE' ? 'success' : 'error'} sx={{ ml: 1 }}>
                    {profile.status}
                  </Label>
                </Typography>
              </div>
            </div>
          </Card>
        )}

        {accounts.map((account) => (
          <Card key={account.account_number} sx={{ mb: 3, border: '1px solid #800080', borderRadius: 2, boxShadow: 3 }}>
            <CardHeader title={<Typography variant="h6" sx={{ color: '#800080' }}>{account.account_type} Account</Typography>} />
            <Divider sx={{ mt: 2, backgroundColor: '#800080' }} />
            <Scrollbar>
              <TableContainer sx={{ p: 2, maxHeight: 400 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f3e5f5' }}>
                    <TableRow>
                      {accountHeaders.map((head) => (
                        <TableCell key={head.id} sx={{ fontWeight: 'bold', color: '#4a0072' }}>
                          <TableSortLabel>{head.label}</TableSortLabel>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{account.account_number}</TableCell>
                      <TableCell>{fCurrency(account.account_balance)}</TableCell>
                      <TableCell>{account.currency_code}</TableCell>
                      <TableCell>{account.can_withdraw ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        <Label variant="soft" color={account.status === 'ACTIVE' ? 'success' : 'error'}>
                          {account.status}
                        </Label>
                      </TableCell>
                      <TableCell>{fDate(account.date_created)}</TableCell>
                      <TableCell>
                        <Button 
                        variant="contained"
                        sx={{ bgcolor: '#800080', color: 'white' }}
                        onClick={() => {
                          setSelectedAccount(account.account_number);
                          setDepositModalOpen(true);
                        }}>
                          MNO Deposit
                        </Button>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleExpandClick(account.account_number)}>
                          <Iconify icon={expanded[account.account_number] ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                {account.account_type === 'LOANS' && (
                  <AppLoansAccount account_number={account.account_number} />
                )}
                <Divider sx={{ mt: 2, backgroundColor: '#800080' }} />
              </TableContainer>
            </Scrollbar>

            <Collapse in={expanded[account.account_number]}>
              <Card sx={{ p: 2, border: '1px dashed #800080', borderRadius: 1, boxShadow: 3 }}>
                <CardHeader title={<Typography variant="h6" sx={{ color: '#800080' }}>Transactions Statements</Typography>} />
                <Divider sx={{ mt: 2, backgroundColor: '#800080' }} />
                <Scrollbar>
                  <TableContainer sx={{ p: 2, maxHeight: 300 }}>
                    <Table>
                      <TableHead sx={{ backgroundColor: '#e1bee7' }}>
                        <TableRow>
                          {transactionHeaders.map((head) => (
                            <TableCell key={head.id} sx={{ fontWeight: 'bold', color: '#6a1b9a' }}>
                              {head.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transactions[account.account_number]?.length > 0 ? transactions[account.account_number].map((txn) => (
                          <TableRow key={txn.id}>
                            <TableCell>{getTransactionAvatar(txn.transaction_type_enum)}</TableCell>
                            <TableCell>{txn.description}</TableCell>
                            <TableCell>{fCurrency(txn.amount)}</TableCell>
                            <TableCell>{fCurrency(txn.charge_amount)}</TableCell>
                            <TableCell>{txn.third_party_transaction_code}</TableCell>
                            <TableCell>{txn.party_b_account_number}</TableCell>
                            <TableCell>{txn.party_b_account_name}</TableCell>
                            <TableCell>
                              <Label variant="soft" color={txn.status === 'SUCCESS' ? 'success' : 'error'}>
                                {txn.status}
                              </Label>
                            </TableCell>
                            <TableCell>{fDate(txn.date_created)}</TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={9} align="center">No transactions available</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
              </Card>
            </Collapse>
          </Card>
        ))}
      </Card>

      {selectedAccount && (
        <AppAccountDeposit
          open={depositModalOpen}
          onClose={() => setDepositModalOpen(false)}
          account_number={selectedAccount}
        />
      )}
    </DashboardContent>
  );
}

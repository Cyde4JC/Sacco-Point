import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
  Card, Table, TableRow, TableBody, TableCell, CardHeader, Typography, Divider,
  TableContainer, TableHead, Avatar,
  InputAdornment,
  TextField
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import axios, { endpoints } from 'src/utils/axios';
import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { DatePicker } from '@mui/x-date-pickers';
import { useDateRangePicker, CustomDateRangePicker } from 'src/components/custom-date-range-picker';

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

export default function AppTellerTransactions() {
  const { account_number = '' } = useParams();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(endpoints.gltransactions, {
          params: { account_number }
        });
        if (response.status === 200) {
          setTransactions(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
  
    if (account_number) {
      fetchTransactions();
    }
  }, [account_number]);
  

  const getTransactionAvatar = (type) => (
    <Avatar sx={{
      bgcolor: type === 1 ? '#800080' : '#800080',
      width: 50, height: 50,
      color: 'white',
      fontWeight: 'bold'
    }}>
      {type === 1 ? 'D' : 'W'}
    </Avatar>
  );

  return (
    <DashboardContent maxWidth="xl">
      <Card sx={{ p: 4, border: '1px solid #800080', borderRadius: 2, boxShadow: 3 }}>
        <CardHeader title={<Typography variant="h6" sx={{ color: '#800080' }}>Transactions</Typography>} />
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
                {transactions.length > 0 ? transactions.map((txn) => (
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
    </DashboardContent>
  );
}

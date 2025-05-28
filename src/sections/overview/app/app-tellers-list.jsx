import { Link, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom, TablePaginationCustom, useTable } from 'src/components/table';
import { useCallback, useEffect, useState } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';
import axios, { endpoints } from 'src/utils/axios';
import { CardContent, Divider } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import AppAccountDeposit from './app-account-deposit';

const headers = [
  { id: 'account_name', label: ' Account Name' },
  { id: 'account_number', label: 'Account No' },
  { id: 'account_balance', label: 'Account Balance' },
  { id: 'can_withdraw', label: 'Can Withdraw' },
  { id: 'status', label: 'Status', width: 200 },
  { id: 'date_created', label: 'Created On' },
  { id: '', label: '' },
  { id: '', label: '' },
];

export function AppTellersList({ title, subheader, headLabel, viewAll = false, ...other }) {
  const [tableData, setTableData] = useState([]);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const table = useTable();
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    count: 0,
    pages: 0,
  });

  const getTellerAccounts = useCallback(async () => {
    const response = await axios.get(endpoints.tellers, {
      params: {
        page: table.page + 1,
        page_size: table.rowsPerPage,
      },
    });

    const { data, ...rest } = response.data;
    setTableData(data);
    setPagination(rest);
  }, [table.page, table.rowsPerPage]);

  useEffect(() => {
    getTellerAccounts();
  }, [getTellerAccounts]);

  return (
    <DashboardContent maxWidth="xl">
      <Card sx={{ mb: 2, mt: 2, padding: 2, border: '1px solid #800080', borderRadius: 2, boxShadow: 3 }}>
        <CardHeader sx={{ color: '#800080' }} title="Teller Accounts" />
        <Divider sx={{ mt: 2, backgroundColor: '#800080' }} />
        <CardContent>
          <Scrollbar sx={{ minHeight: 402 }}>
            <Table size="medium" sx={{ minWidth: 600 }}>
              <TableHeadCustom headLabel={headers} />
              <TableBody>
                {tableData.map((row) => (
                  <RowItem
                    key={row.id}
                    row={row}
                    onOpenDepositModal={() => {
                      setSelectedAccount(row.account_number);
                      setDepositModalOpen(true);
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
          <TablePaginationCustom
            page={table.page}
            count={pagination.count}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </CardContent>
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

function RowItem({ row, onOpenDepositModal }) {
  const confirm = useBoolean();

  return (
    <TableRow>
      <TableCell>{row.account_name}</TableCell>
      <TableCell>{row.account_number}</TableCell>
      <TableCell>{fCurrency(row.account_balance)}</TableCell>
      <TableCell>{row.can_withdraw}</TableCell>
      <TableCell>
        <Label variant="soft" color={row.status === 'ACTIVE' ? 'success' : 'error'}>
          {row.status}
        </Label>
      </TableCell>
      <TableCell>{fDateTime(row.date_created)}</TableCell>
      <TableCell>
        <Button
          variant="contained"
          sx={{ bgcolor: '#800080', color: 'white' }}
          onClick={onOpenDepositModal}
        >
          Fund 
        </Button>
      </TableCell>
      <TableCell>
        <Button
          variant="contained"
          sx={{ bgcolor: '#800080' }}
          component={Link}
          to={`/dashboard/teller-details/${row.id}/${row.account_number}/${row.account_name}`}
        >
          View
        </Button>
      </TableCell>
    </TableRow>
  );
}

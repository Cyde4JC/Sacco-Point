
import { Link, Navigate, useNavigate } from 'react-router-dom';
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

// ----------------------------------------------------------------------

const headers = [
  { id: 'account_name', label: ' Account Name' },
  { id: 'account_category', label: ' Account Category' },
  { id: 'account_number', label: 'Account No' },
  { id: 'account_balance', label: 'Account Balance' },
  { id: 'can_withdraw', label: 'Can Withdraw' },
  { id: 'status', label: 'Status', width: 200 },
  { id: 'date_created', label: 'Created On' },
  { id: '', label: '' },
];

export function AppGlList({ title, subheader, headLabel, viewAll = false, ...other }) {
  const [tableData, setTableData] = useState([]);

  const table = useTable();

  const [pagination, setPagination] = useState({
    count: 0,
    pages: 0,
  });
  const navigate = useNavigate();

  const [search_term, set_search_term] = useState(null);
  
  const getGlAccounts = useCallback(
    async (search = null) => {
      const response = await axios.get(endpoints.glaccounts, {
        params: {
          search_term: search,
          page: table.page + 1,
          page_size: table.rowsPerPage,
        },
      });

      const { data, ...rest } = response.data;

      setTableData(data);
      setPagination(rest);
    },
    [table.page, table.rowsPerPage]
  );

  useEffect(() => {
    getGlAccounts();
  }, [getGlAccounts]);

  const openMember = useBoolean();

  return (
    <DashboardContent maxWidth="xl">
   <Card sx={{ mb: 2, mt: 2, padding: 2, border: '1px solid #800080', borderRadius: 2, boxShadow: 3 }}>

    <CardHeader sx={{ color: '#800080' }} title="GL Accounts" />
     <Divider sx={{ mt: 2, backgroundColor: '#800080' }} />
          <CardContent>
            <Scrollbar sx={{ minHeight: 402 }}>
              <Table size='medium' sx={{ minWidth: 600 }}>
                <TableHeadCustom headLabel={headers} />
                <TableBody>
                  {tableData.map((row) => (
                    <RowItem key={row.id} row={row} />
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
    </DashboardContent>
  );
}

function RowItem({ row }) {
  const open = useBoolean();
  const confirm = useBoolean();
  const confirmReset = useBoolean();

  const [mobile_number, set_mobile_number] = useState(row.mobile_number);

  return (
    <>
      <TableRow>
        <TableCell>{row.account_name}</TableCell>
        <TableCell>{row.account_category ||'n/a'}</TableCell>
        <TableCell>{row.account_number}</TableCell>
        <TableCell>{fCurrency(row.account_balance)}</TableCell>
        <TableCell>{row.can_withdraw}</TableCell>
        <TableCell>
          <Label variant="soft" color={(row.status === 'ACTIVE' && 'success') || 'error'}>
            {row.status}
          </Label>
        </TableCell>
        <TableCell>{fDateTime(row.date_created)}</TableCell>
        <TableCell>
          <Button
            variant="contained"
            sx={{bgcolor: '#800080'}}
            size="small"
            component={Link} to={`/dashboard/gl-details/${row.id}/${row.account_number}/${row.account_name}`}
            >
            View
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom, TablePaginationCustom, useTable } from 'src/components/table';
import axios, { endpoints } from 'src/utils/axios';
import { fDate } from 'src/utils/format-time';
import { DashboardContent } from 'src/layouts/dashboard';
import { Button, Collapse, Divider, IconButton, TableContainer } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { fCurrency, fPercent } from 'src/utils/format-number';
import { Label } from 'src/components/label';

const headers = [
  { id: 'display_name', label: 'Name' },
  { id: 'mobile_number', label: 'Mobile No' },
  { id: 'loan_account_number', label: 'Loan Acc No' },
  { id: 'principal_amount', label: 'Principal' },
  { id: 'outstanding_balance', label: 'Outstanding' },
  { id: 'interest_rate', label: 'Interest Rate' },
  { id: 'interest_charged_derived', label: 'Interest Charged' },
  { id: 'status', label: 'Loan Status' },
  { id: '', label: '' },
  { id: '', label: '' },
];

export function AppAllLoansActive() {
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({ count: 0, pages: 0 });
  const [expandedRow, setExpandedRow] = useState(null);
  const table = useTable();

  const fetchLoans = useCallback(async () => {
    try {
      const response = await axios.get(endpoints.allloans, {
        params: {
          status: 'active',
          page: table.page + 1,
          page_size: table.rowsPerPage,
        },
      });

      const { data, count, pages } = response.data;
      setTableData(data);
      setPagination({ count, pages });
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  }, [table.page, table.rowsPerPage]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const handleRowClick = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  return (
    <>
      <Card sx={{ mb: 2, mt: 2, padding: 2, border: '1px solid #800080', borderRadius: 2, boxShadow: 3 }}>
        <CardHeader sx={{ color: '#800080' }} title="Active Loans" />
        <Divider sx={{ mt: 2, backgroundColor: '#800080' }} />
        <Scrollbar>
          <Table>
            <TableHeadCustom headLabel={headers} />
            <TableBody>
              {tableData.map((row) => (
                <>
                  <TableRow onClick={() => handleRowClick(row.id)}>
                    <TableCell>{row.member.display_name}</TableCell>
                    <TableCell>{row.member.mobile_number}</TableCell>
                    <TableCell>{row.loan_account_number}</TableCell>
                    <TableCell>{fCurrency(row.principal_amount)}</TableCell>
                    <TableCell>{fCurrency(row.outstanding_balance)}</TableCell>
                    <TableCell>{fPercent(row.interest_rate)}</TableCell>
                    <TableCell>{fCurrency(row.interest_charged_derived)}</TableCell>
                    <TableCell>
                      <Label variant="soft" color={(row.status === 'pending' && 'warning') || 'error'}>
                        {row.status}
                      </Label>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        sx={{ bgcolor: '#800080' }}
                        size="small"
                        component={Link}
                        to={`/dashboard/loans-details/${row.id}`}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </>
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
      </Card>
    </>
  );
}

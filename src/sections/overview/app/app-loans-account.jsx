import { useState, useEffect, useCallback } from 'react';
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
import { Button, Collapse, Divider, IconButton } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { fCurrency, fPercent } from 'src/utils/format-number';
import { Label } from 'src/components/label';

const headers = [
  { id: 'loan_account_number', label: 'Loan Acc No' },
  { id: 'principal_amount', label: 'Principal' },
  { id: 'approved_principal', label: 'Approved Principal' },
  { id: 'outstanding_balance', label: 'Outstanding' },
  { id: 'interest_rate', label: 'Interest Rate' },
  { id: 'total_repayment_derived', label: 'Total Repaid' },
  { id: '', label: 'Guarantors' },
];

export function AppLoansAccount({ account_number }) {
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({ count: 0, pages: 0 });
  const [expandedRow, setExpandedRow] = useState(null);
  const table = useTable()

  const fetchLoans = useCallback(async () => {
    try {
      const response = await axios.get(endpoints.allloans, {
        params: {
          account_number: account_number || null,
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
  }, [account_number, table.page, table.rowsPerPage]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const handleRowClick = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Divider sx={{ mt: 2, backgroundColor: '#800080' }} />
      <Scrollbar>
        <Table>
          <TableHeadCustom headLabel={headers} />
          <TableBody>
            {tableData.map((row) => (
              <>
                <TableRow hover>
                  <TableCell>{row.loan_account_number}</TableCell>
                  <TableCell>{fCurrency(row.principal_amount)}</TableCell>
                  <TableCell>{fCurrency(row.approved_principal)}</TableCell>
                  <TableCell>{fCurrency(row.outstanding_balance)}</TableCell>
                  <TableCell>{fPercent(row.interest_rate)}</TableCell>
                  <TableCell>{fCurrency(row.total_repayment_derived)}</TableCell>
                  <TableCell width={50}>
                    <Button sx={{ color: '#800080' }} variant="outlined" size="small" onClick={() => handleRowClick(row.id)}>
                      <Iconify
                        icon={expandedRow === row.id ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                        width={20}
                      />
                    </Button>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={7} sx={{ p: 0, borderBottom: 'none' }}>
                    <Collapse in={expandedRow === row.id} timeout="auto" unmountOnExit>
                      <Card sx={{ m: 2, p: 2, bgcolor: '#f9f9f9', border: '1px dashed #800080' }}>
                        <CardHeader sx={{ color: '#800080' }} title="Guarantors" />
                        <Divider sx={{ mt: 2, backgroundColor: '#800080' }} />
                        {row.guarantors && row.guarantors.length > 0 ? (
                          <Table size="small" sx={{ mt: 1 }}>
                            <TableHeadCustom
                              headLabel={[
                                { id: 'full_name', label: 'Full Name' },
                                { id: 'mobile_number', label: 'Phone' },
                                { id: 'amount_guaranteed', label: 'Amount Guaranteed' },
                                { id: 'guarantorship_status', label: 'Status' },
                                { id: 'guarantorship_status_date', label: 'Status Date' },
                              ]}
                            />
                            <TableBody>
                              {row.guarantors.map((g) => (
                                <TableRow key={g.id}>
                                  <TableCell>{g.full_name}</TableCell>
                                  <TableCell>{g.mobile_number}</TableCell>
                                  <TableCell>{fCurrency(g.amount_guaranteed)}</TableCell>

                                  <TableCell>
                                    <Label variant="soft" color={g.guarantorship_status === 'accepted' ? 'success' : 'error'}>
                                      {g.guarantorship_status}
                                    </Label>
                                  </TableCell>
                                  <TableCell>{fDate(g.guarantorship_status_date)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <p style={{ marginTop: 8 }}>No guarantors for this loan.</p>
                        )}
                      </Card>
                    </Collapse>
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
    </DashboardContent>
  );
}

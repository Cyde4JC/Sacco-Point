import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import {
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Divider,
  Avatar,
  CardHeader,
} from '@mui/material';
import { TableHeadCustom, TablePaginationCustom, useTable } from 'src/components/table';
import { fCurrency, fPercent } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';
import axios, { endpoints } from 'src/utils/axios';
import { Label } from 'src/components/label';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

const headLabel = [
  { id: 'description', label: 'Description' },
  { id: 'total_repayment_derived', label: 'Total Repaid' },
  { id: 'due_date', label: 'Due Date' },
  { id: 'loan_period', label: 'Loan Period' },
  { id: 'disbursement_channel_name', label: 'Disbursement Channel' },
  { id: 'disbursement_account_number', label: 'Disbursement Account' },
];

const AppAllLoansDetails = () => {
  const { id = '' } = useParams();
  const [pagination, setPagination] = useState({ count: 0, pages: 0 });
  const table = useTable();
  const [data, setData] = useState({});

  const fetchLoans = useCallback(async () => {
    try {
      const response = await axios.get(endpoints.allloansview(id), {
        params: {
          page: table.page + 1,
          page_size: table.rowsPerPage,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  }, [table.page, table.rowsPerPage, id]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans, id]);

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Loan Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Loans', href: paths.dashboard.general.loans },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Box sx={{ p: 3 }}>
        {[data?.data]?.map((row) => (
          <Card key={row?.id} sx={{ p: 3, mb: 4, border: '1px solid #800080', borderRadius: 2, boxShadow: 3 }}>
            <CardHeader title={<Typography variant="h6" sx={{ color: '#800080' }}>Loan Details</Typography>} />
            <Divider sx={{ mt: 2, mb: 2, backgroundColor: '#800080' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 24 }}>
              <Avatar sx={{ bgcolor: '#800080', width: 76, height: 76 }}>
                {row?.member?.display_name?.charAt(0)}
              </Avatar>
           
              <div>
              <Typography variant="h4">{row?.member?.display_name || 'N/A'}</Typography>
              <Typography variant="body2" color="text.secondary"><strong>Phone No:</strong> {row?.member?.mobile_number || 'N/A'}</Typography>
            </div >
            </div>
          </Card>
        ))}

        <Divider sx={{ mt: 2, mb: 2, backgroundColor: '#800080' }} />

        <TableContainer sx={{border: '1px solid #800080', borderRadius: 2, boxShadow: 3}}>
          <Table>
            <TableHeadCustom headLabel={headLabel} />
            <TableBody>
              {[data?.data]?.map((row) => (
                <>
                  <TableRow key={row?.id}>
                    <TableCell>{row?.description}</TableCell>
                    <TableCell>{fCurrency(row?.total_repayment_derived)}</TableCell>
                    <TableCell>{fDate(row?.due_date)}</TableCell>
                    <TableCell>{row?.loan_period} Days</TableCell>
                    <TableCell>{row?.disbursement_channel_name}</TableCell>
                    <TableCell>{row?.disbursement_account_number}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box sx={{ mt: 2 }}>

                          {row?.installments?.length > 0 && (
                          <>
                            <Divider sx={{ mt: 3, backgroundColor: '#800080' }} />
                            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                              Repayment Installments
                            </Typography>
                            <Table sx={{ m: 2, p: 2, bgcolor: '#f9f9f9', border: '1px dashed #800080' }}>
                              <TableHeadCustom
                                headLabel={[
                                  { id: 'installment_number', label: 'No of Installments' },
                                  { id: 'due_date', label: 'Due Date' },
                                  { id: 'principal_component', label: 'Principal Amount' },
                                  { id: 'interest_component', label: 'Interest Amount' },
                                  { id: 'total_payment', label: 'Total Payment' },
                                  { id: 'remaining_balance', label: 'Remaining Balance' },            
                                ]}
                              />
                              <TableBody>
                                {row.installments.map((i) => (
                                  <TableRow key={i?.id}>
                                    <TableCell>{i?.installment_number}</TableCell>
                                    <TableCell>{fDate(i?.due_date)}</TableCell>
                                    <TableCell>{fCurrency(i?.principal_component)}</TableCell>
                                   <TableCell>{fCurrency(i?.interest_component)}</TableCell>
                                    <TableCell>{fCurrency(i?.total_payment)}</TableCell>
                                     <TableCell>{fCurrency(i?.remaining_balance)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            <Divider sx={{ mt: 3, backgroundColor: '#800080' }} />
                          </>
                        )}

                        {row?.guarantors?.length > 0 && (
                          <>
                            <Divider sx={{ mt: 3, backgroundColor: '#800080' }} />
                            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                              Guarantors
                            </Typography>
                            <Table sx={{ m: 2, p: 2, bgcolor: '#f9f9f9', border: '1px dashed #800080' }}>
                              <TableHeadCustom
                                headLabel={[
                                  { id: 'full_name', label: 'Full Name' },
                                  { id: 'mobile_number', label: 'Mobile Number' },
                                  { id: 'id_passport', label: 'ID/Passport' },
                                  { id: 'relationship', label: 'Relationship' },
                                  { id: 'amount_guaranteed', label: 'Amount Guaranteed' },
                                  { id: 'guarantorship_status', label: 'Status' },
                                  { id: 'guarantorship_status_date', label: 'Status Date' },
                                ]}
                              />
                              <TableBody>
                                {row.guarantors.map((g) => (
                                  <TableRow key={g?.id}>
                                    <TableCell>{g?.full_name}</TableCell>
                                    <TableCell>{g?.mobile_number}</TableCell>
                                    <TableCell>{g?.id_passport}</TableCell>
                                    <TableCell>{g?.relationship}</TableCell>
                                    <TableCell>{fCurrency(g?.amount_guaranteed)}</TableCell>
                                    <TableCell>
                                      <Label variant="soft" color={(g.status === 'pending' && 'warning') || 'error'}>
                                        {g.status}
                                      </Label>
                                    </TableCell>
                                    <TableCell>
                                      {g?.guarantorship_status_date ? fDate(g?.guarantorship_status_date) : 'N/A'}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </>
                        )}

                        {row?.collaterals?.length > 0 && (
                          <>
                            <Divider sx={{ mt: 3, backgroundColor: '#800080' }} />
                            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                              Collaterals
                            </Typography>
                            <Table sx={{ m: 2, p: 2, bgcolor: '#f9f9f9', border: '1px dashed #800080' }}>
                              <TableHeadCustom
                                headLabel={[
                                  { id: 'collateral_type', label: 'Type' },
                                  { id: 'collateral_value', label: 'Value' },
                                  { id: 'amount_guaranteed', label: 'Amount Guaranteed' },
                                  { id: 'is_active', label: 'Active' },
                                  { id: 'date_created', label: 'Date Created' },
                                ]}
                              />
                              <TableBody>
                                {row.collaterals.map((c) => (
                                  <TableRow key={c?.id}>
                                    <TableCell>{c?.collateral_type}</TableCell>
                                    <TableCell>{fCurrency(c?.collateral_value)}</TableCell>
                                    <TableCell>{fCurrency(c?.amount_guaranteed)}</TableCell>
                                    <TableCell>
                                      <Label variant="soft" color={(c?.is_active === 'yes' && 'success') || 'error'}>
                                        {c?.is_active}
                                      </Label>
                                    </TableCell>
                                    {/* <TableCell>{c?.is_active ? 'Yes' : 'No'}</TableCell> */}
                                    <TableCell>{fDate(c?.date_created)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            <Divider sx={{ mt: 3, backgroundColor: '#800080' }} />
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePaginationCustom
          count={pagination.count}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Box>
    </DashboardContent>
  );
};

export default AppAllLoansDetails;
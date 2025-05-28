import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Card, Table, TableRow, TableBody, TableCell, CardHeader, Divider, Modal,
  Box, CardContent, Select, MenuItem, FormControl, FormLabel, FormControlLabel,
  Checkbox, Button, Stack,Radio,RadioGroup
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import {TableHeadCustom,TablePaginationCustom,useTable} from 'src/components/table';
import axios, { endpoints } from 'src/utils/axios';
import { fCurrency, fPercent } from 'src/utils/format-number';
import { Label } from 'src/components/label';
import { toast } from 'sonner';
import { LoadingButton } from '@mui/lab';

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

const ApprovalModal = ({ open, onClose, onSubmit, loanId, glAccounts }) => {
  const [selectedGlAccount, setSelectedGlAccount] = useState('');
  const [isRtgs, setIsRtgs] = useState(false);
  const [feesPaidUpfront, setFeesPaidUpfront] = useState('Yes');
  const [showConfirm, setShowConfirm] = useState(false);

  const confirmAndSubmit = () => {
    onSubmit(loanId, selectedGlAccount, isRtgs, feesPaidUpfront);
    onClose();
    setShowConfirm(false);
    setSelectedGlAccount('');
    setIsRtgs(false);
    setFeesPaidUpfront(false);
  };

  return (
    <>
      <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card sx={{ mt: 2, padding: 2 }}>
          <CardHeader title="Loan Disbursement" />
          <Divider sx={{ borderStyle: 'dashed', backgroundColor: '#800080' }} />
          <CardContent>
            <Box sx={{ padding: 3, backgroundColor: 'white', margin: 'auto', width: 400 }}>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <FormLabel id="gl-account-label">GL Account to Disburse From</FormLabel>
                <Select
                  value={selectedGlAccount}
                  onChange={(e) => setSelectedGlAccount(e.target.value)}
                >
                  {glAccounts.map((acc) => (
                    <MenuItem key={acc.id} value={acc.account_number}>
                      {acc.account_name} - {fCurrency(acc.account_balance)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

                <FormControl sx={{ mt: 2 }}>
                  <FormLabel>Allow Fees Payment UpFront?</FormLabel>
                  <RadioGroup
                    row
                    value={feesPaidUpfront ? 'true' : 'false'}
                    onChange={(e) => setFeesPaidUpfront(e.target.value === 'true')}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Allow" />
                    <FormControlLabel value="false" control={<Radio />} label="Don't Allow" />
                  </RadioGroup>
                </FormControl>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isRtgs}
                      onChange={(e) => setIsRtgs(e.target.checked)}
                    />
                  }
                  label="Require Manual Disbursement"
                />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  sx={{ mt: 3, backgroundColor: '#800080', color: 'white' }}
                  onClick={() => setShowConfirm(true)}
                  disabled={!selectedGlAccount}
                >
                  Submit
                </Button>
                <Button sx={{ mt: 3 }} variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Modal>

      <Modal open={showConfirm} onClose={() => setShowConfirm(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card sx={{ padding: 3, width: 500 }}>
          <CardHeader title="Confirm Disbursement" />
          <Divider sx={{ mb: 2, backgroundColor: '#800080' }} />
          <Box>
            Are you sure you want to disburse this loan?
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={() => setShowConfirm(false)}>Cancel</Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#800080', color: 'white' }}
                onClick={confirmAndSubmit}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Card>
      </Modal>
    </>
  );
};

export function AppAllLoansUndisbursed() {
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({ count: 0, pages: 0 });
  const [expandedRow, setExpandedRow] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [glAccounts, setGlAccounts] = useState([]);
  const table = useTable();

  const fetchLoans = useCallback(async () => {
    try {
      const response = await axios.get(endpoints.allloans, {
        params: {
          status: 'undisbursed',
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

  const fetchGlAccounts = useCallback(async () => {
    try {
      const response = await axios.get(endpoints.glaccounts, {
        params: { page: 1, page_size: 100 },
      });
      setGlAccounts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching GLAccounts:', error);
    }
  }, []);

  const disburseLoan = async (id, gl_account_number, is_rtgs, fees_paid_upfront) => {
    try {
      const payload = {
        gl_account_number,
        is_rtgs,
        fees_paid_upfront,
      };

      const response = await axios.post(endpoints.disburseapprovals(id), payload);
      const { status, message } = response.data;

      if (response.status === 200) {
        toast.success(message);
        fetchLoans();
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error('Error disbursing loan:', error);
      toast.error('Something went wrong during disbursement.');
    }
  };

  useEffect(() => {
    fetchLoans();
    fetchGlAccounts();
  }, [fetchLoans, fetchGlAccounts]);

  const handleRowClick = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  const handleOpenModal = (loanId) => {
    setSelectedLoanId(loanId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedLoanId(null);
  };

  return (
    <>
      <Card sx={{ mb: 2, mt: 2, border: '1px solid #800080', borderRadius: 2, boxShadow: 3 }}>
        <CardHeader sx={{ color: '#800080' }} title="UnDisbursed Loans" />
        <Divider sx={{ mt: 2, backgroundColor: '#800080' }} />
        <Scrollbar>
          <Table>
            <TableHeadCustom headLabel={headers} />
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id} onClick={() => handleRowClick(row.id)}>
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
                    <LoadingButton
                      sx={{ backgroundColor: '#800080', color: 'white' }}
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(row.id);
                      }}
                    >
                      Disburse
                    </LoadingButton>
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

      <ApprovalModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={disburseLoan}
        loanId={selectedLoanId}
        glAccounts={glAccounts}
      />
    </>
  );
}

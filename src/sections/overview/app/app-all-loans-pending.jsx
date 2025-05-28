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
import {
  Button, Collapse, Divider, IconButton, Modal, TextField, Box, CardContent, Radio,
  RadioGroup, FormControlLabel, FormControl, FormLabel,
  CardActions
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { fCurrency, fPercent } from 'src/utils/format-number';
import { toast } from 'sonner';
import { LoadingButton } from '@mui/lab';
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

const ConfirmationDialog = ({ open, onClose, onConfirm, action }) => (
  <Modal
    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    open={open}
    onClose={onClose}
  >
    <Card sx={{ p: 3, width: 800 }}>
      <CardHeader title="Confirm Action" />
      <Divider sx={{ borderStyle: "dashed", backgroundColor: "#800080" }} />
      <CardContent>
        <Box sx={{ mb: 2 }}>
          Are you sure you want to have this loan <strong>{action}</strong>?
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#800080', color: 'white' }}
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </Box>
      </CardContent>
    </Card>
  </Modal>
);

const ApprovalModal = ({ open, onClose, onSubmit, loanId }) => {
  const [approvalAction, setApprovalAction] = useState('');
  const [remarks, setRemarks] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirm = () => {
    onSubmit(loanId, approvalAction, remarks);
    setConfirmOpen(false);
    onClose();
  };

  const handleSubmit = () => {
    setConfirmOpen(true);
  };

  return (
    <>
      <Modal
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        open={open}
        onClose={onClose}
      >
        <Card sx={{ mt: 2, padding: 2 }}>
          <CardHeader title="Approve or Reject the Loan Application" />
          <Divider sx={{ borderStyle: "dashed", backgroundColor: "#800080" }} />
          <CardContent>
            <>
              <Box sx={{ padding: 3, backgroundColor: 'white', margin: 'auto', width: 400 }}>
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <FormLabel component="legend">Approval Action</FormLabel>
                  <RadioGroup
                    row
                    value={approvalAction}
                    onChange={(e) => setApprovalAction(e.target.value)}
                  >
                    <FormControlLabel value="approved" control={<Radio />} label="Approve" />
                    <FormControlLabel value="rejected" control={<Radio />} label="Reject" />
                  </RadioGroup>
                </FormControl>

                <TextField
                  sx={{ mt: 2, mb: 2 }}
                  label="Remarks"
                  variant="outlined"
                  fullWidth
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
                <CardActions>
                  <Button
                    sx={{ mt: 3 }}
                    variant="outlined"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ mt: 2, backgroundColor: '#800080', color: 'white' }}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </CardActions>

              </Box>
            </>
          </CardContent>
        </Card>
      </Modal>

      <ConfirmationDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        action={approvalAction}
      />
    </>
  );
};

export function AppAllLoansPending() {

  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({ count: 0, pages: 0 });
  const [expandedRow, setExpandedRow] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const table = useTable();

  const approveLoan = async (id, action, remarks) => {
    try {
      const payload = {
        approval_action: action,
        remarks,
      };

      const response = await axios.post(endpoints.loanapprovals(id), payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        toast.success(`Loan ${action} successfully!`);
        setOpenModal(false);
        setSelectedLoanId(null);
        fetchLoans();
      } else {
        toast.error('Error approving loan');
        console.error('Error:', response.data);
      }
    } catch (error) {
      console.error('Approval error:', error);
      toast.error(error.message);
      setOpenModal(false);
    }
  };

  const fetchLoans = useCallback(async () => {
    try {
      const response = await axios.get(endpoints.allloans, {
        params: {
          status: 'pending',
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
        <CardHeader sx={{ color: '#800080' }} title="Application Approvals" />
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
                      <LoadingButton
                        sx={{ backgroundColor: '#800080', color: 'white' }}
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(row.id);
                        }}
                      >
                        Approve
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
      <ApprovalModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={approveLoan}
        loanId={selectedLoanId}
      />
    </>
  );
}

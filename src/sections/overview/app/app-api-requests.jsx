import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom, TablePaginationCustom, useTable } from 'src/components/table';
import { useCallback, useEffect, useState } from 'react';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import axios, { endpoints } from 'src/utils/axios';
import { Collapse, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import { fDate, fDateYMD, fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDateRangePicker, CustomDateRangePicker } from 'src/components/custom-date-range-picker';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

const headers = [
  { id: 'id', label: 'SNo' },
  { id: 'transaction_reference', label: 'Transaction reference' },
  // { id: 'checkout_request_id', label: 'Checkout ID' },
  { id: 'originator_id', label: 'Originator ID' },
  { id: 'channel_code', label: 'Channel ID' },
  { id: 'sender_account_name', label: 'Sender Name' },
  { id: 'recipient_account_name', label: 'Receipient Name' },
  { id: 'amount', label: 'Amount' },
  { id: 'destination_channel', label: 'Destination' },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'date_created', label: 'Created On', width: 200 },
  { id: '' },
];
export function ApiRequests({ title, subheader, headLabel, viewAll = false, ...other }) {
  const [tableData, setTableData] = useState([]);

  const table = useTable();

  const [pagination, setPagination] = useState({
    count: 0,
    pages: 0,
  });

  const rangePicker = useDateRangePicker(null, null);

  const [account_number, set_search_term] = useState(null);

  const getRequests = useCallback(
    async () => {
      setTableData([]);
      const response = await axios.get(endpoints.api, {
        params: {
          account_number,
          page: table.page + 1,
          page_size: table.rowsPerPage,
          start_date: fDateYMD(rangePicker.startDate),
          end_date: fDateYMD(rangePicker.endDate),
        },
      });

      const { status, data, ...rest } = response.data;

      if (status) {
        setTableData(data);
        setPagination(rest);
      }
    },
    [table.page, table.rowsPerPage, rangePicker.startDate, rangePicker.endDate] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    getRequests();
  }, [getRequests]);

  const open = useBoolean(false);
  return (
    <Card {...other}>
      {/* <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} /> */}

      <Collapse in={open.value} unmountOnExit>
        <Box sx={{ p: 2 }} gap={3} display="flex" flexDirection="row">
          <TextField
            value={account_number}
            label="Account Number"
            onChange={(e) => {
              let value = e.target.value;

              if (value === '') {
                value = null;
                getRequests();
              }

              set_search_term(value);
            }}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <>
            <DatePicker
              label="Start date"
              value={rangePicker.startDate}
              onChange={rangePicker.onChangeStartDate}
            />

            <DatePicker
              label="End date"
              value={rangePicker.endDate}
              onChange={rangePicker.onChangeEndDate}
            />
          </>
        </Box>
      </Collapse>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Button
            color="info"
            onClick={(e) => {
              if (open.value) {
                getRequests();

                set_search_term(null);
                rangePicker.setEndDate(null);
                rangePicker.setStartDate(null);
              }

              open.onToggle();
            }}
            startIcon={<Iconify icon="fluent:table-search-20-filled" />}
            variant="contained"
          >
            {open.value ? 'Close Filter' : 'Open Filter'}
          </Button>
        }
        sx={{ mb: 3 }}
      />

      <Scrollbar sx={{ minHeight: 402 }}>
        <Table stickyHeader size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 680 }}>
          <TableHeadCustom headLabel={headers} />

          <TableBody>
            {tableData.map((row) => (
              <RowItem key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>

      {(!viewAll && (
        <>
          <Divider sx={{ borderStyle: 'dashed' }} />

          <Box sx={{ p: 2, textAlign: 'right' }}>
            <Button
              component={RouterLink}
              size="small"
              color="inherit"
              href={paths.dashboard.general.transactions}
              // to={paths.dashboard.general.api}
              endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
            >
              View all
            </Button>
          </Box>
        </>
      )) || (
        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={pagination.count}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      )}
    </Card>
  );
}

function RowItem({ row }) {
  const open = useBoolean();

  return (
    <>
      {/* sx={{ '& > *': { borderBottom: 'unset' } }} */}
      <TableRow>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.transaction_reference}</TableCell>
        {/* <TableCell>{row.checkout_request_id || '----'}</TableCell> */}
        <TableCell>{row.originator_id || '----'}</TableCell>
        <TableCell>{row.channel_code || '----'}</TableCell>
        <TableCell>{row.sender_account_name || '----'}</TableCell>
        <TableCell>{row.recipient_account_name || '----'}</TableCell>
        <TableCell>{row.amount || '----'}</TableCell>
        <TableCell>{row.destination_channel || '----'}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              row.status === 'SUCCESS' ? 'success' : row.status === 'FAILED' ? 'error' : 'warning'
            }
          >
            {row.status}
          </Label>
        </TableCell>
        <TableCell>{fDateTime(row.date_created) || '----'}</TableCell>
        <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton
            size="small"
            color={open.value ? 'inherit' : 'default'}
            onClick={open.onToggle}
          >
            <Iconify
              icon={open.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={12}>
          <Collapse timeout="auto" unmountOnExit in={open.value}>
            <Grid container spacing={3} mb={2}>
              <Grid item sm={4} md={3} lg={3}>
                <Typography variant="button">TRANSACTION TYPE</Typography>
                <br />
                <Typography variant="caption">
                  {row.transaction_type_enum === 2 ? 'WITHDRAWAL' : 'DEPOSIT'}
                </Typography>
              </Grid>

              <Grid item sm={4} md={3} lg={3}>
                <Typography variant="button">TRANSACTION AMOUNT</Typography>
                <br />
                <Typography variant="caption">{fCurrency(row.amount)}</Typography>
              </Grid>
              <Grid item sm={4} md={3} lg={3}>
                <Typography variant="button">TRANSACTION FEE</Typography>
                <br />
                <Typography variant="caption">{fCurrency(row.transaction_fee)}</Typography>
              </Grid>
              <Grid item sm={4} md={3} lg={3}>
                <Typography variant="button">MERCHANT CODE</Typography>
                <br />
                <Typography variant="caption">{row.merchant_code || 'NOT AVAILABLE'}</Typography>
              </Grid>

              <Grid item sm={4} md={3} lg={3}>
                <Typography variant="button">SENDER ACCOUNT NUMBER</Typography>
                <br />
                <Typography variant="caption">
                  {row.sender_account_number || 'NOT AVAILABLE'}
                </Typography>
              </Grid>
              <Grid item sm={4} md={3} lg={3}>
                <Typography variant="button">RECIPIENT ACCOUNT NUMBER</Typography>
                <br />
                <Typography variant="caption">
                  {row.recipient_account_number || 'NOT AVAILABLE'}
                </Typography>
              </Grid>

              <Grid item sm={4} md={3} lg={3}>
                <Typography variant="button">MEMBER ACCOUNT NUMBER</Typography>
                <br />
                <Typography variant="caption">
                  {row.member_account_number || 'NOT AVAILABLE'}
                </Typography>
              </Grid>

              <Grid item sm={4} md={3} lg={3}>
                <Typography variant="button">THIRD PARTY TRANSACTION CODE</Typography>
                <br />
                <Typography variant="caption">
                  {row.third_party_transaction_code || 'NOT AVAILABLE'}
                </Typography>
              </Grid>

              {/* <Grid item sm={4} md={3} lg={3}>
                <Typography variant="button">REMOTE IP ADDRESS</Typography>
                <br />
                <Typography variant="caption">
                  {row.remote_user_ip_address || 'NOT AVAILABLE'}
                </Typography>
              </Grid>
              <Grid item sm={4} md={3} lg={3}>
                <Typography variant="button">REMOTE IP AGENT</Typography>
                <br />
                <Typography variant="caption">
                  {row.remote_user_agent || 'NOT AVAILABLE'}
                </Typography>
              </Grid> */}

              <Grid item sm={4} md={3} lg={3}>
                <Typography variant="button">RESULT MESSAGE</Typography>
                <br />
                <Label
                  variant="soft"
                  color={
                    row.status === 'SUCCESS'
                      ? 'success'
                      : row.status === 'FAILED'
                        ? 'error'
                        : 'warning'
                  }
                >
                  {row.result_description}
                </Label>
              </Grid>

              <Grid item sm={4} md={3} lg={3}>
                <Typography variant="button">DESCRIPTION</Typography>
                <br />
                <Typography variant="caption">{row.description || 'NOT AVAILABLE'}</Typography>
              </Grid>
              {/* <Grid item sm={4} md={3} lg={3}>
                <Typography variant="button">CALLBACK URL</Typography>
                <br />
                <Typography variant="caption">{row.callback_url || 'NOT AVAILABLE'}</Typography>
              </Grid> */}
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

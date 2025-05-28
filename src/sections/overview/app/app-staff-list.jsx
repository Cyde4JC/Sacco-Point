import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar'; // 👈 Added
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom, TablePaginationCustom, useTable } from 'src/components/table';
import { useCallback, useEffect, useState } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import axios, { endpoints } from 'src/utils/axios';
import {
  Collapse,
  Dialog,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import { fDate, fDateTime } from 'src/utils/format-time';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { toast } from 'sonner';
import { upperCase } from 'lodash';
import { sentenceCase } from 'src/utils/change-case';

// ----------------------------------------------------------------------

const headers = [
  { id: 'display_name', label: 'Display Name' },
  { id: 'role', label: 'Role' },
  { id: 'mobile_number', label: 'Mobile No' },
  { id: 'email', label: 'Email' },
  { id: 'status', label: 'Status', width: 200 },
  { id: 'date_created', label: 'Created On' },
  { id: '' },
];

export function AppStaffList({ title, subheader, headLabel, viewAll = false, ...other }) {
  const [tableData, setTableData] = useState([]);

  const table = useTable();

  const [pagination, setPagination] = useState({
    count: 0,
    pages: 0,
  });

  const [search_term, set_search_term] = useState(null);

  const getMembers = useCallback(
    async (mobile_number = null) => {
      const response = await axios.get(endpoints.staff, {
        params: {
          mobile_number,
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
    getMembers();
  }, [getMembers]);


  return (
    
      <Card {...other}>
        <CardHeader
          title={
            <TextField
              value={search_term}
              onChange={(e) => {
                let value = e.target.value;

                if (value === '') {
                  value = null;
                  getMembers();
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
          }
          sx={{ mb: 3 }}
        />

        <Scrollbar sx={{ minHeight: 402 }}>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 680 }}>
            <TableHeadCustom headLabel={headers} />

            <TableBody>
              {tableData.map((row) => (
                <RowItem key={row.id} row={row} refresh={getMembers} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={pagination.count}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
  );
}
function RowItem({ row, refresh }) {
  const open = useBoolean();
  const confirm = useBoolean();

  const onUpdate = async () => {
    try {
      const response = await axios.post(endpoints.staff_action(row.id), {
        status_action: row.status === 'ACTIVE' ? 'disable' : 'enable',
      });

      const { status, message } = response.data;

      if (status) {
        toast.success(message);
        confirm.onFalse();
        row.status = row.status === 'ACTIVE' ? 'DISABLED' : 'ENABLED';
        refresh();
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Something is totally wrong!');
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{ bgcolor: '#800080', width: 52, height: 52 }}>{row.display_name?.substring(0, 2).toUpperCase()}</Avatar>
            <Typography variant="body2">{row.display_name}</Typography>
          </Stack>
        </TableCell>
        <TableCell>{row.role_display}</TableCell>
        <TableCell>{row.mobile_number || '---'}</TableCell>
        <TableCell>{row.email || '---'}</TableCell>
        <TableCell>
          <Stack spacing={2} direction="row">
            <Label variant="soft" color={(row.status === 'ACTIVE' && 'success') || 'error'}>
              {row.status}
            </Label>
            <Button
              size="small"
              onClick={confirm.onTrue}
              color={row.status === 'ACTIVE' ? 'error' : 'success'}
            >
              {row.status === 'ACTIVE' ? 'Disable' : 'Activate'}
            </Button>
          </Stack>
        </TableCell>

        <TableCell>{fDateTime(row?.date_created) || '----'}</TableCell>
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
        <ConfirmDialog
          open={confirm.value}
          onClose={confirm.onFalse}
          title="Confirm"
          content={`Are you sure want to ${row.status === 'ACTIVE' ? 'DISABLE' : 'ENABLE'} ${sentenceCase(row.display_name)}?`}
          action={
            <Button variant="contained" color="error" onClick={onUpdate}>
              Confirm
            </Button>
          }
        />

        <TableCell sx={{ py: 0 }} colSpan={10}>
          <Collapse timeout="auto" unmountOnExit in={open.value}>
            <Grid container spacing={3} mb={2}>
              <Grid item sm={4} md={3} lg={3}>
                <Typography variant="button">LOGIN STATUS</Typography>
                <br />
                <Button
                  size="small"
                  onClick={confirm.onTrue}
                  color={row.status === 'ACTIVE' ? 'error' : 'success'}
                >
                  {row.status === 'ACTIVE' ? 'Disable Login' : 'Activate Login'}
                </Button>
              </Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

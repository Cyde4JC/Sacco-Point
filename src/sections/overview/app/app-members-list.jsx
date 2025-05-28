import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import {
  TableHeadCustom,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import axios, { endpoints } from 'src/utils/axios';
import { useBoolean } from 'src/hooks/use-boolean';
import { fDateTime } from 'src/utils/format-time';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { toast } from 'sonner';
import { upperCase } from 'lodash';
import AddMember from './add-member';

// ----------------------------------------------------------------------

const headers = [
  { id: 'display_name', label: 'Name' },
  { id: 'member_type', label: 'Member Type' },
  { id: 'mobile_number', label: 'Mobile No' },
  { id: 'member_number', label: 'Member No' },
  { id: 'document_number', label: 'Document No' },
  { id: 'status', label: 'Status', width: 200 },
  { id: 'date_created', label: 'Created On' },
  { id: '' },
];

export function AppMembersList({ title, subheader, headLabel, viewAll = false, ...other }) {
  const [tableData, setTableData] = useState([]);
  const table = useTable();
  const [pagination, setPagination] = useState({ count: 0, pages: 0 });
  const navigate = useNavigate();
  const [search_term, set_search_term] = useState(null);

  const getMembers = useCallback(
    async (search = null) => {
      const response = await axios.get(endpoints.members, {
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
    getMembers();
  }, [getMembers]);

  const openMember = useBoolean();

  return (
    <Card sx={{ mb: 2, mt: 2, padding: 2, border: '1px solid #800080', borderRadius: 2, boxShadow: 3 }}>
      <CardHeader sx={{ color: '#800080' }} title="Registered Members" />
      <Divider sx={{ mt: 2, backgroundColor: '#800080' }} />
      <CardContent>
        <Scrollbar sx={{ minHeight: 402 }}>
          <Table size='medium' sx={{ minWidth: 600 }}>
            <TableHeadCustom headLabel={headers} />
            <TableBody>
              {tableData?.map((row) => (
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
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ bgcolor: '#800080', width: 62, height: 62 }}>
              {row.display_name?.substring(0, 2).toUpperCase()}
            </Avatar>
            {row.display_name}
          </Stack>
        </TableCell>
        
        <TableCell>{row.member_type || '----'}</TableCell>

        <TableCell className={row.mobile_number !== mobile_number ? 'wobble' : ''}>
          {row.mobile_number || '----'}
        </TableCell>

        <TableCell>{row.member_number || '----'}</TableCell>
        <TableCell>{row.document_number || '----'}</TableCell>

        <TableCell>
          <Label variant="soft" color={(row.status === 'ACTIVE' && 'success') || 'error'}>
            {row.status}
          </Label>
        </TableCell>

        <TableCell>{fDateTime(row.date_created) || '----'}</TableCell>

        <TableCell>
          <Button
            variant="contained"
            sx={{ bgcolor: '#800080' }}
            size="small"
            component={Link}
            to={`/dashboard/members-details/${row.id}`}
          >
            View
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}

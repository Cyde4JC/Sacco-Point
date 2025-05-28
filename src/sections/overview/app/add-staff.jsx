import { LoadingButton } from '@mui/lab';
import { Box, Card, CardActions, CardContent, CardHeader, Divider, MenuItem, Stack } from '@mui/material';
import React from 'react';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input';
import axios, { endpoints } from 'src/utils/axios';
import { toast } from 'sonner';

export const StaffSchame = zod.object({
  first_name: zod.string().min(1, { message: 'First name is required!' }),
  middle_name: zod.string(),
  last_name: zod.string().min(1, { message: 'Last name is required!' }),
  id_number: zod.string().min(1, { message: 'ID number is required!' }),
  mobile_number: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  role: zod.string().min(1, { message: 'Role is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
});

export default function AddStaff({ open, onClose, refresh }) {
  const defaultValues = {
    first_name: '',
    middle_name: '',
    last_name: '',
    mobile_number: '',
    id_number: '',
    email: '',
    role: '',
  };

  const methods = useForm({
    resolver: zodResolver(StaffSchame),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.mobile_number = data.mobile_number.replace('+', '');
      const response = await axios.post(endpoints.staff, data);

      const { status, message } = response.data;

      if (status) {
        toast.success(message);
        reset();
        refresh();
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error(error);
    }
  });
  
  const renderForm = (
    <Box sx={{ mt: 2 }} gap={3} display="flex" flexDirection="column">

      <Stack direction="row" spacing={2}>
        <Field.Select name="role" label="Select Role" InputLabelProps={{ shrink: true }}>
          <MenuItem value="">None</MenuItem>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="teller">Sacco Teller/Finance</MenuItem>
          <MenuItem value="loan_officer">Loan Officer</MenuItem>
          <MenuItem value="loan_admin">Loan Admin</MenuItem>
        </Field.Select>
        </Stack>

        <Field.Phone
        autoFocus
        name="mobile_number"
        label="Mobile Number"/>

      <Stack direction="row" spacing={2}>
        <Field.Text
          autoFocus
          name="first_name"
          label="First Name"
          InputLabelProps={{ shrink: true }}
        />
        <Field.Text
          autoFocus
          name="last_name"
          label="Last name"
          InputLabelProps={{ shrink: true }}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
      <Field.Text
        autoFocus
        name="id_number"
        label="ID/Passport number"
        InputLabelProps={{ shrink: true }}
      />

      <Field.Text
        autoFocus
        name="email"
        label="Email address"
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
      />
      </Stack>
    </Box>
  );

  return (
    <Card sx={{ mt: 2, padding: 2 }}>
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <CardHeader>ADD STAFF</CardHeader>

      <Form methods={methods} onSubmit={onSubmit}>
        <CardContent> {renderForm}</CardContent>
        <CardActions>
          <LoadingButton
            sx={{ backgroundColor: '#800080', color: 'white' }}
            type="submit"
            variant="contained"
            loading={isSubmitting}
            loadingIndicator="Send request..."
          >
            Submit
          </LoadingButton>
        </CardActions>
      </Form>
    </Box>
    </Card>
  );
}

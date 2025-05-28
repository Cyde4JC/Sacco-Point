import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  Typography,
  FormControl,
  FormHelperText,
  InputLabel,
  Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm, useFormContext, Controller } from 'react-hook-form';
import { z as zod } from 'zod';
import axios, { endpoints } from 'src/utils/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Field, Form } from 'src/components/hook-form'; 

const MemberSchema = zod.object({
  first_name: zod.string().min(1, { message: 'First name is required' }),
  middle_name: zod.string().optional(),
  last_name: zod.string().min(1, { message: 'Last name is required' }),
  mobile_number: zod.string().min(1, { message: 'Phone number is required' }),
  email: zod.string().email({ message: 'Enter a valid email' }),
  document_type: zod.string().min(1, { message: 'Document type is required' }),
  document_number: zod.string().min(1, { message: 'Document number is required' }),
  id_front: zod.any().refine((file) => file instanceof File || file instanceof Blob, { message: 'ID front is required' }),
  id_back: zod.any().refine((file) => file instanceof File || file instanceof Blob, { message: 'ID back is required' }),
  selfie: zod.any().refine((file) => file instanceof File || file instanceof Blob, { message: 'Selfie is required' }),
});

function FileInput({ name, label, accept }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error} sx={{ mt: 2 }}>
          <InputLabel shrink>{label}</InputLabel>
          <input
            type="file"
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              onChange(file || null);
            }}
            style={{ marginTop: 8 }}
          />
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}

export default function AddMember({ refresh }) {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [formData, setFormData] = useState(null);
  const [success, setSuccess] = useState(false);

  const methods = useForm({
    resolver: zodResolver(MemberSchema),
    defaultValues: {
      first_name: '',
      middle_name: '',
      last_name: '',
      mobile_number: '',
      email: '',
      document_type: '',
      document_number: '',
      id_front: null,
      id_back: null,
      selfie: null,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data) => {
    setFormData(data);
    setOpenConfirmDialog(true);
  };

  const handleConfirmAddMember = async () => {
    if (!formData) return;

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          payload.append(key, value);
        }
      });
      payload.append('country_code', '+254');

      const { data: res } = await axios.post(endpoints.addmembers, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.status) {
        toast.success(res.message || 'Member added successfully');
        setSuccess(true);
        setTimeout(() => {
          refresh?.();
          reset();
          setSuccess(false);
        }, 1000);
      } else {
        toast.error(res.message || 'Failed to add member');
      }
    }  finally {
      setOpenConfirmDialog(false);
    }
  };

  if (success) {
    return (
      <Card sx={{ p: 3, backgroundColor: '#f0fff0' }}>
        <CardHeader title="🎉 Success" />
        <CardContent>
          <Typography variant="h6" color="success.main">
            Member application submitted successfully!
          </Typography>
          <Button
            sx={{ mt: 2, bgcolor: '#800080' }}
            variant="contained"
            onClick={() => setSuccess(false)}
          >
            Add Another
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <FormProvider {...methods}>
      <Card sx={{ mb: 2, p: 2 }}>
        <CardHeader title="Add Member" />
        <Divider sx={{ mb: 2, backgroundColor: '#800080' }} />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2}>
                <Field.Select
                  name="document_type"
                  label="Document Type"
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="">Select Document Type</MenuItem>
                  <MenuItem value="NATIONAL_ID">National ID</MenuItem>
                  <MenuItem value="PASSPORT">Passport</MenuItem>
                  <MenuItem value="ALIEN_ID">Alien ID</MenuItem>
                </Field.Select>
                <Field.Text name="document_number" label="Document Number" />
              </Stack>

              <Stack direction="row" spacing={2}>
                <Field.Text name="first_name" label="First Name" />
                <Field.Text name="middle_name" label="Middle Name" />
                <Field.Text name="last_name" label="Last Name" />
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field.Phone
                    name="mobile_number"
                    label="Mobile Number"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field.Text
                    name="email"
                    label="Email"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              <Stack direction="row" spacing={2}>
                <FileInput name="id_front" label="Upload ID Front" accept="image/*" />
                <FileInput name="id_back" label="Upload ID Back" accept="image/*" />
                <FileInput name="selfie" label="Upload Selfie" accept="image/*" />
              </Stack>

              <CardActions>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  sx={{ bgcolor: '#800080' }}
                >
                  Submit
                </LoadingButton>
              </CardActions>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Member Details</DialogTitle>
        <Divider sx={{ mb: 2, backgroundColor: '#800080' }} />
        <DialogContent>
          <Box gap={3} display="flex" sx={{ mt: 2 }} flexDirection="column">
            <p><strong>First Name:</strong> {formData?.first_name}</p>
            <p><strong>Middle Name:</strong> {formData?.middle_name || 'N/A'}</p>
            <p><strong>Last Name:</strong> {formData?.last_name}</p>
            <p><strong>Phone:</strong> {formData?.mobile_number}</p>
            <p><strong>Email:</strong> {formData?.email}</p>
            <p>
              <strong>Document:</strong> {formData?.document_type} - {formData?.document_number}
            </p>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight="bold">Uploaded Images</Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {formData?.id_front && (
                <Box>
                  <Typography variant="body2">ID Front</Typography>
                  <img
                    src={URL.createObjectURL(formData.id_front)}
                    alt="ID Front"
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }}
                  />
                </Box>
              )}
              {formData?.id_back && (
                <Box>
                  <Typography variant="body2">ID Back</Typography>
                  <img
                    src={URL.createObjectURL(formData.id_back)}
                    alt="ID Back"
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }}
                  />
                </Box>
              )}
              {formData?.selfie && (
                <Box>
                  <Typography variant="body2">Selfie</Typography>
                  <img
                    src={URL.createObjectURL(formData.selfie)}
                    alt="Selfie"
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
          <LoadingButton
            variant="contained"
            onClick={handleConfirmAddMember}
            sx={{ bgcolor: '#800080' }}
          >
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}

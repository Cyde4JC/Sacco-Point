import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Typography,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';
import React, { useState } from 'react';
import { Field, Form } from 'src/components/hook-form';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { endpoints } from 'src/utils/axios';
import { Iconify } from 'src/components/iconify';
import AutoHeight from 'embla-carousel-auto-height';
import { toast } from 'sonner';

export const MemberScheme = zod.object({
  account_name: zod.string().min(1, { message: 'Account name is required!' }),
  purpose: zod.string().min(1, { message: 'Purpose is required!' }),
  category: zod.string().min(1, { message: 'Category is required!' }),
});

export default function AddGl({ open, onClose, refresh }) {
  const [formData, setFormData] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const methods = useForm({
    resolver: zodResolver(MemberScheme),
    defaultValues: {
      account_name: '',
      purpose: '',
      category: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

   const handleOpenConfirmDialog = (data) => {
      setFormData(data);
      setOpenConfirmDialog(true);
    };
  
    const handleCloseConfirmDialog = () => {
      setOpenConfirmDialog(false);
    };
  
    const handleConfirmAddGl = async () => {
      if (!formData) return;
      try {
        const response = await axios.post(endpoints.glaccounts, {
          ...formData,
        });
        const { status, message } = response.data;
        if (status) {
          toast.success(response.message);
          setTimeout(() => {
            refresh?.();
            reset();
            onClose();
          }, 500);
          setOpenConfirmDialog(false);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error(error);
      }
      setOpenConfirmDialog(false);
    };
  
    const onSubmit = handleSubmit((data) => {
      handleOpenConfirmDialog(data);
    });

  return (
    <>
    <Card sx={{ mb: 1, p: 2 }}>
      <CardHeader title="Add a GL Account" />
      <Divider sx={{ mt: 2, backgroundColor: '#800080' }} />
      <CardContent>
          <Form methods={methods} onSubmit={onSubmit}>
            <Box gap={3} display="flex" sx={{ mt: 2 }} flexDirection="column">
               <Stack direction="row" spacing={2}>
                      <Field.Select name="category" label="Select a GL Category" InputLabelProps={{ shrink: true }}>
                        <MenuItem value="">None</MenuItem>
                        <Divider sx={{ borderStyle: 'dashed' }} />
                        <MenuItem value="asset">Asset</MenuItem>
                        <MenuItem value="liability">Liability</MenuItem>
                        <MenuItem value="equity">Equity</MenuItem>
                        <MenuItem value="income">Income</MenuItem>
                        <MenuItem value="expense">Expense</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Field.Select>
                      </Stack>
                      
              <Stack direction="row" spacing={2}>
                <Field.Text
                  name="account_name"
                  label="Account Name"
                  InputLabelProps={{ shrink: true }}
                />
                <Field.Text
                  name="purpose"
                  label="Account Purpose"
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </Box>

            <CardActions>
              <LoadingButton
                variant="contained"
                sx={{ bgcolor: '#800080' }}
                type="submit"
                loading={isSubmitting}
                loadingIndicator="Adding..."  
              >
                Add GL Account
              </LoadingButton>
            </CardActions>

          </Form>
      </CardContent>
    </Card>

     <Dialog fullWidth maxWidth="sm" open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
            <DialogTitle>Confirm the GL Account Details before Creating</DialogTitle>
            <Divider sx={{ mb: 2, backgroundColor: '#800080' }} />
            <DialogContent>
              <Box gap={3} display="flex" sx={{ mt: 2 }} flexDirection="column">
                <p><strong>GL Category:</strong> {formData?.category}</p>
                <p><strong>Account Name:</strong> {formData?.account_name}</p>
                <p><strong>Account Purpose:</strong> {formData?.purpose}</p>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
              <LoadingButton onClick={handleConfirmAddGl} sx={{ bgcolor: '#800080' }} variant="contained">
                Confirm
              </LoadingButton>
            </DialogActions>
          </Dialog>
    </>
  );
}

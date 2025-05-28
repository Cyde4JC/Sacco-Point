import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, Divider, MenuItem, Stack } from '@mui/material';
import React, { useState } from 'react';
import { Field, Form } from 'src/components/hook-form';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { endpoints } from 'src/utils/axios';
import { toast } from 'sonner';
import { useParams } from 'src/routes/hooks';
import { fCurrency } from 'src/utils/format-number';

export const TransferScheme = zod.object({
  receiver_account_number: zod.string().min(1, { message: 'Receiver Account is required!' }),
  sender_account_number: zod.string().min(1, { message: 'Sender Account is required!' }),
  amount: zod.string().min(1, { message: 'Amount is required!' }),
  reason: zod.string().min(1, { message: 'Reason is required!' }),
});

export default function AppGlTransferPost({ onClose, refresh }) {

  const { id, account_number } = useParams();

  const methods = useForm({
    resolver: zodResolver(TransferScheme),
    defaultValues: {
      receiver_account_number: "",
      sender_account_number: account_number,
      amount: "",
      reason: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = methods;

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [formData, setFormData] = useState(null);
  
  const handleOpenConfirmDialog = (data) => {
    setFormData(data);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmTransfer = async () => {
    if (!formData) return;

    try {
      const response = await axios.post(endpoints.gltransfer, {
        ...formData,
        currency_code: 'KES',
        channel: 'SACCO',
      });

      const { status, message } = response.data;

      if (status) {
        toast.success(message);
        reset();
        setFormData(null);
        setOpenConfirmDialog(false);
        refresh();
        onClose();
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }

    setOpenConfirmDialog(false);
  };

  const onSubmit = handleSubmit((data) => {
    handleOpenConfirmDialog(data);
  });

  return (
<>
    <Card sx={{ mb: 1, padding: 2 }}>
      <CardHeader title="POST" />
      <Divider sx={{ mt: 2, backgroundColor: '#800080' }} />
      <CardContent>
        <Form methods={methods} onSubmit={onSubmit}>
          <Box gap={3} display="flex" sx={{ mt: 2 }} flexDirection="column">
            <Stack direction="row" spacing={2}>
              <Field.Text name="receiver_account_number" label="Post Account Number" InputLabelProps={{ shrink: true }} />
              <Field.Text name="amount" label="Post Amount" InputLabelProps={{ shrink: true }} />
              <Field.Text name="reason" label="Post Reason" InputLabelProps={{ shrink: true }} />
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
              POST
            </LoadingButton>
          </CardActions>
        </Form>
      </CardContent>
    </Card>

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
              <DialogTitle>
                  <h3>Confirm the details before proceeding with the Post.</h3>
                  <Divider sx={{ backgroundColor: '#800080' }} />
              </DialogTitle>
            <DialogContent>  
                <p style={{ fontSize: '14px' }}>
                  <strong>Post Account Number:</strong> {formData?.receiver_account_number}
                </p>
                <p style={{ fontSize: '14px' }}>
                  <strong>Post Amount:</strong> {fCurrency(formData?.amount)}
                </p>
                <p style={{ fontSize: '14px' }}>
                  <strong>Post Reason:</strong> {formData?.reason}
                </p>
                <Divider sx={{ backgroundColor: '#800080' }} />        
            </DialogContent>
            <DialogActions>
              <LoadingButton onClick={handleCloseConfirmDialog}>Cancel</LoadingButton>
              <LoadingButton
                onClick={handleConfirmTransfer}
                sx={{ bgcolor: '#800080' }}
                variant="contained"
              >
                Confirm
              </LoadingButton>
            </DialogActions>
          </Dialog>
    </>
  );
}

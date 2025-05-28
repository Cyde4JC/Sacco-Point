import {
  Box,
  Card,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import React, { useState } from 'react';
import { Field, Form } from 'src/components/hook-form';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { endpoints } from 'src/utils/axios';
import { toast } from 'sonner';
import { useParams } from 'src/routes/hooks';
import { fCurrency } from 'src/utils/format-number';

export const DepositScheme = zod.object({
  receiver_account_number: zod.string().min(1, { message: 'Receiver Account is required!' }),
  sender_account_number: zod.string().min(1, { message: 'Sender Account is required!' }),
  channel: zod.string().min(1, { message: 'Channel is required!' }),
  amount: zod.string().min(1, { message: 'Amount is required!' }),
});

export default function AppAccountDeposit({ open, account_number, onClose, refresh }) {

  const methods = useForm({
    resolver: zodResolver(DepositScheme),
    defaultValues: {
      receiver_account_number: account_number||'',
      sender_account_number: '',
      channel: '',
      amount: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
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
  
    const handleConfirmDeposit = async () => {
      if (!formData) return;
  
      try {
        const response = await axios.post(endpoints.gldeposit, {
          ...formData,
          currency_code: 'KES',
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Deposit to Account {account_number} </DialogTitle>
      <Divider sx={{ backgroundColor: '#800080' }} />
      <DialogContent>
       <Card sx={{ mb: 1, padding: 4 }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Box gap={3} display="flex" sx={{ mt: 2 }} flexDirection="column">
            <Stack direction="row" spacing={2}>
              <Field.Select name="channel" label="Channel" InputLabelProps={{ shrink: true }}>
                <MenuItem value="63902">MPesa</MenuItem>
                <MenuItem value="63903">Airtel</MenuItem>
              </Field.Select>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Field.Text name="sender_account_number" label="Sender Account Number" InputLabelProps={{ shrink: true }} />
              <Field.Text name="amount" label="Amount" InputLabelProps={{ shrink: true }} />
            </Stack>
          </Box>
          <CardActions>
            <LoadingButton
              variant="contained"
              sx={{ bgcolor: '#800080' }}
              type="submit"
              loading={isSubmitting}
              loadingIndicator="Depositing..."
            >
              Deposit
            </LoadingButton>
          </CardActions>
        </Form>
        </Card>
      </DialogContent>
    </Dialog>

 <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
          <DialogTitle>
              <h3>Confirm the details before proceeding with the deposit.</h3>
              <Divider sx={{ backgroundColor: '#800080' }} />
          </DialogTitle>
        <DialogContent>  
            <p style={{ fontSize: '14px' }}>
              <strong>Sender Account Number:</strong> {formData?.sender_account_number}
            </p>
            <p style={{ fontSize: '14px' }}>
              <strong>Channel:</strong> {formData?.channel}
            </p>
            <p style={{ fontSize: '14px' }}>
              <strong>Amount:</strong> {fCurrency(formData?.amount)}
            </p>
            <Divider sx={{ backgroundColor: '#800080' }} />        
        </DialogContent>
        <DialogActions>
          <LoadingButton onClick={handleCloseConfirmDialog}>Cancel</LoadingButton>
          <LoadingButton
            onClick={handleConfirmDeposit}
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

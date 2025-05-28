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

export const BillPaymentScheme = zod.object({
  receiver_account_number: zod.string().min(1, { message: 'Receiver Account is required!' }),
  sender_account_number: zod.string().min(1, { message: 'Sender Account is required!' }),
  channel: zod.string().min(1, { message: 'Channel is required!' }),
  amount: zod.string().min(1, { message: 'Amount is required!' }),
  reason: zod.string().min(1, { message: 'Reason is required!' }),
  biller_type: zod.string().min(1, { message: 'Biller Type is required!' }),
  account_reference: zod.string().min(1, { message: 'Account Reference is required!' }),
});

export default function AppGlBillpayment({ onClose, refresh }) {

  const { id, account_number } = useParams();

  const methods = useForm({
    resolver: zodResolver(BillPaymentScheme),
    defaultValues: {
      receiver_account_number: "",
      sender_account_number: account_number,
      channel: "",
      amount: "",
      reason: "",
      biller_type: "",
      account_reference: "",
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
  
    const handleConfirmBill = async () => {
      if (!formData) return;
  
      try {
        const response = await axios.post(endpoints.glbillpayment, {
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
    <Card sx={{ mb: 1, padding: 2 }}>
      <CardHeader title="Bill Payment" />
      <Divider sx={{ mt: 2, backgroundColor: '#800080' }} />
      <CardContent>
        <Form methods={methods} onSubmit={onSubmit}>

          <Box gap={3} display="flex" sx={{ mt: 2 }} flexDirection="column">
            <Stack direction="row" spacing={2}>
              <Field.Select name="biller_type" label="Biller Type" InputLabelProps={{ shrink: true }}>
                <MenuItem value="PAYBILL">Paybill</MenuItem>
                <MenuItem value="TILL">Till</MenuItem>
              </Field.Select>
              <Field.Text name="account_reference" label="Account Reference" InputLabelProps={{ shrink: true }} />
            </Stack>
            <Stack direction="row" spacing={2}>
              <Field.Select name="channel" label="Channel" InputLabelProps={{ shrink: true }}>
                <MenuItem value="0">SasaPay</MenuItem>
                <MenuItem value="63902">MPesa</MenuItem>
                <MenuItem value="63903">Airtel</MenuItem>
                <MenuItem value="SACCO">Sacco</MenuItem>
              </Field.Select>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Field.Text name="receiver_account_number" label="Receiver Account Number" InputLabelProps={{ shrink: true }} />
              <Field.Text name="amount" label="Amount" InputLabelProps={{ shrink: true }} />
              <Field.Text name="reason" label="Reason" InputLabelProps={{ shrink: true }} />

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
              Deposit
            </LoadingButton>
          </CardActions>
        </Form>
      </CardContent>
    </Card>

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
                  <DialogTitle>
                      <h3>Confirm the details before proceeding with the deposit.</h3>
                      <Divider sx={{ backgroundColor: '#800080' }} />
                  </DialogTitle>
                <DialogContent>  
                    <p style={{ fontSize: '14px' }}>
                      <strong>Receiver Account Number:</strong> {formData?.receiver_account_number}
                    </p>
                    <p style={{ fontSize: '14px' }}>
                      <strong>Channel:</strong> {formData?.channel}
                    </p>
                    <p style={{ fontSize: '14px' }}>
                      <strong>Amount:</strong> {fCurrency(formData?.amount)}
                    </p>
                    <p style={{ fontSize: '14px' }}>
                      <strong>Reason:</strong> {formData?.reason}
                    </p>
                    <p style={{ fontSize: '14px' }}>
                      <strong>Biller Type:</strong> {formData?.biller_type}
                    </p>
                    <p style={{ fontSize: '14px' }}>
                      <strong>Account Reference:</strong> {formData?.account_reference}
                    </p>                    
                    <Divider sx={{ backgroundColor: '#800080' }} />        
                </DialogContent>
                <DialogActions>
                  <LoadingButton onClick={handleCloseConfirmDialog}>Cancel</LoadingButton>
                  <LoadingButton
                    onClick={handleConfirmBill}
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

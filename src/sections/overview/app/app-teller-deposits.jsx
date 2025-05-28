import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Divider, MenuItem, Stack } from '@mui/material';
import React from 'react';
import { Field, Form } from 'src/components/hook-form';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { endpoints } from 'src/utils/axios';
import { toast } from 'sonner';
import { useParams } from 'src/routes/hooks';

export const CashDepositScheme = zod.object({
  receiver_account_number: zod.string().min(1, { message: 'Receiver Account is required!' }),
  sender_account_number: zod.string().min(1, { message: 'Sender Account is required!' }),
  amount: zod.string().min(1, { message: 'Amount is required!' }),
  reason: zod.string().min(1, { message: 'Reason is required!' }),
});

export default function AppTellerDeposits({ onClose, refresh }) {

  const { id, account_number } = useParams();

  const methods = useForm({
    resolver: zodResolver(CashDepositScheme),
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axios.post(endpoints.gltransfer, {
        ...data,
        currency_code: "KES",
        channel: "SACCO",
      });

      const { status, message } = response.data;

      if (status) {
        toast.success(message);
        reset();
        refresh();
        onClose();
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (

    <Card sx={{ mb: 1, padding: 2 }}>
      <CardHeader title="Cash Deposits" />
      <Divider sx={{ mt: 2, backgroundColor: '#800080' }} />
      <CardContent>
        <Form methods={methods} onSubmit={onSubmit}>
          <Box gap={3} display="flex" sx={{ mt: 2 }} flexDirection="column">
              <Field.Text name="receiver_account_number" label="Receiver Account Number" InputLabelProps={{ shrink: true }} />
              <Field.Text name="amount" label="Amount" InputLabelProps={{ shrink: true }} />
              <Field.Text name="reason" label="Reason" InputLabelProps={{ shrink: true }} />
          </Box>
          <CardActions>
            <LoadingButton
              variant="contained"
              sx={{ bgcolor: '#800080' }}
              type="submit"
              loading={isSubmitting}
              loadingIndicator="Adding..."
            >
              Cash Deposit
            </LoadingButton>
          </CardActions>
        </Form>
      </CardContent>
    </Card>
  );
}

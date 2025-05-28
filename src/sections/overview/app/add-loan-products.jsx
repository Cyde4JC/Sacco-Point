import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Card, CardActions, CardContent, CardHeader, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Field, Form } from 'src/components/hook-form';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { endpoints } from 'src/utils/axios';
import { toast } from 'sonner';
import { fCurrency, fPercent } from 'src/utils/format-number';

const periodTypes = {
  day: [
    { label: '1 Day', value: 1 },
    { label: '2 Days', value: 2 },
    { label: '3 Days', value: 3 },
    { label: '4 Days', value: 4 },
    { label: '5 Days', value: 5 },
    { label: '6 Days', value: 6 },
    { label: '7 Days', value: 7 },
  ],
  week: [
    { label: '1 Week (7 Days)', value: 7 },
    { label: '2 Weeks (14 Days)', value: 14 },
    { label: '3 Weeks (21 Days)', value: 21 },
    { label: '4 Weeks (30 Days)', value: 30 },
  ],
  month: [
    { label: '1 Month (30 Days)', value: 30 },
    { label: '2 Months (60 Days)', value: 60 },
    { label: '3 Months (90 Days)', value: 90 },
    { label: '6 Months (180 Days)', value: 180 },
    { label: '12 Months (365 Days)', value: 365 },
  ],
  year: [
    { label: '1 Year (365 Days)', value: 365 },
    { label: '2 Years (730 Days)', value: 730 },
    { label: '3 Years (1095 Days)', value: 1095 },
    { label: '4 Years (1460 Days)', value: 1460 },
    { label: '5 Years (1825 Days)', value: 1825 },
  ],
};

const repaymentPeriodTypes = {
  day: [
    { label: '1 Day', value: 1 },
    { label: '2 Days', value: 2 },
    { label: '3 Days', value: 3 },
    { label: '4 Days', value: 4 },
    { label: '5 Days', value: 5 },
    { label: '6 Days', value: 6 },
    { label: '7 Days', value: 7 },
  ],
  week: [
    { label: '1 Week (7 Days)', value: 7 },
    { label: '2 Weeks (14 Days)', value: 14 },
    { label: '3 Weeks (21 Days)', value: 21 },
    { label: '4 Weeks (30 Days)', value: 30 },
  ],
  month: [
    { label: '1 Month (30 Days)', value: 30 },
    { label: '2 Months (60 Days)', value: 60 },
    { label: '3 Months (90 Days)', value: 90 },
    { label: '6 Months (180 Days)', value: 180 },
    { label: '12 Months (365 Days)', value: 365 },
  ],
  year: [
    { label: '1 Year (365 Days)', value: 365 },
    { label: '2 Years (730 Days)', value: 730 },
    { label: '3 Years (1095 Days)', value: 1095 },
    { label: '4 Years (1460 Days)', value: 1460 },
    { label: '5 Years (1825 Days)', value: 1825 },
  ],
};

export const ProductScheme = zod.object({
  name: zod.string().min(1, { message: 'Loan Product Name is required!' }),
  grace_period: zod.string().min(1, { message: 'Grace Period is required!' }),
  minimum_loan_limit: zod.string().min(1, { message: 'Minimum Loan Limit is required!' }),
  maximum_loan_limit: zod.string().min(1, { message: 'Maximum Loan Limit is required!' }),
  late_repayment_fee_percentage: zod.string().min(1, { message: 'Late Repayment Fee is required!' }),
  loan_period_type: zod.string().min(1, { message: 'Loan Period Type is required!' }),
  loan_period: zod.number().min(1, { message: 'Loan Period is required!' }),
  interest_rate: zod.string().min(1, { message: 'Interest Rate is required!' }),
  allow_auto_disbursement: zod.boolean(),
  processing_fee: zod.string().min(1, { message: 'Processing Fee is required!' }),
  insurance_fee: zod.string().min(1, { message: 'Insurance Fee is required!' }),
  loan_product_type: zod.string().min(1, { message: 'Loan Product Type is required!' }),
  internal_credit_score: zod.string().min(1, { message: 'Internal Credit Score is required!' }),
  crb_credit_score: zod.string().min(1, { message: 'CRB Credit Score is required!' }),
  other_credit_score: zod.string().min(1, { message: 'Other Credit Score is required!' }),
});

export default function AddLoanProducts({ open, onClose, refresh }) {
  const [formData, setFormData] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const methods = useForm({
    resolver: zodResolver(ProductScheme),
    defaultValues: {
      name: '',
      grace_period: '',
      minimum_loan_limit: '',
      maximum_loan_limit: '',
      late_repayment_fee_percentage: '',
      loan_period_type: '',
      loan_period: '',
      interest_rate: '',
      allow_auto_disbursement: false,
      loan_product_type: '',
      processing_fee: '',
      insurance_fee: '',
      internal_credit_score: 0,
      crb_credit_score: 0,
      other_credit_score: 0,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    register,
    watch,
    setValue,
  } = methods;

  const loanPeriodType = watch('loan_period_type');
  const allowAutoDisbursement = watch('allow_auto_disbursement');
  const loanProductType = watch('loan_product_type');

  const handleOpenConfirmDialog = (data) => {
    setFormData(data);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmAddProduct = async () => {
    if (!formData) return;
    try {
      const response = await axios.post(endpoints.loanproducts, {
        ...formData,
      });
      const { status, message } = response.data;
      if (status) {
        toast.success(message);
        setTimeout(() => {
          refresh?.();
          reset();
          onClose();
        }, 500);
        setOpenConfirmDialog(false);
      } else {
        toast.error(message);
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
      <Card sx={{ mt: 2, padding: 2 }}>
        <CardHeader title="Add Loan Product" />
        <Divider sx={{ borderStyle: 'dashed', backgroundColor: '#800080' }} />
        <CardContent>
          <Form methods={methods} onSubmit={onSubmit}>
            <Box gap={3} display="flex" sx={{ mt: 2 }} flexDirection="column">
              <Stack direction="row" spacing={2}>
                <Field.Text name="name" label="Loan Product Name" InputLabelProps={{ shrink: true }} />
                <Field.Select name="loan_period_type" label="Loan Period Type" InputLabelProps={{ shrink: true }}>
                  <MenuItem value="">Select Type</MenuItem>
                  <MenuItem value="day">Days</MenuItem>
                  <MenuItem value="week">Weeks</MenuItem>
                  <MenuItem value="month">Months</MenuItem>
                  <MenuItem value="year">Years</MenuItem>
                </Field.Select>
              </Stack>
              {loanPeriodType && (
                <Field.Select name="loan_period" label="Loan Duration (in Days)" InputLabelProps={{ shrink: true }}>
                  <MenuItem value="">Select Duration</MenuItem>
                  {periodTypes[loanPeriodType].map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Field.Select>
              )}
              <Stack direction="row" spacing={2}>
                <Field.Text name="minimum_loan_limit" label="Minimum Loan Limit" InputLabelProps={{ shrink: true }} />
                <Field.Text name="maximum_loan_limit" label="Maximum Loan Limit" InputLabelProps={{ shrink: true }} />
              </Stack>
              <Stack direction="row" spacing={2}>
                <Field.Text name="interest_rate" label={`Interest Rate (%) for ${watch('loan_period') || '?'} Days`} InputLabelProps={{ shrink: true }} />
                <Field.Text name="grace_period" label="Grace Period (in Days)" InputLabelProps={{ shrink: true }} />
                <Field.Text name="late_repayment_fee_percentage" label="Late Repayment Fee Interest % (per Grace Period)" InputLabelProps={{ shrink: true }} />
              </Stack>
              <Stack direction="row" spacing={2}>
                <Field.Text name="processing_fee" label="Processing Fee (%)" InputLabelProps={{ shrink: true }} />
                <Field.Text name="insurance_fee" label="Insurance Fee (%)" InputLabelProps={{ shrink: true }} />
              </Stack>

              <FormControl component="fieldset">
                <FormLabel component="legend">Loan Product Type</FormLabel>
                <RadioGroup
                  row
                  value={loanProductType}
                  onChange={(e) => setValue('loan_product_type', e.target.value)}
                >
                  <FormControlLabel value="bnpl" control={<Radio />} label="BNPL" />
                  <FormControlLabel value="brf" control={<Radio />} label="Beneficiary Receives Funds (BRF)" />
                </RadioGroup>
              </FormControl>

              <Typography variant="h6">Credit Score</Typography>
                <Divider sx={{ mb: 2, backgroundColor: '#800080' }} />
              <Stack direction="row" spacing={2}>
                <Field.Text name="internal_credit_score" label="Internal Credit Score" InputLabelProps={{ shrink: true }} />
                <Field.Text name="crb_credit_score" label="CRB Credit Score" InputLabelProps={{ shrink: true }} />
                <Field.Text name="other_credit_score" label="Other Credit Score" InputLabelProps={{ shrink: true }} />
              </Stack>

              <FormControlLabel
                control={
                  <Checkbox
                    {...register('allow_auto_disbursement')}
                    checked={allowAutoDisbursement}
                    onChange={(e) => setValue('allow_auto_disbursement', e.target.checked)}
                  />
                }
                label="Allow Auto Disbursement?"
              />
            </Box>
            <CardActions>
              <LoadingButton
                variant="contained"
                sx={{ bgcolor: '#800080' }}
                type="submit"
                loading={isSubmitting}
                loadingIndicator="Adding..."
              >
                Add a Product
              </LoadingButton>
            </CardActions>
          </Form>
        </CardContent>
      </Card>

      <Dialog fullWidth maxWidth="sm" open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm the Loan Product Details before Adding</DialogTitle>
        <Divider sx={{ mb: 2, backgroundColor: '#800080' }} />
        <DialogContent>
          <Box gap={3} display="flex" sx={{ mt: 2 }} flexDirection="column">
            <Alert severity="info">
              <strong>Note:</strong> The loan product will be added to the system and will be available for use.
              Ensure that all details are correct before proceeding.
            </Alert>
            <p><strong>Loan Product Name:</strong> {formData?.name}</p>
            <p><strong>Loan Period:</strong> {formData?.loan_period} Days</p>
            <p><strong>Minimum Loan:</strong> {fCurrency(formData?.minimum_loan_limit)}</p>
            <p><strong>Maximum Loan:</strong> {fCurrency(formData?.maximum_loan_limit)}</p>
            <p><strong>Interest Rate:</strong> {fPercent(formData?.interest_rate)}</p>
            <p><strong>Grace Period:</strong> {formData?.grace_period} Days</p>
            <p><strong>Late Repayment Fee Interest:</strong> {fPercent(formData?.late_repayment_fee_percentage)}</p>
            <p><strong>Processing Fee:</strong> {fPercent(formData?.processing_fee)}</p>
            <p><strong>Insurance Fee:</strong> {fPercent(formData?.insurance_fee)}</p>
            <p><strong>Allow Auto Disbursement:</strong> {formData?.allow_auto_disbursement ? 'Yes' : 'No'}</p>
            <p><strong>Loan Product Type:</strong> {loanProductType}</p>
            <p><strong>Internal Credit Score:</strong> {formData?.internal_credit_score}</p>
            <p><strong>CRB Credit Score:</strong> {formData?.crb_credit_score}</p>
            <p><strong>Other Credit Score:</strong> {formData?.other_credit_score}</p>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <LoadingButton onClick={handleConfirmAddProduct} sx={{ bgcolor: '#800080' }} variant="contained">
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, IconButton, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { endpoints } from 'src/utils/axios';
import { toast } from 'sonner';
import { fCurrency, fPercent } from 'src/utils/format-number';
import { Iconify } from 'src/components/iconify';

export const ProductScheme = zod.object({
  name: zod.string().min(1, { message: 'Loan Product Name is required!' }),
  grace_period: zod.string().min(1, { message: 'Grace Period is required!' }),
  minimum_loan_limit: zod.string().min(1, { message: 'Minimum Loan Limit is required!' }),
  maximum_loan_limit: zod.string().min(1, { message: 'Maximum Loan Limit is required!' }),
  late_repayment_fee_percentage: zod.string().min(1, { message: 'Late Repayment Fee is required!' }),
  loan_period: zod.string().min(1, { message: 'Loan Period is required!' }),
  interest_rate: zod.string().min(1, { message: 'Interest Rate is required!' }),
  allow_auto_disbursement: zod.boolean(),
});

export default function AppLoanproductsList({ open, onClose, refresh }) {
  const [loanProducts, setLoanProducts] = useState([]);

  const fetchLoanProducts = async () => {
    try {
      const response = await axios.get(endpoints.loanproducts);
      if (Array.isArray(response.data.data)) {
        setLoanProducts(response.data.data);
      } else {
        console.error('Expected an array of loan products');
      }
    } catch (error) {
      console.error('Error fetching loan products:', error);
    }
  };

  useEffect(() => {
    fetchLoanProducts();
  }, []);

  const methods = useForm({
    resolver: zodResolver(ProductScheme),
    defaultValues: {
      name: "",
      grace_period: "",
      minimum_loan_limit: "",
      maximum_loan_limit: "",
      late_repayment_fee_percentage: "",
      loan_period: "",
      interest_rate: "",
      allow_auto_disbursement: false,
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

  const allowAutoDisbursement = watch("allow_auto_disbursement");

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axios.post(endpoints.loanproducts, data);
      const { status, message } = response.data;
      if (status) {
        toast.success(message);
        reset()
        refresh();
        fetchLoanProducts();
        onClose();
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      <Divider sx={{ borderStyle: 'dashed', backgroundColor: '#800080' }} />
      <Card sx={{ mb: 2, mt: 2, padding: 2, border: '1px solid #800080', borderRadius: 2, boxShadow: 3 }}>
        <CardHeader title="Loan Products" />
        <Divider sx={{ borderStyle: 'dashed', backgroundColor: '#800080' }} />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Loan Period</TableCell>
                <TableCell>Min Loan Limit</TableCell>
                <TableCell>Max Loan Limit</TableCell>
                <TableCell>Interest Rate</TableCell>
                <TableCell>Grace Period</TableCell>
                <TableCell>Late Repayment Fee </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loanProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.loan_period} Days</TableCell>
                  <TableCell>{fCurrency(product.minimum_loan_limit)}</TableCell>
                  <TableCell>{fCurrency(product.maximum_loan_limit)}</TableCell>
                  <TableCell>{fPercent(product.interest_rate)}</TableCell>
                  <TableCell>{product.grace_period} Days</TableCell>
                  <TableCell>{fPercent(product.late_repayment_fee_percentage)} after {product.grace_period} Days </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

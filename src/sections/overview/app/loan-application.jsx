import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios, { endpoints } from "src/utils/axios";
import { toast } from "sonner";
import { useParams } from "react-router";
import { Form } from "src/components/hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { fCurrency } from "src/utils/format-number";

const LoanScheme = zod.object({
  loan_product_id: zod.number().min(1, { message: "Loan Product is required!" }),
  amount: zod.string().min(1, { message: "Amount is required!" }),
  require_guarantor: zod.boolean(),
  guarantors: zod.array(zod.any()).optional(),
  disbursement_account_number: zod.string().min(1, { message: "Disbursement Account Number is required!" }),
  disbursement_channel: zod.string().min(1, { message: "Disbursement Channel is required!" }),
  account_type: zod.string().min(1, { message: "Account Type is required!" }),
  fees_paid_upfront: zod.boolean(),
  customer_loan_period: zod.string().min(1, { message: "Customer Loan Period is required!" }),
  repayment_frequency: zod.string().min(1, { message: "Repayment Frequency is required!" }),
  account_reference: zod.string().optional(),
});


export default function LoanApplication({ refresh }) {
  const [searchId, setSearchId] = useState("");
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id = "" } = useParams();
  const [loanProducts, setLoanProducts] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [formData, setFormData] = useState(null);
  const [guarantors, setGuarantors] = useState([]);

  const methods = useForm({
    resolver: zodResolver(LoanScheme),
    defaultValues: {
      loan_product_id: undefined,
      amount: "",
      require_guarantor: false,
      disbursement_account_number: "",
      disbursement_channel: "",
      account_type: "",
      account_reference: "",
      customer_loan_period: "",
      repayment_frequency: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    register,
    watch,
    setValue,
  } = methods;

  const requireGuarantor = watch("require_guarantor");
  const accountType = watch("account_type");
  const selectedProductId = watch("loan_product_id");
  const selectedProduct = loanProducts.find((p) => p.id === selectedProductId);

  const searchMember = async () => {
    if (!searchId.trim()) {
      toast.error("Please enter a document number.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${endpoints.searchmember}?id_passport=${searchId}`);
      if (response.data.status) {
        setMember(response.data.data);
      } else {
        toast.error(response.data.message);
        setMember(null);
      }
    } catch (error) {
      console.error("Error fetching member:", error);
      toast.error("Failed to fetch member details.");
      setMember(null);
    }
    setLoading(false);
  };

  const fetchLoanProducts = async () => {
    try {
      const response = await axios.get(endpoints.loanproducts);
      if (Array.isArray(response.data.data)) {
        setLoanProducts(response.data.data);
      } else {
        console.error("Expected an array of loan products");
      }
    } catch (error) {
      console.error("Error fetching loan products:", error);
    }
  };

  useEffect(() => {
    fetchLoanProducts();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    if (!member) {
      toast.error("No member selected.");
      return;
    }

    setFormData({ ...data, guarantors });
    setOpenConfirmDialog(true);
  });

  const handleConfirmSubmit = async () => {
    try {
      const response = await axios.post(endpoints.loanapplication(member.id), formData);
      const { status, message } = response.data;

      if (status) {
        toast.success(message);
        reset();
        refresh();
        setMember(null);
        setSearchId("");
        setGuarantors([]);
        setFormData(null);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpenConfirmDialog(false);
    }
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const addGuarantor = () => {
    setGuarantors([...guarantors, { name: "", amount: "", phone_number: "", id_number: "", collateral_type: "", collateral_value: "", relationship: "" }]);
  };

  const removeGuarantor = (indexToRemove) => {
    setGuarantors((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleGuarantorChange = (index, field, value) => {
    const updatedGuarantors = [...guarantors];
    updatedGuarantors[index][field] = value;
    setGuarantors(updatedGuarantors);
  };

  return (
    <>
      <Card sx={{ mt: 2, padding: 2 }}>
        <CardHeader title="Search Member" />
        <Divider sx={{ borderStyle: "dashed", backgroundColor: "#800080" }} />
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Enter Document Number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              fullWidth
            />
            <LoadingButton
              variant="contained"
              sx={{ bgcolor: "#800080" }}
              onClick={searchMember}
              loading={loading}
            >
              Search
            </LoadingButton>
          </Stack>

          {member && (
            <Form methods={methods} onSubmit={onSubmit}>
              <Box gap={3} display="flex" flexDirection="column" sx={{ mt: 3 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
                  <TextField label="Name" value={member.name} fullWidth disabled />
                  <TextField label="Document Number" value={member.document_number} fullWidth disabled />
                  <TextField label="Mobile Number" value={member.mobile_number} fullWidth disabled />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
                  <TextField
                    select
                    label="Select Loan Product"
                    {...register("loan_product_id", { valueAsNumber: true })}
                    error={!!errors.loan_product_id}
                    helperText={errors.loan_product_id?.message}
                    fullWidth
                  >
                    <MenuItem value="">-- Select Product --</MenuItem>
                    {loanProducts.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 1 }}>
                  {selectedProduct && (
                    <Card variant="outlined" sx={{ mt: 1 }}>
                      <CardHeader title={`Details of the Loan Product: ${selectedProduct.name}`} />
                      <Divider sx={{ borderStyle: "dashed", backgroundColor: "#800080" }} />
                      <CardContent>
                        <>
                          <Box gap={3} display="flex" sx={{ mt: 2 }} flexDirection="column">
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 1 }}>
                              <p><strong>Name: </strong>{selectedProduct.name}</p>
                              <p><strong>Min Amount: </strong>{fCurrency(selectedProduct.minimum_loan_limit)}</p>
                              <p><strong>Max Amount: </strong>{fCurrency(selectedProduct.maximum_loan_limit)}</p>
                            </Stack>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
                              <p><strong>Interest Rate: </strong>{selectedProduct.interest_rate}%</p>
                              <p><strong>Repayment Period: </strong>{selectedProduct.loan_period} Days</p>
                            </Stack>
                          </Box>
                        </>
                      </CardContent>
                    </Card>
                  )}
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
                  <TextField
                    label="Amount (Between Min and Max Amount)"
                    type="number"
                    {...register("amount")}
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                    fullWidth
                  />

                  <TextField
                    select
                    label="Disbursement Channel"
                    name="disbursement_channel"
                    {...register("disbursement_channel")}
                    error={!!errors.disbursement_channel}
                    helperText={errors.disbursement_channel?.message}
                    fullWidth

                    InputLabelProps={{ shrink: true }}>
                    <MenuItem value="">Select Disbursement Channel</MenuItem>
                    <MenuItem value="fahari">Fahari Capital</MenuItem>
                    <MenuItem value="0">SasaPay</MenuItem>
                    <MenuItem value="63902">M-Pesa</MenuItem>
                    <MenuItem value="63903">Airtel Money</MenuItem>
                  </TextField>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
                  <TextField
                    select
                    label="Account Type"
                    name="account_type"
                    {...register("account_type")}
                    error={!!errors.account_type}
                    helperText={errors.account_type?.message}
                    fullWidth
                    InputLabelProps={{ shrink: true }}>

                    <MenuItem value="">Select Account Type</MenuItem>
                    <MenuItem value="user">User Account</MenuItem>
                    <MenuItem value="paybill">Paybill</MenuItem>
                    <MenuItem value="till">Till Number</MenuItem>
                  </TextField>

                  {accountType === "paybill" && (
                    <TextField
                      label="Account Reference"
                      {...register("account_reference")}
                      error={!!errors.account_reference}
                      helperText={errors.account_reference?.message}
                      fullWidth
                    />
                  )}

                  <TextField
                    label="Disbursement Account Number"
                    {...register("disbursement_account_number")}
                    error={!!errors.disbursement_account_number}
                    helperText={errors.disbursement_account_number?.message}
                    fullWidth
                  />

                  <TextField
                    label="Customer Loan Period (In Days)"
                    {...register("customer_loan_period")}
                    error={!!errors.customer_loan_period}
                    helperText={errors.customer_loan_period?.message}
                    fullWidth
                  />
                </Stack>

                <Stack direction={{ xs: "column" }} spacing={2} sx={{ mb: 2 }}>
                  <TextField
                    select
                    label="Loan Repayment Frequency"
                    name="repayment_frequency"
                    {...register("repayment_frequency")}
                    error={!!errors.repayment_frequency}
                    helperText={errors.repayment_frequency?.message}
                    fullWidth
                    InputLabelProps={{ shrink: true }}>

                    <MenuItem value="">Select Type</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="bi_annually">Bi-Annually</MenuItem>
                    <MenuItem value="annually">Annually</MenuItem>
                  </TextField>
                </Stack>
               
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...register("require_guarantor")}
                        checked={requireGuarantor}
                        onChange={(e) => {
                          setValue("require_guarantor", e.target.checked);
                          if (!e.target.checked) setGuarantors([]);
                        }}
                      />
                    }
                    label="Require Guarantor?"
                  />

                {requireGuarantor && (
                  <Box>
                    {guarantors.map((guarantor, index) => (
                      <Box key={index} sx={{ mb: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2" gutterBottom>
                            Guarantor {index + 1}
                          </Typography>

                          <Button variant="outlined" size="small" onClick={() => removeGuarantor(index)}>
                            - Remove Guarantor
                          </Button>
                        </Stack>
                        <Divider sx={{ borderStyle: "dashed", backgroundColor: "#800080", mb: 4 }} />

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
                          <TextField
                            select
                            label="Collateral Type"
                            name="collateral_type"
                            value={guarantor.collateral_type}
                            onChange={(e) => handleGuarantorChange(index, "collateral_type", e.target.value)}
                            fullWidth
                          >
                            <MenuItem value="">Select Type</MenuItem>
                            <MenuItem value="savings_account">Savings Account</MenuItem>
                            <MenuItem value="title_deed">Title Deed</MenuItem>
                            <MenuItem value="logbook">Logbook</MenuItem>
                            <MenuItem value="sponsor">Sponsor</MenuItem>
                          </TextField>

                          <TextField
                            label="Collateral Value"
                            name="collateral_value"
                            value={guarantor.collateral_value}
                            onChange={(e) => handleGuarantorChange(index, "collateral_value", e.target.value)}
                            fullWidth
                          />
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
                          <TextField
                            label="Guarantor Name"
                            name="name"
                            value={guarantor.name}
                            onChange={(e) => handleGuarantorChange(index, "name", e.target.value)}
                            fullWidth
                          />

                          <TextField
                            label="Phone Number"
                            name="phone_number"
                            value={guarantor.phone_number}
                            onChange={(e) => handleGuarantorChange(index, "phone_number", e.target.value)}
                            fullWidth
                          />
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                          <TextField
                            label="ID Number"
                            name="id_number"
                            value={guarantor.id_number}
                            onChange={(e) => handleGuarantorChange(index, "id_number", e.target.value)}
                            fullWidth
                          />

                          <TextField
                            label="Amount to Guarantee"
                            name="amount"
                            type="number"
                            value={guarantor.amount}
                            onChange={(e) => handleGuarantorChange(index, "amount", e.target.value)}
                            fullWidth
                          />

                          <TextField
                            label="Relationship"
                            name="relationship"
                            value={guarantor.relationship}
                            onChange={(e) => handleGuarantorChange(index, "relationship", e.target.value)}
                            fullWidth
                          />
                        </Stack>
                      </Box>
                    ))}

                    <LoadingButton size="small" onClick={addGuarantor} variant="outlined">
                      + Add Guarantor
                    </LoadingButton>
                  </Box>
                )}
              </Box>

              <CardActions sx={{ mt: 2 }}>
                <LoadingButton
                  variant="contained"
                  sx={{ bgcolor: "#800080" }}
                  type="submit"
                  loading={isSubmitting}
                >
                  Submit Details
                </LoadingButton>
              </CardActions>
            </Form>
          )}
        </CardContent>
      </Card>

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog} fullWidth maxWidth="sm">
        <DialogTitle>Confirm Loan Application Details</DialogTitle>
        <Divider sx={{ mb: 2, backgroundColor: "#800080" }} />
        <DialogContent>
          {formData && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography><strong>Loan Product:</strong> {loanProducts.find(p => p.id === formData.loan_product_id)?.name || "N/A"}</Typography>
              <Typography><strong>Amount:</strong> KES {formData.amount}</Typography>
              <Typography><strong>Require Guarantor:</strong> {formData.require_guarantor ? "Yes" : "No"}</Typography>
              <Typography><strong>Disbursement Account Number:</strong> {formData.disbursement_account_number}</Typography>
              <Typography><strong>Disbursement Channel:</strong> {formData.disbursement_channel}</Typography>
              <Typography><strong>Customer Loan Period:</strong> {formData.customer_loan_period} Days</Typography>
              <Typography><strong>Account Type:</strong> {formData.account_type}</Typography>
              <Typography><strong>Fees Paid Upfront:</strong> {formData.fees_paid_upfront ? "Yes" : "No"}</Typography>
              <Divider sx={{ mb: 2, backgroundColor: "#800080" }} />
              {formData.require_guarantor && formData.guarantors.length > 0 && (
                <>
                  <Typography><strong>Guarantor Details:</strong></Typography>
                  <Divider sx={{ mb: 2, backgroundColor: "#800080" }} />
                  {formData.guarantors.map((guarantor, index) => (
                    <Box key={index} display="flex" flexDirection="column" gap={2}>
                      <Typography><strong>Guarantor Names:</strong> {guarantor.name}</Typography>
                      <Typography><strong>Collateral Type:</strong> {guarantor.collateral_type}</Typography>
                      <Typography><strong>Collateral Value:</strong> {guarantor.collateral_value}</Typography>
                      <Typography><strong>Amount to Guarantee: KES</strong> {guarantor.amount}</Typography>
                      <Typography><strong>Phone Number: </strong>{guarantor.phone_number}</Typography>
                      <Typography><strong>ID Number:</strong> {guarantor.id_number}</Typography>
                      <Typography><strong>Relationship:</strong> {guarantor.relationship}</Typography>
                      <Divider sx={{ mb: 2, backgroundColor: "#800080" }} />
                    </Box>
                  ))}
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <LoadingButton onClick={handleConfirmSubmit} sx={{ bgcolor: "#800080" }} variant="contained">
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

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
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm, useFormContext, Controller } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import axios, { endpoints } from 'src/utils/axios';
import { Field, Form } from 'src/components/hook-form';

const BusinessMemberSchema = zod.object({
  institution_name: zod.string().min(1, 'Institution name is required'),
  institution_type: zod.string().min(1, 'Institution type is required'),
  registration_number: zod.string().min(1, 'Registration number is required'),
  date_of_registration: zod.string().min(1, 'Date of registration is required'),
  postal_address: zod.string().min(1, 'Postal address is required'),
  physical_address: zod.string().min(1, 'Physical address is required'),
  town: zod.string().min(1, 'Town is required'),
  county: zod.string().min(1, 'County is required'),
  mobile_number: zod.string().min(1, 'Phone number is required'),
  email: zod.string().email('Enter a valid email'),
  website: zod.string().optional(),
  kra_pin: zod.string().optional(),
  annual_income: zod.string().optional(),
  annual_expenses: zod.string().optional(),
  net_income: zod.string().optional(),
  bank_name: zod.string().optional(),
  bank_account_name: zod.string().optional(),
  bank_account_number: zod.string().optional(),
  financial_statement: zod.any().optional(),
  business_registration_certificate: zod.any().optional(),
  kra_pin_certificate: zod.any().optional(),
  cr_12_certificate: zod.any().optional(),
  representatives: zod.array(zod.object({
    full_name: zod.string().min(1, 'Full name required'),
    position: zod.string().min(1, 'Position required'),
    id_passport: zod.string().min(1, 'ID/Passport required'),
    phone_number: zod.string().min(1, 'Phone number required'),
    email: zod.string().email('Valid email required')
  }))
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
            style={{ marginTop: 8}}
          />
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}

export default function AddMemberBusiness({ refresh }) {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [formData, setFormData] = useState(null);
  const [success, setSuccess] = useState(false);
  const [directors, setDirectors] = useState([]);

  const methods = useForm({
    resolver: zodResolver(BusinessMemberSchema),
    defaultValues: {
      institution_name: "",
      institution_type: "",
      registration_number: "",
      date_of_registration: "",
      postal_address: "",
      physical_address: "",
      town: "",
      county: "",
      mobile_number: "",
      email: "",
      website: "",
      kra_pin: "",
      annual_income: "",
      annual_expenses: "",
      net_income: "",
      bank_name: "",
      bank_account_name: "",
      bank_account_number: "",
      financial_statement: null,
      business_registration_certificate: null,
      kra_pin_certificate: null,
      cr_12_certificate: null,
      representatives: []
    }
  });

  const { handleSubmit, reset, setValue, getValues, formState: { isSubmitting } } = methods;

  const onSubmit = (data) => {
    data.representatives = directors;
    setFormData(data);
    setOpenConfirmDialog(true);
  };

  const handleConfirmAddMember = async () => {
    if (!formData) return;

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'representatives' && Array.isArray(value)) {
          value.forEach((director, iter) => {
            Object.entries(director).forEach(([dkey, dvalue]) => {
              payload.append(`representatives[${iter}][${dkey}]`, dvalue);
            });
          });
        } else if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });

      const res = await axios.post(endpoints.addcorporatemembers, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.status) {
        toast.success(res.message || "Member added successfully");
        setSuccess(true);
        setTimeout(() => {
          refresh?.();
          reset();
          setSuccess(false);
        }, 1000);
      } else {
        toast.error(res.message || "Failed to add member");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOpenConfirmDialog(false);
    }
  };

  const addDirector = () => {
    setDirectors([...directors, {
      full_name: "",
      position: "",
      id_passport: "",
      phone_number: "",
      email: ""
    }]);
  };
  const removeDirector = (indexToRemove) => {
    setDirectors((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleDirectorChange = (index, field, value) => {
    const updated = [...directors];
    updated[index][field] = value;
    setDirectors(updated);
  };

  if (success) {
    return (
      <Card sx={{ p: 3, backgroundColor: '#f0fff0' }}>
        <CardHeader title="🎉 Success" />
        <CardContent>
          <Typography variant="h6" color="success.main">
            Application was successful!
          </Typography>
          <Button
            sx={{ mt: 2, bgcolor: '#800080' }}
            variant="contained"
            onClick={() => setSuccess(false)}
          >
            OnBoard
          </Button>
        </CardContent>
      </Card>
    );
  }


  return (
    <FormProvider {...methods}>
      <Card sx={{ mb: 2, p: 2 }}>
        <CardHeader title="Applicant Details" />
        <Divider sx={{ mb: 2, backgroundColor: '#800080' }} />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2}>
                <Field.Text name="institution_name" label="Institution Name" />
                <Field.Select
                  name="institution_type"
                  label="Institution Type"
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="">Select Institution Type</MenuItem>
                  <MenuItem value="individual">Individual Company</MenuItem>
                  <MenuItem value="llc">Private LimitedCompany</MenuItem>
                  <MenuItem value="church">Church</MenuItem>
                  <MenuItem value="ngo">NGO</MenuItem>
                  <MenuItem value="chama">Chama</MenuItem>
                  <MenuItem value="club">Club</MenuItem>
                  <MenuItem value="other">Other(Specify)</MenuItem>
                </Field.Select>
              </Stack>

              <Stack direction="row" spacing={2}>
                <Field.Text name="registration_number" label="Registration Number" />
                <Field.Text name="date_of_registration" label="Registration Date" />
                <Field.Text name="kra_pin" label="KRA Pin" />
              </Stack>

              <Stack direction="row" spacing={2}>
                <Field.Text name="physical_address" label="Physical Address" />
                <Field.Text name="postal_address" label=" Postal Address" />
                <Field.Text name="town" label="Town/City" />
                <Field.Text name="county" label="County" />
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
                <Field.Text name="website" label="Website (If Any)" />
              </Stack>

              <Divider sx={{ mb: 2, backgroundColor: '#800080' }} />
              <Typography variant="h6" fontWeight="bold">Financial Details</Typography>
              <Stack direction="row" spacing={2}>
                <Field.Text name="annual_income" label="Annual Income/Revenue" />
                <Field.Text name="annual_expenses" label="Annual Expenses" />
                <Field.Text name="net_income" label="Net Income" />
              </Stack>

              <Divider sx={{ mb: 2, backgroundColor: '#800080' }} />
              <Typography variant="h6" fontWeight="bold">Bank Details</Typography>

              <Stack direction="row" spacing={2}>
                <Field.Text name="bank_name" label="Bank Name" />
                <Field.Text name="bank_account_name" label="Account Name" />
                <Field.Text name="bank_account_number" label="Account Number" />
              </Stack>
              <Divider sx={{ mb: 2, backgroundColor: '#800080' }} />

              <Typography variant="h6" fontWeight="bold">Upload Details</Typography>
              <Stack direction="row" spacing={2}>
                <Divider sx={{ mb: 2, backgroundColor: '#800080' }} />
                <FileInput name="financial_statement" label="Financial Statement" accept="image/*" />
                <FileInput name="business_registration_certificate" label="Reg Cert" accept="image/*" />
                <FileInput name="kra_pin_certificate" label="KRA Cert" accept="image/*" />
                <FileInput name="cr_12_certificate" label="CR12" accept="image/*" />
              </Stack>

              <Divider sx={{ mb: 2, backgroundColor: '#800080' }} />
              <Box>
                <>
                  {directors.map((director, index) => (
                    <>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">
                          Official Representatives {index + 1}
                        </Typography>

                        <Box key={index} sx={{ mb: 2 }}>
                          <Button variant="outlined" size="small" onClick={() => removeDirector(index)}>- Remove</Button>
                        </Box>
                      </Stack>


                      <Stack key={index} direction="row" spacing={2} sx={{ mt: 2 }}>
                        <TextField
                          label="Full Names"
                          value={director.full_name}
                          onChange={(e) => handleDirectorChange(index, "full_name", e.target.value)}
                          fullWidth
                        />
                        <TextField
                          label="Position"
                          value={director.position}
                          onChange={(e) => handleDirectorChange(index, "position", e.target.value)}
                          fullWidth
                        />

                        <TextField
                          label="ID/Passport No"
                          type="number"
                          value={director.id_passport}
                          onChange={(e) => handleDirectorChange(index, "id_passport", e.target.value)}
                          fullWidth
                        />
                        <TextField
                          label="Phone Number"
                          type="number"
                          value={director.phone_number}
                          onChange={(e) => handleDirectorChange(index, "phone_number", e.target.value)}
                          fullWidth
                        />
                        <TextField
                          label="Email"
                          value={director.email}
                          onChange={(e) => handleDirectorChange(index, "email", e.target.value)}
                          fullWidth
                        />
                      </Stack>
                    </>
                  ))}
                  <Button onClick={addDirector} sx={{ mt: 2 }} variant="outlined">
                    + Add Official Representatives
                  </Button>
                </>
              </Box>

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
        <DialogTitle>Confirm Business Details</DialogTitle>
        <Divider sx={{ mb: 2, backgroundColor: '#800080' }} />
        <DialogContent>
          <Stack spacing={2}>
            <Typography><strong>Institution Name:</strong> {formData?.institution_name}</Typography>
            <Typography><strong>Type:</strong> {formData?.institution_type}</Typography>
            <Typography><strong>Reg. No.:</strong> {formData?.registration_number}</Typography>
            <Typography><strong>Reg. Date:</strong> {formData?.date_of_registration}</Typography>
            <Typography><strong>Mobile:</strong> {formData?.mobile_number}</Typography>
            <Typography><strong>Email:</strong> {formData?.email}</Typography>
            <Typography><strong>Physical Address:</strong> {formData?.physical_address}</Typography>
            <Typography><strong>Postal Address:</strong> {formData?.postal_address}</Typography>
            <Typography><strong>Town:</strong> {formData?.town}</Typography>
            <Typography><strong>County:</strong> {formData?.county}</Typography>
            <Typography><strong>Website:</strong> {formData?.website || 'N/A'}</Typography>
            <Typography><strong>KRA Pin:</strong> {formData?.kra_pin || 'N/A'}</Typography>

            <Divider />
            <Typography variant="subtitle1"><strong>Official Representatives</strong></Typography>
            {formData?.representatives?.map((rep, i) => (
              <Box key={i}>
                <Typography><strong>Full Name:</strong> {rep.full_name}</Typography>
                <Typography><strong>Position:</strong> {rep.position}</Typography>
                <Typography><strong>ID/Passport:</strong> {rep.id_passport}</Typography>
                <Typography><strong>Phone:</strong> {rep.phone_number}</Typography>
                <Typography><strong>Email:</strong> {rep.email}</Typography>
                <Divider />
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
          <LoadingButton
            loading={isSubmitting}
            onClick={handleConfirmAddMember}
            variant="contained"
            sx={{ bgcolor: '#800080' }}
          >
            OnBoard Member
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}

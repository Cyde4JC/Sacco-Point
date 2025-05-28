import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { endpoints } from 'src/utils/axios';
import { toast } from 'sonner';

export const BranchScheme = zod.object({
  name: zod.string().min(1, { message: 'Branch Name is required!' }),
  location: zod.string().min(1, { message: 'Location is required!' }),
});

export default function AppBranches({ refresh }) {
  const [branches, setBranches] = useState([]);  

  const fetchBranches = async () => {
    try {
      const response = await axios.get(endpoints.branches);
      const data = response.data?.data;

      if (Array.isArray(data)) {
        setBranches(data);  
      } else {
        console.error('Error: Data is not in the expected format');
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const methods = useForm({
    resolver: zodResolver(BranchScheme),
    defaultValues: {
      name: '',
      location: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axios.post(endpoints.branches, data);
      const { status, message } = response.data;
      if (status) {
        toast.success(message);
        reset();
        refresh();  
        fetchBranches();  
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      <Card sx={{ mt: 2, padding: 2 }}>
        <CardHeader title="Add Branch" />
        <Divider sx={{ borderStyle: 'dashed', backgroundColor: '#800080' }} />
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              <Box gap={3} display="flex" sx={{ mt: 2 }} flexDirection="column">
                <Stack direction="row" spacing={2}>
                  <Controller
                    name="name"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Branch Name"
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Controller
                    name="location"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Location"
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
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
                  Add a Branch
                </LoadingButton>
              </CardActions>
            </form>
          </FormProvider>
        </CardContent>
      </Card>

      <Divider sx={{ mt: 2, borderStyle: 'dashed', backgroundColor: '#800080' }} />

      <Card
        sx={{
          mb: 2,
          mt: 2,
          padding: 2,
          border: '1px solid #800080',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <CardHeader title="Branches" />
        <Divider sx={{ borderStyle: 'dashed', backgroundColor: '#800080' }} />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Branch Name</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>{branch.id}</TableCell>
                  <TableCell>{branch.name}</TableCell>
                  <TableCell>{branch.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

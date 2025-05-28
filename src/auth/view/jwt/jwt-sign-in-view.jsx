import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { signInWithPassword, validateOtp } from '../../context/jwt';

// ----------------------------------------------------------------------

export const SignInSchema = zod.object({
  username: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  otp: zod.string().default(''),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(4, { message: 'Password must be at least 4 characters!' }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();

  const { checkUserSession } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const password = useBoolean();

  const defaultValues = {
    username: '',
    password: '',
    otp:''
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const [showCode, setShowCode] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (showCode) {
        const { status, message } = await validateOtp(data);

        if (status) {
          setSuccessMsg(message);

          await checkUserSession?.();
          router.refresh();
        } else {
          setErrorMsg(message);
        }

        setShowCode(status);
      } else {
        const { status, message } = await signInWithPassword(data);

        if (status) {
          setSuccessMsg(message);
        } else {
          setErrorMsg(message);
        }

        setShowCode(status);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      {/* <Field.Text name="username" label="Username" InputLabelProps={{ shrink: true }} /> */}
      {(showCode && (
        <Field.Text
          name="otp"
          label="Authorization Code"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <LoadingButton
                  fullWidth
                  color="inherit"
                  size="small"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  loadingIndicator="Sign in..."
                >
                  Validate
                </LoadingButton>
              </InputAdornment>
            ),
          }}
        />
      )) || (
        <>
          <Field.Phone name="username" label="Phone number" InputLabelProps={{ shrink: true }} />

          <Box gap={1.5} display="flex" flexDirection="column">
            <Link
              component={RouterLink}
              href="#"
              variant="body2"
              color="inherit"
              sx={{ alignSelf: 'flex-end' }}
            >
              Forgot password?
            </Link>

            <Field.Text
              name="password"
              label="Password"
              placeholder="6+ characters"
              type={password.value ? 'text' : 'password'}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle} edge="end">
                      <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </>
      )}

      {!showCode && (
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          loadingIndicator="Sign in..."
        >
          Sign in
        </LoadingButton>
      )}
    </Box>
  );

  return (
    <>
      <FormHead
        title="Sign in to your account"
        // description={
        //   <>
        //     {/* {`Don’t have an account? `}
        //     <Link component={RouterLink} href={paths.auth.jwt.signUp} variant="subtitle2">
        //       Get started
        //     </Link> */}

        //   </>
        // }
        sx={{ textAlign: { xs: 'center', md: 'left', display: showCode ? 'none' : '' } }}
      />

      {!!successMsg && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      )}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}

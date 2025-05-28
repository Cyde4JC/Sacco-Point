import axios, { endpoints } from 'src/utils/axios';

import { setAccount, setMerchant, setSession } from './utils';
import { STORAGE_KEY } from './constant';

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ username, password }) => {
  try {
    const params = { username, password };

    const res = await axios.post(endpoints.auth.signIn, params);

    // const { status, message} = res.data;

    return res.data;
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

export const validateOtp = async ({ username, password, otp }) => {
  try {
    const params = { username, password, otp };

    const res = await axios.post(endpoints.auth.validateOtp, params);

    const { status, message, ...others } = res.data;

    if (!status) {
      throw new Error(message);
    } else {
      setSession(others?.access_token);
      setMerchant(others.data);
      setAccount(others.data);
    }

    return res.data
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ email, password, firstName, lastName }) => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(STORAGE_KEY, accessToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

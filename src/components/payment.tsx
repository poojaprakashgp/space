import React, { useState, useEffect } from 'react';
import { TextField, Checkbox, FormControlLabel, Button, Box, Grid, Typography } from '@mui/material';

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    sameAsShipping: true,
  });

  const [errors, setErrors] = useState({
    cardNumber: false,
    expiry: false,
    cvv: false,
    firstName: false,
    lastName: false,
  });

  const [isCompleteEnabled, setIsCompleteEnabled] = useState(false);

  useEffect(() => {
    const isValidCard = /^\d{4} \d{4} \d{4} \d{4}$/.test(formData.cardNumber);
    const isValidExpiry = /^(0[1-9]|1[0-2])\/\d{4}$/.test(formData.expiry);
    const isValidCVV = /^\d{3}$/.test(formData.cvv);
    const isValidFirst = formData.firstName.trim().length > 0;
    const isValidLast = formData.lastName.trim().length > 0;

    setErrors({
      cardNumber: !isValidCard,
      expiry: !isValidExpiry,
      cvv: !isValidCVV,
      firstName: !isValidFirst,
      lastName: !isValidLast,
    });

    setIsCompleteEnabled(isValidCard && isValidExpiry && isValidCVV && isValidFirst && isValidLast);
  }, [formData]);

  const handleChange = (field) => (e) => {
    let value = e.target.value;
    if (field === 'cardNumber') {
      value = value.replace(/[^\d]/g, '').slice(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    if (field === 'cvv') {
      value = value.replace(/[^\d]/g, '').slice(0, 3);
    }
    if (field === 'expiry') {
      value = value.replace(/[^\d]/g, '').slice(0, 6);
      if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Payment
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.sameAsShipping}
            onChange={(e) => setFormData({ ...formData, sameAsShipping: e.target.checked })}
          />
        }
        label="Same as shipping address"
      />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="First Name*"
            fullWidth
            value={formData.firstName}
            onChange={handleChange('firstName')}
            error={errors.firstName}
            helperText={errors.firstName ? 'First name required' : ''}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Last Name*"
            fullWidth
            value={formData.lastName}
            onChange={handleChange('lastName')}
            error={errors.lastName}
            helperText={errors.lastName ? 'Last name required' : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Card number*"
            fullWidth
            value={formData.cardNumber}
            onChange={handleChange('cardNumber')}
            error={errors.cardNumber}
            helperText={errors.cardNumber ? 'Enter a valid 16-digit card number' : ''}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Expiration date*"
            fullWidth
            value={formData.expiry}
            onChange={handleChange('expiry')}
            error={errors.expiry}
            helperText={errors.expiry ? 'MM/YYYY' : ''}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="CVV*"
            fullWidth
            value={formData.cvv}
            onChange={handleChange('cvv')}
            error={errors.cvv}
            helperText={errors.cvv ? '3-digit CVV' : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={!isCompleteEnabled}
          >
            Complete
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}



'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Grid,
} from '@mui/material';

const PaymentForm: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiry, setExpiry] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [sameAsShipping, setSameAsShipping] = useState<boolean>(true);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    const cardNumberDigits = cardNumber.replace(/\s/g, '');
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;

    const isValid =
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      /^\d{3}$/.test(cvv) &&
      cardNumberDigits.length === 16 &&
      expiryRegex.test(expiry);

    setIsFormValid(isValid);
  }, [firstName, lastName, cardNumber, expiry, cvv]);

  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 6);
    if (value.length >= 3) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiry(value);
  };

  const handleSubmit = () => {
    alert('Payment Submitted!');
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        p: 4,
        border: '1px solid #ccc',
        borderRadius: 2,
        mt: 4,
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Payment
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={sameAsShipping}
            onChange={(e) => setSameAsShipping(e.target.checked)}
          />
        }
        label="Same as shipping address"
      />

      <Grid container spacing={2} mt={1}>
        <Grid item xs={6}>
          <TextField
            label="First name*"
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Last name*"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Card number*"
            fullWidth
            value={cardNumber}
            onChange={handleCardInput}
            placeholder="1234 5678 9012 3456"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Expiration date*"
            fullWidth
            value={expiry}
            onChange={handleExpiryInput}
            placeholder="MM/YYYY"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="CVV*"
            fullWidth
            inputProps={{ maxLength: 3 }}
            value={cvv}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 3);
              setCvv(val);
            }}
            placeholder="123"
          />
        </Grid>
      </Grid>

      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          Complete
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentForm;



No overload matches this call.
  Overload 1 of 2, '(props: { component: ElementType<any, keyof IntrinsicElements>; } & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<...> & Omit<...>): Element | null', gave the following error.
    Property 'component' is missing in type '{ children: Element; item: true; xs: number; }' but required in type '{ component: ElementType<any, keyof IntrinsicElements>; }'.
  Overload 2 of 2, '(props: DefaultComponentProps<GridTypeMap<{}, "div">>): Element | null', gave the following error.
    Type '{ children: Element; item: true; xs: number; }' is not assignable to type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.
      Property 'item' does not exist on type 'IntrinsicAttributes & GridBaseProps & { sx?: SxProps<Theme> | undefined; } & SystemProps<Theme> & Omit<...>'.ts(2769)


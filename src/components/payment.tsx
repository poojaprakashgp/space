'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

export default function PaymentForm() {
  const [sameAsShipping, setSameAsShipping] = useState(false);

  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    suite: '',
    zipCode: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
  });

  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiration: '',
    cvv: '',
  });

  const handleBillingAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBillingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Same as Shipping:', sameAsShipping);
    console.log('Billing Address:', billingAddress);
    console.log('Billing Info:', billingInfo);

    // Use Next.js 15 Server Actions here (mock example)
    // await submitPayment({ billingAddress, billingInfo });
    alert('Payment submitted successfully!');
  };

  return (
    <Box component="main" sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h5" component="h1" tabIndex={0}>
        Payment & Billing Information
      </Typography>

      <form onSubmit={handleSubmit} aria-label="Payment form">
        <FormControlLabel
          control={
            <Checkbox
              checked={sameAsShipping}
              onChange={(e) => setSameAsShipping(e.target.checked)}
              inputProps={{ 'aria-label': 'Same as shipping address' }}
            />
          }
          label="Same as shipping address"
        />

        {/* Billing Address Section */}
        <Box mt={4}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" id="billing-address-heading">
              Billing Address
            </FormLabel>

            <Grid container spacing={2} aria-labelledby="billing-address-heading" role="group">
              {[
                ['First name', 'firstName'],
                ['Last name', 'lastName'],
                ['Address', 'address'],
                ['Suite/Apt', 'suite'],
                ['ZIP Code', 'zipCode'],
                ['City', 'city'],
                ['State', 'state'],
                ['Country', 'country'],
                ['Phone', 'phone'],
                ['Email', 'email'],
              ].map(([label, name]) => (
                <Grid
                  item
                  xs={12}
                  sm={name === 'firstName' || name === 'lastName' ? 6 : 12}
                  key={name}
                >
                  <TextField
                    fullWidth
                    id={`billing-${name}`}
                    name={name}
                    label={label}
                    value={(billingAddress as any)[name]}
                    onChange={handleBillingAddressChange}
                    inputProps={{
                      'aria-label': label,
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </FormControl>
        </Box>

        {/* Billing Info Section */}
        <Box mt={4}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" id="billing-info-heading">
              Billing Information
            </FormLabel>

            <Grid container spacing={2} aria-labelledby="billing-info-heading" role="group">
              {[
                ['First name', 'firstName'],
                ['Last name', 'lastName'],
                ['Card Number', 'cardNumber'],
                ['Expiration (MM/YYYY)', 'expiration'],
                ['CVV', 'cvv'],
              ].map(([label, name]) => (
                <Grid item xs={12} sm={name === 'cvv' ? 6 : 12} key={name}>
                  <TextField
                    fullWidth
                    id={`billingInfo-${name}`}
                    name={name}
                    label={label}
                    value={(billingInfo as any)[name]}
                    onChange={handleBillingInfoChange}
                    inputProps={{
                      'aria-label': label,
                      inputMode: name === 'cardNumber' || name === 'cvv' ? 'numeric' : 'text',
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </FormControl>
        </Box>

        <Box mt={4}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            aria-label="Complete Payment"
          >
            Complete Payment
          </Button>
        </Box>
      </form>
    </Box>
  );
}

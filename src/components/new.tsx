'use client';

import React, { useState } from 'react';
import './form.scss';
import InputField from '@/common/atoms/InputField';
import Checkbox from '@/common/atoms/Checkbox';
import SubmitButton from '@/common/atoms/SubmitButton';

export default function PaymentPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [isValid, setIsValid] = useState(false);

  const validate = (data: typeof formData) => {
    const { firstName, lastName, cardNumber, expiryDate, cvv } = data;
    return (
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      /^\d{4} \d{4} \d{4} \d{4}$/.test(cardNumber) &&
      /^(0[1-9]|1[0-2])\/\d{4}$/.test(expiryDate) &&
      /^\d{3}$/.test(cvv)
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let v = value;

    if (name === 'cardNumber') {
      v = v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    }
    if (name === 'expiryDate') {
      v = v.replace(/\D/g, '').slice(0, 6).replace(/(\d{2})(\d{0,4})/, (_, m, y) => (y ? `${m}/${y}` : m));
    }
    if (name === 'cvv') {
      v = v.replace(/\D/g, '').slice(0, 3);
    }

    const updated = { ...formData, [name]: v };
    setFormData(updated);
    setIsValid(validate(updated));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) alert('Payment complete!');
  };

  return (
    <form className="payment-form" onSubmit={onSubmit} aria-label="Payment form">
      <h2 className="payment-title">Payment</h2>

      <Checkbox
        label="Same as shipping address"
        checked={true}
        onChange={() => console.log('her')}
      />

      <div className="row">
        <InputField
          label="First Name"
          placeholder="First name"
          name="firstName"
          onChange={handleChange}
          value={formData.firstName}
          required
        />
        <InputField
          label="Last Name"
          placeholder="Last name"
          name="lastName"
          onChange={handleChange}
          value={formData.lastName}
          required
        />
      </div>

      <InputField
        label="Card number"
        placeholder="1234 1234 1234 1234"
        name="cardNumber"
        onChange={handleChange}
        value={formData.cardNumber}
        required
      />

      <div className="row">
        <InputField
          label="Expiration date"
          placeholder="MM/YYYY"
          name="expiryDate"
          onChange={handleChange}
          value={formData.expiryDate}
          required
        />
        <InputField
          label="CVV"
          placeholder="123"
          name="cvv"
          onChange={handleChange}
          value={formData.cvv}
          required
        />
      </div>

      <div className="form__input-wrapper">
        <SubmitButton
          className={`submit-btn ${isValid ? 'enabled' : ''}`}
          disabled={!isValid}
        >
          Complete
        </SubmitButton>
      </div>
    </form>
  );
}

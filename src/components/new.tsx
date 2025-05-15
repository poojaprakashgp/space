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


.payment {
  &__page {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    background: #f5f5f5;
    min-height: 100vh;
  }

  &__form {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 500px;
  }

  &__title {
    font-size: 1.5rem;
    margin-bottom: 24px;
    color: #111;
  }

  &__checkbox {
    font-size: 14px;
    font-family: "GalanoGrotesque-Medium", sans-serif;

    &-flex {
      display: flex;
      align-items: center;
    }

    &-group {
      grid-template-columns: repeat(1, minmax(0, 1fr));
      width: 1rem;
      height: 1rem;
      display: grid;
      margin-right: 8px;

      input:checked {
        background: #1a1c35;
        border-color: #1a1c35;
      }

      svg {
        stroke: #fff;
        justify-self: center;
        align-self: center;
        width: 0.875rem;
        height: 0.875rem;
        grid-row-start: 1;
        grid-column-start: 1;
        pointer-events: none;
        display: block;
        vertical-align: middle;
        overflow-clip-margin: content-box;
        overflow: hidden;
      }
    }

    &-input {
      margin: 0;
      background: #fff;
      border: 1px solid #d1d5dc;
      border-radius: 0.25rem;
      appearance: none;
      width: 1.25rem;
      height: 1.25rem;
      grid-row-start: 1;
      grid-column-start: 1;
    }

    &-bold {
      font-weight: 700;
      font-family: "GalanoGrotesque-Bold", sans-serif;
    }
  }

  &__row {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
  }

  &__submit-btn {
    width: 100%;
    padding: 12px;
    margin-top: 16px;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    background: #ccc;
    color: #777;
    cursor: not-allowed;
    transition: background 0.2s;

    &--enabled {
      background: #d32f2f;
      color: #fff;
      cursor: pointer;

      &:hover {
        background: #a50000;
      }
    }
  }

  &__input-wrapper {
    margin-top: 1rem;
  }
}


const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  let v = value;

  switch (name) {
    case 'firstName':
    case 'lastName':
      // Allow only letters, spaces, and limit to 50 chars
      v = v.replace(/[^A-Za-z\s]/g, '').slice(0, 50);
      break;

    case 'cardNumber':
      // Allow only digits, auto format to 1234 1234 1234 1234
      v = v.replace(/\D/g, '').slice(0, 16);
      v = v.replace(/(.{4})/g, '$1 ').trim();
      break;

    case 'expiryDate':
      // Allow only MM/YYYY format
      v = v.replace(/\D/g, '').slice(0, 6);
      v = v.replace(/(\d{2})(\d{0,4})/, (_, m, y) => (y ? `${m}/${y}` : m));
      break;

    case 'cvv':
      // Allow only 3 digits
      v = v.replace(/\D/g, '').slice(0, 3);
      break;
  }

  setFormData((f) => ({ ...f, [name]: v }));
};



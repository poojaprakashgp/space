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



.payment-form {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 500px;
  padding: 2rem;

  &__title {
    font-size: 1.5rem;
    margin-bottom: 24px;
    color: #111;
  }

  &__input-wrapper {
    margin-top: 1rem;
  }

  &__submit-btn {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    background: #ccc;
    color: #777;
    cursor: not-allowed;
    transition: background 0.2s;

    &.enabled {
      background: #1a1c35;
      color: #fff;
      cursor: pointer;

      &:hover {
        background: darken(#1a1c35, 10%);
      }
    }
  }

  &__row {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
  }
}
 className={`submit-btn ${isValid ? 'enabled' : ''}`}


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
      gap: 8px; // space between checkbox and label text
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

  &__input-wrapper {
    flex: 1; // make inputs grow evenly
    min-width: 0; // prevent overflow
    margin-top: 1rem;
  }

  .input-section {
    &__label {
      display: block;
      font-weight: 500;
      font-size: 12px;
      margin-bottom: 6px;
    }

    &__input {
      width: 100%;
      padding: 10px 12px;
      font-size: 14px;
      border-radius: 6px;
      border: 1.5px solid #e2e2e2;
      transition: border-color 0.3s ease;

      &:focus {
        border-color: #ff5c5c;
        outline: none;
      }
    }
  }

  &__submit-btn {
    width: 100%;
    padding: 12px;
    margin-top: 16px;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 20px;
    background: #ddd;
    color: #555;
    cursor: not-allowed;
    transition: background-color 0.3s ease;

    &:enabled {
      background-color: #ff5c5c;
      color: white;
      cursor: pointer;

      &:hover {
        background-color: #a50000;
      }
    }
  }
}


// pages/index.tsx
"use client";

import { useState, useEffect } from "react";
import styles from "../styles/payment.module.scss";
import InputField from "../components/InputField";
import Checkbox from "../components/Checkbox";

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cardNumber: "",
    expirationDate: "",
    cvv: ""
  });

  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    cardNumber: false,
    expirationDate: false,
    cvv: false
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const cardNumberValid = /^\d{4} \d{4} \d{4} \d{4}$/.test(formData.cardNumber);
    const expirationValid = /^(0[1-9]|1[0-2])\/(\d{4})$/.test(formData.expirationDate);
    const cvvValid = /^\d{3}$/.test(formData.cvv);
    const firstNameValid = formData.firstName.trim().length > 0;
    const lastNameValid = formData.lastName.trim().length > 0;

    setFormErrors({
      firstName: !firstNameValid,
      lastName: !lastNameValid,
      cardNumber: !cardNumberValid,
      expirationDate: !expirationValid,
      cvv: !cvvValid
    });

    setIsValid(
      cardNumberValid && expirationValid && cvvValid && firstNameValid && lastNameValid
    );
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value.replace(/[^\d]/g, "").replace(/(.{4})/g, "$1 ").trim();
    }

    setFormData({
      ...formData,
      [name]: formattedValue
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    alert("Payment submitted!");
  };

  return (
    <main className={styles["payment__page"]}>
      <form onSubmit={handleSubmit} className={styles["payment__form"]} aria-label="Payment Form">
        <h1 className={styles["payment__title"]}>Payment</h1>

        <Checkbox
          checked={sameAsShipping}
          onChange={setSameAsShipping}
          label="Same as shipping address"
          className={styles["payment__checkbox-flex"]}
        />

        <div className={styles["payment__row"]}>
          <div className={styles["payment__first-name"]}>
            <InputField
              label="First Name"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className={formErrors.firstName ? styles.inputError : ""}
            />
          </div>
          <div className={styles["payment__last-name"]}>
            <InputField
              label="Last Name"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className={formErrors.lastName ? styles.inputError : ""}
            />
          </div>
        </div>

        <InputField
          label="Card number"
          name="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={formData.cardNumber}
          onChange={handleInputChange}
          required
          maxLength={19}
          className={formErrors.cardNumber ? styles.inputError : ""}
        />

        <div className={styles["payment__row"]}>
          <InputField
            label="Expiration date"
            name="expirationDate"
            placeholder="MM/YYYY"
            value={formData.expirationDate}
            onChange={handleInputChange}
            required
            maxLength={7}
            className={formErrors.expirationDate ? styles.inputError : ""}
          />
          <InputField
            label="CVV"
            name="cvv"
            placeholder="123"
            value={formData.cvv}
            onChange={handleInputChange}
            required
            maxLength={3}
            className={formErrors.cvv ? styles.inputError : ""}
          />
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={
            isValid
              ? `${styles["payment__submit-btn"]} ${styles["payment__submit-btn--enabled"]}`
              : styles["payment__submit-btn"]
          }
        >
          Complete
        </button>
      </form>
    </main>
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
      gap: 8px;
      margin-bottom: 1rem;
    }

    &-group {
      display: grid;
      width: 1rem;
      height: 1rem;
      grid-template-columns: repeat(1, minmax(0, 1fr));
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

  &__first-name {
    flex: 1;
  }

  &__last-name {
    flex: 2;
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

  .input-section {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;

    &__label {
      font-weight: 500;
      font-size: 12px;
      margin-bottom: 6px;
    }

    &__input {
      padding: 10px 12px;
      font-size: 14px;
      border-radius: 6px;
      border: 1.5px solid #e2e2e2;
      transition: border-color 0.3s ease;

      &:focus {
        border-color: #ff5c5c;
        outline: none;
      }
    }
  }

  .inputError {
    border-color: red !important;
  }
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
    max-width: 480px;
  }

  &__title {
    font-size: 1.5rem;
    margin-bottom: 24px;
    color: #111;
    font-weight: 700;
  }

  &__checkbox-flex {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
  }

  &__input-wrapper {
    margin-bottom: 20px;

    label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 6px;
    }

    input {
      width: 100%;
      padding: 10px 12px;
      font-size: 14px;
      border-radius: 6px;
      border: 1.5px solid #e2e2e2;
      transition: border-color 0.3s ease;

      &:focus {
        border-color: #ff5c5c;
        outline: none;
      }
    }
  }

  &__row {
    display: flex;
    gap: 16px;
  }

  &__input--small {
    flex: 1;
  }

  &__input-wrapper:not(.payment__input--small) {
    flex: 2;
  }

  &__submit-btn {
    width: 100%;
    padding: 14px;
    margin-top: 12px;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    background: #ddd;
    color: #777;
    cursor: not-allowed;
    transition: background 0.2s;

    &--enabled {
      background: #ff5c5c;
      color: #fff;
      cursor: pointer;

      &:hover {
        background: #e04a4a;
      }
    }
  }
}


import React, { useState, useEffect } from 'react';
import InputField from './InputField';
import Checkbox from './Checkbox';
import './payment.scss';

const PaymentForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    sameAsShipping: true,
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, sameAsShipping: checked }));
  };

  const validateCardNumber = (value: string) => {
    const digitsOnly = value.replace(/\s/g, '');
    return /^\d{16}$/.test(digitsOnly);
  };

  const validateForm = () => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      validateCardNumber(formData.cardNumber) &&
      /^\d{2}\/\d{4}$/.test(formData.expiryDate) &&
      /^\d{3}$/.test(formData.cvv)
    );
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData]);

  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim();

  return (
    <div className="payment__page">
      <form className="payment__form" aria-labelledby="payment-title">
        <h2 id="payment-title" className="payment__title">Payment</h2>

        <Checkbox
          checked={formData.sameAsShipping}
          onChange={handleCheckboxChange}
          strongLabel="Same as shipping address"
          className="payment__checkbox-flex"
        />

        <div className="payment__row">
          <div className="payment__input-wrapper payment__input--small">
            <InputField
              label="First Name"
              placeholder="First name"
              required
              name="firstName"
              onChange={handleChange}
              value={formData.firstName}
              aria-required="true"
            />
          </div>
          <div className="payment__input-wrapper">
            <InputField
              label="Last name"
              placeholder="Last name"
              required
              name="lastName"
              onChange={handleChange}
              value={formData.lastName}
              aria-required="true"
            />
          </div>
        </div>

        <div className="payment__input-wrapper">
          <InputField
            label="Card number"
            placeholder="1234 1234 1234 1234"
            required
            name="cardNumber"
            value={formData.cardNumber}
            onChange={(e) =>
              handleChange({
                ...e,
                target: {
                  ...e.target,
                  value: formatCardNumber(e.target.value),
                },
              })
            }
            aria-required="true"
          />
        </div>

        <div className="payment__row">
          <div className="payment__input-wrapper">
            <InputField
              label="Expiration date"
              placeholder="MM/YYYY"
              required
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              aria-required="true"
            />
          </div>
          <div className="payment__input-wrapper payment__input--small">
            <InputField
              label="CVV"
              placeholder="123"
              required
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              aria-required="true"
            />
          </div>
        </div>

        <button
          type="submit"
          className={`payment__submit-btn ${isFormValid ? 'payment__submit-btn--enabled' : ''}`}
          disabled={!isFormValid}
        >
          Complete
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;



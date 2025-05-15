'use client';

import { useEffect, useState } from 'react';
import '@/styles/form.css';

export default function PaymentForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    sameAsShipping: true,
  });

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const nameValid = form.firstName.trim() !== '' && form.lastName.trim() !== '';
    const cardValid = /^(\d{4} \d{4} \d{4} \d{4})$/.test(form.cardNumber);
    const expiryValid = /^(0[1-9]|1[0-2])\/\d{4}$/.test(form.expiry);
    const cvvValid = /^\d{3}$/.test(form.cvv);
    setIsValid(nameValid && cardValid && expiryValid && cvvValid);
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;

    if (id === 'cardNumber') {
      val = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    }

    if (id === 'cvv') {
      val = value.replace(/\D/g, '').slice(0, 3);
    }

    if (id === 'expiry') {
      val = value.replace(/\D/g, '').slice(0, 6);
      if (val.length >= 3) val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }

    setForm(prev => ({ ...prev, [id]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Payment completed successfully!');
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h2>Payment</h2>

      <label className="checkbox">
        <input
          type="checkbox"
          id="sameAsShipping"
          checked={form.sameAsShipping}
          onChange={handleChange}
        />
        Same as shipping address
      </label>

      <div className="row">
        <div className="form-group">
          <label htmlFor="firstName">First Name*</label>
          <input
            id="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name*</label>
          <input
            id="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last name"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="cardNumber">Card Number*</label>
        <input
          id="cardNumber"
          value={form.cardNumber}
          onChange={handleChange}
          placeholder="XXXX XXXX XXXX XXXX"
          inputMode="numeric"
        />
      </div>

      <div className="row">
        <div className="form-group">
          <label htmlFor="expiry">Expiration Date*</label>
          <input
            id="expiry"
            value={form.expiry}
            onChange={handleChange}
            placeholder="MM/YYYY"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cvv">CVV*</label>
          <input
            id="cvv"
            value={form.cvv}
            onChange={handleChange}
            placeholder="123"
            inputMode="numeric"
          />
        </div>
      </div>

      <button type="submit" className="submit-btn" disabled={!isValid}>
        Complete
      </button>
    </form>
  );
}



.payment-form {
  max-width: 500px;
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-family: sans-serif;
}

h2 {
  margin-bottom: 1rem;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  flex: 1;
}

input {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

input:focus {
  outline: 2px solid #0070f3;
  border-color: transparent;
}

.row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.submit-btn {
  width: 100%;
  padding: 0.8rem;
  background-color: #d32f2f;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}




'use client';

import { useState, useEffect } from 'react';

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [isValid, setIsValid] = useState(false);

  const validateForm = () => {
    const { firstName, lastName, cardNumber, expiry, cvv } = formData;
    const cardPattern = /^\d{4} \d{4} \d{4} \d{4}$/;
    const expiryPattern = /^(0[1-9]|1[0-2])\/(\d{4})$/;
    const cvvPattern = /^\d{3}$/;

    return (
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      cardPattern.test(cardNumber) &&
      expiryPattern.test(expiry) &&
      cvvPattern.test(cvv)
    );
  };

  useEffect(() => {
    setIsValid(validateForm());
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (name === 'cardNumber') {
      val = val.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim();
    }

    if (name === 'cvv') {
      val = val.replace(/[^\d]/g, '').slice(0, 3);
    }

    if (name === 'expiry') {
      val = val.replace(/[^\d]/g, '').slice(0, 6);
      if (val.length >= 3) {
        val = val.slice(0, 2) + '/' + val.slice(2);
      }
    }

    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      alert('Payment submitted!');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-xl bg-white p-8 shadow-md"
      >
        <h2 className="mb-6 text-2xl font-bold">Payment</h2>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="sameAddress"
            checked
            readOnly
            className="mr-2"
          />
          <label htmlFor="sameAddress" className="text-sm font-medium">
            Same as shipping address
          </label>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">First Name*</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Last Name*</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-blue-500"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Card number*</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="1234 1234 1234 1234"
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-blue-500"
          />
        </div>
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Expiration date*</label>
            <input
              type="text"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
              placeholder="MM/YYYY"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">CVV*</label>
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="123"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={!isValid}
          className={`w-full rounded bg-red-600 px-4 py-2 text-white font-semibold transition-opacity ${
            isValid ? 'opacity-100 hover:bg-red-700' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          Complete
        </button>
      </form>
    </div>
  );
}


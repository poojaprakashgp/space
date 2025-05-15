'use client';

import React, { useState, useEffect } from 'react';
import InputField from '@/components/InputField';
import './payment.scss';

export default function PaymentPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [isValid, setIsValid] = useState(false);

  // validate on data change
  useEffect(() => {
    const newErrors: Record<string,string> = {};
    const { firstName, lastName, cardNumber, expiryDate, cvv } = formData;

    if (!firstName.trim()) newErrors.firstName = 'Required';
    if (!lastName.trim()) newErrors.lastName = 'Required';
    if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(cardNumber))
      newErrors.cardNumber = 'Must be 16 digits in 4‑digit groups';
    if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(expiryDate))
      newErrors.expiryDate = 'MM/YYYY';
    if (!/^\d{3}$/.test(cvv))
      newErrors.cvv = '3 digits';

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let v = value;

    if (name === 'cardNumber') {
      v = v.replace(/\D/g, '').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
    }
    if (name === 'expiryDate') {
      v = v.replace(/\D/g,'').slice(0,6)
           .replace(/(\d{2})(\d{0,4})/,(_,m,y)=>y?`${m}/${y}`:m);
    }
    if (name === 'cvv') {
      v = v.replace(/\D/g,'').slice(0,3);
    }

    setFormData(f => ({ ...f, [name]: v }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) alert('Payment complete!');
  };

  return (
    <div className="payment‑page">
      <form className="payment‑form" onSubmit={onSubmit} aria-label="Payment form">
        <h2 className="payment‑title">Payment</h2>

        <label className="payment‑checkbox">
          <input type="checkbox" defaultChecked readOnly />
          <span>Same as shipping address</span>
        </label>

        <div className="row">
          <InputField
            label="First Name"
            placeholder="First name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            error={errors.firstName}
          />
          <InputField
            label="Last Name"
            placeholder="Last name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            error={errors.lastName}
          />
        </div>

        <InputField
          label="Card number"
          placeholder="1234 1234 1234 1234"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          required
          error={errors.cardNumber}
        />

        <div className="row">
          <InputField
            label="Expiration date"
            placeholder="MM/YYYY"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            required
            error={errors.expiryDate}
          />
          <InputField
            label="CVV"
            placeholder="123"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            required
            error={errors.cvv}
          />
        </div>

        <button
          type="submit"
          className={`submit‑btn${isValid? ' enabled': ''}`}
          disabled={!isValid}
          aria-disabled={!isValid}
        >
          Complete
        </button>
      </form>
    </div>
  );
}



.payment‑page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: #f5f5f5;
  min-height: 100vh;
}

.payment‑form {
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 500px;
}

.payment‑title {
  font-size: 1.5rem;
  margin-bottom: 24px;
  color: #111;
}

.payment‑checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  font-size: 0.95rem;
  input {
    width: 18px;
    height: 18px;
    margin-right: 8px;
    accent-color: #111;
  }
  span {
    color: #111;
  }
}

.row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.submit‑btn {
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
  &.enabled {
    background: #d32f2f;
    color: #fff;
    cursor: pointer;
    &:hover {
      background: darken(#d32f2f, 10%);
    }
  }
}

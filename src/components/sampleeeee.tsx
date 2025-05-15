'use client';

import React, { useState, useEffect } from 'react';
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
      <form className="payment‑form" onSubmit={onSubmit} aria-label="Payment form">
        <h2 className="payment‑title">Payment</h2>


        <Checkbox
              label="Same as shipping address"
              checked={true}
              onChange={()=>console.log("her")}
        />
 

        <div className="row">
          <InputField
            label="First Name"
            placeholder="First name"
            name="firstName"
            onChange={handleChange}
            required
          />
          <InputField
            label="Last Name"
            placeholder="Last name"
            name="lastName"
            onChange={handleChange}
            required
          />
        </div>

        <InputField
          label="Card number"
          placeholder="1234 1234 1234 1234"
          name="cardNumber"
          onChange={handleChange}
          required
        />

        <div className="row">
          <InputField
            label="Expiration date"
            placeholder="MM/YYYY"
            name="expiryDate"
            onChange={handleChange}
            required
          />
          <InputField
            label="CVV"
            placeholder="123"
            name="cvv"
            onChange={handleChange}
            required
          />
        </div>


        <div className="form__input-wrapper">
        <SubmitButton
          className="form__w-24"
          disabled={!isValid}
        >
          Complete
        </SubmitButton>
      </div>
      </form>
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
    // padding: 32px;
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

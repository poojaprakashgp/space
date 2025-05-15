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






.checkbox_section{
    font-size: 14px;
    font-family: "GalanoGrotesque-Medium", sans-serif;
   &__flex{
        display: flex;
        align-items: center;
   }

   &__checkbox-group{
        grid-template-columns: repeat(1, minmax(0, 1fr));
        width: 1rem;
        height: 1rem;
        display: grid;
        margin-right: 8px;
        input:checked {
            background: #1A1C35;
            border-color: #1A1C35;
        }
        svg{
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

   &__checkbox-input{
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

   &__font-bold{
        font-weight: 700;
        font-family: "GalanoGrotesque-Bold", sans-serif;
   }
}

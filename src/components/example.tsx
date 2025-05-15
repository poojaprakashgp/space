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

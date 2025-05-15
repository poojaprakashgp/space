// pages/index.tsx
"use client";

import { useState, useEffect } from "react";
import styles from "../styles/PaymentForm.module.scss";

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cardNumber: "",
    expirationDate: "",
    cvv: ""
  });

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const cardNumberValid = /^\d{4} \d{4} \d{4} \d{4}$/.test(formData.cardNumber);
    const expirationValid = /^(0[1-9]|1[0-2])\/(\d{4})$/.test(formData.expirationDate);
    const cvvValid = /^\d{3}$/.test(formData.cvv);
    const nameValid = formData.firstName.trim() !== "" && formData.lastName.trim() !== "";

    setIsValid(cardNumberValid && expirationValid && cvvValid && nameValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    alert("Payment information submitted!");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.paymentForm}>
      <h1>Payment</h1>
      <label>
        First Name*
        <input
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First name"
          required
        />
      </label>
      <label>
        Last Name*
        <input
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last name"
          required
        />
      </label>
      <label>
        Card number*
        <input
          name="cardNumber"
          type="text"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          required
        />
      </label>
      <label>
        Expiration date*
        <input
          name="expirationDate"
          type="text"
          value={formData.expirationDate}
          onChange={handleChange}
          placeholder="MM/YYYY"
          required
        />
      </label>
      <label>
        CVV*
        <input
          name="cvv"
          type="text"
          value={formData.cvv}
          onChange={handleChange}
          placeholder="123"
          maxLength={3}
          required
        />
      </label>
      <button type="submit" disabled={!isValid} className={styles.submitButton}>
        Complete
      </button>
    </form>
  );
}



.paymentForm {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h1 {
    text-align: center;
    margin-bottom: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    font-weight: 500;

    input {
      padding: 0.5rem;
      border: 1px solid #aaa;
      border-radius: 4px;
      margin-top: 0.25rem;
      font-size: 1rem;
    }
  }

  .submitButton {
    padding: 0.75rem;
    background-color: #d32f2f;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;

    &:disabled {
      background-color: #aaa;
      cursor: not-allowed;
    }
  }
}



// pages/index.tsx
"use client";

import { useState, useEffect } from "react";
import styles from "../styles/PaymentForm.module.scss";

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cardNumber: "",
    expirationDate: "",
    cvv: ""
  });

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const cardNumberValid = /^\d{4} \d{4} \d{4} \d{4}$/.test(formData.cardNumber);
    const expirationValid = /^(0[1-9]|1[0-2])\/(\d{4})$/.test(formData.expirationDate);
    const cvvValid = /^\d{3}$/.test(formData.cvv);
    const nameValid = formData.firstName.trim() !== "" && formData.lastName.trim() !== "";

    setIsValid(cardNumberValid && expirationValid && cvvValid && nameValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    alert("Payment information submitted!");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.paymentForm}>
      <h1>Payment</h1>

      <div className={styles.checkboxGroup}>
        <input type="checkbox" checked readOnly />
        <label>Same as shipping address</label>
      </div>

      <div className={styles.row}>
        <label>
          First Name*
          <input
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
            required
          />
        </label>
        <label>
          Last Name*
          <input
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            required
          />
        </label>
      </div>

      <label>
        Card number*
        <input
          name="cardNumber"
          type="text"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          required
        />
      </label>

      <div className={styles.row}>
        <label>
          Expiration date*
          <input
            name="expirationDate"
            type="text"
            value={formData.expirationDate}
            onChange={handleChange}
            placeholder="MM/YYYY"
            required
          />
        </label>
        <label>
          CVV*
          <input
            name="cvv"
            type="text"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
            maxLength={3}
            required
          />
        </label>
      </div>

      <button type="submit" disabled={!isValid} className={styles.submitButton}>
        Complete
      </button>
    </form>
  );
}



.paymentForm {
  max-width: 480px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fdfdfd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  font-family: sans-serif;

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }

  .checkboxGroup {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    input[type="checkbox"] {
      width: 16px;
      height: 16px;
    }

    label {
      margin: 0;
      font-weight: 500;
    }
  }

  .row {
    display: flex;
    gap: 1rem;

    label {
      flex: 1;
    }
  }

  label {
    display: flex;
    flex-direction: column;
    font-size: 0.95rem;
    font-weight: 500;

    input {
      margin-top: 0.35rem;
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-size: 1rem;
      background-color: #fff;
    }
  }

  .submitButton {
    padding: 0.9rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 10px;
    border: none;
    background-color: #ddd;
    color: #555;
    cursor: not-allowed;

    &:not(:disabled) {
      background-color: #000;
      color: #fff;
      cursor: pointer;
    }
  }
}


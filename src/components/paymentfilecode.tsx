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


if (name === "expirationDate") {
      formattedValue = value
        .replace(/[^\d]/g, "")
        .slice(0, 6)
        .replace(/(\d{2})(\d{0,4})/, (match, p1, p2) => `${p1}${p2 ? "/" + p2 : ""}`);
    }




// pages/index.tsx
"use client";

import { useState, useEffect } from "react";
import styles from "../styles/PaymentForm.module.scss";
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

  const [isValid, setIsValid] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);

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
    } else if (name === "expirationDate") {
      formattedValue = value.replace(/[^\d]/g, "");
      if (formattedValue.length >= 3) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 6)}`;
      }
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

      <Checkbox
        checked={sameAsShipping}
        onChange={setSameAsShipping}
        strongLabel="Same as shipping address"
      />

      <div className={styles.row}>
        <InputField
          label="First Name"
          name="firstName"
          placeholder="First name"
          required
          value={formData.firstName}
          onChange={handleChange}
        />
        <InputField
          label="Last Name"
          name="lastName"
          placeholder="Last name"
          required
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>

      <InputField
        label="Card number"
        name="cardNumber"
        placeholder="1234 5678 9012 3456"
        required
        maxLength={19}
        value={formData.cardNumber}
        onChange={handleChange}
      />

      <div className={styles.row}>
        <InputField
          label="Expiration date"
          name="expirationDate"
          placeholder="MM/YYYY"
          required
          maxLength={7}
          value={formData.expirationDate}
          onChange={handleChange}
        />
        <InputField
          label="CVV"
          name="cvv"
          placeholder="123"
          required
          maxLength={3}
          value={formData.cvv}
          onChange={handleChange}
        />
      </div>

      <button type="submit" disabled={!isValid} className={styles.submitButton}>
        Complete
      </button>
    </form>
  );
}




"use client";

import React, { useState, useEffect } from "react";
import InputField from "./InputField";  // adjust path as needed
import Checkbox from "./Checkbox";      // adjust path as needed
import styles from "../styles/payment.module.scss";

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  const matched = digits.match(/.{1,4}/g);
  return matched ? matched.join(" ") : digits;
}

function isValidCardNumber(value: string) {
  const digits = value.replace(/\s/g, "");
  return /^\d{16}$/.test(digits);
}

function isValidExpirationDate(value: string) {
  // MM/YYYY format, valid months 01-12
  return /^(0[1-9]|1[0-2])\/\d{4}$/.test(value);
}

function isValidCVV(value: string) {
  return /^\d{3}$/.test(value);
}

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });

  const [isValid, setIsValid] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Validate inputs and update error messages
  useEffect(() => {
    const errors = {
      firstName: formData.firstName.trim() ? "" : "First name is required",
      lastName: formData.lastName.trim() ? "" : "Last name is required",
      cardNumber: isValidCardNumber(formData.cardNumber)
        ? ""
        : "Card number must be 16 digits",
      expirationDate: isValidExpirationDate(formData.expirationDate)
        ? ""
        : "Expiration date must be MM/YYYY",
      cvv: isValidCVV(formData.cvv) ? "" : "CVV must be 3 digits",
    };
    setFormErrors(errors);

    // Form is valid only if no errors
    const valid =
      Object.values(errors).every((e) => e === "") &&
      Object.values(formData).every((v) => v !== "");
    setIsValid(valid);
  }, [formData]);

  // Handlers for inputs:
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      setFormData((prev) => ({
        ...prev,
        cardNumber: formatCardNumber(value),
      }));
    } else if (name === "expirationDate") {
      // Optionally you can add formatting here if needed
      setFormData((prev) => ({
        ...prev,
        expirationDate: value,
      }));
    } else if (name === "cvv") {
      // Allow only digits and max 3 chars
      const onlyDigits = value.replace(/\D/g, "").slice(0, 3);
      setFormData((prev) => ({
        ...prev,
        cvv: onlyDigits,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setSameAsShipping(checked);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    alert("Payment information submitted!");
    // Here you can also handle actual submission logic
  };

  return (
    <form onSubmit={handleSubmit} className={styles.payment__form}>
      <h1 className={styles.payment__title}>Payment</h1>

      <Checkbox
        label="Same as shipping address"
        checked={sameAsShipping}
        onChange={handleCheckboxChange}
        className={styles.payment__checkbox}
        strongLabel=""
      />

      <div className={styles.payment__row}>
        <InputField
          label="First Name"
          placeholder="First name"
          required
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          className={formErrors.firstName ? styles.inputError : ""}
        />
        <InputField
          label="Last Name"
          placeholder="Last name"
          required
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          className={formErrors.lastName ? styles.inputError : ""}
        />
      </div>

      <InputField
        label="Card number"
        placeholder="1234 1234 1234 1234"
        required
        name="cardNumber"
        value={formData.cardNumber}
        onChange={handleInputChange}
        maxLength={19}
        className={formErrors.cardNumber ? styles.inputError : ""}
      />
      {formErrors.cardNumber && (
        <div className={styles.errorMessage}>{formErrors.cardNumber}</div>
      )}

      <div className={styles.payment__row}>
        <InputField
          label="Expiration date"
          placeholder="MM/YYYY"
          required
          name="expirationDate"
          value={formData.expirationDate}
          onChange={handleInputChange}
          maxLength={7}
          className={formErrors.expirationDate ? styles.inputError : ""}
        />
        {formErrors.expirationDate && (
          <div className={styles.errorMessage}>
            {formErrors.expirationDate}
          </div>
        )}

        <InputField
          label="CVV"
          placeholder="123"
          required
          name="cvv"
          value={formData.cvv}
          onChange={handleInputChange}
          maxLength={3}
          className={formErrors.cvv ? styles.inputError : ""}
        />
        {formErrors.cvv && (
          <div className={styles.errorMessage}>{formErrors.cvv}</div>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className={`${styles.payment__submitBtn} ${
          isValid ? styles["payment__submitBtn--enabled"] : ""
        }`}
      >
        Complete
      </button>
    </form>
  );
}



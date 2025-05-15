'use client';
import React, { useState } from 'react';
import Button from '@/common/molecules/Button/Button';
import Card from '@/common/atoms/Icons/Card';
import SubmitButton from '@/common/atoms/SubmitButton';
import SelectOption from '@/common/atoms/SelectOption';
import Checkbox from '@/common/atoms/Checkbox';
import { verifyAddress } from '@/store/sagas/clientApis/conversationalAI/verifyAddress';
import { placeOrder } from '@/store/sagas/clientApis/conversationalAI/placeOrder';
import { getSessionItem } from '@/helpers/sessionHandler';
import { FETCH_CONFIRMATION_DETAILS_SUCCESS } from '@/store/constants/conversationalAI/orderConfirmation';
import { useRouter } from 'next/navigation';
import { useCheckoutContext } from '@/store/contexts/conversationalAI/checkoutContext';
import InputField from '@/common/atoms/InputField';
import {
  checkoutData,
  paymentFormElement,
  formDataElement,
  ICheckoutFormProps,
  CustomerDetailsSection,
  CustomerDetails,
} from './type';
import { useCartContext } from '@/store/contexts/CartContext';
import { getBaseURL } from '@/helpers/uriUtils';
import PaymentForm from './PaymentForm';

const CheckoutForm: React.FC<ICheckoutFormProps> = ({
  subdomain,
  dispatch,
  setLoading,
}) => {
  const { setCartPrice, setCartCount } = useCartContext();
  const { customerDetails } = useCheckoutContext() as {
    customerDetails: CustomerDetails;
  };
  const [checkoutData, setCheckoutData] = useState<checkoutData>({
    full_name: '',
    address: '',
    address_2: '',
    zip_code: '',
    city: '',
    state: '',
    phone_number: '',
    email: '',
  });

  const [cardData, setCardData] = useState<checkoutData>({
    card_number: '',
    expiration_date: '',
    cvv: '',
  });
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState(0);
  const router = useRouter();
  const formData: {
    name: formDataElement[];
    address: formDataElement[];
    city: formDataElement[];
    state: formDataElement[];
    phone: formDataElement[];
  } = {
    name: [],
    address: [],
    city: [],
    state: [],
    phone: [],
  };
  const paymentFormData: {
    cardNumber: paymentFormElement[];
    expirationDate: paymentFormElement[];
  } = {
    cardNumber: [],
    expirationDate: [],
  };

  // Process customer details for payment options
  (customerDetails?.content?.section?.[0]?.content?.section || [])
    ?.find((obj: CustomerDetailsSection) => obj?.id === 'payment_options')
    ?.options?.[0]?.contents?.section?.map((data: CustomerDetailsSection) => {
      if (data.id === 'card_number') {
        paymentFormData?.cardNumber?.push({
          id: data.id,
          input: data.input,
        });
      } else {
        paymentFormData?.expirationDate?.push({
          id: data.id,
          input: data.input,
        });
      }
    });

  // Process customer details for billing info
  customerDetails?.content?.section?.[0]?.content?.section
    ?.find((obj: CustomerDetailsSection) => obj?.id === 'billing_info')
    ?.content?.section?.map((data: CustomerDetailsSection) => {
      if (data?.id === 'full_name') {
        formData?.name?.push({
          id: data.id,
          input: data.input,
        });
      } else if (data?.id === 'address' || data?.id === 'address_2') {
        formData?.address?.push({
          id: data.id,
          input: data.input,
        });
      } else if (data?.id === 'city' || data?.id === 'zip_code') {
        formData?.city?.push({
          id: data.id,
          input: data.input,
        });
      } else if (data?.id === 'phone_number' || data?.id === 'email') {
        formData?.phone?.push({
          id: data.id,
          input: data.input,
        });
      } else if (data?.id === 'state') {
        formData?.state?.push({
          id: data.id,
          dropdown: data.dropdown,
        });
      }
    });
  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const btnTextColor = '#1A1C35';
  const deactiveBtnTextColor = '#525252';
  const paymentOptions = [
    {
      icon: <Card />,
      label: 'Card',
    },
  ];

  function splitFullName(fullName: string): {
    firstName: string;
    lastName: string;
  } {
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';
    return { firstName, lastName };
  }

  function parseMonthYear(input: string): { month: number; year: number } {
    const [monthStr, yearStr] = input.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    return { month, year };
  }

  const handleVerify = async () => {
    try {
      setLoading(true);
      // samplePayload to be replaced with actual data from the form
      const splitName = splitFullName(checkoutData.full_name || '');

      const samplePayload = {
        firstName: splitName.firstName,
        lastName: splitName.lastName,
        address: checkoutData?.address || '',
        apt: checkoutData?.address_2 || '',
        city: checkoutData?.city || '',
        zipcode: checkoutData?.zip_code || '',
        country: 'USA',
        addressType: 'Residential',
        phoneNumber: checkoutData?.phone_number || '',
        email: checkoutData?.email || '',
        stateOrProvince: 'MO',
      };
      const res = await verifyAddress(subdomain, samplePayload);
      if (res) {
        setLoading(false);
        const { data: { verifyLevel } = { verifyLevel: '' } } = res;
        if (verifyLevel === 'Verified') setIsVerified(true);
      }
    } catch (error) {
      console.error('Error in handle add to cart', error);
    } finally {
      setLoading(false);
    }
  };
  const clearCookies = () => {
    ['wctoken', 'wctrustedtoken'].forEach((name) => {
      document.cookie = `${name}=;Max-Age=0;path=/`;
    });
  };
  const handlePay = async () => {
    try {
      setLoading(true);
      const splitName = splitFullName(checkoutData.full_name || '');
      const splitDate = parseMonthYear(cardData.expiration_date || '');
      const payload = {
        cartId: getSessionItem('agenticCartId'),
        // To be replaced with actual data from the form
        firstName: splitName.firstName,
        lastName: splitName.lastName,
        nickName: 'ccSEYYUIBjyA',
        addressType: 'Shipping',
        addressLine1: checkoutData?.address || '',
        addressLine2: '',
        apt: checkoutData?.address_2 || '',
        city: checkoutData?.city || '',
        stateOrProvince: 'MO',
        zipCode: checkoutData?.zip_code || '',
        country: 'USA',
        phoneNumber: checkoutData?.phone_number || '',
        emailAddress: checkoutData?.email || '',
        paymentMethodId: '243115956',
        paymentType: 'CREDITCARD',
        cardType: 'VISA',
        month: splitDate.month,
        year: splitDate.year,
        encryptedCreditCardNumber: cardData?.card_number || '',
        encryptedCVV: cardData?.cvv || '',
        pieKeyId: '177e8fdd',
        deviceFingerprintId: '8f225a9d-3e99-4d29-188b-9315c08645dd',
      };

      const res = await placeOrder(subdomain, payload);

      if (res) {
        dispatch({
          type: FETCH_CONFIRMATION_DETAILS_SUCCESS,
          payload: res,
        });
        clearCookies();
        setCartPrice('', 0);
        setCartCount(0);
        setLoading(false);
        router.push(`${getBaseURL()}/new-order-confirmation`);
      }
    } catch (error) {
      console.error('Error in handle add to cart', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form form__form-wrapper">
      <div className="form__input-wrapper form__pb-2">
        {formData?.name?.map((data, key) => {
          return (
            <InputField
              key={`${data.id}_${key}`}
              label={data.input?.label || ''}
              wrapperClass="form__w-44"
              placeholder={data.input?.placeholder || ''}
              required={data.input?.required || false}
              onChange={handleChange}
              name={data.id}
            />
          );
        })}
      </div>

      <div className="form__input-wrapper form__pb-2">
        {formData?.address?.map((data, key) => {
          return (
            <InputField
              key={`${data.id}_${key}`}
              label={data.input?.label || ''}
              wrapperClass={`form__w-${data.id === 'address' ? '68' : '25'}`}
              placeholder={data.input?.placeholder || ''}
              required={data.input?.required || false}
              onChange={handleChange}
              name={data.id}
            />
          );
        })}
      </div>

      <div className="form__input-wrapper form__pb-2">
        {formData?.city?.map((data, key) => {
          return (
            <InputField
              key={`${data.id}_${key}`}
              label={data.input?.label || ''}
              wrapperClass={`form__w-${data.id === 'city' ? '40' : '25'}`}
              placeholder={data.input?.placeholder || ''}
              required={data.input?.required || false}
              onChange={handleChange}
              name={data.id}
            />
          );
        })}
      </div>

      <div className="form__input-wrapper">
        {formData?.state?.map((data, key) => {
          return (
            <SelectOption
              label={data.id}
              key={`${data.id}_${key}`}
              required={data.dropdown?.required || false}
              options={[
                {
                  // @ts-expect-error typing
                  name: data.dropdown?.option.name || '',
                  // @ts-expect-error typing
                  value: data.dropdown?.option.value || '',
                },
              ]}
              onChange={(e) => {
                const { name, value } = e.target as HTMLSelectElement;
                setCheckoutData((prev) => ({
                  ...prev,
                  [name]: value,
                }));
              }}
              defaultValue={data.dropdown?.defaultValue}
              wrapperClass="form__w-33"
              name={data.id}
            />
          );
        })}
      </div>

      <div className="form__input-wrapper form__pb-2">
        {formData?.phone?.map((data, key) => {
          return (
            <InputField
              key={`${data.id}_${key}`}
              label={data.input?.label || ''}
              wrapperClass={`form__w-${data.id === 'phone_number' ? '38' : '58'}`}
              placeholder={data.input?.placeholder || ''}
              required={data.input?.required || false}
              onChange={handleChange}
              name={data.id}
            />
          );
        })}
      </div>

      <div className="form__input-wrapper">
        <SubmitButton onClick={handleVerify} className="form__w-24">
          Verify
        </SubmitButton>
      </div>
      <div className="form__input-wrapper form__py-8">
        {paymentOptions.map(({ label, icon }, key) => {
          return (
            <Button
              textColorValue={
                paymentMethod === key ? btnTextColor : deactiveBtnTextColor
              }
              key={key}
              label={label}
              icon={icon}
              onClick={() => setPaymentMethod(key)}
              className={`form__btn-rounded-white ${paymentMethod === key ? 'form__btn-active' : ''}`}
            />
          );
        })}
      </div>
      <PaymentForm />
      {paymentMethod === 0 && (
        <div className="form__pb-2">
          <div className="form__input-wrapper form__pb-2">
            {paymentFormData?.cardNumber?.map((data, key) => {
              return (
                <InputField
                  key={`${data.id}_${key}`}
                  label={data.input?.label || ''}
                  wrapperClass={'form__w-80'}
                  placeholder={data.input?.placeholder || ''}
                  required={data.input?.required || false}
                  onChange={handlePaymentChange}
                  name={data.id}
                />
              );
            })}
          </div>

          <div className="form__input-wrapper form__pb-2">
            {paymentFormData?.expirationDate?.map((data, key) => {
              return (
                <InputField
                  key={`${data.id}_${key}`}
                  label={data.input?.label || ''}
                  wrapperClass={`form__w-${data.id === 'expiration_date' ? '32' : '24'}`}
                  placeholder={data.input?.placeholder || ''}
                  required={data.input?.required || false}
                  onChange={handlePaymentChange}
                  name={data.id}
                />
              );
            })}
          </div>
          <div className="form__input-wrapper form__py-2  ">
            <Checkbox
              label="after first month"
              strongLabel="Auto Pay and save $5/mo "
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
          </div>
        </div>
      )}
      <div className="form__input-wrapper">
        <SubmitButton
          onClick={handlePay}
          className="form__w-24"
          disabled={!isVerified}
        >
          Pay
        </SubmitButton>
      </div>
    </div>
  );
};

export default CheckoutForm;
import React from 'react';

interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  className?: string;
  wrapperClass?: string;
  borderColor?: string;
  required?: boolean;
  name?: string;
  onChange?:(e:React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  required,
  onChange,
  type = 'text',
 // borderColor = '#E2E2E2',
  wrapperClass = '',
  className = '',
  name,
  ...props
}) => (
  <div className={`input-section input-section__input-group  ${wrapperClass}`}>
    <label className="input-section__label">
      {label}
      {required && '*'}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className={`input-section__input ${className}`}
      onChange={onChange}
      {...props}
    />
  </div>
);

export default InputField;
import React from 'react';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  strongLabel?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  strongLabel,
  className = '',
}) => {
  return (
    <>
      <label className={`checkbox_section checkbox_section__flex  ${className}`}>
        <div className="checkbox_section__checkbox-group">
          <input
            aria-describedby="offers-description"
            name="offers"
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="checkbox_section__checkbox-input"
          />
          <svg
           
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
            
              d="M3 8L6 11L11 3.5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
          </svg>
        </div>
        <span>
          {strongLabel && <span className="checkbox_section__font-bold">{strongLabel}</span>}
          {label && label}
        </span>
      </label>
    </>
  );
};

export default Checkbox;






 {
                        "id": "payment",
                        "title": "Payment",
                        "content": {
                          "section": [
                            {
                              "id": "completed_state",
                              "body": "****XXXX",
                              "cta": {
                                "text": "Edit Payment",
                                "type": "link",
                                "action": "native"
                              }
                            },
                            {
                              "id": "incompleted_state",
                              "content": {
                                "section": [
                                  {
                                    "id": "same_as_shipping_address",
                                    "title": "Same as shipping address",
                                    "type": "checkbox"
                                  },
                                  {
                                    "id": "billing_address_and_information",
                                    "content": [
                                      {
                                        "id": "billing_address",
                                        "content": {
                                          "section": [
                                            {
                                              "id": "first_name",
                                              "input": {
                                                "label": "First Name*",
                                                "placeholder": "First name",
                                                "required": true,
                                                "errorMessages": {
                                                  "required": "Enter first name"
                                                }
                                              }
                                            },
                                            {
                                              "id": "last_name",
                                              "input": {
                                                "label": "Last Name*",
                                                "placeholder": "Last name",
                                                "required": true,
                                                "errorMessages": {
                                                  "required": "Enter last name"
                                                }
                                              }
                                            },
                                            {
                                              "id": "address",
                                              "input": {
                                                "label": "Address*",
                                                "placeholder": "Address",
                                                "required": true,
                                                "errorMessages": {
                                                  "required": "Enter address"
                                                }
                                              }
                                            },
                                            {
                                              "id": "address_2",
                                              "input": {
                                                "label": "Suite/Apt",
                                                "placeholder": "Suite/Apt",
                                                "required": false
                                              }
                                            },
                                            {
                                              "id": "zip_code",
                                              "input": {
                                                "label": "Zip code*",
                                                "placeholder": "XXXXX",
                                                "required": true,
                                                "errorMessages": {
                                                  "invalid": "Please enter a number that contains at least 5 digits.",
                                                  "required": "Enter ZIP code"
                                                }
                                              }
                                            },
                                            {
                                              "id": "city",
                                              "input": {
                                                "label": "City*",
                                                "placeholder": "City",
                                                "required": true,
                                                "errorMessages": {
                                                  "required": "Enter city"
                                                }
                                              }
                                            },
                                            {
                                              "id": "state",
                                              "dropdown": {
                                                "label": "State*",
                                                "placeholder": "Select",
                                                "required": true,
                                                "errorMessages": {
                                                  "required": "Enter state"
                                                },
                                                "options": [
                                                  {
                                                    "name": "California",
                                                    "value": "CA"
                                                  }
                                                ]
                                              }
                                            },
                                            {
                                              "id": "country",
                                              "dropdown": {
                                                "label": "Country*",
                                                "placeholder": "Select",
                                                "required": true,
                                                "errorMessages": {
                                                  "required": "Enter country"
                                                },
                                                "options": [
                                                  {
                                                    "name": "USA",
                                                    "value": "USA"
                                                  }
                                                ]
                                              }
                                            },
                                            {
                                              "id": "phone_number",
                                              "input": {
                                                "label": "Phone number*",
                                                "placeholder": "XXX-XXX-XXXX",
                                                "required": true,
                                                "errorMessages": {
                                                  "required": "Enter phone number",
                                                  "invalid": "Invalid format"
                                                }
                                              }
                                            },
                                            {
                                              "id": "email",
                                              "input": {
                                                "label": "Email*",
                                                "placeholder": "email@email",
                                                "required": true,
                                                "errorMessages": {
                                                  "invalid": "Enter a valid email",
                                                  "required": "Enter email"
                                                }
                                              }
                                            }
                                          ]
                                        }
                                      },
                                      {
                                        "id": "billing_information",
                                        "content": {
                                          "section": [
                                            {
                                              "id": "first_name",
                                              "input": {
                                                "label": "First Name*",
                                                "placeholder": "First name",
                                                "required": true,
                                                "errorMessages": {
                                                  "required": "Enter first name"
                                                }
                                              }
                                            },
                                            {
                                              "id": "last_name",
                                              "input": {
                                                "label": "Last Name*",
                                                "placeholder": "Last name",
                                                "required": true,
                                                "errorMessages": {
                                                  "required": "Enter last name"
                                                }
                                              }
                                            },
                                            {
                                              "id": "card_number",
                                              "input": {
                                                "label": "Card number*",
                                                "placeholder": "XXXX XXXX XXXX XXXX",
                                                "required": true,
                                                "errorMessages": {
                                                  "required": "Enter card number",
                                                  "invalid": "Enter valid card number"
                                                }
                                              }
                                            },
                                            {
                                              "id": "expiration_date",
                                              "input": {
                                                "label": "Expiration date*",
                                                "placeholder": "MM/YYYY",
                                                "required": true,
                                                "errorMessages": {
                                                  "required": "Enter expiration date",
                                                  "invalid": "Enter valid expiration date"
                                                }
                                              }
                                            },
                                            {
                                              "id": "cvv",
                                              "input": {
                                                "label": "CVV*",
                                                "placeholder": "XXX",
                                                "required": true,
                                                "errorMessages": {
                                                  "invalid": "Enter valid CVV",
                                                  "required": "Enter CVV"
                                                }
                                              }
                                            }
                                          ]
                                        }
                                      }
                                    ]
                                  }
                                ]
                              },
                              "cta": {
                                "text": "Complete",
                                "type": "button",
                                "style": "primary",
                                "action": "native"
                              }
                            }
                          ]
                        }
                      },

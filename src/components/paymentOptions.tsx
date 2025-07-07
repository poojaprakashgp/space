import React, { useState } from 'react';
import {
  PaymentOptionsPriceMainContainer,
  PaymentOptionsBoxContainer,
  PaymentOptionsPriceCheckBx,
  PaymentOptionsPriceBodyContainer,
  PaymentOptionsPriceBodyTitle,
  PaymentOptionsPriceBodyContent,
  PaymentOptionsPriceImgContent,
  PaymentOptionsOffer,
} from '../styledComponents';
import { RadioButton } from 'value-design-system/src/Atoms/RadioButton';
import PaymentOptionsOfferDetails from './PaymentOptionsOfferDetails';
import PaymentOptionsSmartPayModal from './PaymentOptionsSmartPayModal';
import PaymentOptionsPriceDetails from './PaymentOptionsPriceDetails';
import { PaymentOptionsPriceProps } from '../types';
/**
 * PaymentOptionsPrice component renders the price details for a payment option.
 *
 * @param {Options} paymentOptionsDetails - The details of the payment option.
 * @param {string} selectedRadioButton - The currently selected radio button ID.
 * @param {(id: string) => void} handleRadioChange - Callback to handle radio button selection.
 * @param {SKU[]} SKUs - The list of SKUs.
 * @param {string} selectedColor - The currently selected color.
 * @param {string} subdomain - The subdomain for brand-specific logic.
 * @param {string} selectedDeviceAvailable - The availability status of the selected device.
 * @returns {JSX.Element} The rendered component.
 */

const PaymentOptionsPrice = ({
  paymentOptionsDetails: { id, title, body, image, cta, modal, price },
  selectedRadioButton,
  handleRadioChange,
  SKUs,
  selectedColor,
  subdomain,
  selectedDeviceAvailable,
}: PaymentOptionsPriceProps): JSX.Element => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal((prevState) => !prevState);

  const renderModal = () => {
    if (!modal) return <></>;

    return modal?.content?.type === 'DOT_LIST' ? (
      <PaymentOptionsOfferDetails
        modal={modal}
        showModal={showModal}
        toggleModal={toggleModal}
        subdomain={subdomain}
      />
    ) : (
      <PaymentOptionsSmartPayModal
        modal={modal}
        showModal={showModal}
        toggleModal={toggleModal}
        subdomain={subdomain}
      />
    );
  };

  const renderImage = () => {
    if (!image?.src) return null;

    return (
      <PaymentOptionsPriceImgContent
        src={image.src}
        alt={image.alt ?? 'Payment Option Image'}
        width={0}
        height={0}
      />
    );
  };

  return (
    <PaymentOptionsPriceMainContainer
      id={id}
      onClick={() => handleRadioChange(id)}
      data-testid={id}
    >
      <PaymentOptionsBoxContainer>
        <PaymentOptionsPriceCheckBx>
          <RadioButton
            key={id}
            available={selectedDeviceAvailable === 'Available'}
            name={id}
            selected={true}
            selectFn={() => {}}
            type="radio"
            value=""
          />
        </PaymentOptionsPriceCheckBx>

        <PaymentOptionsPriceBodyContainer>
          {title && (
            <PaymentOptionsPriceBodyTitle>{title}</PaymentOptionsPriceBodyTitle>
          )}
          {body && (
            <PaymentOptionsPriceBodyContent>
              {body}
            </PaymentOptionsPriceBodyContent>
          )}
          {renderImage()}
        </PaymentOptionsPriceBodyContainer>

        {PaymentOptionsPriceDetails(id, price, SKUs, selectedColor)}
      </PaymentOptionsBoxContainer>

      {cta?.text && (
        <PaymentOptionsOffer onClick={() => toggleModal()}>
          {cta.text}
        </PaymentOptionsOffer>
      )}
      {renderModal()}
    </PaymentOptionsPriceMainContainer>
  );
};

export default PaymentOptionsPrice;



.payment-options__main-container {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.payment-options__box-container {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.payment-options__checkbox {
  margin-top: 0.5rem;
}

.payment-options__body-container {
  flex: 1;
}

.payment-options__body-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.payment-options__body-content {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 0.5rem;
}

.payment-options__image {
  max-width: 80px;
  height: auto;
  margin-top: 0.5rem;
}

.payment-options__offer {
  color: #007aff;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.75rem;
  text-align: left;
  background: none;
  border: none;
  padding: 0;
}


import React, { useState } from 'react';
import { RadioButton } from 'value-design-system/src/Atoms/RadioButton';
import PaymentOptionsOfferDetails from './PaymentOptionsOfferDetails';
import PaymentOptionsSmartPayModal from './PaymentOptionsSmartPayModal';
import PaymentOptionsPriceDetails from './PaymentOptionsPriceDetails';
import { PaymentOptionsPriceProps } from '../types';

import './PaymentOptionsPrice.scss';

const PaymentOptionsPrice = ({
  paymentOptionsDetails: { id, title, body, image, cta, modal, price },
  selectedRadioButton,
  handleRadioChange,
  SKUs,
  selectedColor,
  subdomain,
  selectedDeviceAvailable,
}: PaymentOptionsPriceProps): JSX.Element => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal((prev) => !prev);

  const renderModal = () => {
    if (!modal) return null;

    return modal?.content?.type === 'DOT_LIST' ? (
      <PaymentOptionsOfferDetails
        modal={modal}
        showModal={showModal}
        toggleModal={toggleModal}
        subdomain={subdomain}
      />
    ) : (
      <PaymentOptionsSmartPayModal
        modal={modal}
        showModal={showModal}
        toggleModal={toggleModal}
        subdomain={subdomain}
      />
    );
  };

  const renderImage = () => {
    if (!image?.src) return null;

    return (
      <img
        className="payment-options__image"
        src={image.src}
        alt={image.alt ?? 'Payment Option Image'}
      />
    );
  };

  return (
    <div
      id={id}
      onClick={() => handleRadioChange(id)}
      data-testid={id}
      className="payment-options__main-container"
    >
      <div className="payment-options__box-container">
        <div className="payment-options__checkbox">
          <RadioButton
            key={id}
            available={selectedDeviceAvailable === 'Available'}
            name={id}
            selected={true}
            selectFn={() => {}}
            type="radio"
            value=""
          />
        </div>

        <div className="payment-options__body-container">
          {title && <div className="payment-options__body-title">{title}</div>}
          {body && <div className="payment-options__body-content">{body}</div>}
          {renderImage()}
        </div>

        {PaymentOptionsPriceDetails(id, price, SKUs, selectedColor)}
      </div>

      {cta?.text && (
        <button
          className="payment-options__offer"
          onClick={(e) => {
            e.stopPropagation();
            toggleModal();
          }}
        >
          {cta.text}
        </button>
      )}

      {renderModal()}
    </div>
  );
};

export default PaymentOptionsPrice;


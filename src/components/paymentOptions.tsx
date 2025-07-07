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

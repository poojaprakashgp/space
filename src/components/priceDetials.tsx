import React from 'react';
import {
  PaymentOptionsPriceContainer,
  PaymentOptionsPricePreText,
  PaymentOptionsPriceText,
  PaymentOptionsCentText,
  PaymentOptionsPricePostText,
} from '../styledComponents';
import { Options, SKU } from '@/common/types';

/**
 * Renders the price details based on the payment option ID.
 *
 * @param {string} id - The ID of the payment option.
 * @param {Options['price']} price - The price details of the payment option.
 * @param {SKU[]} SKUs - The list of SKUs.
 * @param {string} selectedColor - The currently selected color.
 * @returns {JSX.Element | null} The rendered price details or null if no SKU is found.
 */

const PaymentOptionsPriceDetails = (
  id: string,
  price: Options['price'],
  SKUs: Array<SKU>,
  selectedColor: string,
): JSX.Element | null => {
  const sku = SKUs?.find((sku) => sku.color?.name === selectedColor);
  if (!sku) return null;

  let preText = price?.preText ?? '';
  let postText = price?.postText ?? '';
  let finalPrice = '';
  let cents = '';

  switch (id) {
  case 'great_price':
    finalPrice = sku.veriffOnlyPrice?.discountedPrice?.toString() ?? '';
    cents = sku.veriffOnlyPrice?.cents ?? '';
    break;
  case 'payment_plan':
    finalPrice = sku.loanTermOptions?.dollars?.toString() ?? '';
    cents = sku.loanTermOptions?.cents?.toString() ?? '';
    postText = `${sku.loanTermOptions?.amountOfPayments?.toString() ?? ''} ${postText}`;
    break;
  case 'full_price':
    finalPrice = sku.price?.discountedPrice?.toString() ?? '';
    cents = sku.price?.cents?.toString() ?? '';
    preText = sku.price?.dollars?.toString() ?? '';
    break;
  default:
    return null;
  }

  return (
    <PaymentOptionsPriceContainer>
      <PaymentOptionsPricePreText>{preText}</PaymentOptionsPricePreText>
      <PaymentOptionsPriceText>
        {finalPrice}
        <PaymentOptionsCentText>{cents}</PaymentOptionsCentText>
      </PaymentOptionsPriceText>
      <PaymentOptionsPricePostText>{postText}</PaymentOptionsPricePostText>
    </PaymentOptionsPriceContainer>
  );
};

export default PaymentOptionsPriceDetails;
import React, { useMemo, useState } from 'react';
import { Tabs } from 'value-design-system/src/Organisms/Tabs';
import { AccordionList } from 'value-design-system/src/Molecules/AccordionList';

import {
  PaymentOptionsSmartPayModalMainContainer,
  PaymentOptionsSmartPayAboutBody,
  PaymentOptionsSmartPayAboutContainer,
  PaymentOptionsSmartPayFaqContainer,
  PaymentOptionsSmartPayAboutBullet,
  PaymentOptionsSmartPayAboutBulletItem,
  PaymentOptionsSmartPayAboutBulletImage,
  PaymentOptionsAccordionList,
  PaymentOptionsSmartPayModalTabs,
  PaymentOptionsSmartPayInfoModal,
} from '../styledComponents';
import { PaymentOptionsSmartPayModalProps } from '../types';
import { Section } from '@/common/types';
import CustomNextImage from '@/components/common/components/CustomNextImage';

/**
 * PaymentOptionsSmartPayModal component renders a modal with tabs for "About" and "FAQs".
 *
 * @param {PaymentOptionsSmartPayModalProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */

const PaymentOptionsSmartPayModal = ({
  modal: {
    title: modalTitle = '',
    content: { section = [] } = { section: [] },
  },
  showModal,
  toggleModal,
  subdomain,
}: PaymentOptionsSmartPayModalProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState(0);

  const modalProps = useMemo(
    () => ({
      show: showModal,
      closeModal: toggleModal,
      modalTitle,
    }),
    [showModal, toggleModal, modalTitle],
  );

  const tabTitles = useMemo(
    () => section.map(({ title }) => title) ?? '',
    [section],
  );
  const TabsProps = useMemo(
    () => ({
      brand: subdomain,
      selected: activeTab,
      setSelected: setActiveTab,
      tabs: tabTitles.map((title) => ({ label: title ?? '' })),
    }),
    [subdomain, activeTab, tabTitles],
  );

  const renderAboutContainer = ({ title, body, options }: Section) => {
    return (
      <PaymentOptionsSmartPayAboutContainer key={`about-tabs-${title}`}>
        {body && (
          <PaymentOptionsSmartPayAboutBody>
            {body}
          </PaymentOptionsSmartPayAboutBody>
        )}

        {options?.map(({ image, title: optionTitle }, optionIndex) => (
          <PaymentOptionsSmartPayAboutBullet
            key={`option-${optionIndex}-${optionIndex}`}
          >
            {image?.src && (
              <PaymentOptionsSmartPayAboutBulletImage>
                <CustomNextImage
                  src={image.src}
                  width={30}
                  height={30}
                  alt={image.alt || ''}
                />
              </PaymentOptionsSmartPayAboutBulletImage>
            )}
            <PaymentOptionsSmartPayAboutBulletItem>
              {optionTitle}
            </PaymentOptionsSmartPayAboutBulletItem>
          </PaymentOptionsSmartPayAboutBullet>
        ))}
      </PaymentOptionsSmartPayAboutContainer>
    );
  };

  const renderFAQsContainer = ({ title, options }: Section) => (
    <PaymentOptionsSmartPayFaqContainer key={`faqs-${title}`}>
      <PaymentOptionsAccordionList>
        <AccordionList headline={''} subHeadline={''} options={options || []} />
      </PaymentOptionsAccordionList>
    </PaymentOptionsSmartPayFaqContainer>
  );

  // Render Tab Content Dynamically
  const renderTabContent = (section: Section, index: number) => {
    if (activeTab !== index) return null;

    switch (section.title) {
    case 'About':
      return renderAboutContainer(section);
    case 'FAQS':
      return renderFAQsContainer(section);
    default:
      return null;
    }
  };

  return (
    <PaymentOptionsSmartPayModalMainContainer>
      <PaymentOptionsSmartPayInfoModal {...modalProps}>
        <PaymentOptionsSmartPayModalTabs>
          <Tabs {...TabsProps}>
            {section?.map((section, index) =>
              renderTabContent(section, index),
            )}
          </Tabs>
        </PaymentOptionsSmartPayModalTabs>
      </PaymentOptionsSmartPayInfoModal>
    </PaymentOptionsSmartPayModalMainContainer>
  );
};

export default PaymentOptionsSmartPayModal;
import {
  PaymentOptionsOfferDetailsMainContainer,
  PaymentOptionsOfferDetailsBody,
  PaymentOptionsOfferDetailsBodyTitle,
  PaymentOptionsOfferDetailsFooter,
  PaymentOptionsOfferDetailsModal,
} from '../styledComponents';
import { PaymentOptionsOfferDetailsProps } from '../types';
/**
 * PaymentOptionsOfferDetails component renders the modal with payment option details.
 *
 * @param {PaymentOptionsOfferDetailsProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */

const PaymentOptionsOfferDetails = ({
  modal,
  showModal,
  toggleModal,
}: PaymentOptionsOfferDetailsProps): JSX.Element => {
  const modalProps = {
    show: showModal,
    closeModal: toggleModal,
    modalTitle: modal.title ?? '',
  };

  return (
    <PaymentOptionsOfferDetailsMainContainer>
      <PaymentOptionsOfferDetailsModal {...modalProps}>
        <PaymentOptionsOfferDetailsBody>
          {modal.content?.section.map((obj, index) => (
            <PaymentOptionsOfferDetailsBodyTitle
              key={'paymentOptionsOfferDetailsBodyTitle-' + index}
            >
              {obj.title}
            </PaymentOptionsOfferDetailsBodyTitle>
          ))}
        </PaymentOptionsOfferDetailsBody>
        <PaymentOptionsOfferDetailsFooter>
          {modal.footer?.title}
        </PaymentOptionsOfferDetailsFooter>
      </PaymentOptionsOfferDetailsModal>
    </PaymentOptionsOfferDetailsMainContainer>
  );
};

export default PaymentOptionsOfferDetails;

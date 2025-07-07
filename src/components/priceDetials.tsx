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




// PaymentOptionsPriceDetails.tsx
import React from 'react';
import './PaymentOptionsPrice.scss';
import { Options, SKU } from '@/common/types';

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
    <div className="price-container">
      <span className="price-pre-text">{preText}</span>
      <span className="price-text">
        {finalPrice}
        <span className="cent-text">{cents}</span>
      </span>
      <span className="price-post-text">{postText}</span>
    </div>
  );
};

export default PaymentOptionsPriceDetails;

.price-container {
  display: flex;
  align-items: center;
  gap: 4px;
}

.price-pre-text {
  font-size: 14px;
  color: #555;
}

.price-text {
  font-size: 20px;
  font-weight: bold;
  color: #222;

  .cent-text {
    font-size: 12px;
    vertical-align: super;
    margin-left: 2px;
  }
}

.price-post-text {
  font-size: 14px;
  color: #888;
}


// PaymentOptionsSmartPayModal.tsx
import React, { useMemo, useState } from 'react';
import { Tabs } from 'value-design-system/src/Organisms/Tabs';
import { AccordionList } from 'value-design-system/src/Molecules/AccordionList';
import './PaymentOptionsSmartPayModal.scss';
import { PaymentOptionsSmartPayModalProps } from '../types';
import { Section } from '@/common/types';
import CustomNextImage from '@/components/common/components/CustomNextImage';

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

  const tabTitles = useMemo(() => section.map(({ title }) => title), [section]);

  const TabsProps = useMemo(
    () => ({
      brand: subdomain,
      selected: activeTab,
      setSelected: setActiveTab,
      tabs: tabTitles.map((title) => ({ label: title ?? '' })),
    }),
    [subdomain, activeTab, tabTitles],
  );

  const renderAboutContainer = ({ title, body, options }: Section) => (
    <div className="about-container" key={`about-tabs-${title}`}>
      {body && <p className="about-body">{body}</p>}
      {options?.map(({ image, title: optionTitle }, optionIndex) => (
        <div className="bullet" key={`option-${optionIndex}-${optionIndex}`}>
          {image?.src && (
            <div className="bullet-image">
              <CustomNextImage
                src={image.src}
                width={30}
                height={30}
                alt={image.alt || ''}
              />
            </div>
          )}
          <span className="bullet-item">{optionTitle}</span>
        </div>
      ))}
    </div>
  );

  const renderFAQsContainer = ({ title, options }: Section) => (
    <div className="faq-container" key={`faqs-${title}`}>
      <div className="accordion-list">
        <AccordionList headline={''} subHeadline={''} options={options || []} />
      </div>
    </div>
  );

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
    <div className="smartpay-modal">
      <div className="smartpay-info-modal">
        <div className="smartpay-tabs">
          <Tabs {...TabsProps}>
            {section.map((section, index) => renderTabContent(section, index))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptionsSmartPayModal;

.smartpay-modal {
  padding: 16px;
}

.smartpay-info-modal {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
}

.smartpay-tabs {
  margin-top: 12px;
}

.about-container {
  margin-bottom: 20px;
}

.about-body {
  font-size: 16px;
  margin-bottom: 16px;
  color: #333;
}

.bullet {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  .bullet-image {
    margin-right: 10px;
    width: 30px;
    height: 30px;
  }

  .bullet-item {
    font-size: 14px;
    color: #444;
  }
}

.faq-container {
  margin-top: 16px;
}

.accordion-list {
  margin-top: 8px;
}


// PaymentOptionsOfferDetails.tsx
import React from 'react';
import './PaymentOptionsOfferDetails.scss';
import { PaymentOptionsOfferDetailsProps } from '../types';

const PaymentOptionsOfferDetails = ({
  modal,
  showModal,
  toggleModal,
}: PaymentOptionsOfferDetailsProps): JSX.Element => {
  return (
    <div className="offer-details">
      <div className="offer-modal">
        <div className="offer-body">
          {modal.content?.section.map((obj, index) => (
            <h3 key={index} className="offer-title">{obj.title}</h3>
          ))}
        </div>
        <div className="offer-footer">{modal.footer?.title}</div>
      </div>
    </div>
  );
};

export default PaymentOptionsOfferDetails;

.offer-details {
  padding: 20px;
  background-color: #f9f9f9;
}

.offer-modal {
  background-color: #fff;
  border-radius: 6px;
  padding: 20px;
}

.offer-body {
  margin-bottom: 16px;
}

.offer-title {
  font-size: 18px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #222;
}

.offer-footer {
  font-size: 16px;
  font-weight: 500;
  color: #555;
}



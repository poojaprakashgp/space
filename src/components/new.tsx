import React, { useEffect, useMemo, useState } from 'react';
import RadioOn from '@/public/assets/tbv/radio-on.svg';
import RadioOff from '@/public/assets/tbv/radio-off.svg';
import CustomNextImage from '@/components/common/components/CustomNextImage';
import { isValidKeyDownKeys } from '@/helpers/keyboardUtils';
import {
  DeviceSectionContent,
  PaymentOptionDetails,
  ChoosePaymentSection,
  ImgType,
} from '@/common/types';
import Markdown from 'markdown-to-jsx';
import Button from '@/common/molecules/Button/Button';
import { Modal } from '@/common/molecules/Modal/Modal';
import { removeDollarSymbol } from '@/helpers/uriUtils';
import { isValueObject } from '@/components/Pdp/common/helper/utils';
import ProductReviewCouponExclusions from './ProductReviewCouponExclusions';
import PaymentOptionsSmartPayModal from '@/common/templates/Recommendation/PaymentOptionsSmartPayModal';

interface ChoosePaymentProps {
  fullPrice: number;
  selectedPaymentOption: string;
  setSelectedPaymentOption: (_selectedOption: string) => void;
  DEVICE_DETAILS_CONTENT_SECTION: DeviceSectionContent[] | undefined;
}

const formatPrice = (option: PaymentOptionDetails, fullPrice: number) => {
  const discounted = option.price?.discountedPrice ?? '0';
  const parsedDiscounted = parseFloat(discounted.replace(/[^0-9.-]+/g, '') || '0');

  return {
    preText: option.price?.preText || '',
    fullPrice:
      option.id === 'full_price'
        ? fullPrice
        : parseFloat(option.price?.fullPrice || '0') || 0,
    postText: option.price?.postText || '',
    veriffPrice: option.price?.veriffPrice || '',
    discountedPrice:
      option.id === 'full_price' ? parsedDiscounted : parseFloat(discounted) || 0,
  };
};

const ChoosePaymentOptionList = ({
  options,
  fullPrice,
  selectedPaymentOption,
  setSelectedPaymentOption,
}: {
  options: PaymentOptionDetails[];
  fullPrice: number;
  selectedPaymentOption: string;
  setSelectedPaymentOption: (_selected: string) => void;
}) => {
  return (
    <>
      {options.map((option) => (
        <ChoosePaymentSelection
          key={option.id}
          title={option.title}
          subTitle={option.body}
          price={formatPrice(option, fullPrice)}
          setSelectedPaymentOption={setSelectedPaymentOption}
          selectedPaymentOption={selectedPaymentOption}
          option={option}
          image={option?.image}
        />
      ))}
    </>
  );
};

const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="accordion__wrapper">
      <button className="accordion__toggle" onClick={() => setIsOpen(!isOpen)}>
        {title} {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && <div className="accordion__content">{children}</div>}
    </div>
  );
};

const ChoosePayment: React.FC<ChoosePaymentProps> = ({
  fullPrice,
  selectedPaymentOption,
  setSelectedPaymentOption,
  DEVICE_DETAILS_CONTENT_SECTION,
}) => {
  const choosePaymentSection = useMemo(
    () =>
      DEVICE_DETAILS_CONTENT_SECTION?.find(
        (section): section is ChoosePaymentSection =>
          section?.id === 'choose_payment_option',
      ),
    [DEVICE_DETAILS_CONTENT_SECTION],
  );

  const couponExclusionsSection = useMemo(
    () =>
      DEVICE_DETAILS_CONTENT_SECTION?.find(
        (section): section is ChoosePaymentSection =>
          section?.id === 'coupon_exclusions',
      ),
    [DEVICE_DETAILS_CONTENT_SECTION],
  );

  const paymentOptions: PaymentOptionDetails[] =
    choosePaymentSection?.content?.section?.[0]?.options || [];

  const sectionTitle = choosePaymentSection?.title || '';

  const [firstOption, ...otherOptions] = paymentOptions;
  const showAccordion = paymentOptions.length > 2;

  return (
    <>
      <div className="choose-payment__wrapper">
        <p className="choose-payment__title">{sectionTitle}</p>
        <div className="choose-payment__option-wrapper">
          {firstOption && (
            <ChoosePaymentSelection
              key={firstOption.id}
              title={firstOption.title}
              subTitle={firstOption.body}
              price={formatPrice(firstOption, fullPrice)}
              setSelectedPaymentOption={setSelectedPaymentOption}
              selectedPaymentOption={selectedPaymentOption}
              option={firstOption}
              image={firstOption?.image}
            />
          )}

          {showAccordion ? (
            <Accordion title="See other payment options">
              <ChoosePaymentOptionList
                options={otherOptions}
                fullPrice={fullPrice}
                selectedPaymentOption={selectedPaymentOption}
                setSelectedPaymentOption={setSelectedPaymentOption}
              />
            </Accordion>
          ) : (
            <ChoosePaymentOptionList
              options={otherOptions}
              fullPrice={fullPrice}
              selectedPaymentOption={selectedPaymentOption}
              setSelectedPaymentOption={setSelectedPaymentOption}
            />
          )}
        </div>
      </div>

      <ProductReviewCouponExclusions
        title={couponExclusionsSection?.title ?? ''}
        cta={couponExclusionsSection?.cta}
        modal={couponExclusionsSection?.modal}
      />
    </>
  );
};

// [Keep the rest of ChoosePaymentSelection and PaymentModal unchanged from your original code.]

export default ChoosePayment;

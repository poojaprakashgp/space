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
  // eslint-disable-next-line no-unused-vars
  setSelectedPaymentOption: (_selectedOption: string) => void;
  DEVICE_DETAILS_CONTENT_SECTION: DeviceSectionContent[] | undefined;
}

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

  return (
    <>
      <div className="choose-payment__wrapper">
        <p className="choose-payment__title">{sectionTitle}</p>
        <div className="choose-payment__option-wrapper">
          {paymentOptions.map((option: PaymentOptionDetails) => (
            <ChoosePaymentSelection
              key={option.id}
              title={option.title}
              subTitle={option.body}
              price={{
                preText: option.price?.preText || '',
                fullPrice:
                  option.id === 'full_price'
                    ? fullPrice
                    : parseFloat(option.price?.fullPrice || '0') || 0,
                postText: option.price?.postText || '',
                veriffPrice: option.price?.veriffPrice || '',
                discountedPrice:
                  (option.id === 'full_price' &&
                    parseFloat(
                      (option.price?.discountedPrice?.replace(
                        /[^0-9.-]+/g,
                        '',
                      ) ??
                        '') ||
                        '0',
                    )) ||
                  0,
              }}
              setSelectedPaymentOption={setSelectedPaymentOption}
              selectedPaymentOption={selectedPaymentOption}
              option={option}
              image={option?.image}
            />
          ))}
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

interface ChoosePaymentSelectionProps {
  title?: string;
  subTitle?: string;
  price: {
    preText?: string;
    fullPrice?: number;
    postText?: string;
    veriffPrice?: string;
    discountedPrice?: number;
  };
  // eslint-disable-next-line no-unused-vars
  setSelectedPaymentOption?: (_selectedOption: string) => void;
  selectedPaymentOption: string;
  option: PaymentOptionDetails;
  image?: ImgType
}

const ChoosePaymentSelection: React.FC<ChoosePaymentSelectionProps> = ({
  title = '',
  subTitle = '',
  price: { preText = '', postText = '', veriffPrice = '', discountedPrice = 0 },
  setSelectedPaymentOption,
  selectedPaymentOption,
  option,
  image
}) => {
  const [selected, setSelected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const priceDollarFormatter = useMemo(() => {
    const priceToUse =
      option.id === 'veriff_only_price'
        ? parseFloat(removeDollarSymbol(veriffPrice)) || 0
        : discountedPrice;
    return String(priceToUse).split('.')[0];
  }, [veriffPrice, option.id, discountedPrice]);

  const priceCentFormatter = useMemo(() => {
    const priceToUse =
      option.id === 'veriff_only_price'
        ? parseFloat(removeDollarSymbol(veriffPrice)) || 0
        : discountedPrice;
    return String(priceToUse).split('.')[1] || '00';
  }, [veriffPrice, option.id, discountedPrice]);

  const handlePaymentSelection = () => {
    setSelected(!selected);
    if (setSelectedPaymentOption) {
      setSelectedPaymentOption(!selected ? title : '');
    }
    if (option.id === 'veriff_only_price' && typeof window !== 'undefined') {
      const existingVeriffOffer = localStorage.getItem('veriffOffer');
      if (existingVeriffOffer) {
        const deviceId = JSON.parse(existingVeriffOffer);
        const cleanVeriffPrice = removeDollarSymbol(veriffPrice);
        const newVeriffOffer = {
          deviceId: isValueObject(deviceId) ? deviceId.deviceId : deviceId,
          veriffPrice: cleanVeriffPrice,
        };

        localStorage.setItem('veriffOffer', JSON.stringify(newVeriffOffer));
      }
    }
  };

  const renderImage = () => {
    if (!image?.src) return null;

    return (
      <img
        className='payment-options__image'
        src={image.src}
        alt={image.alt ?? 'Payment Option Image'}
      />
    );
  };

  useEffect(() => {
    if (selectedPaymentOption && selected) {
      if (selectedPaymentOption !== title) {
        setSelected(false);
      }
    }
  }, [selectedPaymentOption, selected, title]);

  const toggleModal = () => setShowModal((prev) => !prev);

  const renderModal = () => {
    if (!option.modal) return null;

    return (
      <Modal
        className='payment-options-modal__wrapper'
        show={showModal}
        titleClassName='payment-options-modal__header'
        closeModal={toggleModal}
        modalTitle={option.modal.title}
        ariaLabel={option.modal.title}
      >
        <PaymentOptionsSmartPayModal modal={option.modal} />
      </Modal>
    );
  };

  return (
    <div className="choose-payment__option-container">
      <div
        className="choose-payment__option"
        onClick={() => handlePaymentSelection()}
        onKeyDown={(e) => {
          if (isValidKeyDownKeys(e.nativeEvent)) handlePaymentSelection();
        }}
      >
        <div className="choose-payment__left-side">
          <div>
            <div style={{ display: selected ? 'none' : 'block' }}>
              <CustomNextImage
                src={RadioOff}
                width={24}
                height={24}
                alt={'Selected payment option'}
              />
            </div>
            <div style={{ display: selected ? 'block' : 'none' }}>
              <CustomNextImage
                src={RadioOn}
                width={24}
                height={24}
                alt={'Selected payment option'}
              />
            </div>
          </div>
          <div>
            <p className="choose-payment__option-title">{title}</p>
            <p className="choose-payment__option-title-subtext">
              <Markdown>{`${subTitle}`.replaceAll('<br/>', ', ')}</Markdown>
            </p>
            {/* {body && (
              <div className='payment-options__body-content'>{body}</div>
            )} */}
            {renderImage()}
          </div>
        </div>
        <div className="choose-payment__option-price-wrapper">
          <p
            className={`choose-payment__option-price-subtext--black ${option.id === 'full_price' ? 'strikeout' : ''}`}
          >
            {preText}
          </p>
          <div className="choose-payment__option-fullprice-wrapper">
            <p className="choose-payment__option-fullprice">
              ${priceDollarFormatter}
            </p>
            <p className="choose-payment__option-fullprice-cents">
              {priceCentFormatter}
            </p>
          </div>
          <p className="choose-payment__option-price-subtext">{postText}</p>
        </div>
      </div>

      {option?.cta && (
        <Button
          className="payment-options__offer payment-offer"
          label={option.cta.text}
          size="small"
          onClick={toggleModal}
        />
      )}
      
      {renderModal()}

      {option?.id === 'veriff_only_price' && option?.modal && (
        <PaymentModal
          showModal={showModal}
          toggleModal={toggleModal}
          option={option}
          className="payment-offer-modal"
        />
      )}
    </div>
  );
};

interface PaymentModalProps {
  showModal: boolean;
  toggleModal: () => void;
  option: PaymentOptionDetails;
  className?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  showModal,
  toggleModal,
  option,
  className = '',
}) => {
  const modalProps = {
    show: showModal,
    closeModal: toggleModal,
    modalTitle: option.modal?.title || '',
    className: className,
  };

  const renderDotListContent = () => {
    if (option.modal?.content?.type === 'DOT_LIST') {
      return (
        <ul className="payment-modal__dot-list">
          {option.modal.content.section?.map((item, index) =>
            item?.title ? (
              <li key={index + item.title} className="payment-modal__dot-item">
                {item.title}
              </li>
            ) : null,
          )}
        </ul>
      );
    }
    return null;
  };

  return (
    <Modal {...modalProps}>
      <div className="payment-modal__content">
        {renderDotListContent()}

        {option.modal?.footer?.title && (
          <p className="payment-modal__footer">{option.modal.footer.title}</p>
        )}
      </div>
    </Modal>
  );
};

export default ChoosePayment;

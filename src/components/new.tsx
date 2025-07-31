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
import UpCaret from '@vds/core/icons/up-caret';
import DownCaret from '@vds/core/icons/down-caret';

interface ChoosePaymentProps {
  fullPrice: number;
  selectedPaymentOption: string;
  // eslint-disable-next-line no-unused-vars
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
    smartPayPrice: option.price?.smartPayPrice || '',
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

interface ChoosePaymentSelectionProps {
  title?: string;
  subTitle?: string;
  price: {
    preText?: string;
    fullPrice?: number;
    postText?: string;
    veriffPrice?: string;
    discountedPrice?: number;
    smartPayPrice?: string;
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
  price: { preText = '', postText = '', veriffPrice = '', discountedPrice = 0, smartPayPrice = '' },
  setSelectedPaymentOption,
  selectedPaymentOption,
  option,
  image
}) => {
  const [selected, setSelected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const priceDollarFormatter = useMemo(() => {
    const smartpayOrVeriffPrice = option.id === 'veriff_only_price' ? veriffPrice : smartPayPrice;
    const priceToUse =
      (option.id === 'veriff_only_price' || option.id === 'payment_plan')
        ? parseFloat(removeDollarSymbol(smartpayOrVeriffPrice)) || 0
        : discountedPrice;
    return String(priceToUse).split('.')[0];
  }, [veriffPrice, option.id, discountedPrice, smartPayPrice]);

  const priceCentFormatter = useMemo(() => {
    const smartpayOrVeriffPrice = option.id === 'veriff_only_price' ? veriffPrice : smartPayPrice;
    const priceToUse =
      (option.id === 'veriff_only_price' || option.id === 'payment_plan')
        ? parseFloat(removeDollarSymbol(smartpayOrVeriffPrice)) || 0
        : discountedPrice;
    return String(priceToUse).split('.')[1] || '00';
  }, [veriffPrice, option.id, discountedPrice, smartPayPrice]);

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
        data-testid="payment-option-image"
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

  const renderPaymentOptionModal = () => {
    if (!option.modal) return null;

    let modalContent = null;
    let modalClassName = 'payment-options-modal__wrapper';

    if (option.id === 'veriff_only_price') {
      modalContent = <PaymentModal modal={option.modal} />;
      modalClassName = 'payment-offer-modal'; // Specific class for veriff modal
    } else if (option.id === 'payment_plan') {
      modalContent = <PaymentOptionsSmartPayModal modal={option.modal} />;
    } else {
      return null;
    }

    return (
      <Modal
        className={modalClassName}
        show={showModal}
        titleClassName='payment-options-modal__header'
        closeModal={toggleModal}
        modalTitle={option.modal.title}
        ariaLabel={option.modal.title}
        data-testid="modal"
      >
        {modalContent}
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
                alt={'Unselected payment option radio'}
              />
            </div>
            <div style={{ display: selected ? 'block' : 'none' }}>
              <CustomNextImage
                src={RadioOn}
                width={24}
                height={24}
                alt={'Selected payment option radio'}
              />
            </div>
          </div>
          <div>
            <p className="choose-payment__option-title">{title}</p>
            <div className="choose-payment__option-title-subtext">
              <Markdown>{`${subTitle}`.replaceAll('<br/>', ', ')}</Markdown>
            </div>
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
          className={`payment-options__offer payment-offer ${option.id === 'payment_plan' ? 'payment-options__learn_more' : ''}`}
          label={option.cta.text}
          size="small"
          onClick={toggleModal}
        />
      )}
      
      {renderPaymentOptionModal()}

    </div>
  );
};

interface PaymentModalProps {
  modal: PaymentOptionDetails['modal']; // Explicitly pass modal prop
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  modal,
}) => {
  const renderDotListContent = () => {
    if (modal?.content?.type === 'DOT_LIST') {
      return (
        <ul className="payment-modal__dot-list">
          {modal.content.section?.map((item, index) =>
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
    <div className="payment-modal__content">
      {renderDotListContent()}

      {modal?.footer?.title && (
        <p className="payment-modal__footer">{modal.footer.title}</p>
      )}
    </div>
  );
};

export default ChoosePayment;

const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="accordion">
      <button className="accordion__toggle" onClick={() => setOpen(!open)}>
        {title} {open ? <UpCaret /> : <DownCaret ariaHidden={true} />}
      </button>
      {open && <div className="accordion__content">{children}</div>}
    </div>
  );
};
pleade check why radio button not coming for option smartpay that is plan payment

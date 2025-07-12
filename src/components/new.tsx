import React from 'react';
import CustomNextImage from '@/components/common/components/CustomNextImage';
import { PaymentMethodProps } from '../../../../../types';
import { DigitalWalletType } from './DigitalWalletType';

export const PaymentMethods = ({
  title,
  body,
  footer,
  content: { section = [] },
}: PaymentMethodProps) => {
  const componentMap: { [key: string]: React.ComponentType<any> } = {
    credit_card_brand: ({ image }) =>
      image ? (
        <CustomNextImage
          src={image.src}
          alt="payment method"
          unoptimized
          width={44}
          height={28}
        />
      ) : null,
    credit_card_number: ({ title }) => <span>{title}</span>,
    digitalWalletType: DigitalWalletType,
    smart_pay: ({ image }) =>
      image ? (
        <CustomNextImage
          src={image.src}
          alt="smart pay"
          unoptimized
          width={44}
          height={10}
        />
      ) : null,
    smart_pay_detail: ({ title }) => <span className="smartpay__title">{title}</span>,
    leased_to: ({ title, options }) => (
      <div className="smartpay__lease">
        <span className="smartpay__lease-title">{title}</span>
        {options.map((opt, idx) => (
          <span key={idx}>{opt.title}</span>
        ))}
      </div>
    ),
    leased_from: ({ title, body }) => (
      <div className="smartpay__lease">
        <span className="smartpay__lease-title">{title}</span>
        <div>{body}</div>
      </div>
    ),
    auto_refil: ({ title, body }) => (
      <div className="smartpay__autoref">
        <div className="smartpay__autoref-title">{title}</div>
        <div className="smartpay__autoref-body">{body}</div>
      </div>
    ),
  };

  const renderSection = () =>
    section.map((item) => {
      const Component = componentMap[item.id] || React.Fragment;
      return <Component key={item.id} {...item} />;
    });

  const getItemById = (id: string) => section.find((item) => item.id === id);

  const renderSmartPay = () => {
    const smartPay = getItemById('smart_pay');
    const smartPayDetail = getItemById('smart_pay_detail');
    const leasedTo = getItemById('leased_to');
    const leasedFrom = getItemById('leased_from');
    const autoRefil = getItemById('auto_refil');

    return (
      <div className="smartpay">
        {body && <span className="smartpay__body">{body}</span>}

        {smartPay && smartPayDetail && (
          <div className="smartpay__row">
            {React.createElement(componentMap.smart_pay, smartPay)}
            <span className="smartpay__label">{smartPayDetail.title}</span>
          </div>
        )}

        <div className="smartpay__leases">
          {leasedTo && React.createElement(componentMap.leased_to, leasedTo)}
          {leasedFrom && React.createElement(componentMap.leased_from, leasedFrom)}
        </div>

        {autoRefil && (
          <div className="smartpay__autoref">
            {React.createElement(componentMap.auto_refil, autoRefil)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="order-confirmation__card order-confirmation__card--payment">
      <h2 className="order-confirmation__card-title">{title}</h2>
      {section.some((item) => item.id === 'smart_pay') ? renderSmartPay() : (
        <div className="order-confirmation__paymentImg">{renderSection()}</div>
      )}
      {footer?.title && <span className="smartpay__footer">{footer.title}</span>}
    </div>
  );
};


.smartpay {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__body {
    font-size: 14px;
    color: var(--order-summary-text-primary);
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__label {
    font-size: 14px;
    font-weight: 500;
  }

  &__leases {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }

  &__lease {
    display: flex;
    flex-direction: column;
  }

  &__lease-title {
    font-weight: 600;
  }

  &__autoref-title {
    font-weight: 600;
    padding-top: 10px;
  }

  &__autoref-body {
    padding: 10px 0;
  }

  &__footer {
    font-size: 12px;
  }
}

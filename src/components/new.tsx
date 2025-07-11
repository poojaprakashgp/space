import React from 'react';
import CustomNextImage from '@/components/common/components/CustomNextImage';
import { PaymentMethodProps } from '../../../../../types';
import { DigitalWalletType } from './DigitalWalletType';

export const PaymentMethods = ({
  title,
  body, footer,
  content: { section = [] },
}: PaymentMethodProps) => {
  const getSection = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const componentMap: { [key: string]: React.ComponentType<any> } = {
      credit_card_brand: ({ image }: { image: { src: string } }) =>
        image ? (
          <CustomNextImage
            src={image?.src}
            alt="payment method"
            unoptimized={true}
            width={44}
            height={28}
          />
        ) : null,
      credit_card_number: ({ title }: { title: string }) => title,
      digitalWalletType: DigitalWalletType,
      smart_pay: ({ image }: { image: { src: string } }) =>
        image ? (
          <CustomNextImage
            src={image?.src}
            alt="payment method"
            unoptimized={true}
            width={44}
            height={10}
          />
        ) : null,
      smart_pay_detail: ({ title }: { title: string }) => <div>{title}</div>,
      leased_to: ({title, options}: {title: string, options: Array<{title:string}>}) => <div>{title}{options.map((option)=> <span>{option.title}</span>)}</div>,
      leased_from: ({title, body}: {title: string, body: string}) => <div>{title}<div>{body}</div></div>,
      auto_refil: ({title, body}) => <div>{title}<div>{body}</div></div>
    };

    return section.map((item) => {
      const Component = componentMap[item.id] || React.Fragment;
      return <Component key={item.id} {...item} />;
    });
  };

  return (
    <div className="order-confirmation__card order-confirmation__card--payment">
      <h2 className="order-confirmation__card-title">{title}</h2>
      {body && <span>{body}</span>}
      <div className="order-confirmation__paymentImg">{getSection()}</div>
      {footer && <span>{footer.title}</span>}
    </div>
  );
};


.order-confirmation {
  font-family: 'GalanoGrotesque-medium', sans-serif;
  &__container {
    max-width: var(--order-confirmation-width-max);
    margin: var(-order-confirmation-spacing-zero-auto);
    padding: var(--order-confirmation-spacing-md);
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--order-confirmation-spacing-md);
    @media (min-width: 768px) {
      grid-template-columns: var(--order-confirmation-grid-template-column);
    }
  }

  &__main-content {
    padding: var(--order-confirmation-spacing-md);
    border: var(--order-confirmation-border-width-style)
      var(--order-confirmation-border-color);
    background-color: var(--order-confirmation-secondary-color);
    box-shadow: var(--order-confirmation-box-shadow-lg),
      var(--order-confirmation-box-shadow-xl);
    border-radius: var(--order-confirmation-border-radius-md);
  }

  &__content-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--order-confirmation-spacing-sm);
    @media (min-width: 768px) {
      flex-direction: row;
    }
  }

  &__heading {
    font-family: 'GalanoGrotesque-Bold', sans-serif;
    font-size: var(--order-confirmation-font-size-xxl);
    line-height: var(--order-confirmation-line-height-lg);
    font-weight: var(--order-confirmation-font-weight-regular);
  }

  &__left-section {
    width: var(--order-confirmation-bwidth-100);
    @media (min-width: 768px) {
      width: var(--order-confirmation-bwidth-65);
    }
  }

  &__text {
    font-size: var(--order-confirmation-font-size-md);
    color: var(--order-summary-text-primary);
    font-weight: 500;
    &--highlight {
      font-weight: bold;
      color: var(--order-confirmation-primary-color);
    }
  }

  &__headerText {
    font-size: 36px;
    font-weight: 700;
    font-family: 'GalanoGrotesque-Bold', sans-serif;
    color: var(--order-summary-text-primary);
  }

  &__subText {
    font-size: 18px;
    font-weight: 700;
    font-family: 'GalanoGrotesque-Bold', sans-serif;
    color: var(--order-summary-text-primary);
  }

  &__nextMsg {
    width: 481px;
    p {
      font-size: 36px;
      font-weight: 700;
      font-family: 'GalanoGrotesque-Bold', sans-serif;
      color: var(--order-summary-text-primary);
    }
    div {
      font-size: 18px;
      font-weight: 500;
      font-family: 'GalanoGrotesque-medium', sans-serif;
      color: var(--order-summary-text-primary);
    }
  }

  &__shippingText {
    margin: 25px 0;
  }

  &__activationText {
    margin: 30px 0;
  }

  &__activateTips {
    width: 481px;
    font-weight: 500;
    font-size: 18px;
    font-family: 'GalanoGrotesque-medium', sans-serif;
    p {
      font-size: 24px;
      font-weight: 700;
      font-family: 'GalanoGrotesque-Bold', sans-serif;
      color: var(--order-summary-text-primary);
    }
    span,
    a {
      font-weight: 500;
      font-size: 18px;
      font-family: 'GalanoGrotesque-medium', sans-serif;
      color: var(--order-summary-text-primary);
      text-decoration: underline;
    }
  }

  &__link {
    color: var(--order-confirmation-highlight-color);
    text-decoration: underline;
    transition: color var(--order-confirmation-transition-speed)
      var(--order-confirmation-transition-ease);
  }

  &__info-cards {
    display: flex;
    flex-direction: column;
    gap: var(--order-confirmation-spacing-sm);
    margin-top: var(--order-confirmation-spacing-lg);
    @media (min-width: 640px) {
      flex-direction: row;
    }
  }

  &__card {
    border: var(--order-confirmation-border-width-style)
      var(--order-confirmation-border-color);
    border-radius: var(--order-confirmation-border-radius-md);
    padding: var(--order-confirmation-spacing-sm);
    box-shadow: var(--order-confirmation-box-shadow-sm);
    flex: 1;

    &--shipping,
    &--payment,
    &--shipMethod {
      border: var(--order-confirmation-border-width-style)
        var(--order-summary-border-color);
      box-shadow: var(--order-confirmation-box-shadow-md);
      background-color: #ffffff;
      width: 100%;
    }
  }

  &__cartItems {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
    border-radius: 8px;
    padding: 12px;
    margin: 30px 0;
  }

  &__phoneDetail,
  &__planDetail {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  &__subDetails {
    display: flex;
    justify-content: space-between;
  }

  &__paymentImg,
  &__shippingImg {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
  }

  &__phoneDetail {
    flex-direction: column;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 10px;
    &:last-child {
      border-bottom: none;
    }
    &__title {
      display: flex;
      font-size: 16px;
      font-weight: 700;
      font-family: 'GalanoGrotesque-Bold', sans-serif;
      color: var(--order-summary-text-primary);

      img {
        width: 60px;
        height: 60px;
      }
    }

    &__quantity {
      font-weight: 500;
      font-size: calc(var(--base-font-size) * 0.875);
      padding-top: calc(var(--spacing-small) * 0.55);
    }

    &__subtitle {
      font-size: 14px;
      font-weight: 500;
      font-family: 'GalanoGrotesque-medium', sans-serif;
      color: var(--order-summary-text-primary);

      p {
        margin: 0;
      }
    }
    &__price {
      font-size: 14px;
      font-weight: 500;
      font-family: 'GalanoGrotesque-medium', sans-serif;
      color: var(--order-summary-text-primary);
    }
    &__titlecontainer {
      margin-left: 8px;
    }
  }

  &__card-title {
    font-weight: var(--order-confirmation-font-weight-bold);
    margin-bottom: var(--order-confirmation-spacing-xs);
    font-size: var(--order-confirmation-font-size-lg);
    font-family: 'GalanoGrotesque-Bold', sans-serif;
    color: var(--order-summary-text-primary);
  }

  &__card--shipping {
    padding: 24px 24px 24px 16px;
  }
  &__card--payment {
    width: 100%;
  }

  &__paymentMethod {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    height: 350px;
    width: 230px;
  }

  &__right-section {
    width: var(--order-confirmation-bwidth-100);
    @media (min-width: 768px) {
      width: var(--order-confirmation-bwidth-35);
    }
  }

  &__confirmation-container {
    display: flex;
  }

  &__digital-wallet {
    line-height: 1;
    font-size: 14px;
    img {
      width: 100px;
      padding-bottom: 5px;
    }
    &-text {
      padding-bottom: 5px;
    }
  }

  &__digital-wallet-body {
    width: 200px;
    word-break: break-all;
  }

  &__price-footer-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
    max-width: 200px; // adjust as needed for 3–4 line wrap
    word-break: break-word;
    gap: 8px;
  }

  &__price {
    font-size: 16px;
    font-weight: 700;
    color: var(--order-summary-text-primary);
  }

  &__footer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
    font-size: 14px;
    font-weight: 500;
    font-family: 'GalanoGrotesque-medium', sans-serif;

    img {
      margin-top: 4px;
      width: 60px;
      height: 20px;
    }
  }

  &__footer-text {
    max-width: 100%;
    line-height: 1.3;
    white-space: normal;
  }
}

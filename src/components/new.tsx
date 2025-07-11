import React from 'react';
import { OrderLineDetailsProps } from '../../../types';
import CustomNextImage from '@/components/common/components/CustomNextImage';

const OrderLineDetails: React.FC<OrderLineDetailsProps> = ({ content }) => {
  return (
    <div className='order-confirmation__cartItems'>
      {content?.section?.map((section) => {
        const quantity = parseFloat(section?.quantity ?? '0');
        return (
          <div
            key={`cart-item-${section.id}`}
            className='order-confirmation__phoneDetail'
          >
            <div className='order-confirmation__subDetails'>
              <div className='order-confirmation__phoneDetail__title'>
                <CustomNextImage
                  src={section?.image?.src ?? ''}
                  alt=''
                  width={60}
                  height={60}
                />
                <div className='order-confirmation__phoneDetail__titlecontainer'>
                  <div>{section?.title}</div>
                  <div className='order-confirmation__phoneDetail__subtitle'>
                    {section?.content?.section?.map((item) => (
                      <p key={`item-${item.id}`}>{item?.title}</p>
                    ))}
                  </div>
                </div>
              </div>
              <div className='order-confirmation__phoneDetail__title'>
                {section?.price?.fullPrice}
                {quantity > 1 && (
                  <span className='order-confirmation__phoneDetail__quantity'>
                    &nbsp;{`(x${quantity})`}
                  </span>
                )}
                {
                  section?.footer && (
                    <div>{section?.footer.title} {section?.footer.image && <img src={section?.footer.image.src} alt={section?.footer.image.alt} width={10} height={10} style={{display:'inline'}}/>}</div>
                  )
                }
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderLineDetails;


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
}

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
      leased_to: ({title, options}: {title: string, options: Array<{title:string}>}) => <div style={{  display: 'flex',
            flexDirection: 'column'}}><span style={{fontWeight: 600}}>{title}</span>{options.map((option)=> <span>{option.title}</span>)}</div>,
      leased_from: ({title, body}: {title: string, body: string}) => <div><span style={{fontWeight: 600}}>{title}</span><div>{body}</div></div>,
      auto_refil: ({title, body}) => <div style={{paddingTop:10}}>{title}<div style={{padding: 10}}>{body}</div></div>
    };

    return section.map((item) => {
      const Component = componentMap[item.id] || React.Fragment;
      return <Component key={item.id} {...item} />;
    });
  };

  return (
  <div className="order-confirmation__card order-confirmation__card--payment">
    <h2 className="order-confirmation__card-title">{title}</h2>
    {section.some((item) => item.id === 'smart_pay') ? (
      <div className="order-confirmation__smartpay">
          <span style={{fontSize: '14px'}}>{body}</span>
          <div className="order-confirmation__smartpay-row">
          {getSection().find((el) => el.key === 'smart_pay')}
          <span className="order-confirmation__smartpay-body">
            {section.find((item) => item.id === 'smart_pay_detail')?.title}
          </span>
        </div>

        {/* Leased To and From side by side */}
        <div className="order-confirmation__smartpay-leases">
          {getSection().find((el) => el.key === 'leased_to')}
          {getSection().find((el) => el.key === 'leased_from')}
        </div>
        <div>
        {getSection().find((el) => el.key === 'auto_refil')}
        </div>
      </div>
    ) : (
      <div className="order-confirmation__paymentImg">{getSection()}</div>
    )}

    {footer?.title && <span style={{fontSize: '12px'}}>{footer.title}</span>}
  </div>
  );
};


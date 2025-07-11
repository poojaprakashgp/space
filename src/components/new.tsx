return (
  <div className="order-confirmation__card order-confirmation__card--payment">
    <h2 className="order-confirmation__card-title">Payment Method</h2>

    {/* If SmartPay is present, render special layout */}
    {section.some((item) => item.id === 'smart_pay') ? (
      <div className="order-confirmation__smartpay">
        {/* smart_pay_detail title */}
        <div className="order-confirmation__smartpay-title">
          {
            getSection().find(
              (element) =>
                React.isValidElement(element) &&
                element.key === 'smart_pay_detail'
            )
          }
        </div>

        {/* smart_pay image + body */}
        <div className="order-confirmation__smartpay-icon-row">
          {
            getSection().find(
              (element) =>
                React.isValidElement(element) && element.key === 'smart_pay'
            )
          }
          {
            getSection().find(
              (element) =>
                React.isValidElement(element) &&
                element.key === 'smart_pay_detail_body'
            )
          }
        </div>

        {/* leased_to + leased_from side by side */}
        <div className="order-confirmation__smartpay-leases">
          {['leased_to', 'leased_from'].map((leaseId) =>
            getSection().find(
              (element) =>
                React.isValidElement(element) && element.key === leaseId
            )
          )}
        </div>
      </div>
    ) : (
      // fallback to normal rendering if it's not smart_pay
      <div className="order-confirmation__paymentImg">{getSection()}</div>
    )}

    {footer && <span>{footer.title}</span>}
  </div>
);

const getSection = () => {
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
    credit_card_number: ({ title }: { title: string }) => <div>{title}</div>,
    digitalWalletType: DigitalWalletType,
    smart_pay: ({ image }: { image: { src: string } }) =>
      image ? (
        <CustomNextImage
          src={image?.src}
          alt="Smart Pay"
          unoptimized={true}
          width={44}
          height={10}
        />
      ) : null,
    smart_pay_detail: ({ title, body }: { title: string; body: string }) => (
      <>
        <div key="smart_pay_detail">{title}</div>
        <div key="smart_pay_detail_body">{body}</div>
      </>
    ),
    leased_to: ({ title, options }: { title: string; options: Array<{ title: string }> }) => (
      <div key="leased_to">
        <div className="order-confirmation__lease-title">{title}</div>
        <div className="order-confirmation__lease-body">
          {options?.map((option, i) => (
            <div key={i}>{option.title}</div>
          ))}
        </div>
      </div>
    ),
    leased_from: ({ title, body }: { title: string; body: string }) => (
      <div key="leased_from">
        <div className="order-confirmation__lease-title">{title}</div>
        <div className="order-confirmation__lease-body">{body}</div>
      </div>
    ),
    auto_refil: ({ title, body }) => (
      <div>
        <div>{title}</div>
        <div>{body}</div>
      </div>
    ),
  };

  return section.map((item) => {
    const Component = componentMap[item.id] || React.Fragment;
    return <Component key={item.id} {...item} />;
  });
};


&__smartpay {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

&__smartpay-title {
  font-size: 16px;
  font-weight: 700;
  font-family: 'GalanoGrotesque-Bold', sans-serif;
  color: var(--order-summary-text-primary);
}

&__smartpay-icon-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

&__smartpay-leases {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

&__lease-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--order-summary-text-primary);
}

&__lease-body {
  font-size: 13px;
  font-weight: 400;
  color: var(--order-summary-text-primary);
}

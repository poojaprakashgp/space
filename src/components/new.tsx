{section.some((item) => item.id === 'smart_pay') ? (
  <div className="order-confirmation__smart-pay-wrapper">
    {/* smart_pay_detail.title */}
    {section
      .filter((item) => item.id === 'smart_pay_detail')
      .map(({ title }) => (
        <div key="smart_pay_detail" className="order-confirmation__smartpay-title">
          {title}
        </div>
      ))}

    {/* smart_pay image + body */}
    <div className="order-confirmation__smartpay-inline">
      {section
        .filter((item) => item.id === 'smart_pay')
        .map(({ image }) => (
          <CustomNextImage
            key="smart_pay"
            src={image?.src}
            alt="Smart Pay"
            width={44}
            height={10}
            unoptimized
          />
        ))}
      {section
        .filter((item) => item.id === 'smart_pay_detail')
        .map(({ body }) => (
          <div key="smart_pay_body" className="order-confirmation__smartpay-body">
            {body}
          </div>
        ))}
    </div>

    {/* leased_to and leased_from side by side */}
    <div className="order-confirmation__smartpay-leases">
      {section
        .filter((item) => item.id === 'leased_to' || item.id === 'leased_from')
        .map((item) => {
          const Component = componentMap[item.id] || React.Fragment;
          return <Component key={item.id} {...item} />;
        })}
    </div>
  </div>
) : (
  <div className="order-confirmation__paymentImg">{getSection()}</div>
)}


&__smart-pay-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

&__smartpay-title {
  font-size: 16px;
  font-weight: bold;
  font-family: 'GalanoGrotesque-Bold', sans-serif;
  color: var(--order-summary-text-primary);
}

&__smartpay-inline {
  display: flex;
  align-items: center;
  gap: 10px;
}

&__smartpay-body {
  font-size: 14px;
  font-weight: 500;
  font-family: 'GalanoGrotesque-medium', sans-serif;
  color: var(--order-summary-text-primary);
}

&__smartpay-leases {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  > div {
    flex: 1;
  }
}

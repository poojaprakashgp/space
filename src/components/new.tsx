return (
  <div className="order-confirmation__card order-confirmation__card--payment">
    <h2 className="order-confirmation__card-title">Payment Method</h2>

    {section.some((item) => item.id === 'smart_pay') ? (
      <div className="order-confirmation__smartpay">
        {/* SmartPay title (from smart_pay_detail.title) */}
        {section.find((item) => item.id === 'smart_pay_detail')?.title && (
          <div className="order-confirmation__smartpay-title">
            {section.find((item) => item.id === 'smart_pay_detail')?.title}
          </div>
        )}

        {/* SmartPay image + body inline */}
        <div className="order-confirmation__smartpay-row">
          {getSection().find((el) => el.key === 'smart_pay')}
          <span className="order-confirmation__smartpay-body">
            {section.find((item) => item.id === 'smart_pay_detail')?.body}
          </span>
        </div>

        {/* Leased To and From side by side */}
        <div className="order-confirmation__smartpay-leases">
          {getSection().find((el) => el.key === 'leased_to')}
          {getSection().find((el) => el.key === 'leased_from')}
        </div>
      </div>
    ) : (
      <div className="order-confirmation__paymentImg">{getSection()}</div>
    )}

    {footer?.title && <span>{footer.title}</span>}
  </div>
);

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

&__smartpay-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

&__smartpay-body {
  font-size: 14px;
  font-weight: 500;
  color: var(--order-summary-text-primary);
}

&__smartpay-leases {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

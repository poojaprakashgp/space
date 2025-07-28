import { useState } from 'react';
import Accordion from '@/common/molecules/Accordion/Accordion'; // Replace this with your actual Accordion component if it exists

...

<div className="choose-payment__option-wrapper">
  {paymentOptions.length <= 2 ? (
    // ✅ Just render them all normally
    paymentOptions.map((option) => (
      <ChoosePaymentSelection
        key={option.id}
        title={option.title}
        subTitle={option.body}
        price={...}
        setSelectedPaymentOption={setSelectedPaymentOption}
        selectedPaymentOption={selectedPaymentOption}
        option={option}
        image={option?.image}
      />
    ))
  ) : (
    <>
      {/* 🚨 Always show the first one outside */}
      <ChoosePaymentSelection
        key={paymentOptions[0].id}
        title={paymentOptions[0].title}
        subTitle={paymentOptions[0].body}
        price={...}
        setSelectedPaymentOption={setSelectedPaymentOption}
        selectedPaymentOption={selectedPaymentOption}
        option={paymentOptions[0]}
        image={paymentOptions[0]?.image}
      />

      {/* 🔽 Accordion for rest */}
      <Accordion title="See other payment options">
        {paymentOptions.slice(1).map((option) => (
          <ChoosePaymentSelection
            key={option.id}
            title={option.title}
            subTitle={option.body}
            price={...}
            setSelectedPaymentOption={setSelectedPaymentOption}
            selectedPaymentOption={selectedPaymentOption}
            option={option}
            image={option?.image}
          />
        ))}
      </Accordion>
    </>
  )}
</div>


// Accordion.tsx
import React, { useState } from 'react';

const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="accordion">
      <button className="accordion__toggle" onClick={() => setOpen(!open)}>
        {title} {open ? '▲' : '▼'}
      </button>
      {open && <div className="accordion__content">{children}</div>}
    </div>
  );
};

export default Accordion;


.accordion {
  margin-top: 1rem;

  &__toggle {
    background: none;
    border: none;
    font-weight: bold;
    cursor: pointer;
    padding: 0.5rem 0;
  }

  &__content {
    padding: 0.5rem 0;
  }
}

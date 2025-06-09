
 
1x
 
 
 
 
 
 
 
 
 
1x
 
 
 
 
 
 
 
 
 
 	
import React from 'react';
 
export const DevicePrice = ({
  title,
  price: { discountedPrice , fullPrice } = {
    discountedPrice: '',
    fullPrice: '',
  },
}: {
  title: string;
  price: { discountedPrice: string; fullPrice: string };
}) => {
  console.log(discountedPrice, 'pricepricepriceprice');
  return (
    <div className="phone-recommendation__title-price-wrapper">
      <div className="plan-desc__title">{title}</div>
      <p className="plan-desc__price">
        <span className="font-light">{discountedPrice ?? fullPrice}</span>
      </p>
    </div>
  );
};
 

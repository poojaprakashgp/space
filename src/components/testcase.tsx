
 	
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


import React from 'react';
import { render, screen } from '@testing-library/react';
import { DevicePrice } from './DevicePrice';

describe('DevicePrice Component', () => {
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  afterEach(() => {
    consoleLogSpy.mockClear();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  it('renders title and discounted price', () => {
    render(
      <DevicePrice
        title="iPhone 14"
        price={{ discountedPrice: '₹70,000', fullPrice: '₹80,000' }}
      />
    );

    expect(screen.getByText('iPhone 14')).toBeInTheDocument();
    expect(screen.getByText('₹70,000')).toBeInTheDocument();
    expect(consoleLogSpy).toHaveBeenCalledWith('₹70,000', 'pricepricepriceprice');
  });

  it('renders title and falls back to fullPrice if discountedPrice is empty', () => {
    render(
      <DevicePrice
        title="Samsung Galaxy"
        price={{ discountedPrice: '', fullPrice: '₹60,000' }}
      />
    );

    expect(screen.getByText('Samsung Galaxy')).toBeInTheDocument();
    expect(screen.getByText('₹60,000')).toBeInTheDocument();
    expect(consoleLogSpy).toHaveBeenCalledWith('', 'pricepricepriceprice');
  });

  it('renders title and empty price when both are empty', () => {
    render(
      <DevicePrice
        title="Nokia"
        price={{ discountedPrice: '', fullPrice: '' }}
      />
    );

    expect(screen.getByText('Nokia')).toBeInTheDocument();
    expect(screen.getByText('')).toBeInTheDocument(); // Empty span
    expect(consoleLogSpy).toHaveBeenCalledWith('', 'pricepricepriceprice');
  });
});


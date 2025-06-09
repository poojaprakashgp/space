
 	
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

DevicePrice > renders title and falls back to fullPrice if discountedPrice is empty
-----
Error: Unable to find an element with the text: ₹60,000. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.Jest
(method) matchers.TestingLibraryMatchers<any, void>.toBeInTheDocument(): void
@description — Assert whether an element is present in the document or not.

@example

<svg data-testid="svg-element"></svg>



 DevicePrice > renders title and empty price when both are empty
-----
Error: Found multiple elements with the text: 

Here are the matching elements:

The detailed error message is suppressed by waitFor

The detailed error message is suppressed by waitFor

The detailed error message is suppressed by waitFor

The detailed error message is suppressed by waitFor



 import React from 'react';
 
export const Preorder = ({ title = "", body = "" }) => {
  return (
    <div className="plan-desc-preorder-wrapper">
      {title && (
        <p>
          {title}
        </p>
      )}
      {body && (
        <p>
          {body}
        </p>
      )}
    </div>
  );
};


  it('renders both title and body when provided', () => {
    render(<Preorder title="Preorder Now" body="Ships in 2 weeks" />);
    expect(screen.getByText('Preorder Now')).toBeInTheDocument();
    expect(screen.getByText('Ships in 2 weeks')).toBeInTheDocument();
  });

  it('renders only title when body is empty', () => {
    render(<Preorder title="Coming Soon" body="" />);
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(screen.queryByText('Ships in 2 weeks')).not.toBeInTheDocument();
  });

  it('renders only body when title is empty', () => {
    render(<Preorder title="" body="Launching next month" />);
    expect(screen.queryByText('Coming Soon')).not.toBeInTheDocument();
    expect(screen.getByText('Launching next month')).toBeInTheDocument();
  });

  it('renders nothing when both title and body are empty', () => {
    const { container } = render(<Preorder title="" body="" />);
    expect(container.querySelector('p')).toBeNull();
  });


 import React from 'react';
import { render, screen } from '@testing-library/react';
import { Preorder } from './Preorder';

describe('Preorder Component', () => {
  it('renders both title and body', () => {
    render(<Preorder title="Preorder Now" body="Ships in 2 weeks" />);
    expect(screen.getByText('Preorder Now')).toBeInTheDocument();
    expect(screen.getByText('Ships in 2 weeks')).toBeInTheDocument();
  });

  it('renders only title when body is empty', () => {
    render(<Preorder title="Coming Soon" body="" />);
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(screen.queryByText('Ships in 2 weeks')).not.toBeInTheDocument();
  });

  it('renders only body when title is empty', () => {
    render(<Preorder title="" body="Launching next month" />);
    expect(screen.queryByText('Coming Soon')).not.toBeInTheDocument();
    expect(screen.getByText('Launching next month')).toBeInTheDocument();
  });

  it('renders nothing when both title and body are empty', () => {
    const { container } = render(<Preorder title="" body="" />);
    expect(container.querySelector('p')).toBeNull();
  });
});


  it('uses default price prop when not provided', () => {
    const { container } = render(
      // @ts-expect-error - intentionally omitting `price` to trigger default
      <DevicePrice title="Default Device" />
    );
    expect(screen.getByText('Default Device')).toBeInTheDocument();
    const priceEl = container.querySelector('.font-light');
    expect(priceEl?.textContent).toBe('');
  });

 jest --coverage --collectCoverageFrom="src/components/DevicePrice.tsx"

 npm run test -- --coverage src/components/__tests__/DevicePrice.test.tsx


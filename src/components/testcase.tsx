

 	
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


 import React from 'react';

export const OutOfStock = ({ title }: { title: string }) => {
  return (
    <div className="phone-recommendation__out-of-stock">
      <span className="phone-recommendation__out-of-stock--text">{title}</span>
    </div>
  );
};

 import React from 'react';
import { render, screen } from '@testing-library/react';
import { OutOfStock } from './OutOfStock';

describe('OutOfStock', () => {
  it('renders the out-of-stock title', () => {
    render(<OutOfStock title="Currently Unavailable" />);
    expect(screen.getByText('Currently Unavailable')).toBeInTheDocument();
  });
});



 it('should redirect to /phones if navigatedViaApp is not true', () => {
  // Setup
  const mockPush = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

  // Override sessionStorage.getItem for this test
  const getItemSpy = jest.spyOn(sessionStorage, 'getItem');
  getItemSpy.mockImplementation((key) => {
    if (key === 'isAgenticEnabledOnConfirmation') return 'true';
    if (key === 'checkoutCartInfo') return null;
    if (key === 'navigatedViaApp') return null; // triggers else block
    return null;
  });

  const removeItemSpy = jest.spyOn(sessionStorage, 'removeItem');

  render(<OrderConfirmationPage />);

  // Assertions
  expect(removeItemSpy).not.toHaveBeenCalled();
  expect(mockPush).toHaveBeenCalledWith(`${getBaseURL()}/phones`);
});


 OrderConfirmationPage > should redirect to /phones if navigatedViaApp is not true
-----
Error: expect(jest.fn()).not.toHaveBeenCalled()

Expected number of calls: 0
Received number of calls: 2

1: "navigatedViaApp"
2: "navigatedViaApp"Jest



 it('should redirect to /phones if navigatedViaApp is not true', () => {
  const mockPush = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

  // Reset sessionStorage mocks for this test
  const getItemSpy = jest.spyOn(window.sessionStorage, 'getItem');
  const removeItemSpy = jest.spyOn(window.sessionStorage, 'removeItem');

  // Set mock implementation to return null (not "true")
  getItemSpy.mockImplementation((key) => {
    if (key === 'navigatedViaApp') return null; // <- triggers `else`
    if (key === 'isAgenticEnabledOnConfirmation') return 'true';
    if (key === 'checkoutCartInfo') return JSON.stringify([{ item: 'test' }]);
    return null;
  });

  render(<OrderConfirmationPage />);

  expect(removeItemSpy).not.toHaveBeenCalled(); // ✅ Now valid
  expect(mockPush).toHaveBeenCalledWith(`${getBaseURL()}/phones`);
});



 

 
 The iPhone 15 has several improvements over the iPhone 14. The iPhone 15 features Dynamic Island, a 48MP Main camera, and an A16 Bionic Chip. The iPhone 15's Super Retina XDR display is also brighter. Here's a comparison: * **Display:** iPhone 15's display is up to 2x brighter in the sun compared to iPhone 14. * **Camera:** iPhone 15 has a 48MP Main camera. * **Chip:** iPhone 15 uses the A16 Bionic Chip. * **Features:** iPhone 15 has Dynamic Island.


import React from 'react';
import { render, screen } from '@testing-library/react';
import { DeviceDetails } from '../index';

// Mock child components
jest.mock('../components/ProductDetails', () => ({
  ProductDetails: () => <div data-testid='ProductDetails'>ProductDetails</div>,
}));
jest.mock('../components/DevicePrice', () => ({
  DevicePrice: () => <div data-testid='DevicePrice'>DevicePrice</div>,
}));
jest.mock('../components/Bestphone', () => ({
  BestPhone: () => <div data-testid='BestPhone'>BestPhone</div>,
}));
jest.mock('@vds/core/icons/down-caret', () => {
  return {
    __esModule: true,
    default: ({ ariaHidden }) => <div data-testid="down-caret-icon" aria-hidden={ariaHidden}>▼</div>
  };
});

jest.mock('@vds/core/icons/up-caret', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="up-caret-icon">▲</div>
  };
});

describe('DeviceDetails', () => {
  it('renders all mapped sections', () => {
    const mockSection = [
      { id: 'best_phone_for_you', someProp: 'foo' },
      { id: 'device_title_price', someProp: 'bar' },
      { id: 'product_details', someProp: 'baz' },
    ];
    render(<DeviceDetails content={{ section: mockSection }} />);
    expect(screen.getByTestId('BestPhone')).toBeInTheDocument();
    expect(screen.getByTestId('DevicePrice')).toBeInTheDocument();
    expect(screen.getByTestId('ProductDetails')).toBeInTheDocument();
  });

  it('renders nothing for unknown section id', () => {
    const mockSection = [{ id: 'unknown_section', someProp: 'foo' }];
    render(<DeviceDetails content={{ section: mockSection }} />);
    // Should not find any of the known test ids
    expect(screen.queryByTestId('BestPhone')).not.toBeInTheDocument();
    expect(screen.queryByTestId('DevicePrice')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ProductDetails')).not.toBeInTheDocument();
  });

  it('renders nothing when no content is provided (default empty section array)', () => {
    render(<DeviceDetails />);
    expect(screen.queryByTestId('BestPhone')).not.toBeInTheDocument();
    expect(screen.queryByTestId('DevicePrice')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ProductDetails')).not.toBeInTheDocument();
  });

  it('renders nothing when content is provided but section is undefined (fallback to empty array)', () => {
    render(<DeviceDetails content={{}} />);
    expect(screen.queryByTestId('BestPhone')).not.toBeInTheDocument();
    expect(screen.queryByTestId('DevicePrice')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ProductDetails')).not.toBeInTheDocument();
  });

  it('renders nothing when section item has null/undefined id (fallback to empty string key)', () => {
    const mockSection = [
      { id: null, someProp: 'foo' },
      { id: undefined, someProp: 'bar' },
    ];
    render(<DeviceDetails content={{ section: mockSection }} />);
    expect(screen.queryByTestId('BestPhone')).not.toBeInTheDocument();
    expect(screen.queryByTestId('DevicePrice')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ProductDetails')).not.toBeInTheDocument();
  });
});

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    C:\Users\pplepo\Desktop\VProject\onevz-value-digital-mfe-shop\node_modules\@vds\core\icons\warning\index.js:7
    import IconBase from '../icon-base';
    ^^^^^^

    SyntaxError: Cannot use import statement outside a module

      12 |   className?: string;
      13 |   closeModal: () => void;
    > 14 |   show: boolean;
         |                                     ^
      15 |   showClose?: boolean;
      16 |   modalTitle?: string | React.ReactNode;
      17 |   titleClassName?: string;

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1505:14)
      at Object.<anonymous> (common/molecules/Modal/Modal.tsx:14:57)
      at Object.<anonymous> (common/templates/Recommendation/PaymentOptionsPrice.tsx:16:16)
      at Object.<anonymous> (common/templates/Recommendation/PaymentOptions.tsx:13:69)
      at Object.<anonymous> (common/organisms/ProductDescription/Components/DeviceDetails/index.tsx:19:64)
      at Object.<anonymous> (common/organisms/ProductDescription/Components/DeviceDetails/test/DeviceDetails.test.tsx:46:16)

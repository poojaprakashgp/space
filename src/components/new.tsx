/* eslint-disable react/display-name */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductDescription from '../productDescription';
import { usePdpContext } from '@/store/contexts/conversationalAI/pdpContext';
import { fetchCityStateDetailFromZipCode } from '@/store/sagas/clientApis/conversationalAI/mapquest';
import '@testing-library/jest-dom';
import { useFeatureFlag } from '@/store/contexts/featureFlagContext';

jest.mock('@/store/contexts/conversationalAI/pdpContext', () => ({
  usePdpContext: jest.fn(),
}));

jest.mock('@/common/molecules/UpdateZipCode/UpdateZipCode', () => (props) => (
  <div data-testid="update-zip-code-modal">
    <button data-testid="close-zip-modal" onClick={() => props.closeModal('12345')}>Close</button>
    UpdateZipCodeMock
  </div>
));

jest.mock('../../MarketAvailabilityModal/MarketAvailabilityModal', () => (props) => (
  <div data-testid="market-availability-modal">
    <button onClick={props.onModalClose} data-testid="close-market-modal">Close</button>
    MarketAvailabilityModalMock
  </div>
));

jest.mock('@vds/core/icons/warning', () => {
  const Warning = (props) => <div data-testid="warning-icon" {...props} />;
  Warning.displayName = 'Warning';
  return Warning;
});

jest.mock('@/store/sagas/clientApis/conversationalAI/marketAvailability', () => ({
  marketAvailability: jest.fn(),
}));

jest.mock('@/store/sagas/clientApis/conversationalAI/mapquest', () => ({
  fetchCityStateDetailFromZipCode: jest.fn(),
}));

jest.mock('../Components/DeviceDetails/index', () => ({
  DeviceDetails: (props) => <div data-testid="device-details">DeviceDetailsMock</div>,
}));

jest.mock('@/store/contexts/featureFlagContext', () => ({
  useFeatureFlag: jest.fn(),
}));

jest.mock('@/common/molecules/Button/Button', () => (props) => (
  <button {...props}>{props.label || 'Button'}</button>
));

jest.mock('@/components/Navigation/common/helper/navigationTopUpdateZipModal', () => ({
  navigationTopUpdateZipModal: { testdomain: { title: 'Test Modal' } },
}));

describe('ProductDescription', () => {
  const defaultProps = {
    handleChooseClick: jest.fn(),
    descriptionData: {
      content: {
        section: [
          {
            id: 'device_details',
            content: {
              section: [
                {
                  id: 'device_title_price',
                  price: { fullPrice: '$100.00', discountedPrice: '$80.00' },
                  title: 'Test Device',
                  content: { section: [], type: 'device_title_price_section' },
                },
              ],
            },
            cta: { text: 'Choose', destination: '', style: '', type: '' },
          },
        ],
      },
    },
    productId: 'prod1',
    SKUs: [{ status: 'Available', id: 'sku1' }],
    selectedSkuId: 'sku1',
    setLoading: jest.fn(),
  };

  beforeEach(() => {
    useFeatureFlag.mockReturnValue({
      featureFlags: {
        ShopCfgProfile: {
          enableVeriffPortInFFlag: false,
          enableSmartPayFFlag: false,
        },
      },
    });

    usePdpContext.mockReturnValue({
      subDomain: 'testdomain',
      pdpDevice: 'testDevice',
    });

    localStorage.setItem('addressDetails', JSON.stringify({ zip_code: '12345' }));
    sessionStorage.setItem('cart', JSON.stringify([]));

    const { marketAvailability } = require('@/store/sagas/clientApis/conversationalAI/marketAvailability');
    marketAvailability.mockResolvedValue(true);

    fetchCityStateDetailFromZipCode.mockResolvedValue({
      zip_code: '12345',
      city: 'TestCity',
      state: 'TS',
      error: false,
    });
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it('renders device details and choose button', () => {
    render(<ProductDescription {...defaultProps} />);
    expect(screen.getByTestId('device-details')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /choose/i })).toBeInTheDocument();
  });

  it('opens UpdateZipCode modal if no zip code is present', async () => {
    localStorage.removeItem('addressDetails');
    render(<ProductDescription {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /choose/i }));
    expect(await screen.findByTestId('update-zip-code-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('close-zip-modal'));
    await waitFor(() => {
      expect(screen.queryByTestId('update-zip-code-modal')).not.toBeInTheDocument();
    });
  });

  it('shows MarketAvailability modal if entered zip is unserviceable', async () => {
    localStorage.removeItem('addressDetails');
    const { marketAvailability } = require('@/store/sagas/clientApis/conversationalAI/marketAvailability');
    marketAvailability.mockResolvedValue(false);

    render(<ProductDescription {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /choose/i }));
    fireEvent.click(await screen.findByTestId('close-zip-modal'));

    expect(await screen.findByTestId('market-availability-modal')).toBeInTheDocument();
  });

  it('calls handleChooseClick if market is available', async () => {
    render(<ProductDescription {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /choose/i }));

    await waitFor(() => {
      expect(defaultProps.handleChooseClick).toHaveBeenCalledWith(
        'prod1', '$80.00', 100, 'Test Device', 'sku1', '12345', ''
      );
    });
  });

  it('disables choose button if no available SKUs', () => {
    render(<ProductDescription {...defaultProps} SKUs={[]} />);
    expect(screen.getByRole('button', { name: /choose/i })).toBeDisabled();
  });

  it('shows and closes MarketAvailabilityModal correctly', async () => {
    const { marketAvailability } = require('@/store/sagas/clientApis/conversationalAI/marketAvailability');
    marketAvailability.mockResolvedValue(false);

    render(<ProductDescription {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /choose/i }));

    expect(await screen.findByTestId('market-availability-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('close-market-modal'));
    await waitFor(() => {
      expect(screen.queryByTestId('market-availability-modal')).not.toBeInTheDocument();
    });
  });

  it('does not show MarketAvailabilityModal if zip is invalid', async () => {
    const { marketAvailability } = require('@/store/sagas/clientApis/conversationalAI/marketAvailability');
    marketAvailability.mockResolvedValue(false);
    fetchCityStateDetailFromZipCode.mockResolvedValue({ error: true });

    render(<ProductDescription {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /choose/i }));

    await waitFor(() => {
      expect(screen.queryByTestId('market-availability-modal')).not.toBeInTheDocument();
    });
  });

  it('handles edge case zip input and modals gracefully', async () => {
    sessionStorage.removeItem('cart');
    localStorage.removeItem('addressDetails');

    render(<ProductDescription {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /choose/i }));

    expect(await screen.findByTestId('update-zip-code-modal')).toBeInTheDocument();

    localStorage.setItem('addressDetails', JSON.stringify({ zip_code: '12345' }));
    fireEvent.click(screen.getByTestId('close-zip-modal'));

    await waitFor(() => {
      expect(screen.queryByTestId('update-zip-code-modal')).not.toBeInTheDocument();
    });
  });
});

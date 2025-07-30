/* eslint-disable react/display-name */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductDescription from '../productDescription';
import { usePdpContext } from '@/store/contexts/conversationalAI/pdpContext';
import { fetchCityStateDetailFromZipCode } from '@/store/sagas/clientApis/conversationalAI/mapquest';
import '@testing-library/jest-dom';
import { useFeatureFlag } from '@/store/contexts/featureFlagContext';
// Mock dependencies
jest.mock('@/store/contexts/conversationalAI/pdpContext', () => ({
  usePdpContext: jest.fn(),
}));

const mockZip = '12345';

jest.mock(
  '@/common/molecules/UpdateZipCode/UpdateZipCode',
  () => (props: any) => (
    <div data-testid='update-zip-code-modal' {...props}>
      <button
        data-testid='close-zip-modal'
        onClick={() => props.closeModal(mockZip)}
      >
        Close
      </button>
      UpdateZipCodeMock
    </div>
  )
);

jest.mock(
  '../../MarketAvailabilityModal/MarketAvailabilityModal',
  () => (props: any) => (
    <div data-testid='market-availability-modal' {...props}>
      <button onClick={props.onModalClose} data-testid='close-market-modal'>
        Close
      </button>
      MarketAvailabilityModalMock
    </div>
  )
);

jest.mock('@vds/core/icons/warning', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Warning: React.FC<{ [key: string]: unknown }> = (props) => (
    <div data-testid='warning-icon' {...props} />
  );
  Warning.displayName = 'Warning';
  return Warning;
});

jest.mock(
  '@/store/sagas/clientApis/conversationalAI/marketAvailability',
  () => ({
    marketAvailability: jest.fn().mockResolvedValue(true),
  })
);

jest.mock('@/store/sagas/clientApis/conversationalAI/mapquest', () => ({
  fetchCityStateDetailFromZipCode: jest.fn().mockResolvedValue({
    zip_code: '12345',
    city: 'TestCity',
    state: 'TS',
    error: false,
  }),
}));

jest.mock('../Components/DeviceDetails/index', () => ({
  DeviceDetails: (props: any) => (
    <div data-testid='device-details' {...props}>
      DeviceDetailsMock
    </div>
  ),
}));
jest.mock('@/store/contexts/featureFlagContext', () => ({
  useFeatureFlag: jest.fn(),
}));

jest.mock('@/common/molecules/Button/Button', () => (props: any) => (
  <button {...props}>{props.label || 'Button'}</button>
));

jest.mock(
  '@/components/Navigation/common/helper/navigationTopUpdateZipModal',
  () => ({
    navigationTopUpdateZipModal: { testdomain: { title: 'Test Modal' } },
  })
);

describe('ProductDescription', () => {
  beforeEach(() => {
    // Mock useFeatureFlag hook
    useFeatureFlag.mockReturnValue({
      featureFlags: {
        ShopCfgProfile: {
          enableVeriffPortInFFlag: false,
        },
      },
    });
    (usePdpContext as jest.Mock).mockReturnValue({
      subDomain: 'testdomain',
      pdpDevice: 'testDevice',
    });
    localStorage.setItem(
      'addressDetails',
      JSON.stringify({ zip_code: '12345' })
    );
    sessionStorage.setItem('cart', JSON.stringify([]));
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
  });

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
                  content: { section: [], type: 'device_title_price_section' }, // <-- add this line
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

  it('renders device details and choose button', () => {
    render(<ProductDescription {...defaultProps} />);
    expect(screen.getByTestId('device-details')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /choose/i })).toBeInTheDocument();
  });

  it('opens UpdateZipCode modal if no zip code is present', async () => {
    localStorage.removeItem('addressDetails');
    render(<ProductDescription {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /choose/i }));
    expect(
      await screen.findByTestId('update-zip-code-modal')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-zip-modal'));
    expect(
      await screen.queryByTestId('update-zip-code-modal')
    ).not.toBeInTheDocument();
  });

  it('shows MarketAvailability modal if UpdateZipCode modal enters unserviceable zip', async () => {
    localStorage.removeItem('addressDetails');
    const {
      marketAvailability,
    } = require('@/store/sagas/clientApis/conversationalAI/marketAvailability');
    marketAvailability.mockResolvedValue(false);

    render(<ProductDescription {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /choose/i }));

    expect(
      await screen.findByTestId('update-zip-code-modal')
    ).toBeInTheDocument();
    screen.debug();

    // mocked to work as continue button click, i.e. sends zip in closeModal prop func.
    fireEvent.click(screen.getByTestId('close-zip-modal'));

    expect(
      await screen.findByTestId('market-availability-modal')
    ).toBeInTheDocument();
  });

  it('calls handleChooseClick when choose is clicked and market is available', async () => {
    const {
      marketAvailability,
    } = require('@/store/sagas/clientApis/conversationalAI/marketAvailability');
    marketAvailability.mockResolvedValue(true);

    render(<ProductDescription {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /choose/i }));
    await waitFor(() => {
      expect(defaultProps.handleChooseClick).toHaveBeenCalledWith(
        'prod1',
        '$80.00',
        100,
        'Test Device',
        'sku1',
        '12345',
        ''
      );
    });
  });

  it('disables choose button if no available SKUs', () => {
    render(<ProductDescription {...defaultProps} SKUs={[]} />);
    expect(screen.getByRole('button', { name: /choose/i })).toBeDisabled();
  });

  it('shows MarketAvailabilityModal if not serviceable', async () => {
    const {
      marketAvailability,
    } = require('@/store/sagas/clientApis/conversationalAI/marketAvailability');
    marketAvailability.mockResolvedValue(false);

    render(<ProductDescription {...defaultProps} onColorChange={jest.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /choose/i }));

    expect(
      await screen.findByTestId('market-availability-modal')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-market-modal'));

    expect(
      screen.queryByTestId('market-availability-modal')
    ).not.toBeInTheDocument();
  });

  it('does not show error MarketAvailabilityModal if invalid zip', async () => {
    const {
      marketAvailability,
    } = require('@/store/sagas/clientApis/conversationalAI/marketAvailability');
    marketAvailability.mockResolvedValue(false);

    // returning false to simulate error/invalid zip code flow
    (fetchCityStateDetailFromZipCode as jest.Mock).mockReturnValue({
      error: true,
    });

    render(<ProductDescription {...defaultProps} onColorChange={jest.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /choose/i }));

    expect(
      screen.queryByTestId('market-availability-modal')
    ).not.toBeInTheDocument();
  });

  it('handle edge cases gracefully', async () => {
    sessionStorage.removeItem('cart');
    localStorage.removeItem('addressDetails');
    const mockChoose = jest.fn();

    const edgeCaseProps = {
      handleChooseClick: mockChoose,
      descriptionData: {
        content: {
          section: [
            {
              id: 'device_details',
              content: {
                section: [
                  {
                    id: '',
                    price: { fullPrice: '$100.00', discountedPrice: '$80.00' },
                    title: 'Test Device',
                    content: {
                      section: [],
                      type: 'device_title_price_section',
                    },
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
      onColorChange: jest.fn(),
      setLoading: jest.fn(),
    };

    render(<ProductDescription {...edgeCaseProps} />);

    expect(screen.getByTestId('device-details')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /choose/i }));

    expect(
      await screen.findByTestId('update-zip-code-modal')
    ).toBeInTheDocument();
    localStorage.setItem(
      'addressDetails',
      JSON.stringify({ zip_code: mockZip })
    );
    screen.debug();

    fireEvent.click(screen.getByTestId('close-zip-modal'));
    expect(
      screen.queryByTestId('update-zip-code-modal')
    ).not.toBeInTheDocument();
  });
});



/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Button from '@/common/molecules/Button/Button';
import { navigationTopUpdateZipModal } from '@/components/Navigation/common/helper/navigationTopUpdateZipModal';
import UpdateZipCode from '@/common/molecules/UpdateZipCode/UpdateZipCode';
import { usePdpContext } from '@/store/contexts/conversationalAI/pdpContext';
import { DeviceDetails } from './Components/DeviceDetails/index';
import { ProductDescriptionProps } from './common/types';
import { marketAvailability } from '@/store/sagas/clientApis/conversationalAI/marketAvailability';
import MarketAvailabilityModal from '../MarketAvailabilityModal/MarketAvailabilityModal';
import { fetchCityStateDetailFromZipCode } from '@/store/sagas/clientApis/conversationalAI/mapquest';
import { INVALID_ZIP } from './common/constants';
import ChoosePayment from './Components/DeviceDetails/components/ChoosePayment';
import { useFeatureFlag } from '@/store/contexts/featureFlagContext';
import { Section } from '@/common/types';

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  handleChooseClick,
  descriptionData,
  productId,
  SKUs,
  selectedSkuId,
  onColorChange = () => { },
  setLoading = () => { },
  isProcessingPDP
}) => {
  const [showGreatDeals, setShowGreatDeals] = useState<boolean>(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<string>('');
  const {
    featureFlags: {
      ShopCfgProfile: {
        enableVeriffPortInFFlag = false,
        enableSmartPayFFlag = false
      },
    },
  } = useFeatureFlag();
  const addressData =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('addressDetails') ?? '{}')
      : {};
  const selectedZipCode: string =
    typeof window !== 'undefined' ? addressData?.zip_code ?? '' : '';

  const { subDomain, pdpDevice } = usePdpContext();

  const modalContent = navigationTopUpdateZipModal[subDomain];

  const DEVICE_DETAILS_CONTENT = descriptionData?.content?.section?.find(
    (item) => item?.id === 'device_details',
  );

  // The device_details section contains the actual device content sections
  const DEVICE_DETAILS_CONTENT_SECTION: Section[] =
    DEVICE_DETAILS_CONTENT?.content?.section || [];
  const choosePaymentSection =  DEVICE_DETAILS_CONTENT_SECTION?.find(section => section.id =='choose_payment_option');
  const isSmartPay = choosePaymentSection?.content?.section && choosePaymentSection?.content?.section.length > 0 &&
  choosePaymentSection?.content?.section[0].options?.some(option => option.id== 'payment_plan');

  const DEVICE_DETAILS_CONTENT_CTA = DEVICE_DETAILS_CONTENT?.cta;

  const DEVICE_TITLE_PRICE = DEVICE_DETAILS_CONTENT_SECTION?.find(
    (item) => item.id === 'device_title_price',
  );

  const fullPrice = Number(
    DEVICE_TITLE_PRICE?.price?.fullPrice?.replace(/[^0-9.-]+/g, '') ?? '',
  );

  const [chooseClicked, setChooseClicked] = useState<boolean>(false);
  const [showUpdateZipModal, setShowUpdateZipModal] = useState<boolean>(false);
  const [showMarketAvailabilityModal, setShowMarketAvailabilityModal] =
    useState<boolean>(false);

  const fetchAddressFromZip = async (zip: string) => {
    try {
      const addressData = await fetchCityStateDetailFromZipCode(zip);
      if (addressData) {
        if (!addressData.error) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('addressDetails', JSON.stringify(addressData));
            window.dispatchEvent(new Event('addressDetailsChanged'));
          }
        }
      }
      return addressData;
    } catch (error) {
      console.error('fetchCityStateDetailFromZipCode Error', error);
    }
  };

  const sendDataToPlanPdp = (zipCode: string) => {
    handleChooseClick(
      productId,
      DEVICE_TITLE_PRICE?.price?.discountedPrice ?? '',
      fullPrice,
      DEVICE_TITLE_PRICE?.title ?? '',
      selectedSkuId,
      zipCode,
      selectedPaymentOption
    );
  };

  const checkMarketAvailability = async (
    zip: string,
  ): Promise<boolean | string | undefined> => {
    const addressInfo = await fetchAddressFromZip(zip);

    if (addressInfo?.error) return INVALID_ZIP;

    try {
      const isServiceable = await marketAvailability(subDomain, pdpDevice);
      if (!isServiceable) {
        document.cookie = 'location=; Path=/; Max-Age=0';
      } else if (isServiceable && chooseClicked) {
        sendDataToPlanPdp(zip);
      }
      setShowMarketAvailabilityModal(false);
      return isServiceable;
    } catch (error) {
      console.error('marketAvailability Error', error);
    }
  };

  useEffect(() => {
    (async () => {
      if (selectedZipCode.length) {
        const isServiceable = await checkMarketAvailability(selectedZipCode);
        if (typeof isServiceable === 'boolean' && !isServiceable)
          setShowMarketAvailabilityModal(true);
      }
    })();

    return () => {
      setChooseClicked(false);
    };
  }, []);

  const closeModal = async (zipCode?: string) => {
    setShowUpdateZipModal(false);

    if (!zipCode || typeof zipCode !== 'string' || zipCode.trim() === '')
      return;

    setLoading(true);
    /* Device should not be added if it is not available in the current zip */
    const isServiceable = await checkMarketAvailability(zipCode);
    if (typeof isServiceable === 'boolean' && !isServiceable) {
      setLoading(false);
      setShowMarketAvailabilityModal(true);
      return;
    }

    if (typeof zipCode === 'string') {
      sendDataToPlanPdp(zipCode);
    }
  };

  const disableChooseButton = (): boolean => {
    //TODO: Remove the commented code if veriff flow and full price flow working fine
    // if(showGreatDeals) {
    //   return !selectedPaymentOption;
    // }
    // Check if SKUs is an array and not empty
    if (!Array.isArray(SKUs) || SKUs.length === 0) {
      return true; // Disable button if no SKUs available
    }

    // Check if any SKU has status as 'Available'
    // return !SKUs.some((sku) => sku?.status === 'Available') || isProcessingPDP;
    // Check if any SKU has status as 'Available'
    const skusAvailable = SKUs.some((sku) => sku?.status === 'Available');
  
    if (!skusAvailable || isProcessingPDP) {
      return true; 
    }
    if (showGreatDeals && !selectedPaymentOption) {
      return true; // Disable button if payment option not selected
    }

    return false; // Enable button if all conditions are met


  };

  const handleChoose = async () => {
    // Checks to see if the member wants to pay full price. If so, we remove the veriff from local.
    // Else we'll see if they want to take advantage of the great price offer and reapply it if its not there
    if(selectedPaymentOption === 'Full Price' && enableVeriffPortInFFlag) {
      localStorage.removeItem('veriffOffer');
    } else if(selectedPaymentOption === 'Great Price' && !localStorage.getItem('veriffOffer') && enableVeriffPortInFFlag) {
      localStorage.setItem('veriffOffer', JSON.stringify(productId));
    }
    setChooseClicked(true);
    setLoading(true);
    let selectedZipCode: string | null = null;
    if (typeof window !== 'undefined') {
      const addressData = JSON.parse(
        localStorage.getItem('addressDetails') ?? '{}',
      );
      selectedZipCode = addressData?.zip_code;

      if (!selectedZipCode) {
        setLoading(false);
        setShowUpdateZipModal(true);
        return;
      }

      setShowUpdateZipModal(false);

      const isServiceable = await checkMarketAvailability(selectedZipCode);
      if (typeof isServiceable === 'boolean' && !isServiceable) {
        setLoading(false);
        setShowMarketAvailabilityModal(true);
        return;
      }

      sendDataToPlanPdp(selectedZipCode);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('isLimitedOfferapplicable') && enableVeriffPortInFFlag) {
      setShowGreatDeals(true);
    }
  }, []);

  return (
    <>
      {/* UpdateZipCode Component */}
      {showUpdateZipModal && (
        <UpdateZipCode
          subDomain={subDomain}
          show={showUpdateZipModal}
          closeModal={closeModal}
          details={modalContent}
        />
      )}
      {showMarketAvailabilityModal && (
        <MarketAvailabilityModal
          showModal={showMarketAvailabilityModal}
          onModalClose={() => setShowMarketAvailabilityModal(false)}
          checkMarketAvailability={checkMarketAvailability}
        />
      )}
      <div className="phone-recommendation__description--content">
        <DeviceDetails
          SKUs={SKUs}
          selectedSkuId={selectedSkuId}
          onColorChange={onColorChange}
          deviceName={DEVICE_TITLE_PRICE?.title}
          subdomain={subDomain}
          selectedPaymentOption={selectedPaymentOption}
          {...DEVICE_DETAILS_CONTENT}
        />
        {(showGreatDeals || (enableSmartPayFFlag && isSmartPay))&& (
          <ChoosePayment
            {...DEVICE_DETAILS_CONTENT}
            fullPrice={fullPrice}
            selectedPaymentOption={selectedPaymentOption}
            setSelectedPaymentOption={setSelectedPaymentOption}
            DEVICE_DETAILS_CONTENT_SECTION={DEVICE_DETAILS_CONTENT_SECTION}
          />
        )}
        <Button
          primary={true}
          className={
            disableChooseButton()
              ? 'button--disabled plan-desc__button'
              : 'plan-desc__button'
          }
          size="large"
          disabled={disableChooseButton()}
          dataGtmCta="add_to_cart"
          onClick={handleChoose}
          label={DEVICE_DETAILS_CONTENT_CTA?.text}
        />
      </div>
    </>
  );
};

export default ProductDescription;
please fix all the test cases

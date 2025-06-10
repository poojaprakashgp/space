The iPhone 15 has several improvements over the iPhone 14. The iPhone 15 features Dynamic Island, a 48MP Main camera, and an A16 Bionic Chip. The iPhone 15's Super Retina XDR display is also brighter. Here's a comparison: * **Display:** iPhone 15's display is up to 2x brighter in the sun compared to iPhone 14. * **Camera:** iPhone 15 has a 48MP Main camera. * **Chip:** iPhone 15 uses the A16 Bionic Chip. * **Features:** iPhone 15 has Dynamic Island.


If navigatedViaApp === 'true':
It means the user reached this page through the proper app flow.
We then remove the flag after confirming it, so that on subsequent reloads it doesn't persist.
 
If navigatedViaApp is not set or false:
We treat it as an unauthorized access or a page reload, and redirect the user to the /phones page.



 const navigatedViaApp = sessionStorage.getItem('navigatedViaApp') === 'true';
    if(navigatedViaApp) {
      sessionStorage.removeItem('navigatedViaApp');
    } else E{
      router.push(`${getBaseURL()}/phones`);
    }
 
it('should redirect to /phones if navigatedViaApp is not true', () => {
    sessionStorage.removeItem('navigatedViaApp'); // ensure it's gone
    const removeItemSpy = jest.spyOn(sessionStorage, 'removeItem');

    yourFunctionOrComponent(); // this must run the logic

    expect(removeItemSpy).not.toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith(`${getBaseURL()}/phones`);
  });






import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OrderConfirmationPage from '../page';
import { useOrderConfirmationContext } from '@/store/contexts/conversationalAI/confirmationContext';
import * as tealiumTagger from '@/helpers/(aiConversation)/tealiumTagger';
import * as fetchChatSummary from '../helpers/fetchChatSummary';
import OrderConfirmationComponentManager from '../componentManager';
import { useRouter } from 'next/navigation';
import { getBaseURL } from '@/helpers/uriUtils';

// Mock the required modules and functions
jest.mock('@/store/contexts/conversationalAI/confirmationContext');
jest.mock('@/helpers/(aiConversation)/tealiumTagger');
jest.mock('@/helpers/jsConsoleErrorMonitor', () => ({
  jsConsoleErrorMonitor: jest.fn(),
}));
jest.mock('../helpers/fetchChatSummary', () => ({
  fetchSummary: jest.fn(),
}));
jest.mock('../componentManager', () =>
  jest.fn(() => <div data-testid='order-components' />)
);
jest.mock('@/common/organisms/ChatInterface/ChatInterface', () => ({
  __esModule: true,
  default: () => <div data-testid='chat-interface' />,
}));
jest.mock('@/common/templates/Container', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='container'>{children}</div>
  ),
}));
// Mock the required hooks and modules
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn((key) => {
    if (key === 'checkoutCartInfo') {
      return JSON.stringify([{ item: 'test' }]);
    }
    if (key === 'isAgenticEnabledOnConfirmation') {
      return 'true';
    }
    return null;
  }),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(() => 'true'),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

describe('OrderConfirmationPage', () => {
  const mockRouter = {
    push: jest.fn(),
  };
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock hook returns
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    // Mock useOrderConfirmationContext with proper components structure
    (useOrderConfirmationContext as jest.Mock).mockReturnValue({
      responseMessages: [],
      components: [
        {
          type: 'ORDER_CONFIRMATION',
          display: 'ORDER_CONFIRMATION',
          details: {
            content: {
              section: [
                {
                  id: 'order_details',
                  title: 'Thanks for your purchase',
                  content: {
                    section: [
                      {
                        id: 'order_number',
                        title: 'Your order has been placed',
                        body: 'Order number #2233-O705L38R08',
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          type: 'WHATS_NEXT',
          display: 'WHATS_NEXT',
          details: {
            title: "What's next?",
            body: 'Test body',
          },
        },
      ],
      subDomain: 'totalwireless',
    });

    // Mock window.digitalData
    window.digitalData = {};
  });

  test('renders the OrderConfirmationPage component', () => {
    render(<OrderConfirmationPage />);
    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('order-components')).toBeInTheDocument();
    expect(screen.getByTestId('chat-interface')).toBeInTheDocument();
  });

  test('calls pageView function on component mount', () => {
    const pageViewSpy = jest.spyOn(tealiumTagger, 'pageView');
    render(<OrderConfirmationPage />);
    expect(pageViewSpy).toHaveBeenCalledTimes(1);
    expect(pageViewSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        pageName: 'order_confirmation_page_ai',
        event: 'pageview',
        brandName: 'totalwireless',
      })
    );
  });

  test('calls fetchSummary function on component mount', () => {
    const fetchSummarySpy = jest.spyOn(fetchChatSummary, 'fetchSummary');
    render(<OrderConfirmationPage />);
    expect(fetchSummarySpy).toHaveBeenCalledTimes(1);
  });

  test('calls OrderConfirmationComponentManager with correct props', () => {
    render(<OrderConfirmationPage />);
    expect(OrderConfirmationComponentManager).toHaveBeenCalledWith(
      expect.objectContaining({
        subdomain: 'totalwireless',
        components: expect.arrayContaining([
          expect.objectContaining({ type: 'ORDER_CONFIRMATION' }),
          expect.objectContaining({ type: 'WHATS_NEXT' }),
        ]),
      })
    );
  });

  test('initializes digitalData object if it does not exist', () => {
    // Delete digitalData before test
    delete window.digitalData;
    expect(window.digitalData).toBeUndefined();

    render(<OrderConfirmationPage />);
    expect(window.digitalData).toBeDefined();
  });

  test('handles missing cartInfo in sessionStorage', () => {
    mockSessionStorage.getItem.mockImplementation((key) => {
      if (key === 'isAgenticEnabledOnConfirmation') {
        return 'true';
      }
      return null;
    });
    const pageViewSpy = jest.spyOn(tealiumTagger, 'pageView');

    render(<OrderConfirmationPage />);
    expect(pageViewSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        cartInfo: true,
      })
    );
  });

  it('should redirect to /phones if navigatedViaApp is not true', () => { 

    const removeItemSpy = jest.spyOn(sessionStorage, 'removeItem');
    
    const mockPush = jest.fn();
    jest.mock('next/router', () => ({
      useRouter: () => ({
        push: mockPush
      })
    }))
    const getItemSpy = jest.spyOn(sessionStorage, 'getItem');
    getItemSpy.mockReturnValue(null);
    
    render(<OrderConfirmationPage />);
    
    expect(removeItemSpy).not.toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith(`${getBaseURL()}/phones`);
  });
});

  const removeLeasePlan = async () => {
    setOrderSummaryLoader(true);

    const parsedDeviceDetails = JSON.parse(
      sessionStorage.getItem('deviceDetails') ?? '{}',
    );
    parsedDeviceDetails['devicePayment'] = 'retail';
    updateSessionStorage('deviceDetails', false, parsedDeviceDetails);

    const summary = await removeSmartPayLeasePlan(subDomain);
    updateOrderSummary(summary);

    setOrderSummaryLoader(false);
  };
cover this function which is called from other component after click of button with data-testid="remove lease"



import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComponentA from './ComponentA';

// Mock the dependent functions
jest.mock('../utils/session', () => ({
  updateSessionStorage: jest.fn(),
}));

jest.mock('../api', () => ({
  removeSmartPayLeasePlan: jest.fn(() => Promise.resolve({ summaryData: 'mockSummary' })),
}));

describe('ComponentA', () => {
  beforeEach(() => {
    sessionStorage.setItem('deviceDetails', JSON.stringify({ some: 'data' }));
  });

  test('covers removeLeasePlan when button is clicked', async () => {
    render(<ComponentA />);

    const button = screen.getByTestId('remove-lease');
    fireEvent.click(button); // 👈 This triggers `removeLeasePlan`

    await waitFor(() => {
      // assert or just wait to ensure async completes
      // or verify side effect, e.g. that a mock was called
      expect(screen.queryByTestId('remove-lease')).toBeInTheDocument();
    });
  });
});

expect(updateSessionStorage).toHaveBeenCalledWith('deviceDetails', false, {
  some: 'data',
  devicePayment: 'retail',
});

expect(removeSmartPayLeasePlan).toHaveBeenCalledWith(expect.anything());

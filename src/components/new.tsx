import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChoosePayment from './ChoosePayment';

const mockOption = (id, title = 'Option', body = 'Body', image = null, discountedPrice = '50') => ({
  id,
  title,
  body,
  price: {
    preText: 'Pre',
    fullPrice: '100',
    postText: 'Post',
    veriffPrice: '30',
    discountedPrice,
  },
  image,
});

describe('ChoosePayment Component', () => {
  const setup = (optionsLength = 2) => {
    const options = Array.from({ length: optionsLength }, (_, i) =>
      mockOption(`option_${i}`, `Option ${i + 1}`),
    );

    const DEVICE_DETAILS_CONTENT_SECTION = [
      {
        id: 'choose_payment_option',
        title: 'Choose your payment',
        content: {
          section: [
            {
              options,
            },
          ],
        },
      },
      {
        id: 'coupon_exclusions',
        title: 'Coupon Exclusions',
        cta: { text: 'Learn More' },
        modal: {
          title: 'Coupon Modal',
          content: { type: 'DOT_LIST', section: [{ title: 'Exclusion Item' }] },
          footer: { title: 'Footer text' },
        },
      },
    ];

    const mockSetSelected = jest.fn();

    render(
      <ChoosePayment
        fullPrice={999}
        selectedPaymentOption={''}
        setSelectedPaymentOption={mockSetSelected}
        DEVICE_DETAILS_CONTENT_SECTION={DEVICE_DETAILS_CONTENT_SECTION}
      />,
    );

    return { mockSetSelected };
  };

  test('renders section title and coupon exclusions', () => {
    setup(2);
    expect(screen.getByText('Choose your payment')).toBeInTheDocument();
    expect(screen.getByText('Coupon Exclusions')).toBeInTheDocument();
  });

  test('renders payment options without accordion when <= 2 options', () => {
    setup(2);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.queryByText('See other payment options')).not.toBeInTheDocument();
  });

  test('renders first option and accordion when > 2 options', () => {
    setup(4);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('See other payment options')).toBeInTheDocument();
    expect(screen.queryByText('Option 2')).not.toBeVisible();
  });

  test('accordion expands and shows other options', () => {
    setup(4);
    fireEvent.click(screen.getByText('See other payment options'));
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
    expect(screen.getByText('Option 4')).toBeInTheDocument();
  });

  test('handles selection state correctly', () => {
    const { mockSetSelected } = setup(2);
    fireEvent.click(screen.getByText('Option 1'));
    expect(mockSetSelected).toHaveBeenCalledWith('Option 1');
  });

  test('renders CTA button inside payment option if present', () => {
    const optionWithCTA = mockOption('cta_option', 'CTA Option');
    optionWithCTA.cta = { text: 'More Info' };

    const DEVICE_DETAILS_CONTENT_SECTION = [
      {
        id: 'choose_payment_option',
        title: 'Choose your payment',
        content: {
          section: [
            {
              options: [optionWithCTA],
            },
          ],
        },
      },
    ];

    render(
      <ChoosePayment
        fullPrice={1000}
        selectedPaymentOption={''}
        setSelectedPaymentOption={jest.fn()}
        DEVICE_DETAILS_CONTENT_SECTION={DEVICE_DETAILS_CONTENT_SECTION}
      />,
    );

    expect(screen.getByText('More Info')).toBeInTheDocument();
  });

  test('shows modal content when CTA is clicked', () => {
    const optionWithModal = mockOption('modal_option', 'Modal Option');
    optionWithModal.cta = { text: 'Details' };
    optionWithModal.modal = {
      title: 'Modal Title',
      content: { type: 'DOT_LIST', section: [{ title: 'Feature 1' }] },
      footer: { title: 'Footer' },
    };

    const DEVICE_DETAILS_CONTENT_SECTION = [
      {
        id: 'choose_payment_option',
        title: 'Choose your payment',
        content: {
          section: [
            {
              options: [optionWithModal],
            },
          ],
        },
      },
    ];

    render(
      <ChoosePayment
        fullPrice={1000}
        selectedPaymentOption={''}
        setSelectedPaymentOption={jest.fn()}
        DEVICE_DETAILS_CONTENT_SECTION={DEVICE_DETAILS_CONTENT_SECTION}
      />,
    );

    fireEvent.click(screen.getByText('Details'));
    expect(screen.getByText('Modal Title')).toBeInTheDocument();
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});

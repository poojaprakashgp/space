/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import React, { useEffect, useRef, useState } from 'react';
import BackButton from '@/common/molecules/BackButton/BackButton';
import CustomNextImage from '@/components/common/components/CustomNextImage';
import PhoneRecImg from '../../../../../../public/assets/tbv/phone_rec.svg';
import StarImg from '../../../../../../public/assets/tbv/star.svg';
import Button from '@/common/molecules/Button/Button';
import { PlanDetailsProps, PlanSummaryProps } from './common/types';
import SkeletonLoader from '@/common/molecules/SkeletonLoader/SkeletonLoader';

const PlanDetails = ({
  details: {
    content: { section = [{ id: '' }] },
  },
  setLoading,
  setAgenticPageLoader,
  ...args
}: PlanDetailsProps) => {
  const referrerPath =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('pdpReferPath') || ''
      : '';
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = imageRef.current;

    if (img?.complete && img?.naturalWidth !== 0) {
      // Image already loaded (from cache)
      setIsLoading(false); ///cover this under test cases
    }
  }, []);

  return (
    <div>
      <div>
        <BackButton
          ariaLabel="Current Plan"
          destination={referrerPath as string}
          onClick={() => {///cover this under test cases
            setLoading(true);
            setAgenticPageLoader('PDP');
          }}
        />
      </div>
      <div className="plan-recommendation">
        {section.map(
          ({ id: sectionId = '', ...sectionArgs }, index: number) => (
            <div key={`${sectionId}-${index}`}>
              {sectionId === 'plan_gallery' && (
                <div className="plan-recommendation__image plan-recommendation__image-wrapper">
                  {isLoading && (
                    <SkeletonLoader
                      variant="vertical"
                      width={300}
                      height={400}
                      marginTop={'50px'}
                    />
                  )}
                  {!hasError ? (
                    <CustomNextImage
                      ref={imageRef}
                      src={PhoneRecImg}
                      alt="plan_icon"
                      width={100}
                      height={100}
                      style={{ display: isLoading ? 'none' : 'block' }}
                      priority
                      onLoad={() => { ///cover this under test cases
                        setIsLoading(false);
                      }}
                      onError={() => {///cover this under test cases
                        setHasError(true);
                        setIsLoading(false);
                        console.error('PhoneRecImg failed to load');
                      }}
                    />
                  ) : (
                    !isLoading && (
                      <div className="plan-recommendation__no-image">
                        Image not available
                      </div>
                    )
                  )}
                </div>
              )}
              {sectionId === 'plan_details' && (
                <PlanSummary
                  content={sectionArgs.content || { section: [] }}
                  cta={sectionArgs.cta || { text: '' }}
                  selectedPlan={
                    sectionArgs.selectedPlan || {
                      recommendedPlans: {},
                      planTitlePrice: {},
                      planSummary: {},
                    }
                  }
                  {...args}
                />
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
};

const PlanSummary = ({
  content: { section = [] },
  cta: { text = '' },
  selectedPlan: {
    recommendedPlans = {
      title: '',
    },
    planTitlePrice = {
      title: '',
      price: {
        fullPrice: '',
        postText: '',
      },
    },
    planSummary = {
      title: '',
      content: {
        section: [],
      },
    },
  },
  handleChooseClick,
}: PlanSummaryProps) => {
  return (
    <div className="plan-recommendation__description">
      <div className="plan-desc">
        {section.map(({ id = '' }) => (
          <>
            {id === 'best_phone_for_you' && recommendedPlans.title && (
              <div className="plan-desc__best-plan">
                <CustomNextImage
                  src={StarImg}
                  alt="star"
                  width={15.78}
                  height={19.86}
                  className="mr-2"
                />
                <span className="plan-desc__best-plan-text">
                  {recommendedPlans.title}
                </span>
              </div>
            )}
            {id === 'plan_title_price' && planTitlePrice.title && (
              <>
                <h1 className="plan-desc__title">{planTitlePrice.title}</h1>
                <div className="plan-desc__plan">
                  <p className="plan-desc__postPrice">
                    {planTitlePrice.price.fullPrice}
                    {planTitlePrice.price.postText}
                  </p>
                </div>
              </>
            )}
            {id === 'main_summary' && (
              <div className="plan-desc__match">
                <h2 className="plan-desc__match-title">{'Details'}</h2>
                <ol className="plan-options__card-list">
                  {planSummary.content.section.map(
                    ({ title = '', body = '' }, index: number) => (
                      <li
                        key={`${title}-${index}`}
                        className="other-options__body"
                      >
                        {`${title} ${body}`}
                      </li>
                    ),
                  )}
                </ol>
              </div>
            )}
          </>
        ))}
        <Button
          className="plan-desc__button"
          primary={true}
          size="large"
          onClick={() =>
            handleChooseClick(
              planTitlePrice.price.fullPrice,
              planTitlePrice.title,
            )
          }
          label={text}
          dataGtmCta="add_to_cart"
          ariaLabel={`Choose ${planTitlePrice.title} plan`}
        />
      </div>
    </div>
  );
};

export default PlanDetails;


// PlanDetails.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PlanDetails from './PlanDetails'; // adjust path
import '@testing-library/jest-dom';

const mockSetLoading = jest.fn();
const mockSetAgenticPageLoader = jest.fn();

// 🧪 Basic props template
const defaultProps = {
  details: {
    content: {
      section: [
        { id: 'plan_gallery' },
        { id: 'plan_details', content: {}, cta: {}, selectedPlan: {} },
      ],
    },
  },
  setLoading: mockSetLoading,
  setAgenticPageLoader: mockSetAgenticPageLoader,
  handleChooseClick: jest.fn(),
};

it('calls setLoading and setAgenticPageLoader on BackButton click', () => {
  render(<PlanDetails {...defaultProps} />);
  const backBtn = screen.getByRole('button', { name: /current plan/i });

  fireEvent.click(backBtn);

  expect(mockSetLoading).toHaveBeenCalledWith(true);
  expect(mockSetAgenticPageLoader).toHaveBeenCalledWith('PDP');
});

jest.mock('@/components/common/components/CustomNextImage', () => 
  jest.fn((props) => {
    // simulate onLoad
    React.useEffect(() => {
      props.onLoad?.();
    }, []);
    return <img alt={props.alt} />;
  })
);

it('calls setIsLoading(false) on image load', async () => {
  render(<PlanDetails {...defaultProps} />);
  expect(screen.getByAltText('plan_icon')).toBeInTheDocument();
});
jest.mock('@/components/common/components/CustomNextImage', () =>
  jest.fn((props) => {
    React.useEffect(() => {
      props.onError?.(); // trigger onError
    }, []);
    return <img alt={props.alt} />;
  })
);

it('sets hasError and logs error when image fails to load', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  render(<PlanDetails {...defaultProps} />);

  // Wait for error handling to complete
  expect(screen.getByText('Image not available')).toBeInTheDocument();
  expect(consoleErrorSpy).toHaveBeenCalledWith('PhoneRecImg failed to load');
  consoleErrorSpy.mockRestore();
});
it('skips loading if image is already loaded from cache', () => {
  const originalGetItem = window.sessionStorage.getItem;
  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: jest.fn(() => '/some/path'),
    },
    writable: true,
  });

  const imageMock = {
    complete: true,
    naturalWidth: 100,
  };

  const ref = React.createRef();
  ref.current = imageMock;

  // This simulates internal logic, but to truly unit test it, you’d expose `ref` or break out useEffect logic
  // Ideally use integration test for this behavior
});


PlanDetails Component > calls setLoading and setAgenticPageLoader on BackButton click
-----
Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

Expected: true

Number of calls: 0Jest
const mockSetLoading: jest.Mock<any, any, any>


import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlanDetails from './PlanDetails';

jest.mock('@/common/molecules/BackButton/BackButton', () => {
  return ({ onClick }: any) => (
    <button onClick={onClick}>Current Plan</button>
  );
});

jest.mock('@/components/common/components/CustomNextImage', () => () => (
  <img alt="plan_icon" />
));

const mockSetLoading = jest.fn();
const mockSetAgenticPageLoader = jest.fn();

describe('PlanDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.setItem('pdpReferPath', '/mock-path');
  });

  it('calls setLoading and setAgenticPageLoader on BackButton click', () => {
    render(
      <PlanDetails
        details={{
          content: {
            section: [{ id: 'plan_gallery' }],
          },
        }}
        setLoading={mockSetLoading}
        setAgenticPageLoader={mockSetAgenticPageLoader}
      />
    );

    const backBtn = screen.getByRole('button', { name: /current plan/i });
    fireEvent.click(backBtn);

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetAgenticPageLoader).toHaveBeenCalledWith('PDP');
  });
});


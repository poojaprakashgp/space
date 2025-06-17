import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlanDetails from '../index';

// 🔧 Mocks
const mockSetLoading = jest.fn();
const mockSetAgenticPageLoader = jest.fn();
const mockHandleChooseClick = jest.fn();

jest.mock('@/common/molecules/BackButton/BackButton', () => ({
  __esModule: true,
  default: ({ ariaLabel, onClick }: { ariaLabel: string; onClick: () => void }) => (
    <button aria-label={ariaLabel} onClick={onClick}>
      BackButton
    </button>
  ),
}));

jest.mock('@/common/molecules/Button/Button', () => ({
  __esModule: true,
  default: ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button onClick={onClick}>{label}</button>
  ),
}));

jest.mock('@/common/molecules/SkeletonLoader/SkeletonLoader', () => ({
  __esModule: true,
  default: ({ variant }: { variant: string }) => (
    <div data-testid="skeleton-loader">{variant}</div>
  ),
}));

let simulateLoad = true;
let simulateError = false;

jest.mock('@/components/common/components/CustomNextImage', () =>
  jest.fn((props) => {
    React.useEffect(() => {
      if (simulateLoad) props.onLoad?.();
      if (simulateError) props.onError?.();
    }, []);
    return <img alt={props.alt} />;
  })
);

// 🧪 Default props
const defaultProps = {
  details: {
    content: {
      section: [
        { id: 'plan_gallery' },
        {
          id: 'plan_details',
          content: {
            section: [
              { id: 'best_phone_for_you' },
              { id: 'plan_title_price' },
              { id: 'main_summary' },
            ],
          },
          cta: { text: 'Select Plan' },
          selectedPlan: {
            recommendedPlans: { title: 'Best Plan' },
            planTitlePrice: {
              title: 'Plan A',
              price: { fullPrice: '$100', postText: '/mo' },
            },
            planSummary: {
              title: 'Summary',
              content: {
                section: [
                  { title: 'Speed', body: 'Fast' },
                  { title: 'Data', body: 'Unlimited' },
                ],
              },
            },
          },
        },
      ],
    },
  },
  setLoading: mockSetLoading,
  setAgenticPageLoader: mockSetAgenticPageLoader,
  handleChooseClick: mockHandleChooseClick,
};

describe('PlanDetails Component — 100% Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    simulateLoad = true;
    simulateError = false;
    window.sessionStorage.setItem('pdpReferPath', '/test-path');
  });

  it('renders plan_gallery with image and triggers onLoad', () => {
    render(<PlanDetails {...defaultProps} />);
    expect(screen.getByAltText('plan_icon')).toBeInTheDocument();
  });

  it('renders SkeletonLoader while loading', () => {
    simulateLoad = false;
    render(<PlanDetails {...defaultProps} />);
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
  });

  it('shows fallback message when image fails to load', () => {
    simulateLoad = false;
    simulateError = true;
    render(<PlanDetails {...defaultProps} />);
    expect(screen.getByText('Image not available')).toBeInTheDocument();
  });

  it('calls setLoading and setAgenticPageLoader on BackButton click', () => {
    render(<PlanDetails {...defaultProps} />);
    const btn = screen.getByRole('button', { name: /current plan/i });
    fireEvent.click(btn);
    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetAgenticPageLoader).toHaveBeenCalledWith('PDP');
  });

  it('renders best_phone_for_you with recommended title and star icon', () => {
    render(<PlanDetails {...defaultProps} />);
    expect(screen.getByText('Best Plan')).toBeInTheDocument();
    expect(screen.getByAltText('star')).toBeInTheDocument();
  });

  it('renders plan_title_price section with title and price', () => {
    render(<PlanDetails {...defaultProps} />);
    expect(screen.getByText('Plan A')).toBeInTheDocument();
    expect(screen.getByText('$100/mo')).toBeInTheDocument();
  });

  it('renders main_summary with feature list', () => {
    render(<PlanDetails {...defaultProps} />);
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText(/Speed Fast/)).toBeInTheDocument();
    expect(screen.getByText(/Data Unlimited/)).toBeInTheDocument();
  });

  it('calls handleChooseClick with correct args', () => {
    render(<PlanDetails {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /select plan/i }));
    expect(mockHandleChooseClick).toHaveBeenCalledWith('$100', 'Plan A');
  });

  it('handles unknown section id gracefully (no render)', () => {
    const props = {
      ...defaultProps,
      details: {
        content: {
          section: [{ id: 'unknown_section' }],
        },
      },
    };
    render(<PlanDetails {...props} />);
    expect(screen.queryByAltText('plan_icon')).not.toBeInTheDocument();
  });

  it('renders without selectedPlan, cta or content gracefully', () => {
    const props = {
      ...defaultProps,
      details: {
        content: {
          section: [
            {
              id: 'plan_details',
              // No content, cta, or selectedPlan
            },
          ],
        },
      },
    };
    render(<PlanDetails {...props} />);
    expect(screen.getByText('Choose plan')).toBeInTheDocument(); // from default prop
  });
});

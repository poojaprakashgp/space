import React from 'react';
import Button from '@/common/molecules/Button/Button';
import DownCaret from '@vds/core/icons/down-caret';
import UpCaret from '@vds/core/icons/up-caret';

interface FaqItemProps {
  title: string;
  body: string;
  index: number;
  openIndex: number | null;
  onToggle: (index: number) => void;
}

export default function FaqItem({
  title,
  body,
  index,
  openIndex,
  onToggle,
}: Readonly<FaqItemProps>) {
  const isOpen = openIndex === index;
  return (
    <div className='faq-item'>
      <Button
        className='faq-question'
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        ariaLabel={title}
        label={
          <span className='flex-between'>
            {title}{' '}
            <span>
              {isOpen ? <UpCaret /> : <DownCaret ariaHidden={true} />}
            </span>
          </span>
        }
        onClick={() => onToggle(index)}
        size='medium'
      />
      <div
        id={`faq-answer-${index}`}
        role='region'
        aria-labelledby={`faq-question-${index}`}
        className='faq-answer'
        hidden={!isOpen}
        aria-hidden={!isOpen}
      >
        {body}
      </div>
    </div>
  );
}
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FaqItem from '../FaqItem';
import '@testing-library/jest-dom';

// Don't mock the FaqItem component itself, let it render normally
// Only mock its dependencies
jest.mock('@/common/molecules/Button/Button', () => {
  return {
    __esModule: true,
    default: ({ label, onClick, ariaLabel, 'aria-expanded': ariaExpanded, 'aria-controls': ariaControls }) => (
      <button 
        data-testid="mock-button" 
        aria-label={ariaLabel}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        id={`faq-question-${ariaLabel === 'FAQ Question' ? '1' : '0'}`}
        onClick={onClick}
      >
        {typeof label === 'string' ? label : (
          <>
            {label.props.children[0]}{' '}
            {label.props.children[2]}
          </>
        )}
      </button>
    )
  };
});

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

describe('FaqItem Component', () => {
  const mockOnToggle = jest.fn();
  
  const mockProps = {
    title: 'FAQ Question',
    body: 'This is the answer to the FAQ question',
    index: 1,
    openIndex: null,
    onToggle: mockOnToggle
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component in closed state by default', () => {
    render(<FaqItem {...mockProps} />);
    
    // Button should be rendered with question text
    const button = screen.getByTestId('mock-button');
    expect(button).toBeInTheDocument();
    
    // Answer should be hidden
    const answer = screen.getByRole('region');
    expect(answer).toHaveAttribute('hidden');
    expect(answer).toHaveAttribute('aria-hidden', 'true');
    
    // Should find the down caret in the DOM
    expect(screen.getByTestId('down-caret-icon')).toBeInTheDocument();
  });

  it('renders the component in open state when index matches openIndex', () => {
    const openProps = {
      ...mockProps,
      openIndex: 1 // Matches the index 1
    };
    
    render(<FaqItem {...openProps} />);
    
    // Button should be rendered
    const button = screen.getByTestId('mock-button');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    
    // Answer should be visible
    const answer = screen.getByRole('region');
    expect(answer).not.toHaveAttribute('hidden');
    expect(answer).toHaveAttribute('aria-hidden', 'false');
    
    // Up caret should be displayed when open
    expect(screen.getByTestId('up-caret-icon')).toBeInTheDocument();
  });

  it('calls onToggle with the correct index when clicked', () => {
    render(<FaqItem {...mockProps} />);
    
    // Click on the button
    fireEvent.click(screen.getByTestId('mock-button'));
    
    // onToggle should be called with the index
    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });

  it('displays the correct title and body content', () => {
    render(<FaqItem {...mockProps} />);
    
    // Button should contain the title
    expect(screen.getByTestId('mock-button')).toHaveTextContent('FAQ Question');
    
    // Region should contain the answer text
    const answer = screen.getByRole('region');
    expect(answer).toHaveTextContent('This is the answer to the FAQ question');
    
    // Check that the region has the correct accessibility attributes
    expect(answer).toHaveAttribute('id', 'faq-answer-1');
    expect(answer).toHaveAttribute('aria-labelledby', 'faq-question-1');
  });
}); in the above test file first and last test case are failing please fix it





import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FaqItem from '../FaqItem';
import '@testing-library/jest-dom';

jest.mock('@/common/molecules/Button/Button', () => {
  return {
    __esModule: true,
    default: ({
      label,
      onClick,
      ariaLabel,
      'aria-expanded': ariaExpanded,
      'aria-controls': ariaControls,
    }) => (
      <button
        data-testid="mock-button"
        aria-label={ariaLabel}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        id={`faq-question-${ariaLabel === 'FAQ Question' ? '1' : '0'}`}
        onClick={onClick}
      >
        {typeof label === 'string' ? label : (
          <>
            {label.props.children[0]}{' '}
            {label.props.children[2]}
          </>
        )}
      </button>
    ),
  };
});

jest.mock('@vds/core/icons/down-caret', () => {
  return {
    __esModule: true,
    default: ({ ariaHidden }) => (
      <div data-testid="down-caret-icon" aria-hidden={ariaHidden}>▼</div>
    ),
  };
});

jest.mock('@vds/core/icons/up-caret', () => {
  return {
    __esModule: true,
    default: () => (
      <div data-testid="up-caret-icon">▲</div>
    ),
  };
});

describe('FaqItem Component', () => {
  const mockOnToggle = jest.fn();

  const mockProps = {
    title: 'FAQ Question',
    body: 'This is the answer to the FAQ question',
    index: 1,
    openIndex: null,
    onToggle: mockOnToggle,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component in closed state by default', () => {
    render(<FaqItem {...mockProps} />);

    const button = screen.getByTestId('mock-button');
    expect(button).toBeInTheDocument();

    // Use querySelector for hidden region
    const answer = document.querySelector('#faq-answer-1');
    expect(answer).toHaveAttribute('hidden');
    expect(answer).toHaveAttribute('aria-hidden', 'true');

    expect(screen.getByTestId('down-caret-icon')).toBeInTheDocument();
  });

  it('renders the component in open state when index matches openIndex', () => {
    const openProps = {
      ...mockProps,
      openIndex: 1,
    };

    render(<FaqItem {...openProps} />);

    const button = screen.getByTestId('mock-button');
    expect(button).toHaveAttribute('aria-expanded', 'true');

    const answer = screen.getByRole('region');
    expect(answer).not.toHaveAttribute('hidden');
    expect(answer).toHaveAttribute('aria-hidden', 'false');

    expect(screen.getByTestId('up-caret-icon')).toBeInTheDocument();
  });

  it('calls onToggle with the correct index when clicked', () => {
    render(<FaqItem {...mockProps} />);

    fireEvent.click(screen.getByTestId('mock-button'));
    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });

  it('displays the correct title and body content', () => {
    render(<FaqItem {...mockProps} />);

    const button = screen.getByTestId('mock-button');
    expect(button).toHaveTextContent('FAQ Question');

    const answer = document.querySelector('#faq-answer-1');
    expect(answer).toHaveTextContent('This is the answer to the FAQ question');
    expect(answer).toHaveAttribute('id', 'faq-answer-1');
    expect(answer).toHaveAttribute('aria-labelledby', 'faq-question-1');
  });
});

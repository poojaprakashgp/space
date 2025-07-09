   <button
            id={id}
            onClick={() =>
              selectedDeviceAvailable === 'Available' && handleRadioChange(id)
            }
            onKeyDown={(e) => {
              if (
                selectedDeviceAvailable === 'Available' &&
                (e.key === 'Enter' || e.key === ' ')
              ) {
                e.preventDefault(); 
                handleRadioChange(id);
              }
            }}
            data-testid={id}
            className='payment-options__main-container'
          >
            <div className='payment-options__box-container'>
              <div className='payment-options__checkbox'>
                <RadioButton
                  disabled={selectedDeviceAvailable !== 'Available'}
                  checked={selectedRadioButton === id}
                  aria-label=''
                  id={id}
                  name='payment_option'
                  value=''
                  label=''
                  onChange={() => {}}
                  className='payment__cardBtn'
                />
              </div>

              <div className='payment-options__body-container'>
                <div className='payment-options__body-title'>{title}</div>
                {body && (
                  <div className='payment-options__body-content'>{body}</div>
                )}
                {renderImage()}
              </div>

              {PaymentOptionsPriceDetails(id, price, SKUs, selectedSKUId)}
            </div>
          </button>
'use client';

import React from 'react';

export interface ButtonProps {
  primary?: boolean;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large' | 'xl';
  label: string | React.ReactNode;
  className?: string;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  textColor?: boolean;
  textColorValue?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  dataGtmCta?: string;
  dataTestId?: string;
  ariaLabel?: string;
}

export const Button = ({
  primary,
  size = 'medium',
  label,
  className,
  textColor,
  onClick,
  textColorValue,
  icon,
  disabled = false,
  dataGtmCta,
  dataTestId,
  ariaLabel,
}: ButtonProps) => {
  let textColorClass = 'button--text-white';
  if (textColorValue) {
    textColorClass = 'button-custom-text';
  } else if (textColor) {
    textColorClass = 'button--text-dark';
  }
  const buttonClasses = [
    'button',
    primary ? 'button--primary' : 'button--secondary',
    `button--${size}`,
    textColorClass,
    className,
  ].join(' ');
  return (
    <button
      type='button'
      className={`${buttonClasses}`}
      onClick={onClick}
      disabled={disabled}
      data-gtm-cta={dataGtmCta}
      data-testid={dataTestId}
      aria-label={ariaLabel}
    >
      {icon} {label}
    </button>
  );
};

export default Button;

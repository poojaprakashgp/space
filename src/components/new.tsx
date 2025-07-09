import { Button as CustomButton } from 'path-to-your-button'; // update the import path accordingly

<CustomButton
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
  className='payment-options__main-container'
  disabled={selectedDeviceAvailable !== 'Available'}
  dataTestId={id}
  ariaLabel={title}
  label={
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
  }
/>

// In your Button.scss
.button--secondary.payment-options__main-container {
  background: none;
  border: none;
  padding: 0;
  text-align: left;
  width: 100%;
}

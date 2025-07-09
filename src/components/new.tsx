  <div
            id={id}
            onClick={() => selectedDeviceAvailable === 'Available' && handleRadioChange(id)}
            data-testid={id}
            className='payment-options__main-container'
          >
            <div className='payment-options__box-container'>
              <div className='payment-options__checkbox'>
                <RadioButton
                  disabled={selectedDeviceAvailable !== 'Available'}
                  checked={selectedRadioButton === id}
                  aria-label={''}
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
          </div>
Visible, non-interactive elements with click handlers must have at least one keyboard listener.sonarqube(typescript:S1082)
(property) JSX.IntrinsicElements.div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>





  <div
  id={id}
  role="button"
  tabIndex={0}
  onClick={() =>
    selectedDeviceAvailable === 'Available' && handleRadioChange(id)
  }
  onKeyDown={(e) => {
    if (
      selectedDeviceAvailable === 'Available' &&
      (e.key === 'Enter' || e.key === ' ')
    ) {
      e.preventDefault(); // avoid scrolling on space
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
      {body && <div className='payment-options__body-content'>{body}</div>}
      {renderImage()}
    </div>

    {PaymentOptionsPriceDetails(id, price, SKUs, selectedSKUId)}
  </div>
</div>
Use <input type="button">, <input type="image">, <input type="reset">, <input type="submit">, or <button> instead of the "button" role to ensure accessibility across all devices.s

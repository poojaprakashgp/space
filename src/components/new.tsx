<div className='number-selection__actions'>
  {ctas.map((cta, index) => {
    const isPrimary = cta.style === 'primary';
    const isDisabled = cta.text === 'Continue' ? isContinueDisabled() : false;
    const isLoading = cta.text === 'Continue' && loading;
    const shouldRender =
      cta.text === 'Continue' ||
      (cta.text === 'Skip' && verificationCodeSuccess && greatDealSelected);

    if (!shouldRender) return null;

    return (
      <Button
        key={index}
        primary={isPrimary}
        label={isLoading ? 'Processing...' : cta.text}
        onClick={cta.text === 'Continue' ? handleSubmit : handleSkip}
        disabled={isDisabled}
        className='number-selection__continue-btn'
        data-testid='continue-button'
        size='xl'
        dataGtmCta={`continue_number_selection_${cta.text.toLowerCase()}`}
      />
    );
  })}
</div>

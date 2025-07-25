<div className='number-selection__actions'>
            <Button
              primary={true}
              label={loading ? 'Processing...' : 'Continue'}
              onClick={handleSubmit}
              disabled={isContinueDisabled()}
              className='number-selection__continue-btn'
              data-testid='continue-button'
              size='xl'
              dataGtmCta='continue_number_selection'
            />
            {verificationCodeSuccess && greatDealSelected && (
              <Button
                label='Skip'
                onClick={handleSkip}
                className='number-selection__continue-btn'
                data-testid='continue-button'
                size='xl'
                dataGtmCta='continue_number_selection'
              />
            )}
          </div>


"ctas": [
                            	{
                              	"text": "Continue",
                              	"type": "button",
                              	"style": "primary",
                              	"action": "native"
                            	},
                            	{
                              	"text": "Skip",
                              	"type": "button",
                              	"style": "secondary",
                              	"action": "native"
                            	}
                          	],

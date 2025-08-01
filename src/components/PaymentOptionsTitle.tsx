import {
  PaymentOptionsTitleWrapper,
  PaymentOptionsSteps,
  PaymentOptionsHeading,
} from '../styledComponents';
import { renderStepsTitle } from '../helper/utils';
import { PaymentOptionsTitleProps } from '../types';

/**
 * PaymentOptionsTitleTemplate component renders the title and body of a payment option section.
 *
 * @param {Section} section - The section data to render.
 * @returns {JSX.Element} The rendered component.
 */

const PaymentOptionsTitle = ({
  selectedPaymentOptions,
  body,
  id,
  title,
}: PaymentOptionsTitleProps): JSX.Element => {
  return (
    <PaymentOptionsTitleWrapper id={`PaymentOptionsTitle-${id}`}>
      <PaymentOptionsSteps>
        {renderStepsTitle('paymentOptions', selectedPaymentOptions, title)}
      </PaymentOptionsSteps>
      <PaymentOptionsHeading>{body}</PaymentOptionsHeading>
    </PaymentOptionsTitleWrapper>
  );
};

export default PaymentOptionsTitle;


import { renderStepsTitle } from '../helper/utils';
import { PaymentOptionsTitleProps } from '../types';
import '../../styles/PaymentOptionsSmartPay.scss'; // or wherever your SCSS file lives

/**
 * PaymentOptionsTitleTemplate component renders the title and body of a payment option section.
 *
 * @param {Section} section - The section data to render.
 * @returns {JSX.Element} The rendered component.
 */

const PaymentOptionsTitle = ({
  selectedPaymentOptions,
  body,
  id,
  title,
}: PaymentOptionsTitleProps): JSX.Element => {
  return (
    <div className="payment-options-title-wrapper" id={`PaymentOptionsTitle-${id}`}>
      <div className="payment-options-steps">
        {renderStepsTitle('paymentOptions', selectedPaymentOptions, title)}
      </div>
      <h2 className="payment-options-heading">{body}</h2>
    </div>
  );
};

export default PaymentOptionsTitle;

.payment-options-title-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 1.5rem;
}

.payment-options-steps {
  font-size: 14px;
  font-weight: 600;
  color: #444;
}

.payment-options-heading {
  font-size: 18px;
  font-weight: 700;
  color: #222;
  line-height: 1.4;
}

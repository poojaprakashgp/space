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

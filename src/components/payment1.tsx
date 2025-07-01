import React, { useRef, useState, useEffect } from 'react';
import Checkbox from '@/common/atoms/Checkbox';
import Button from '@/common/molecules/Button/Button';
import { Modal } from '@/common/molecules/Modal/Modal';
import { aiPayment } from '@/store/sagas/clientApis/conversationalAI/payment';
import {
  ContentSection,
  SectionData,
} from '@/app/[subdomain]/(aiConversation)/new-checkout/common/types';
import { BillingAddressType, FormIds, ValidationRules } from '../types';
import {
  useCheckoutContext,
  useCheckoutDispatchContext,
} from '@/store/contexts/conversationalAI/checkoutContext';
import { CustomerDetailsSection } from '../../BillingAddress/type';
import {
  removeNonDigits,
  formatCardExpiry,
  formatCardNumber,
  detectCardBrand,
  CardBrandInfo,
  cardBrandRegexes,
} from '@/helpers/fieldFormatters';
import paymentActions from '@/store/actions/conversationalAI/paymentActions';
import { linkClick } from '@/helpers/(aiConversation)/tealiumTagger';
import getMaskedCardNumber from '@/helpers/getMaskedCardNumber';
import PaymentCompletedSection from '../common/components/PaymentCompletedSection';
import BillingAddressSection from '../common/components/PaymentBillingAddressSection';
import BillingInputFields from '../common/components/PaymentBillingInputFields';
import { PaymentFormProps } from '../common/types';
import { getCartInfo } from '@/helpers/commonDataUtils';

const PaymentInfoDefault: React.FC<PaymentFormProps> = ({
  isEditMode,
  setIsEditMode,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });

  const {
    checkoutData,
    shippingInfo,
    billingAddress,
    subDomain,
    paymentFailure,
    paymentSuccess,
    isPaymentCompleted,
  } = useCheckoutContext();
  const dispatch = useCheckoutDispatchContext();

  // Get payment data from context
  const paymentSection = checkoutData.payment;

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrs, setFormErrs] = useState<{ [key: string]: string }>({});
  const [formTouched, setFormTouched] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [cardInfo, setCardInfo] = useState<CardBrandInfo>({
    brand: 'Unknown',
    cvvLength: 3,
    maxLength: 16,
  });
  const { setPaymentFailure } = paymentActions;

  const [originalCardNumber, setOriginalCardNumber] = useState<string>('');
  const [cardPermanentlyDisabled, setCardPermanentlyDisabled] =
    useState<boolean>(false);
  const [displayCardNumber, setDisplayCardNumber] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('card');


  useEffect(() => {
    if (paymentSuccess?.paymentMethods && !originalCardNumber) {
      setOriginalCardNumber(formData?.cardNumber?.replace(/\s+/g, ''));
    }
  }, [paymentSuccess, originalCardNumber]);

  useEffect(() => {
    if (paymentSuccess?.paymentMethods) {
      setIsEditMode((prev) => ({ ...prev, payment: true }));
      dispatch({
        type: 'SET_ACTIVE_SECTION',
        payload: 'review',
      });
    }
  }, [paymentSuccess]);
  const handleCloseModal = () => {
    dispatch(setPaymentFailure(''));
    setFormData({
      ...formData,
      cvv: '',
    });
  };

  const cardDetailsEdited = !isEditMode && paymentSuccess?.paymentMethods;
  const paymentFailureModalDetails = checkoutData?.modals?.find(
    (sec: SectionData) =>
      sec.id ===
      (() => {
        let modalId = '';
        if (paymentFailure === '400') {
          modalId = 'payment_declined';
        } else if (paymentFailure === '500') {
          modalId = 'internal_server_error';
        }
        return modalId;
      })(),
  );

  const inCompletedState =
    paymentSection?.content?.section?.find(
      (item: { id: string }) => item.id === 'incompleted_state',
    ) ?? undefined;

  const shipingAddCheckBox =
    inCompletedState?.content?.section?.find(
      (item: { id: string }) => item.id === 'same_as_shipping_address',
    ) ?? undefined;

  const billingAddAndInfo =
    inCompletedState?.content?.section?.find(
      (item: { id: string }) => item.id === 'billing_address_and_information',
    ) ?? undefined;

  const cta = inCompletedState?.cta;

  const billingAddressSection = billingAddAndInfo?.content?.section?.find(
    (item: ContentSection) => item.id === 'billing_address',
  );

  // Properly extract and type billingInfo to resolve type issues
  const billingInfoSection = billingAddAndInfo?.content?.section?.find(
    (item: { id: string }) => item.id === 'billing_information',
  );

  const billingInfo = billingInfoSection?.content?.section;

  const errMsg: FormIds = {};
  billingInfo?.map((item: ContentSection) => {
    errMsg[item?.id as keyof FormIds] = item?.input?.errorMessages;
  });

  const billingInfoLayout = [
    billingInfo?.slice(0, 2),
    billingInfo?.slice(2, 3),
    billingInfo?.slice(3, 5),
  ];

  const handleCheckboxChange = (checked: boolean) => {
    setSameAsShipping(checked);
  };

  // Map input field labels to form data keys
  const fieldMap: Record<string, keyof typeof formData> = {
    first_name: 'firstName',
    last_name: 'lastName',
    card_number: 'cardNumber',
    expiration_date: 'expirationDate',
    cvv: 'cvv',
  };

  const rules: ValidationRules = {
    firstName: {
      regex: /^[A-Za-z\s]+$/,
    },
    lastName: {
      regex: /^[A-Za-z\s]+$/,
    },
    cardNumber: {
      regex: cardBrandRegexes[detectCardBrand(formData?.cardNumber)?.brand],
      maxLength: 19 /* Including spaces, maximum card number length */,
    },
    cvv: {
      regex: /^\d{3,4}$/ /* Base regex, will be updated dynamically */,
      maxLength: 3 /* Default, will be updated dynamically */,
    },
    expirationDate: {
      regex: /^(0[1-9]|1[0-2])\/\d{4}$/,
      maxLength: 7 /* MM/YYYY format */,
    },
  };

  /* Update card info and validation rules when component mounts */
  useEffect(() => {
    if (formData?.cardNumber) {
      const detectedCardInfo = detectCardBrand(formData?.cardNumber);
      const cvvLength = detectedCardInfo?.cvvLength ?? 3;
      setCardInfo(detectedCardInfo);
      // Update CVV validation rule
      rules.cvv = {
        regex: cvvLength === 4 ? /^\d{4}$/ : /^\d{3}$/,
        maxLength: cvvLength,
      };
    }
  }, []);

  const isValid =
    Object.values(formData).every((item) => item !== '') &&
    Object.values(formErrs).every((item) => item === '');

  const validateField = (name: string, value: string) => {
    const fieldKey = fieldMap[name];
    if (!fieldKey) return;

    // Step 1: Format the value based on field type
    let formattedValue = value;
    let errorMessage = '';

    if (fieldKey === 'cardNumber') {
      // Get card info based on current value
      const detectedCardInfo = detectCardBrand(value);
      setCardInfo(detectedCardInfo);

      // Apply formatting based on the detected card brand
      formattedValue = formatCardNumber(value);

      // When card number is emptied, clear related card fields and their error messages
      if (!value.trim()) {
        setFormData((prev) => ({
          ...prev,
          cvv: '',
          expirationDate: '',
          [fieldKey]: formattedValue,
        }));

        // Also clear any error messages for these fields
        setFormErrs((prev) => ({
          ...prev,
          card_number: '',
          cvv: '',
          expiration_date: '',
        }));

        // Reset touched state for these fields
        setFormTouched((prev) => ({
          ...prev,
          card_number: false,
          cvv: false,
          expiration_date: false,
        }));

        return;
      }

      // Get digits only to check against max length
      const digitsOnly = value.replace(/\D/g, '');

      // For Diners Club, also check if the number has exactly 14 digits
      if (
        detectedCardInfo.brand === 'Diners Club' &&
        digitsOnly.length > 0 &&
        digitsOnly.length !== 14
      ) {
        errorMessage = `${detectedCardInfo.brand} card numbers must be exactly 14 digits`;
        setFormErrs((prev) => ({
          ...prev,
          [name as keyof FormIds]: errorMessage,
        }));
        setFormData({
          ...formData,
          [fieldKey]: formattedValue,
        });
        return;
      }

      // Check if we had to truncate more than the max length for this card type
      if (digitsOnly.length > detectedCardInfo.maxLength) {
        const errStr = `${detectedCardInfo.brand} card numbers cannot exceed ${detectedCardInfo.maxLength} digits`;
        setFormErrs((prev) => ({ ...prev, [name as keyof FormIds]: errStr }));
        setFormData({
          ...formData,
          [fieldKey]: formattedValue,
        });
        return;
      }
    } else if (fieldKey === 'expirationDate') {
      // Format expiry date as MM/YYYY
      formattedValue = formatCardExpiry(value);

      // Now validate if correctly formatted
      const regex = /^(0[1-9]|1[0-2])\/\d{4}$/;

      if (formattedValue.includes('/') && !regex.test(formattedValue)) {
        // @ts-expect-error ignore
        errorMessage = errMsg[name]?.invalid ?? '';
      } else if (formattedValue.includes('/')) {
        // Check if date is in the future (only if we have a complete date)
        const [month, year] = formattedValue.split('/');
        if (month && year && year.length === 4) {
          const expiryDate = new Date(parseInt(year), parseInt(month) - 1, 1);
          expiryDate.setDate(
            new Date(parseInt(year), parseInt(month), 0).getDate(),
          );
          expiryDate.setHours(23, 59, 59, 999);

          const today = new Date();

          if (expiryDate < today) {
            errorMessage = 'Expiration date must be in the future';
          }
        }
      }
    } else if (fieldKey === 'cvv') {
      // Use the detected card brand's CVV length for validation
      formattedValue = value.replace(/\D/g, '').slice(0, cardInfo.cvvLength);

      // Validate CVV length
      if (formattedValue && formattedValue.length < cardInfo.cvvLength) {
        errorMessage = `CVV must be ${cardInfo.cvvLength} digits for ${cardInfo.brand} cards`;
      }
    }

    // Step 2: Validate the formatted value
    // Empty field validation
    if (!formattedValue.trim()) {
      errorMessage =
        name === 'first_name' || name === 'last_name'
          ? errMsg[name as keyof FormIds]?.invalid ?? ''
          : errMsg[name as keyof FormIds]?.required ?? '';
    }
    // General regex validation for other fields
    else if (
      !errorMessage && // Skip if we already have an error
      rules[fieldKey as keyof ValidationRules]?.regex &&
      !rules[fieldKey as keyof ValidationRules]?.regex?.test(formattedValue)
    ) {
      errorMessage = errMsg[name as keyof FormIds]?.invalid ?? '';
    }

    // Step 3: Update form state
    setFormErrs((prev) => ({ ...prev, [name]: errorMessage ?? '' }));
    setFormData({
      ...formData,
      [fieldKey]: formattedValue,
    });
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Mark the field as touched first
    setFormTouched((prev) => ({ ...prev, [name]: true }));

    // Special handling for card number field
    if (name === 'card_number') {
      // Check if card number is empty
      if (!value.trim()) {
        setFormErrs((prev) => ({
          ...prev,
          [name]:
            errMsg[name as keyof FormIds]?.required ??
            'Card number is required',
        }));
        return;
      }

      // Get digits only to check card number completeness
      const digitsOnly = value.replace(/\D/g, '');
      const detectedCardInfo = detectCardBrand(value);

      // For Diners Club, check if it's exactly 14 digits
      if (
        detectedCardInfo.brand === 'Diners Club' &&
        digitsOnly.length !== 14
      ) {
        setFormErrs((prev) => ({
          ...prev,
          [name]: `${detectedCardInfo.brand} card numbers must be exactly 14 digits`,
        }));
      }
      // For other cards, check if the length matches the expected length
      else if (digitsOnly.length !== detectedCardInfo.maxLength) {
        setFormErrs((prev) => ({
          ...prev,
          [name]: `${detectedCardInfo.brand} card numbers must be ${detectedCardInfo.maxLength} digits`,
        }));
      } else {
        // Card number is valid, run standard validation
        validateField(name, value);

        // If the card number is valid and not empty, create masked version for display only
        if (value.trim() !== '') {
          // Create masked version for display but keep original in state
          const maskedNumber = getMaskedCardNumber(value, '•');
          setDisplayCardNumber(maskedNumber);
        }
      }
      return;
    }

    // Run standard validation for all other fields
    validateField(name, value);
  };

  const [cursorPositions, setCursorPositions] = useState<{
    [key: string]: number;
  }>({
    card_number: 0,
    expiration_date: 0,
    cvv: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, selectionStart } = e.target;
    const currentPos = selectionStart ?? 0;
    const prevValue = formData[fieldMap[name]] ?? '';

    /* Update card info when card number changes */
    if (name === 'card_number') {
      const detectedCardInfo = detectCardBrand(value);
      setCardInfo(detectedCardInfo);

      /* Update the CVV validation rule based on the card brand */
      rules.cvv = {
        regex: detectedCardInfo.cvvLength === 4 ? /^\d{4}$/ : /^\d{3}$/,
        maxLength: detectedCardInfo.cvvLength,
      };
    }

    // Call validateField which will format and update the value
    validateField(name, value);

    // Calculate new cursor position based on formatting changes
    if (name === 'card_number') {
      // For card numbers, position depends on the card type
      const beforeCursor = value.substring(0, currentPos);
      const digitsBeforeCursor = beforeCursor.replace(/\D/g, '').length;
      const cardType = detectCardBrand(value).brand;
      let newPos = digitsBeforeCursor;

      // Determine if user is typing or deleting
      const isAddingDigit =
        value.replace(/\D/g, '').length > prevValue.replace(/\D/g, '').length;

      // Handle cursor positioning based on card type
      if (cardType === 'American Express') {
        // American Express uses 4-6-5 pattern
        if (digitsBeforeCursor > 10) {
          newPos += 2; // Two spaces: after 4th and 10th digits
        } else if (digitsBeforeCursor > 4) {
          newPos += 1; // One space: after 4th digit
        }

        // If typing and at a position where a space will be added, move cursor forward
        if (isAddingDigit) {
          if (digitsBeforeCursor === 4 || digitsBeforeCursor === 10) {
            newPos += 1;
          }
        }
      } else {
        // All other cards use 4-4-4-4 pattern
        // Add 1 space for every 4 digits before cursor
        const spacesBeforeCursor = Math.floor(digitsBeforeCursor / 4);
        newPos += spacesBeforeCursor;

        // If typing and at a position where a space will be added, move cursor forward
        if (
          isAddingDigit &&
          digitsBeforeCursor % 4 === 0 &&
          digitsBeforeCursor > 0
        ) {
          newPos += 1;
        }
      }

      setCursorPositions((prev) => ({ ...prev, [name]: newPos }));
    } else if (name === 'expiration_date') {
      // For expiration date, a slash is added after 2 digits
      const beforeCursor = value.substring(0, currentPos);
      const digitsBeforeCursor = beforeCursor.replace(/\D/g, '').length;

      // If cursor is after the potential slash position
      if (digitsBeforeCursor >= 2) {
        // Add 1 for the slash
        const newPos = digitsBeforeCursor + 1;
        setCursorPositions((prev) => ({ ...prev, [name]: newPos }));
      } else {
        setCursorPositions((prev) => ({ ...prev, [name]: digitsBeforeCursor }));
      }
    } else {
      // For other fields, just maintain the cursor position
      setCursorPositions((prev) => ({ ...prev, [name]: currentPos }));
    }
  };

  // Handle key events to improve editing experience with formatted inputs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { name, selectionStart, value } = e.target as HTMLInputElement;

    // Only handle special cases for card number field
    if (name !== 'card_number') return;

    const cursorPos = selectionStart ?? 0;

    // Check if cursor is right after a space
    const isAfterSpace = cursorPos > 0 && value.charAt(cursorPos - 1) === ' ';

    // Handle backspace key when cursor is right after a space
    if (e.key === 'Backspace' && isAfterSpace) {
      e.preventDefault();

      // Calculate new value with the digit before the space removed
      const newPos = cursorPos - 2; // Move cursor before the space and deleted digit
      const newValue =
        value.substring(0, cursorPos - 2) + value.substring(cursorPos);

      // Update the input value and cursor position
      const input = e.target as HTMLInputElement;
      input.value = newValue;

      // Trigger onChange event manually with the new value
      const changeEvent = new Event('input', {
        bubbles: true,
      }) as unknown as React.ChangeEvent<HTMLInputElement>;
      Object.defineProperty(changeEvent, 'target', { value: input });
      handleChange(changeEvent);

      // Set cursor position after the update
      setTimeout(() => {
        const ref = inputRefs.current[name];
        if (ref) {
          ref.setSelectionRange(newPos, newPos);
        }
      }, 0);
    }

    // Handle delete key when cursor is right before a space
    if (
      e.key === 'Delete' &&
      cursorPos < value.length &&
      value.charAt(cursorPos) === ' '
    ) {
      e.preventDefault();

      // Calculate new value with the digit after the space removed
      const newValue =
        value.substring(0, cursorPos) + value.substring(cursorPos + 2);

      // Update the input value and cursor position
      const input = e.target as HTMLInputElement;
      input.value = newValue;

      // Trigger onChange event manually with the new value
      const changeEvent = new Event('input', {
        bubbles: true,
      }) as unknown as React.ChangeEvent<HTMLInputElement>;
      Object.defineProperty(changeEvent, 'target', { value: input });
      handleChange(changeEvent);

      // Maintain cursor position after the update
      setTimeout(() => {
        const ref = inputRefs.current[name];
        if (ref) {
          ref.setSelectionRange(cursorPos, cursorPos);
        }
      }, 0);
    }
  };

  const linkViewEventCall = (formData: {
    firstName: string;
    lastName: string;
    cardNumber: string;
    expirationDate: string;
    cvv: string;
    billingAddress?: BillingAddressType;
    cardType: string;
    [key: string]: string | BillingAddressType | undefined;
  }) => {
    linkClick({
      pageName: 'checkout_page_ai',
      linkLocation: 'checkout_display_module',
      linkType: 'button',
      payment_type: 'Card',
      shipping_type: shippingInfo?.shippingOption ?? '',
      brandName: subDomain,
      devicePurchaseType: 'Device Purchase',
      cartInfo: getCartInfo(),
      authType: 'guest',
      event: 'payment_complete_cta',
      autopay_enroll_selected: 'N',
      address_line1: formData?.addressLine1 ?? '',
      address_line2: formData?.addressLine1 ?? '',
      address_city: formData?.city ?? '',
      address_state: formData?.stateOrProvince ?? '',
      address_zip_code: formData?.zipCode ?? '',
      customerEmailHashed: formData?.emailAddress ?? '',
      recommended_devices_plans: [],
      cart_shipping_amount:
        checkoutData?.orderSummaryData?.orderSummaryTotal?.shipping ?? '',
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    const { ...rest } = formData;
    const formatedCardNumber = formData?.cardNumber?.replace(/\s+/g, '');
    const updatedFormData = {
      ...rest,
      cardNumber: originalCardNumber || formatedCardNumber,
    };

    try {
      const completeFormData = {
        ...updatedFormData,
        addressLine1: shippingInfo?.address ?? '',
        addressLine2: shippingInfo?.address_2 ?? '',
        apt: shippingInfo?.address_2 ?? '',
        city: shippingInfo?.city ?? '',
        stateOrProvince: shippingInfo?.state ?? '',
        zipCode: shippingInfo?.zip_code ?? '',
        country: 'US',
        phoneNumber: removeNonDigits(shippingInfo?.phone_number ?? ''),
        emailAddress: shippingInfo?.email ?? '',
        sameAsShippingAddress: sameAsShipping ? 'Y' : 'N',
        shippingFirstName: shippingInfo?.first_name ?? '',
        shippingLastName: shippingInfo?.last_name ?? '',
        cardType: cardInfo.brand,
        ...(sameAsShipping
          ? {}
          : {
            billingAddress: {
              addressLine1: billingAddress?.address ?? '',
              addressLine2: billingAddress?.address_2 ?? '',
              apt: billingAddress?.apt ?? '',
              city: billingAddress?.city ?? '',
              stateOrProvince: billingAddress?.state ?? '',
              zipcode: billingAddress?.zip_code ?? '',
              country: 'US',
              phoneNumber:
                  removeNonDigits(billingAddress?.phone_number) ?? '',
              emailAddress: billingAddress?.email ?? '',
            },
          }),
      };

      linkViewEventCall(completeFormData);
      dispatch(
        paymentActions.setPaymentCardData(
          originalCardNumber || formatedCardNumber,
          cardInfo.brand,
          formData.expirationDate,
          formData.firstName,
          formData.lastName,
        ),
      );

      // Process payment through the API
      await aiPayment(subDomain, completeFormData, dispatch);
      dispatch({
        type: 'SET_LAST_ACTIVE_SECTION',
        payload: 'review',
      });
    } catch (error) {
      console.error({ message: 'An unknown error occurred.', error: error });
    } finally {
      setIsSubmitting(false);
    }
  };

  const CardImage = paymentSuccess?.paymentMethods?.[0]?.image?.src;
  const CardAltText = paymentSuccess?.paymentMethods?.[0]?.image?.alt;
  const lastFourDigits = formData?.cardNumber?.replace(/\s/g, '').slice(-4);
  const CardTitle = `**** **** **** ${lastFourDigits || 'XXXX'}`;
  const { paymentCardData } = useCheckoutContext();

  useEffect(() => {
    if (paymentSuccess?.paymentMethods) {
      setFormData((prev) => {
        if (isEditMode) {
          return {
            ...prev,
            cvv: '',
            cardNumber: originalCardNumber
              ? formatCardNumber(originalCardNumber)
              : prev.cardNumber
                ? getMaskedCardNumber(prev.cardNumber, '•')
                : (() => {
                  let cardNumber = '';
                  if (paymentCardData?.cardNumber) {
                    cardNumber = formatCardNumber(paymentCardData.cardNumber);
                  }
                  return cardNumber;
                })(),
          };
        }

        return {
          ...prev,
          cvv: '',
          cardNumber: prev.cardNumber
            ? getMaskedCardNumber(prev.cardNumber, '•')
            : (() => {
              let cardNumber = '';
              if (paymentCardData?.cardNumber) {
                cardNumber = formatCardNumber(paymentCardData.cardNumber);
              }
              return cardNumber;
            })(),
        };
      });

      if (!originalCardNumber && paymentCardData?.cardNumber) {
        setOriginalCardNumber(paymentCardData.cardNumber);
      }
    }
  }, [isEditMode, paymentSuccess, originalCardNumber]);

  useEffect(() => {
    if (paymentCardData) {
      if (!formData.firstName && paymentCardData.firstName) {
        setFormData((prev) => ({
          ...prev,
          firstName: paymentCardData.firstName,
        }));
      }

      if (!formData.lastName && paymentCardData.lastName) {
        setFormData((prev) => ({
          ...prev,
          lastName: paymentCardData.lastName,
        }));
      }

      // If cardType is not set but available in context, update it
      if (!cardInfo.brand || cardInfo.brand === 'Unknown') {
        if (paymentCardData.cardType) {
          setCardInfo((prev) => ({
            ...prev,
            brand: paymentCardData.cardType,
          }));
        }
      }
    }
  }, [paymentCardData, formData.firstName, formData.lastName, cardInfo.brand]);

  const setDisable = (id: string): boolean => {
    if (id === 'card_number') {
      if (cardPermanentlyDisabled) {
        return true;
      }

      if (cardDetailsEdited && paymentSuccess) {
        setCardPermanentlyDisabled(true);
        return true;
      }
    }
    return false;
  };

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  useEffect(() => {
    // Initialize refs for each input field
    billingInfo?.forEach((item: ContentSection) => {
      const id = item?.id ?? '';
      if (id && !inputRefs.current[id]) {
        inputRefs.current[id] = null;
      }
    });
  }, [billingInfo]);

  // Handle focus event for showing unmasked card number
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;

    // If focusing on card number field and we have a display version stored
    if (name === 'card_number' && displayCardNumber) {
      // Reset display to show the actual number from state
      setDisplayCardNumber('');

      // Set cursor position at the end of the input
      setTimeout(() => {
        const ref = inputRefs.current[name];
        if (ref) {
          const length = formData.cardNumber.length;
          ref.setSelectionRange(length, length);
        }
      }, 0);
    }
  };

  function renderPaymentForm() {

    return (
      <>
        <div className="payment__row">
          <Checkbox
            checked={sameAsShipping}
            onChange={handleCheckboxChange}
            className="payment__checbox-flex"
            label={shipingAddCheckBox?.title}
            aria-label={shipingAddCheckBox?.title}
          />
        </div>

        {/* Payment section */}
        <div>
          {/* Payment address  */}
          <BillingAddressSection
            sameAsShipping={sameAsShipping}
            billingAddressSection={
              billingAddressSection as CustomerDetailsSection
            }
          />
          {/* Payment card info  */}
          <BillingInputFields
            billingInfoLayout={billingInfoLayout}
            formData={formData}
            formErrs={formErrs}
            formTouched={formTouched}
            displayCardNumber={displayCardNumber}
            fieldMap={fieldMap}
            inputRefs={inputRefs}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleFocus={handleFocus}
            handleKeyDown={handleKeyDown}
            setDisable={setDisable}
          />
          <div></div>
        </div>

        {/* Payment failure */}
        {paymentFailure !== '' && (
          <div className="payment__error" role="alert">
            <Modal
              showClose
              showAlert={true}
              show={true}
              modalTitle={paymentFailureModalDetails?.title}
              closeModal={handleCloseModal}
            >
              {paymentFailureModalDetails?.body}
            </Modal>
          </div>
        )}

        <Button
          primary={true}
          className="number-selection__continue-btn"
          size="xl"
          onClick={() => {
            const event = new Event('submit', {
              bubbles: true,
              cancelable: true,
            }) as unknown as React.FormEvent<HTMLFormElement>;
            handleSubmit(event);
          }}
          disabled={!isValid}
          aria-disabled={!isValid ? 'true' : 'false'}
          label={isSubmitting ? 'Processing...' : cta?.text}
          dataTestId={'submit-button'}
          dataGtmCta="complete_payment"
        />
      </>
    );
  }

  useEffect(() => {
    Object.entries(cursorPositions).forEach(([name, pos]) => {
      const ref = inputRefs.current[name];
      if (ref && typeof pos === 'number') {
        ref.setSelectionRange(pos, pos);
      }
    });
  }, [formData, cursorPositions]);

  return (
    <div className="payment__form" aria-labelledby="payment-title">
      {isEditMode && isPaymentCompleted ? (
        <PaymentCompletedSection
          CardImage={CardImage as string}
          CardAltText={CardAltText as string}
          CardTitle={CardTitle}
        />
      ) : (
        renderPaymentForm()
      )}
    </div>
  );
};

export default PaymentInfoDefault;


import { ContentSection } from '@/app/[subdomain]/(aiConversation)/new-checkout/common/types';
import TextInput from '@/common/atoms/TextInput';
import React from 'react';
import { BillingInputFieldsProps } from '../types';

const BillingInputFields: React.FC<BillingInputFieldsProps> = ({
  billingInfoLayout,
  formData,
  formErrs,
  formTouched,
  displayCardNumber,
  fieldMap,
  inputRefs,
  handleChange,
  handleBlur,
  handleFocus,
  handleKeyDown,
  setDisable,
}) => {
  return (
    <>
      {billingInfoLayout.map((inputItems, inputItemsIndex) => (
        <div
          key={`billing-row-${inputItemsIndex}`}
          className={`payment__row ${
            inputItems && inputItems.length > 1 ? 'payment__flex' : ''
          }`}
        >
          {inputItems?.map((inputItem: ContentSection) => {
            const inputField = inputItem?.input;
            const id = inputItem?.id ?? '';

            const displayValue = () => {
              if (id && fieldMap[id]) {
                if (id === 'card_number' && displayCardNumber) {
                  return displayCardNumber;
                }
                return formData[fieldMap[id]];
              }
              return '';
            };

            return (
              <TextInput
                ref={(el) => {
                  inputRefs.current[id] = el;
                }}
                key={id}
                label={inputField?.label ?? ''}
                name={id ?? ''}
                value={displayValue()}
                placeholder={
                  id !== 'expiration_date'
                    ? inputField?.placeholder ?? ''
                    : 'MM/YYYY'
                }
                required={!!inputField?.required}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                aria-label={inputField?.label ?? ''}
                aria-required={inputField?.required ? 'true' : 'false'}
                errorMessage={formTouched[id] ? formErrs[id] : ''}
                disabled={setDisable(id)}
                type={inputItem.id === 'cvv' ? 'password' : 'text'}
              />
            );
          })}
        </div>
      ))}
    </>
  );
};

export default BillingInputFields;
import CustomNextImage from '@/components/common/components/CustomNextImage';
import React from 'react';
import { PaymentCompletedProps } from '../types';

const PaymentCompletedSection: React.FC<PaymentCompletedProps> = ({
  CardImage,
  CardAltText,
  CardTitle,
}) => {
  return (
    <div className="payment__completed">
      <div className="payment__completed--icon-container">
        <CustomNextImage
          alt={CardAltText}
          src={CardImage}
          width={44}
          height={28}
        />
        <p
          className="payment__completed--details"
          data-testid="payment__completed--details"
        >{`${CardTitle}`}</p>
      </div>
    </div>
  );
};

export default PaymentCompletedSection;

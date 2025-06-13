export const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '');

  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
};

export function formatCardExpiry(value: string): string {
  // Remove any non-digit characters
  const digits = value.replace(/\D/g, '');

  // Handle the formatting
  if (digits.length <= 2) {
    return digits;
  } else {
    // Format as MM/YYYY (always use full 4-digit year)
    return `${digits.substring(0, 2)}/${digits.substring(2, 6)}`;
  }
}

export interface CardBrandInfo {
  brand: string;
  cvvLength: number;
  maxLength: number;
}

export const detectCardBrand = (cardNumber: string): CardBrandInfo => {
  /* Remove all non-digits */
  const digits = cardNumber.replace(/\D/g, '');

  /* Default card info */
  const defaultCard: CardBrandInfo = {
    brand: 'Unknown',
    cvvLength: 3,
    maxLength: 16,
  };
  /* Card detection patterns */
  if (digits.startsWith('4')) {
    return { brand: 'VISA', cvvLength: 3, maxLength: 16 };
  } else if (
    /^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d\d|27[0-1]\d|2720)/.test(digits)
  ) {
    return { brand: 'MASTERCARD', cvvLength: 3, maxLength: 16 };
  } else if (/^3[47]/.test(digits)) {
    return { brand: 'AMEX', cvvLength: 4, maxLength: 15 };
  } else if (
    /^(6011|6(?:4[4-9]|5\d)\d{2}|622(?:12[6-9]|1[3-9]\d|[2-9]\d\d))/.test(
      digits,
    )
  ) {
    return { brand: 'DISCOVER', cvvLength: 3, maxLength: 16 };
  } else if (/^3(?:0[0-5]|6|8)/.test(digits)) {
    return { brand: 'DINERSCLUB', cvvLength: 3, maxLength: 14 };
  } else if (/^35(?:2[89]|[3-8]\d)/.test(digits)) {
    return { brand: 'JCB', cvvLength: 3, maxLength: 16 };
  } else if (
    /^62/.test(digits) &&
    !/^622(?:12[6-9]|1[3-9]\d|[2-9]\d\d)/.test(digits)
  ) {
    return { brand: 'UNIONPAY', cvvLength: 3, maxLength: 19 };
  }

  return defaultCard;
};

export const formatCardNumber = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');

  /* Get card info */
  const cardInfo = detectCardBrand(digits);

  /* Limit to card's specific max length */
  const limitedDigits = digits.slice(0, cardInfo.maxLength);

  /* Format with spaces */
  let formattedNumber = '';

  /* Special formatting for Amex (4-6-5 pattern) */
  if (cardInfo.brand === 'American Express') {
    if (limitedDigits.length >= 4) {
      formattedNumber = limitedDigits.substring(0, 4);

      if (limitedDigits.length > 4) {
        const secondGroup = limitedDigits.substring(
          4,
          Math.min(10, limitedDigits.length),
        );
        formattedNumber += ` ${secondGroup}`;

        if (limitedDigits.length > 10) {
          formattedNumber += ` ${limitedDigits.substring(10, 15)}`;
        }
      }
    } else {
      formattedNumber = limitedDigits;
    }
  } else {
    /* Standard 4-4-4-4 pattern for all other cards including Diners Club */
    for (let i = 0; i < limitedDigits.length; i += 4) {
      if (i > 0) formattedNumber += ' ';
      formattedNumber += limitedDigits.substring(
        i,
        Math.min(i + 4, limitedDigits.length),
      );
    }
  }

  return formattedNumber;
};

export const cleanFormValue = (value: string = ''): string =>
  value.replace(/[\s()]/g, '');

export const removeNonDigits = (value = ''): string => value.replace(/\D/g, '');

/**
 * Brand-specific card number regex patterns for use in validation rules.
 * Use the correct regex for the detected brand.
 */
export const cardBrandRegexes: Record<string, RegExp> = {
  Visa: /^(?:\d{4}[ -]?){1,3}\d{1,4}$/,
  MasterCard: /^(?:\d{4}[ -]?){1,3}\d{1,4}$/,
  'American Express': /^\d{4}[ -]?\d{6}[ -]?\d{5}$/,
  Discover: /^(?:\d{4}[ -]?){1,3}\d{1,4}$/,
  'Diners Club': /^\d{4}[ -]?\d{6}[ -]?\d{4}$/,
  JCB: /^(?:\d{4}[ -]?){1,3}\d{1,4}$/,
  UnionPay: /^(?:\d{4}[ -]?){1,4}\d{1,4}$/,
  Unknown: /^(?:\d[ -]?){12,19}$/,
};

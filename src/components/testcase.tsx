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






import {
  formatPhoneNumber,
  formatCardExpiry,
  detectCardBrand,
  formatCardNumber,
  cleanFormValue,
  removeNonDigits,
  cardBrandRegexes,
} from './your-utils-file'; // <-- update path accordingly

describe('formatPhoneNumber', () => {
  it('formats < 3 digits', () => {
    expect(formatPhoneNumber('12')).toBe('12');
  });

  it('formats 3-6 digits', () => {
    expect(formatPhoneNumber('123456')).toBe('(123) 456');
  });

  it('formats more than 6 digits', () => {
    expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
  });

  it('removes non-digits', () => {
    expect(formatPhoneNumber('(123)-456')).toBe('(123) 456');
  });
});

describe('formatCardExpiry', () => {
  it('formats MM', () => {
    expect(formatCardExpiry('12')).toBe('12');
  });

  it('formats MMYYYY', () => {
    expect(formatCardExpiry('122025')).toBe('12/2025');
  });

  it('ignores non-digits', () => {
    expect(formatCardExpiry('12/20a25')).toBe('12/2025');
  });
});

describe('detectCardBrand', () => {
  const brands = [
    { number: '4111111111111111', brand: 'VISA' },
    { number: '5555555555554444', brand: 'MASTERCARD' },
    { number: '378282246310005', brand: 'AMEX', cvv: 4, max: 15 },
    { number: '6011111111111117', brand: 'DISCOVER' },
    { number: '30569309025904', brand: 'DINERSCLUB', max: 14 },
    { number: '3530111333300000', brand: 'JCB' },
    { number: '6240000000000000', brand: 'UNIONPAY', max: 19 },
    { number: '9999999999999999', brand: 'Unknown' },
  ];

  brands.forEach(({ number, brand }) => {
    it(`detects ${brand}`, () => {
      expect(detectCardBrand(number).brand).toBe(brand);
    });
  });
});

describe('formatCardNumber', () => {
  it('formats Visa (4x4x4x4)', () => {
    expect(formatCardNumber('4111111111111111')).toBe('4111 1111 1111 1111');
  });

  it('formats Amex (4-6-5)', () => {
    expect(formatCardNumber('378282246310005')).toBe('3782 822463 10005');
  });

  it('trims card number based on brand length', () => {
    expect(formatCardNumber('378282246310005999999')).toBe('3782 822463 10005');
    expect(formatCardNumber('41111111111111112222')).toBe('4111 1111 1111 1111');
  });

  it('handles short card numbers', () => {
    expect(formatCardNumber('4111')).toBe('4111');
  });

  it('removes non-digit characters', () => {
    expect(formatCardNumber('4111-1111 1111')).toBe('4111 1111 1111');
  });
});

describe('cleanFormValue', () => {
  it('removes spaces and brackets', () => {
    expect(cleanFormValue('(123) 456 7890')).toBe('1234567890');
  });

  it('handles empty input', () => {
    expect(cleanFormValue()).toBe('');
  });
});

describe('removeNonDigits', () => {
  it('removes non-digits', () => {
    expect(removeNonDigits('(123)abc')).toBe('123');
  });

  it('handles undefined input', () => {
    expect(removeNonDigits()).toBe('');
  });
});

describe('cardBrandRegexes', () => {
  const tests = [
    { brand: 'Visa', number: '4111 1111 1111 1111' },
    { brand: 'MasterCard', number: '5555 5555 5555 4444' },
    { brand: 'American Express', number: '3782 822463 10005' },
    { brand: 'Discover', number: '6011 1111 1111 1117' },
    { brand: 'Diners Club', number: '3056 930902 5904' },
    { brand: 'JCB', number: '3530 1113 3330 0000' },
    { brand: 'UnionPay', number: '6240 0000 0000 0000 000' },
    { brand: 'Unknown', number: '9999 9999 9999 9999' },
  ];

  tests.forEach(({ brand, number }) => {
    it(`matches ${brand} number`, () => {
      expect(cardBrandRegexes[brand].test(number)).toBe(true);
    });
  });
});


describe('detectCardBrand - additional property checks', () => {
  it('returns correct cvvLength and maxLength for AMEX', () => {
    const result = detectCardBrand('378282246310005');
    expect(result).toEqual({ brand: 'AMEX', cvvLength: 4, maxLength: 15 });
  });

  it('returns default for unrecognized number', () => {
    const result = detectCardBrand('999999999999');
    expect(result).toEqual({ brand: 'Unknown', cvvLength: 3, maxLength: 16 });
  });
});

describe('formatCardNumber - edge Amex formatting', () => {
  it('formats Amex correctly with < 4 digits', () => {
    expect(formatCardNumber('378')).toBe('378');
  });

  it('formats Amex correctly with 4-10 digits', () => {
    expect(formatCardNumber('3782822463')).toBe('3782 822463');
  });

  it('formats Amex with exactly 15 digits', () => {
    expect(formatCardNumber('378282246310005')).toBe('3782 822463 10005');
  });
});

describe('formatCardNumber - generic brand format', () => {
  it('formats Discover (non-Amex) in 4-4-4-4', () => {
    expect(formatCardNumber('6011111111111117')).toBe('6011 1111 1111 1117');
  });

  it('formats JCB (max 16 digits)', () => {
    expect(formatCardNumber('3530111333300000')).toBe('3530 1113 3330 0000');
  });

  it('formats UnionPay with max 19 digits', () => {
    const number = '6240000000000000000';
    expect(formatCardNumber(number)).toBe('6240 0000 0000 0000 000');
  });
});

describe('cleanFormValue - extra cases', () => {
  it('returns clean string when no special characters', () => {
    expect(cleanFormValue('1234567890')).toBe('1234567890');
  });

  it('handles undefined string safely', () => {
    expect(cleanFormValue(undefined)).toBe('');
  });
});

describe('removeNonDigits - full non-digit string', () => {
  it('returns empty string if all chars are non-digits', () => {
    expect(removeNonDigits('abc!@#')).toBe('');
  });
});



Field Formatters util > should formate card number properly for formats Amex correctly with >= 4 digits and <=10 digits
-----
Error: expect(received).toBe(expected) // Object.is equality

Expected: "3783 243545"
Received: "3783 2435 45"Jest



Field Formatters util > should formate card number properly for formats Amex correctly with >10 digits
-----
Error: expect(received).toBe(expected) // Object.is equality

Expected: "3783 243545 12345"
Received: "3783 2435 4512 345"Jes

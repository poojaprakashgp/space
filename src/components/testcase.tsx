  const findAdjacentPricedProducts = (
    phoneList: Array<{ productId: string; [key: string]: any }>,
    phoneProductData: {
      [productId: string]: { offerPrice?: number; [key: string]: any };
    },
    selectedPhone: { phoneType: string; [key: string]: any },
  ): { nextHighestPriceId: string; nextLowestPriceId: string } => {
    const result = {
      nextHighestPriceId: '',
      nextLowestPriceId: '',
    };

    // Check if we have enough items to sort
    if (phoneList.length <= 2) {
      return result;
    }

    // Create a sorted copy of the phone list by offerPrice
    const sortedList = [...phoneList].sort((a, b) => {
      const priceA = phoneProductData[a.productId]?.offerPrice || 0;
      const priceB = phoneProductData[b.productId]?.offerPrice || 0;

      // Sort in ascending order (lowest price first)
      return priceA - priceB;
    });

    const selectedPhoneIndex = sortedList.findIndex(
      (phone) => phone.productId === selectedPhone.productId,
    );

    if (selectedPhoneIndex !== -1) {
      const selectedPhonePrice =
        phoneProductData[selectedPhone.productId]?.offerPrice || 0;
      // Find the next lowest priced phone
      for (let i = selectedPhoneIndex - 1; i >= 0; i--) {
        // const phonePrice = sortedList[i]?.offerPrice || 0;
        if ((sortedList[i]?.offerPrice || 0) < selectedPhonePrice) {
          result.nextLowestPriceId = sortedList[i].productId;
          break;
        }
      }
      // Find the next highest priced phone
      for (let i = selectedPhoneIndex + 1; i < sortedList.length; i++) {
        // const phonePrice = sortedList[i]?.offerPrice || 0;
        if ((sortedList[i]?.offerPrice || 0) > selectedPhonePrice) {
          result.nextHighestPriceId = sortedList[i].productId;
          break;
        }
      }
    }
    return result;
  };


import { findAdjacentPricedProducts } from './yourFile'; // adjust path as needed

describe('findAdjacentPricedProducts', () => {
  const basePhones = [
    { productId: 'p1' },
    { productId: 'p2' },
    { productId: 'p3' },
    { productId: 'p4' },
  ];

  const basePrices = {
    p1: { offerPrice: 200 },
    p2: { offerPrice: 400 },
    p3: { offerPrice: 300 },
    p4: { offerPrice: 500 },
  };

  it('should return nextHighestPriceId and nextLowestPriceId correctly (middle item)', () => {
    const selectedPhone = { productId: 'p3', phoneType: 'mid' }; // price 300
    const result = findAdjacentPricedProducts(basePhones, basePrices, selectedPhone);

    expect(result).toEqual({
      nextLowestPriceId: 'p1', // 200
      nextHighestPriceId: 'p2', // 400
    });
  });

  it('should return only nextHighestPriceId if selected is lowest priced', () => {
    const selectedPhone = { productId: 'p1', phoneType: 'low' }; // price 200
    const result = findAdjacentPricedProducts(basePhones, basePrices, selectedPhone);

    expect(result).toEqual({
      nextLowestPriceId: '',
      nextHighestPriceId: 'p3', // 300
    });
  });

  it('should return only nextLowestPriceId if selected is highest priced', () => {
    const selectedPhone = { productId: 'p4', phoneType: 'high' }; // price 500
    const result = findAdjacentPricedProducts(basePhones, basePrices, selectedPhone);

    expect(result).toEqual({
      nextLowestPriceId: 'p2', // 400
      nextHighestPriceId: '',
    });
  });

  it('should return empty result if selectedPhone not in list', () => {
    const selectedPhone = { productId: 'pX', phoneType: 'ghost' }; // not found
    const result = findAdjacentPricedProducts(basePhones, basePrices, selectedPhone);

    expect(result).toEqual({
      nextLowestPriceId: '',
      nextHighestPriceId: '',
    });
  });

  it('should use 0 for missing offerPrice and still sort', () => {
    const customPhones = [
      { productId: 'a' }, // no price
      { productId: 'b' }, // price: 150
      { productId: 'c' }, // price: 100
    ];
    const priceMap = {
      b: { offerPrice: 150 },
      c: { offerPrice: 100 },
      // a is missing offerPrice
    };
    const selectedPhone = { productId: 'b', phoneType: 'test' };

    const result = findAdjacentPricedProducts(customPhones, priceMap, selectedPhone);
    expect(result.nextLowestPriceId).toBe('c');
    expect(result.nextHighestPriceId).toBe('');
  });

  it('should return empty values if phoneList has only two phones', () => {
    const result = findAdjacentPricedProducts(
      [{ productId: 'one' }, { productId: 'two' }],
      { one: { offerPrice: 100 }, two: { offerPrice: 200 } },
      { productId: 'one', phoneType: 'short' },
    );

    expect(result).toEqual({
      nextLowestPriceId: '',
      nextHighestPriceId: '',
    });
  });
});

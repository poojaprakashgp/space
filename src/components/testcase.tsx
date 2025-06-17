    const sortedList = [...phoneList].sort((a, b) => {
      const priceA = phoneProductData[a.productId]?.offerPrice || 0;
      const priceB = phoneProductData[b.productId]?.offerPrice || 0;
 
      // Sort in ascending order (lowest price first)
      return priceA - priceB;
    });
 
    const selectedPhoneIndex = sortedList.findIndex(
      (phone) => phone.productId === selectedPhone.productId,
    );
 
    Iif (selectedPhoneIndex !== -1) {
      const selectedPhonePrice =
        phoneProductData[selectedPhone.productId]?.offerPrice || 0;
      // Find the next lowest priced phone
      for (let i = selectedPhoneIndex - 1; i >= 0; i--) {
        // const phonePrice = sortedList[i]?.offerPrice || 0;
        Iif ((sortedList[i]?.offerPrice || 0) < selectedPhonePrice) {
          result.nextLowestPriceId = sortedList[i].productId;
          break;
        }
      }
      // Find the next highest priced phone
      for (let i = selectedPhoneIndex + 1; i < sortedList.length; i++) {
        // const phonePrice = sortedList[i]?.offerPrice || 0;
        Iif ((sortedList[i]?.offerPrice || 0) > selectedPhonePrice) {
          result.nextHighestPriceId = sortedList[i].productId;
          break;
        }
      }
    }
    return result;
  }; give test cases to cover each lines above i have given



describe('findPriceRangeNeighbors', () => {
  const basePhones = [
    { productId: 'phone1' },
    { productId: 'phone2' },
    { productId: 'phone3' },
  ];

  const baseProductData = {
    phone1: { offerPrice: 10000 },
    phone2: { offerPrice: 15000 },
    phone3: { offerPrice: 20000 },
  };

  it('should return correct nextLowestPriceId and nextHighestPriceId (happy path)', () => {
    const result = findPriceRangeNeighbors({
      phoneList: basePhones,
      phoneProductData: baseProductData,
      selectedPhone: { productId: 'phone2' },
    });

    expect(result).toEqual({
      nextLowestPriceId: 'phone1',
      nextHighestPriceId: 'phone3',
    });
  });

  it('should handle when selectedPhone is the lowest priced phone (no next lower)', () => {
    const result = findPriceRangeNeighbors({
      phoneList: basePhones,
      phoneProductData: baseProductData,
      selectedPhone: { productId: 'phone1' },
    });

    expect(result).toEqual({
      nextLowestPriceId: undefined,
      nextHighestPriceId: 'phone2',
    });
  });

  it('should handle when selectedPhone is the highest priced phone (no next higher)', () => {
    const result = findPriceRangeNeighbors({
      phoneList: basePhones,
      phoneProductData: baseProductData,
      selectedPhone: { productId: 'phone3' },
    });

    expect(result).toEqual({
      nextLowestPriceId: 'phone2',
      nextHighestPriceId: undefined,
    });
  });

  it('should return empty result when selectedPhone not found in sorted list', () => {
    const result = findPriceRangeNeighbors({
      phoneList: basePhones,
      phoneProductData: baseProductData,
      selectedPhone: { productId: 'phoneX' }, // not in list
    });

    expect(result).toEqual({});
  });

  it('should treat missing offerPrice as 0 and still return correct neighbors', () => {
    const result = findPriceRangeNeighbors({
      phoneList: [
        { productId: 'phone1' },
        { productId: 'phone2' },
        { productId: 'phone3' },
      ],
      phoneProductData: {
        phone1: {}, // offerPrice missing
        phone2: { offerPrice: 5000 },
        phone3: { offerPrice: 10000 },
      },
      selectedPhone: { productId: 'phone2' },
    });

    expect(result).toEqual({
      nextLowestPriceId: 'phone1',
      nextHighestPriceId: 'phone3',
    });
  });

  it('should skip over phones with same price as selectedPhone (must be strictly lower/higher)', () => {
    const result = findPriceRangeNeighbors({
      phoneList: [
        { productId: 'phone1' },
        { productId: 'phone2' },
        { productId: 'phone3' },
      ],
      phoneProductData: {
        phone1: { offerPrice: 5000 },
        phone2: { offerPrice: 10000 },
        phone3: { offerPrice: 10000 }, // same as selected
      },
      selectedPhone: { productId: 'phone2' },
    });

    expect(result).toEqual({
      nextLowestPriceId: 'phone1',
      nextHighestPriceId: undefined,
    });
  });
});


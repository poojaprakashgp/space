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


 const handleProductSelection = (productId: string, destination: string) => {
    try {
      const selectedPhone = {
        ...phoneProductData[productId],
        productId: productId,
      };
      // List of filtered phones based on the selected phone type
      const selectedFilteredPhoneTypeList: FilteredPhoneItem[] = [];
      // List of filtered phones
      const selectedFilteredPhoneList: FilteredPhoneItem[] = [];

      phoneList.forEach((phone) => {
        if (
          phoneProductData[phone.productId].phoneType ===
          selectedPhone.phoneType
        ) {
          selectedFilteredPhoneTypeList.push({
            ...phoneProductData[phone.productId],
            productId: phone.productId,
          });
        }
        selectedFilteredPhoneList.push({
          ...phoneProductData[phone.productId],
          productId: phone.productId,
        });
      });

      // Get the id of the next highest and lowest price phones within the selected phone type
      let { nextHighestPriceId, nextLowestPriceId } =
        findAdjacentPricedProducts(
          selectedFilteredPhoneTypeList,
          phoneProductData,
          selectedPhone,
        );

      // If no results found in the selectedFilteredPhoneTypeList, try with selectedFilteredPhoneList
      if (
        (!nextHighestPriceId || !nextLowestPriceId) &&
        selectedFilteredPhoneList.length > 1
      ) {
        const allPhonesPriceRange = findAdjacentPricedProducts(
          selectedFilteredPhoneList,
          phoneProductData,
          selectedPhone,
        );
        nextHighestPriceId = allPhonesPriceRange.nextHighestPriceId;
        nextLowestPriceId = allPhonesPriceRange.nextLowestPriceId;
      }

      const queryParams =
        nextHighestPriceId && nextLowestPriceId
          ? `?rec=${nextHighestPriceId},${nextLowestPriceId}`
          : '';
      router.push(`${destination}${queryParams}`);
    } catch (error) {
      console.error(
        `Failed to find adjacent products for productId: ${productId}.`,
        error,
      );
      router.push(destination);
    }
  };


jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const router = require('next/router').useRouter();

const phoneProductData = {
  phone1: { offerPrice: 20000, phoneType: 'flagship' },
  phone2: { offerPrice: 25000, phoneType: 'flagship' },
  phone3: { offerPrice: 30000, phoneType: 'flagship' },
  phone4: { offerPrice: 22000, phoneType: 'midrange' },
};


it('should find adjacent priced products within the same phone type', () => {
  const phoneList = [
    { productId: 'phone1' },
    { productId: 'phone2' },
    { productId: 'phone3' },
  ];

  handleProductSelection('phone2', '/product', phoneList, phoneProductData);

  expect(router.push).toHaveBeenCalledWith('/product?rec=phone1,phone3');
});
it('should fallback to full list if same phone type has no neighbors', () => {
  const phoneList = [
    { productId: 'phone2' }, // type: flagship
    { productId: 'phone4' }, // type: midrange
  ];

  handleProductSelection('phone2', '/product', phoneList, phoneProductData);

  // since same type = only one phone, fallback happens
  expect(router.push).toHaveBeenCalledWith('/product?rec=phone4,');
});
it('should handle phoneList with 2 or fewer items (early return)', () => {
  const phoneList = [
    { productId: 'phone1' },
    { productId: 'phone2' },
  ];

  handleProductSelection('phone1', '/product', phoneList, phoneProductData);

  // No adjacent neighbors
  expect(router.push).toHaveBeenCalledWith('/product');
});
it('should fallback to destination if productId is invalid', () => {
  const phoneList = [{ productId: 'phone1' }];

  handleProductSelection('invalid-id', '/product', phoneList, phoneProductData);

  expect(router.push).toHaveBeenCalledWith('/product');
});
it('should find only one adjacent phone if selected phone is first in list', () => {
  const phoneList = [
    { productId: 'phone1' },
    { productId: 'phone2' },
    { productId: 'phone3' },
  ];

  handleProductSelection('phone1', '/product', phoneList, phoneProductData);

  expect(router.push).toHaveBeenCalledWith('/product?rec=,phone2');
});

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

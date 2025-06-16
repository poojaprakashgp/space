export function applyBrandFilter({
  filteredPhones,
  newFilterChips,
  filterUpdates,
  phoneProductData,
  plpData,
}: any) {
  if (filterUpdates.brand && filterUpdates.brand.length !== 0) {
    newFilterChips = [
      ...newFilterChips,
      ...filterUpdates.brand.map((brand: string) =>
        brand !== 'TCL' && brand !== 'motorola'
          ? brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase()
          : brand,
      ),
    ];
    const brandFilters = filterUpdates.brand.map((brand: string) =>
      brand.toLowerCase(),
    );
    filteredPhones = plpData.products.filter((phone: any) => {
      const phoneData = phoneProductData[phone.productId];
      Iif (!phoneData) return false; //write test case for this line to cover the coverage
      const phoneBrand = phoneData.brand.toLowerCase();
      return brandFilters.includes(phoneBrand);
    });
  }
  return { filteredPhones, newFilterChips };
}



it('returns false if phoneProductData is missing productId (covers !phoneData)', () => {
    const filteredPhones = [];
    const newFilterChips = [];
    const filterUpdates = {
      brand: ['samsung'],
    };
    const phoneProductData = {
      // purposely leaving out productId 'p1'
      // so the condition `!phoneData` triggers
    };
    const plpData = {
      products: [
        { productId: 'p1' }, // this will be skipped because p1 is not in phoneProductData
      ],
    };

    const result = applyBrandFilter({
      filteredPhones,
      newFilterChips,
      filterUpdates,
      phoneProductData,
      plpData,
    });

    expect(result.filteredPhones).toEqual([]); // Because phoneData is missing
    expect(result.newFilterChips).toContain('Samsung');
  });




export function applyPhoneTypeFilter({
  filteredPhones,
  newFilterChips,
  filterUpdates,
  phoneProductData,
}: any) {
  if (filterUpdates.phoneType && filterUpdates.phoneType.length !== 0) {
    newFilterChips = [
      ...newFilterChips,
      ...filterUpdates.phoneType.map(
        (phoneType: string) =>
          phoneType.charAt(0).toUpperCase() + phoneType.slice(1).toLowerCase(),
      ),
    ];
    const phoneTypeFilters = filterUpdates.phoneType.map((phoneType: string) =>
      phoneType.split(' ')[0].toLowerCase(),
    );
    filteredPhones = filteredPhones.filter((phone: any) => {
      const phoneData = phoneProductData[phone.productId];
      if (!phoneData) return false; //write test case for this line to cover the coverage
      const phoneType = phoneData.phoneType.toLowerCase();
      return phoneTypeFilters.includes(phoneType);
    });
  }
  return { filteredPhones, newFilterChips };
}

  it('filters out phones if phoneProductData is missing the productId (covers !phoneData)', () => {
    const filteredPhones = [{ productId: 'abc123' }]; // this ID won’t exist in phoneProductData
    const newFilterChips: string[] = [];
    const filterUpdates = {
      phoneType: ['smartphone'],
    };
    const phoneProductData = {
      // purposely empty / missing 'abc123'
    };

    const result = applyPhoneTypeFilter({
      filteredPhones,
      newFilterChips,
      filterUpdates,
      phoneProductData,
    });

    // Assert the phone got filtered out because its data was missing
    expect(result.filteredPhones).toEqual([]);
    expect(result.newFilterChips).toEqual(['Smartphone']);
  });


export function applyPriceRangeFilter({
  filteredPhones,
  newFilterChips,
  filterUpdates,
  isDefaultFilter,
  extractPrice,
}: any) {
  if (filterUpdates.priceRange) {
    filterUpdates.priceRange.forEach((priceRange: any) => {
      const { min, max } = priceRange;
      const isDefaultPriceRange = isDefaultFilter('price', { min, max });
      
      if (!isDefaultPriceRange && priceRange.title) {
        newFilterChips.push(priceRange.title);
      }
    });
    
    // Filter phones that match ANY of the specified price ranges
    filteredPhones = filteredPhones.filter((phone: any) => {
      const { price } =
        phone.content.section?.find((item: any) => !!item.price) || {}; //cover this lines
      const phonePrice = extractPrice(
        price?.discountedPrice || price?.fullPrice || '0',// cpover this edge case
      );
      
      // Phone passes if it fits in ANY of the price ranges
      return filterUpdates.priceRange.some((priceRange: any) => {
        const { min, max } = priceRange;
        return phonePrice >= min && phonePrice <= max;
      });
    });
  }
  
  return { filteredPhones, newFilterChips };
}



it('should fallback to empty object when no price found in section', () => {
  const filteredPhones = [
    {
      content: {
        section: [{ title: 'No price here' }], // 👈 `!!item.price` is false
      },
    },
  ];

  const newFilterChips: string[] = [];
  const filterUpdates = {
    priceRange: [
      { min: 0, max: 100, title: 'Under $100' },
    ],
  };

  const isDefaultFilter = jest.fn(() => false);
  const extractPrice = jest.fn((val) => parseInt(val)); // simulate behavior

  const result = applyPriceRangeFilter({
    filteredPhones,
    newFilterChips,
    filterUpdates,
    isDefaultFilter,
    extractPrice,
  });

  expect(extractPrice).toHaveBeenCalledWith('0'); // ✅ fallback covered
  expect(result.filteredPhones.length).toBe(1);   // ✅ phone stays (0 is in range)
  expect(result.newFilterChips).toEqual(['Under $100']);
});


it('should fallback to "0" when price object has no discountedPrice or fullPrice', () => {
  const filteredPhones = [
    {
      content: {
        section: [{ price: {} }], // 👈 found, but no valid price keys
      },
    },
  ];

  const newFilterChips: string[] = [];
  const filterUpdates = {
    priceRange: [
      { min: 0, max: 100, title: 'Under $100' },
    ],
  };

  const isDefaultFilter = jest.fn(() => false);
  const extractPrice = jest.fn((val) => parseInt(val)); // still gets '0'

  const result = applyPriceRangeFilter({
    filteredPhones,
    newFilterChips,
    filterUpdates,
    isDefaultFilter,
    extractPrice,
  });

  expect(extractPrice).toHaveBeenCalledWith('0'); // ✅ fallback hit
  expect(result.filteredPhones.length).toBe(1);   // ✅ still matches range
  expect(result.newFilterChips).toEqual(['Under $100']);
});


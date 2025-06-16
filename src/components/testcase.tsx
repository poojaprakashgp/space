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

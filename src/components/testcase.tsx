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

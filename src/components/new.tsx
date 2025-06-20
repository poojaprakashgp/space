export const getCartInfoForTealiumTag = () => {
  const cartSessionInfo = sessionStorage.getItem('cart');
  const cartSessionInfoParsed = cartSessionInfo
    ? JSON.parse(cartSessionInfo)
    : [];

  const cartSessionInfoData: ProductDetails[] = [];

  cartSessionInfoParsed.forEach((item: any) => {
  // Create and push device info
    const deviceInfo :ProductDetails = {
      product_type: 'device',
      product_manufacturer: item.device.name
        ? item.device.name.split(' ')[0]
        : '',
      product_item_id: '',
      product_name: item.device.name,
      product_capacity: '',
      product_category: '',
      product_color: '',
      product_id: item.device.id,
      product_list_price: '',
      product_sku: item.device.sku,
      product_part_number: '',
      product_availability: '',
      product_tile_position: '',
      product_image_url: '',
    };
    cartSessionInfoData.push(deviceInfo);

    // Create and push plan info if it exists
    if (item?.plan && item?.plan?.id) {
      const planInfo: ProductDetails = {
        product_type: 'plan',
        product_manufacturer: '',
        product_item_id: '',
        product_name: item.plan.name,
        product_capacity: '',
        product_category: '',
        product_color: '',
        product_id: item.plan.id,
        product_list_price: item.plan.price,
        product_sku: '',
        product_part_number: '',
        product_availability: '',
        product_tile_position: '',
        product_image_url: '',
      };
      cartSessionInfoData.push(planInfo);
    }
  });
  return cartSessionInfo ? [...cartSessionInfoData] : [];
}; please write test cases to cover the above function each lines

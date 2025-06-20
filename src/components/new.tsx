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




import { getCartInfoForTealiumTag } from '../getCartInfoForTealiumTag';

describe('getCartInfoForTealiumTag', () => {
  const originalSessionStorage = { ...window.sessionStorage };

  beforeEach(() => {
    let store: Record<string, string> = {};
    const mockSessionStorage = {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };

    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true,
    });
  });

  afterEach(() => {
    // Reset sessionStorage to original after each test
    Object.defineProperty(window, 'sessionStorage', {
      value: originalSessionStorage,
    });
  });

  it('returns both device and plan when both are present', () => {
    const cartData = JSON.stringify([
      {
        device: {
          id: '123',
          name: 'iPhone 15 Pro',
          sku: 'iphone15pro',
        },
        plan: {
          id: 'plan1',
          name: 'Unlimited Plan',
          price: '29.99',
        },
      },
    ]);
    window.sessionStorage.getItem = jest.fn(() => cartData);

    const result = getCartInfoForTealiumTag();

    expect(result.length).toBe(2);
    expect(result[0].product_type).toBe('device');
    expect(result[0].product_manufacturer).toBe('iPhone');
    expect(result[1].product_type).toBe('plan');
    expect(result[1].product_name).toBe('Unlimited Plan');
  });

  it('returns only device when plan is missing', () => {
    const cartData = JSON.stringify([
      {
        device: {
          id: '456',
          name: 'Samsung Galaxy',
          sku: 'galaxy123',
        },
      },
    ]);
    window.sessionStorage.getItem = jest.fn(() => cartData);

    const result = getCartInfoForTealiumTag();

    expect(result.length).toBe(1);
    expect(result[0].product_type).toBe('device');
    expect(result[0].product_manufacturer).toBe('Samsung');
  });

  it('handles device with no name', () => {
    const cartData = JSON.stringify([
      {
        device: {
          id: '789',
          name: '',
          sku: 'no-name',
        },
      },
    ]);
    window.sessionStorage.getItem = jest.fn(() => cartData);

    const result = getCartInfoForTealiumTag();
    expect(result[0].product_manufacturer).toBe('');
  });

  it('returns empty array when sessionStorage is null', () => {
    window.sessionStorage.getItem = jest.fn(() => null);

    const result = getCartInfoForTealiumTag();

    expect(result).toEqual([]);
  });

  it('returns empty array for invalid JSON in cart', () => {
    window.sessionStorage.getItem = jest.fn(() => '{ bad json');

    // Should not throw — just return []
    expect(() => getCartInfoForTealiumTag()).not.toThrow();
  });

  it('returns empty array when cart is empty array', () => {
    window.sessionStorage.getItem = jest.fn(() => '[]');
    const result = getCartInfoForTealiumTag();
    expect(result).toEqual([]);
  });
});


import React from 'react';
import { ProductDetails } from './components/ProductDetails';
import { DevicePrice } from './components/DevicePrice';
import { BestPhone } from './components/Bestphone';
import { OutOfStock } from './components/OutOfStock';
import { Preorder } from './components/Preorder';
import {
  OptionData,
  Section,
} from '@/app/[subdomain]/(aiConversation)/[PDPDevice]/common/types';
import PhoneColors from '@/common/templates/Recommendation/PhoneColors';
import PaymentOptions from '@/common/templates/Recommendation/PaymentOptions';

export const DeviceDetails = ({
  content: { section = [] } = { section: [] },
  ...args
}: OptionData) => {
  const getSection = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const componentMap: { [key: string]: React.ComponentType<any> } = {
      out_of_stock: OutOfStock,
      best_phone_for_you: BestPhone,
      device_title_price: DevicePrice,
      product_details: ProductDetails,
      colors: PhoneColors,
      preorder: Preorder,
    };

    return section.map((details: Section) => {
      const Component = componentMap[details.id ?? ''] || React.Fragment;
      if (details.id === 'payment_options') {
        return (
          <PaymentOptions
            content={details.content}
            key={details.id}
            SKUs={args.SKUs}
            setSelectedPaymentOptions={args.onChoosePayment}
            selectedPaymentOptions={args.selectedPaymentOption ?? ''}
            selectedSKUId={args.selectedSkuId ?? ''}
            subdomain={args.subdomain ?? ''}
            selectedDeviceAvailable={section.some(details => details.id == 'out_of_stock') ? 'Out Of Stock' : 'Available'}
            title={details.title ?? ''}
            {...details}
          />
        );
      } else {
        return (
          <Component key={details.id} additionalProps={args} {...details} />
        );
      }
    });
  };

  return <div className='details'>{getSection()}</div>;
};


import { ProductDetails } from '@/helpers/(aiConversation)/type';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export interface PriceObject {
  discountedPrice?: string;
  fullPrice: string;
  postText: string;
}

export interface TopCardDetailObject {
  text: string;
  type: string;
}

export interface AttributeDetailsObject {
  name: string;
  value: string;
}

export interface Device {
  type: string;
  id: string;
  image: string;
  name: string;
  price: PriceObject;
  topCardDetails?: TopCardDetailObject;
  attributesDetails: AttributeDetailsObject[];
  //   colorOptions
}

export interface PriceFilter {
  name: string;
  value: string;
}

export interface PageComponent {
  type: string;
  display?: string;
  details?: {
    display: string;
    type: string;
    devices?: Device[];
    filterOptions?: {
      allFilterOptions?: {
        price?: PriceFilter[];
        [key: string]: PriceFilter[] | undefined;
      };
    };
  };
  cta?: { text: string; type: string };
}

export interface NarrativeDetails {
  bulletsPoints: string[];
  longSummary: string;
}

export interface Narrative {
  id: string;
  narrative: NarrativeDetails;
}

export interface InsuranceObject {
  insuranceId: string;
  insuranceSku: string;
}

export interface ColorObject {
  name: string;
  hexColor: string;
}

export interface SkuPriceObject {
  discountedPrice: number;
  dollars: string;
  cents: string;
}

export interface SKUObject {
  id: string;
  gallery: number;
  status: string;
  availableQuantity: string;
  color: ColorObject;
  price: SkuPriceObject;
}

export interface ImagesObject {
  src: string;
  alt: string;
}

export interface GalleriesObject {
  images: ImagesObject[];
}

export interface PDPObject {
  SKUs: SKUObject[];
  deviceID: string;
  galleries: GalleriesObject[];
  insurance: InsuranceObject;
}

export interface PageData {
  components: PageComponent[];
  narrative: Narrative[];
  type: string;
  data?: DataObject;
}

export interface PdpContext {
  pageData?: PageData;
  subDomain: string;
  pdpDevice: string;
  loading?: boolean;
}

export interface DeviceData {
  deviceID?: string;
  SKUs?: Array<{
    id: string;
    gallery?: number;
    specs?: object;
    status?: string;
  }>;
  galleries?: Array<{ images: Array<{ alt: string; src: string }> }>;
  [key: string]: unknown;
}

export interface DataObject {
  [key: string]: DeviceData;
}

// Define appropriate types for components
export interface PhoneRecommendationData {
  details: {
    content: {
      section: Array<{
        id: string;
        content?: {
          section: Array<{
            id: string;
            title: string;
            content?: object;
            price?: object;
          }>;
        };
        cta?: {
          destination: string;
          style: string;
          text: string;
          type: string;
        };
      }>;
    };
    cta: {
      destination: string;
      text: string;
      type: string;
    };
  };
  display: string;
  type: string;
}

export interface AccordionData {
  details: {
    accordion: {
      content: {
        section: Array<{
          id: string;
          title?: string;
          content?: {
            section: Array<{
              body?: string;
              id: string;
              image?: {
                alt: string;
                src: string;
              };
              title: string;
            }>;
          };
        }>;
      };
    };
    cta: {
      action: string;
      text: string;
      type: string;
    };
  };
}

export interface Section {
  id?: string;
  title?: string;
  body?: string;
  price?: {
    fullPrice?: string;
    discountedPrice?: string;
  };
  content?: {
    section?: {
      id?: string;
      title?: string;
      body?: string;
      price?: {
        fullPrice?: string;
        discountedPrice?: string;
      };
      content?: {
        section?: Array<{
          id?: string;
          title?: string;
          body?: string;
          price?: {
            discountedPrice?: string;
            fullPrice?: string;
          };
        }>;
        type?: string;
      };
    }[];
    type?: string;
  };
  cta?: {
    destination?: string;
    style?: string;
    text?: string;
    type?: string;
  };
  image?: {
    alt?: string;
    src?: string;
  };
}

export interface OptionData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SKUs?: any;
  selectedSkuId?: string;
  onColorChange?: (skuId: string) => void;
  deviceName?: string;
  content?: {
    section?: {
      id?: string;
      title?: string;
      body?: string;
      price?: {
        fullPrice?: string;
        discountedPrice?: string;
      };
      content?: {
        section?: {
          id?: string;
          title?: string;
          body?: string;
          price?: {
            fullPrice?: string;
            discountedPrice?: string;
          };
          content?: {
            section?: Array<{
              id?: string;
              title?: string;
              body?: string;
              price?: {
                discountedPrice?: string;
                fullPrice?: string;
              };
            }>;
            type?: string;
          };
        }[];
        type?: string;
      };
      cta?: {
        destination?: string;
        style?: string;
        text?: string;
        type?: string;
      };
      image?: {
        alt?: string;
        src?: string;
      };
    }[];
    title?: string;
  };
  cta?: {
    destination: string;
    style: string;
    text: string;
    type: string;
  };
  id?: string;
  title?: string;
  image?: {
    alt: string;
    src: string;
  };
  subdomain?: string;
  onChoosePayment: (method: string) => void;
  selectedPaymentOption?: string;
}

export interface ProductObject {
  id: string;
  content: {
    section: {
      id: string;
      title?: string;
      image?: {
        src: string;
        alt: string;
      };
      price?: {
        fullPrice: string;
        preText: string;
        discountedPrice?: string;
      };
    }[];
  };
  productId: string;
}

export interface PDPComponent {
  type: string;
  display: string;
  title: string;
  details: {
    title?: string;
    content: {
      section: {
        id: string;
        title?: string;
        price?: {
          fullPrice?: string;
          discountedPrice?: string;
        };
        content?: {
          section?: {
            id?: string;
            title?: string;
            body?: string;
            price?: {
              fullPrice?: string;
              discountedPrice?: string;
            };
            content: {
              section: Array<{
                id: string;
                title: string;
                body: string;
                price?: {
                  discountedPrice?: string;
                  fullPrice?: string;
                };
              }>;
              type: string;
            };
          }[];
          type?: string;
        };
        cta?: {
          destination: string;
          style: string;
          text: string;
          type: string;
        };
        image?: {
          alt?: string;
          src?: string;
        };
      }[];
      title?: string;
    };
    cta: {
      destination: string;
      text: string;
      type: string;
      action: string;
      style: string;
    };
    accordion: {
      content: {
        section: {
          id: string;
          title?: string;
          content?: {
            section: {
              body?: string;
              id: string;
              image?: {
                alt: string;
                src: string;
              };
              title: string;
            }[];
          };
        }[];
      };
    };
  };
}

export interface PDPDetailsComponentManagerProps {
  main: {
    type: string;
    components: PDPComponent[];
    data: {
      DEVICE_DETAILS?: {
        deviceID: string;
        galleries: {
          images: {
            src: string;
            alt: string;
          }[];
        }[];
        SKUs: {
          id: string;
          status: string;
          gallery: number;
          specs: {
            color: {
              name: string;
              hexColor: string;
            };
          };
        }[];
      };
    };
  };
  handleChooseClick: (
    id: string,
    current: string,
    cancelled: number,
    name: string,
    selectedSkuId?: string,
  ) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  extraData: {
    SKUs: {
      gallery: number;
      id: string;
      specs: object;
      status: string;
    }[];
    deviceID: string;
    galleries: {
      images: {
        alt: string;
        src: string;
      }[];
    }[];
  };
  subDomain: string;
  onSelect: (id: string) => void;
  isProcessingPDP: boolean
}

export interface HandleChooseDeviceParams {
  id?: string;
  currentPrice?: string;
  cancelledPrice?: number;
  name?: string;
  selectedSkuId?: string;
  zipCode?: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  addToCart: () => void;
  setCartPrice: (price: string, cancelledPrice: number) => void;
  addPrompt: (name: string, showLoader: boolean) => void;
  router: AppRouterInstance;
  pathname: string;
  cartCount?: number;
  DEVICE_DETAILS_KEY: string;
  DATA: DataObject;
  deviceTitle: string;
  subDomain: string;
  deviceInfo: ProductDetails[];
  otherOptionsInfo: ProductDetails[];
}

export interface SelectOtherDeviceOptionParams {
  destination: string;
  setLoading: (loading: boolean) => void;
  subDomain: string;
  deviceInfo: ProductDetails[];
  otherOptionsInfo: ProductDetails[];
  router: AppRouterInstance;
}
export interface PaymentOptionsProps {
  content?: Content;
  SKUs: SKU[];
  setSelectedPaymentOptions: (_method: string) => void; // Fixed typo 'stirng' -> 'string'
  selectedPaymentOptions: string;
  subdomain: string;
  selectedDeviceAvailable: string;
  selectedSKUId: string;
  title: string;
}
export interface Content {
  section: Section[];
  type?: string;
}export interface Section {
  id?: string;
  title?: string;
  subtitle?: string;
  type?: string;
  body?: string;
  options?: Options[];
  content?: Content;
  cta?: Cta;
  ctas?: Cta[];
  image?: ImgType;
  modal?: Modal;
  tooltip?: Tooltip;
}


"Type '{ section?: { id?: string | undefined; title?: string | undefined; body?: string | undefined; price?: { fullPrice?: string | undefined; discountedPrice?: string | undefined; } | undefined; content?: { ...; } | undefined; }[] | undefined; type?: string | undefined; } | undefined' is not assignable to type 'Content | undefined'.
  Type '{ section?: { id?: string | undefined; title?: string | undefined; body?: string | undefined; price?: { fullPrice?: string | undefined; discountedPrice?: string | undefined; } | undefined; content?: { ...; } | undefined; }[] | undefined; type?: string | undefined; }' is not assignable to type 'Content'.
    Types of property 'section' are incompatible.
      Type '{ id?: string | undefined; title?: string | undefined; body?: string | undefined; price?: { fullPrice?: string | undefined; discountedPrice?: string | undefined; } | undefined; content?: { ...; } | undefined; }[] | undefined' is not assignable to type 'Section[]'.
        Type 'undefined' is not assignable to type 'Section[]'.ts(2322)
paymentTypes.ts(43, 3): The expected type comes from property 'content' which is declared here on type 'IntrinsicAttributes & PaymentOptionsProps" please fix this type issue

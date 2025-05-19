/* eslint no-console: ['error', { allow: ['warn', 'error'] }] */
'use client';

import React, { useState, useEffect } from 'react';
import StarryIcon from '@/common/atoms/Icons/StarryIcon';
import Button from '@/common/molecules/Button/Button';
import SearchBar from '@/common/molecules/Searchbar/Searchbar';
import Container from '@/common/templates/Container';
import Badge from '@/common/atoms/Badge/Badge';
import ChatInterface from '@/common/organisms/ChatInterface/ChatInterface';
import { useFilter } from '@/store/contexts/FilterContext';
import AITypewriter from '@/common/atoms/AITypewriter/AITypewriter';
import { useChatContext } from '@/store/contexts/ChatContext';
import { usePlpContext } from '@/store/contexts/conversationalAI/plpContext';
import { PageComponent, PlpProduct, Section } from './common/types';
import ProductTile from '@/common/molecules/ProductTile';
import { aiPlpFilter } from '@/store/sagas/clientApis/conversationalAI/plpFilter';
import { useCartContext } from '@/store/contexts/CartContext';
import { CommandDispatcher } from '@/lib/dispatcher/CommandDispatcher';
import type { FilterState } from '@/lib/dispatcher/types';
import { parsePriceFilterValue } from '@/helpers/priceFilterUtils';
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from '@/components/common/components/Loader';
import { v4 as uuidv4 } from 'uuid';
import { AllFiltersData, Options } from '@/common/types';
import {
  isValidAllFilter,
  processGroupedFilters,
} from '@/helpers/allFilterUtils';
import AllFilters from '@/common/organisms/AllFilters/AllFilters';
import UpCaret from '@vds/core/icons/up-caret';
import DownCaret from '@vds/core/icons/down-caret';
import TextLinkButton from '@vds/core/buttons/text-link';
import { updateSharedContext } from '@/lib/context/SessionContext';

export default function ProductsList() {
  const { filters, setFilters } = useFilter();
  const { prompts, addPrompt } = useChatContext();
  const [recommendedProduct, setRecommendedProduct] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { setCartPrice, setCartCount } = useCartContext();
  const [showAllFilters, setShowAllFilters] = useState(false);

  const {
    pageData,
    subDomain,
    // loading,
  } = usePlpContext();
  const { agent, main } = pageData || {};

  const priceObj = [
    {
      title: 'Under $300',
      value: 'Under $300',
      valueGTE: 0,
      valueLTE: 299.999,
    },
    {
      title: 'Over $300',
      value: 'Over $300',
      valueGTE: 299.999,
      valueLTE: 1149.999,
    },
  ];

  const bannerData = {
    header: agent?.banner?.title,
    searchPlaceHolder: agent?.banner?.input?.placeholder,
    primaryFilters: agent?.banner?.options,
  };

  const PLP_NODE = main?.components?.find(
    (comp) => comp?.type === 'AGENTIC_PLP'
  );
  const PRICE_FILTERS =
    PLP_NODE &&
    (
      PLP_NODE.details.accordion.content.section?.find(
        (comp) => comp?.id === 'price'
      ) || { options: [] }
    ).options;

  const plpData = {
    title: PLP_NODE?.details?.title,
    cta: PLP_NODE?.details?.cta?.text,
    products: (PLP_NODE?.details?.content?.section) || [],
    data: main?.data?.products,
  };

  const ALL_FITLERS: AllFiltersData = PLP_NODE?.details
    .accordion as AllFiltersData;

  const [selectedAllFilters, setSelectedAllFilters] = useState<Options[]>([]);
  const [allFilteredResult, setAllFilteredResult] = useState<PlpProduct[]>([]);
  const [allFiltersOpenState, setAllFiltersOpenState] = useState(false);
  const handleSelectedAllFiltersChange = (selected: Options[]) => {
    setSelectedAllFilters(selected);
  };
  const toggleShowAllFilters = () => {
    setAllFiltersOpenState(!allFiltersOpenState);
  };

  const [phoneList, setPhoneList] = useState(plpData.products);
  const [phoneProductData] = useState(plpData?.data);

  const setActiveFilters = useState<FilterState>(
    CommandDispatcher.DEFAULT_FILTERS
  )[1];

  const handleApplyFilters = () => {
    setAllFiltersOpenState(!allFiltersOpenState);
    setPhoneList(allFilteredResult);
  };

  const handleAllFiltersClearAll = () => {
    setPhoneList(plpData.products);
  };

  /** Handles all filters changes */
  useEffect(() => {
    if (selectedAllFilters.length > 0) {
      /** Group filters by their `attr` type */
      const groupedFilters = selectedAllFilters.reduce(
        (acc, filter) => {
          if (filter?.attr && isValidAllFilter(filter)) {
            if (!acc[filter.attr]) {
              acc[filter.attr] = [];
            }
            acc[filter.attr].push(filter);
          }
          return acc;
        },
        {} as Record<string, Options[]>
      );

      setAllFilteredResult([]);

      processGroupedFilters(
        groupedFilters,
        selectedAllFilters,
        setActiveFilters,
        setFilters,
        getFilteredList,
        plpData.products,
        phoneProductData
      )
        .then((combinedFilteredPhones) => {
          setAllFilteredResult(combinedFilteredPhones);
        })
        .catch((error) => {
          console.error('Error processing grouped filters:', error);
        });
    } else {
      setAllFilteredResult(phoneList);
    }
  }, [selectedAllFilters]);

  useEffect(() => {
    const pendingFilterCommand = sessionStorage.getItem('pendingFilterCommand');

    if (pendingFilterCommand) {
      sessionStorage.removeItem('pendingFilterCommand');

      setTimeout(() => {
        CommandDispatcher.processFilterCommand(
          pendingFilterCommand,
          'pending-command'
        );
      }, 500);
    }
  }, []);

  const searchParams = useSearchParams(); // Hook to access query params
  const searchQuery = searchParams.get('search'); // Extract the 'search' param
  const router = useRouter();

  // Apply searchQuery to filter products and trigger chat orchestration
  useEffect(() => {
    // Get searchQuery from query params or session storage
    const queryValue = sessionStorage.getItem('searchQuery')
      ? sessionStorage.getItem('searchQuery')
      : searchQuery;
    if (queryValue) {
      handleSearch('search-text', queryValue);
      // Remove the searchQuery from the URL after handling it
      if (searchQuery) {
        router.replace('phones'); // Replace the URL without the searchQuery
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    if (filters.length <= 2 && showAllFilters) {
      setShowAllFilters(false);
    }
  }, [filters, showAllFilters]);

  useEffect(() => {
    // Flag to track if we just cleared filters to prevent the subsequent filtersChanged event from re-adding filters
    let justClearedFilters = false;
    let clearFilterTimestamp = 0;

    const handleClearAllFilters = (event: Event) => {
      const customEvent = event as CustomEvent;

      try {
        // Set the flag indicating we just cleared filters and store timestamp
        justClearedFilters = true;
        clearFilterTimestamp = Date.now();

        // Reset this flag after a short delay to only block the immediate filtersChanged event
        setTimeout(() => {
          justClearedFilters = false;
        }, 1000); // Block filtersChanged events for 1 second after clearing

        clearAllFilters(customEvent.detail?.source ?? 'chat-command');
      } catch (error) {
        console.error(
          '❌ PhonesPage: Error handling clearAllFilters event:',
          error
        );
        justClearedFilters = false;
      }
    };

    const handleFiltersChanged = (event: Event) => {
      const customEvent = event as CustomEvent;
      const {
        filters: updatedFilters,
        source,
        filterType,
        timestamp,
      } = customEvent.detail ?? {};

      // If we just cleared filters, and this is a closely timed event, ignore it to prevent re-adding filters
      if (
        justClearedFilters &&
        timestamp &&
        timestamp - clearFilterTimestamp < 1000
      ) {
        return;
      }

      // If this is a clear-all action, just ignore it (clearAllFilters event will handle it)
      if (customEvent.detail?.action === 'clear-all') {
        return;
      }

      if (updatedFilters && source !== 'phones-page') {
        // Special handling for different filter types
        if (filterType === 'brand-only') {
          applyBrandOnlyFilter(updatedFilters);
        } else {
          // Normal filter processing
          // applyFilterUpdates(updatedFilters, source);
        }
      }
    };

    window.addEventListener('clearAllFilters', handleClearAllFilters);
    window.addEventListener('filtersChanged', handleFiltersChanged);
    setPhoneList(plpData.products);
    return () => {
      window.removeEventListener('clearAllFilters', handleClearAllFilters);
      window.removeEventListener('filtersChanged', handleFiltersChanged);
    };
  }, [plpData.products, setCartPrice, setCartCount]);

  const applyFilterUpdates = async (
    filterUpdates: FilterState,
    source: string
  ) => {
    // Update active filters with the new filter updates
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      ...filterUpdates,
    }));
    let filteredPhones = [...plpData.products];

    // Create a fresh array for filter chips - this is key to prevent duplication
    let newFilterChips: string[] = [];

    // Process brand filters
    if (filterUpdates.brand && filterUpdates.brand.length !== 0) {
      // Add brand names to filter chips, with proper capitalization
      newFilterChips = [
        ...newFilterChips,
        ...filterUpdates.brand.map((brand) => {
          // This will only modify brands that need to have a capital first letter and rest is lower case
          if (brand !== 'TCL' && brand !== 'motorola') {
            return brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
          }
          return brand;
        }),
      ];
      const apiFilterSuccess = false;

      // Fallback: If API filtering fails, implement client-side brand filtering
      if (!apiFilterSuccess) {
        const brandFilters = filterUpdates.brand.map((brand) =>
          // TODO: Remove the split once the values are updated
          brand.toLowerCase()
        );

        filteredPhones = plpData.products.filter((phone) => {
          const { title } =
            phone.content.section?.find((item) => !!item.title) || {};

          if (!title) return false;

          // Extract brand from phone name using common brand patterns
          // TODO: Remove the split once the values are updated
          const phoneName = title.toLowerCase();
          // Apply brand identification logic matching CommandDispatcher.filterByBrand
          return brandFilters.some((brandFilter) => {
            // Check for iPhone, iPad -> Apple
            if (
              brandFilter === 'apple' &&
              (phoneName.includes('iphone') ||
                phoneName.includes('ipad') ||
                phoneName.includes('macbook'))
            ) {
              return true;
            }

            // Check for Galaxy, Samsung -> Samsung
            if (
              brandFilter === 'samsung' &&
              (phoneName.includes('galaxy') || phoneName.includes('samsung'))
            ) {
              return true;
            }

            // Check for Pixel, Google -> Google
            if (
              brandFilter === 'google' &&
              (phoneName.includes('pixel') || phoneName.includes('google'))
            ) {
              return true;
            }

            // Check for Moto, Motorola -> Motorola
            if (
              brandFilter === 'motorola' &&
              (phoneName.includes('moto') || phoneName.includes('motorola'))
            ) {
              return true;
            }

            // Check for direct name match
            if (phoneName.includes(brandFilter)) {
              return true;
            }

            // If no specific brand pattern matched
            return false;
          });
        });
      }
    }

    // Process phoneType filters
    if (filterUpdates.phoneType && filterUpdates.phoneType.length !== 0) {
      // Add brand names to filter chips, with proper capitalization
      newFilterChips = [
        ...newFilterChips,
        ...filterUpdates.phoneType.map(
          (phoneType) =>
            phoneType.charAt(0).toUpperCase() + phoneType.slice(1).toLowerCase()
        ),
      ];

      const apiFilterSuccess = false;

      // Fallback: If API filtering fails, implement client-side brand filtering
      if (!apiFilterSuccess) {
        const phoneTypeFilters = filterUpdates.phoneType.map((phoneType) =>
          // TODO: Remove the split once the values are updated
          phoneType.split(' ')[0].toLowerCase()
        );

        filteredPhones = filteredPhones.filter((phone) => {
          const { title } =
            phone.content.section?.find((item) => !!item.title) || {};

          if (!title) return false;

          // Extract brand from phone name using common brand patterns
          const phoneName = title.toLowerCase();
          // Apply brand identification logic matching CommandDispatcher.filterByBrand
          return phoneTypeFilters.some((phoneType) => {
            // Check for iPhone, iPad -> Apple
            if (
              phoneType === 'apple' &&
              (phoneName.includes('iphone') ||
                phoneName.includes('ipad') ||
                phoneName.includes('macbook'))
            ) {
              return true;
            }

            // Checks for android phone types
            if (
              phoneType === 'android' &&
              (phoneName.includes('moto') ||
                phoneName.includes('motorola') ||
                phoneName.includes('pixel') ||
                phoneName.includes('google') ||
                phoneName.includes('galaxy') ||
                phoneName.includes('samsung'))
            ) {
              return true;
            }

            if (phoneType === 'basic' && phoneName.includes('tcl flip')) {
              return true;
            }
            return false;
          });
        });
      }
    }

    // Process price range filters - Only add to visible filters if not default range
    if (filterUpdates.priceRange) {
      const { min, max } = filterUpdates.priceRange;

      // Check if this is a default price range that shouldn't be shown as an active filter
      const isDefaultPriceRange = isDefaultFilter('price', { min, max });

      if (!isDefaultPriceRange) {
        // Only add non-default price filters to the UI filter chips
        const checkCondition = min === 0 ? `Under $${max}` : `$${min}-$${max}`;
        const priceFilterString = max >= 2000 ? `$${min}+` : checkCondition;

        // Add price filter to filter chips (removing any existing price filters)
        newFilterChips = [...newFilterChips.filter((f) => !f.includes('$'))];
        newFilterChips.push(priceFilterString);
      }

      let foundMatchingPredefinedFilter = false;

      if (PRICE_FILTERS) {
        for (const priceFilter of PRICE_FILTERS) {
          const filterName = priceFilter.title.toLowerCase();

          if (
            (min === 0 && max === 499 && filterName.includes('under $500')) ||
            (min === 500 && max === 799 && filterName.includes('$500-$799')) ||
            (min === 800 && max === 999 && filterName.includes('$800-$999')) ||
            (min >= 1000 && filterName.includes('$1000+'))
          ) {
            try {
              const result = await getFilteredList(priceFilter.title);
              if (result && result.length > 0) {
                filteredPhones = result;
                foundMatchingPredefinedFilter = true;
                break;
              }
            } catch (error) {
              console.error(
                `Error filtering by price range ${priceFilter.value}:`,
                error
              );
            }
          }
        }
      }

      // If we don't find a matching predefined filter, filter the products directly by price
      if (!foundMatchingPredefinedFilter) {
        filteredPhones = filteredPhones.filter((phone) => {
          const { price } =
            phone.content.section?.find((item) => !!item.price) || {};
          const phonePrice = extractPrice(price?.fullPrice ?? '0');

          return phonePrice >= min && phonePrice <= max;
        });
      }
    }

    // Process stock availability filters - Only show in UI if not default value
    if (filterUpdates.inStock !== undefined) {
      // Check if this is a default availability filter that shouldn't be shown
      const isDefaultAvailability = isDefaultFilter(
        'availability',
        filterUpdates.inStock
      );

      if (!isDefaultAvailability) {
        // Only add non-default availability filters to the UI
        newFilterChips = newFilterChips.filter(
          (f) => f !== 'In Stock' && f !== 'All Items'
        );
        newFilterChips.push(filterUpdates.inStock ? 'In Stock' : 'All Items');
      }
    }

    if (filterUpdates.ampleStorage && filterUpdates.ampleStorage.length !== 0) {
      filteredPhones = filteredPhones.filter((phone) => {
        if (phoneProductData[phone.productId].largeScreen) {
          return true;
        }
        return false;
      });
    }

    if (filterUpdates.largeScreen && filterUpdates.largeScreen.length !== 0) {
      filteredPhones = filteredPhones.filter((phone) => {
        if (phoneProductData[phone.productId].largeScreen) {
          return true;
        }
        return false;
      });
    }

    // Update the phone list with filtered results
    setPhoneList(filteredPhones);

    // For chat-based filters, we want to replace all filter chips
    if (
      source.includes('chat-intent') ||
      source.includes('command-dispatcher')
    ) {
      // For chat-based commands, fully replace the filter chip array
      setFilters(newFilterChips);

      // Also update selected filters in session storage to maintain sync
      try {
        const filterChipObjects = newFilterChips.map((chip) => ({
          id: `filter-${Date.now()}-${uuidv4()}`,
          type: getFilterType(chip),
          value: chip,
        }));

        sessionStorage.setItem(
          'selectedFilters',
          JSON.stringify(filterChipObjects)
        );

        // Also log success for monitoring
      } catch (error) {
        console.error(
          'Error updating selected filters in session storage:',
          error
        );
        // Attempt recovery by initializing with empty array
        try {
          sessionStorage.setItem('selectedFilters', JSON.stringify([]));
        } catch (fallbackError) {
          console.error(
            'Failed to recover from session storage error:',
            fallbackError
          );
        }
      }
    } else {
      // For UI button clicks, merge with existing filters but remove duplicates
      setFilters((prevFilters) => {
        // Remove duplicates between previous filters and new filters (by category)
        const deduplicatedPrevFilters = prevFilters.filter((prevFilter) => {
          // Keep previous filter if there's no new filter of the same category
          const isPriceFilter = getFilterType(prevFilter) === 'price';
          const isStockFilter = getFilterType(prevFilter) === 'availability';

          // If it's a price filter and we have new price filters, remove it
          if (
            isPriceFilter &&
            newFilterChips.some((f) => getFilterType(f) === 'price')
          )
            return false;

          // If it's a stock filter and we have new stock filters, remove it
          if (
            isStockFilter &&
            newFilterChips.some((f) => getFilterType(f) === 'availability')
          )
            return false;

          // For brand filters, we need to check if the exact brand is in the new filters
          if (!isPriceFilter && !isStockFilter) {
            return !newFilterChips.includes(prevFilter);
          }

          return true;
        });
        return [...deduplicatedPrevFilters, ...newFilterChips];
      });
    }
  };

  // New helper function for brand-only filtering
  const applyBrandOnlyFilter = async (filterUpdates: FilterState) => {
    if (!filterUpdates.brand || filterUpdates.brand.length === 0) {
      console.warn('PhonesPage: No brand specified in brand-only filter');
      return;
    }

    // Update active filters with just the brand filter
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      brand: filterUpdates.brand,
    }));

    // Check if this is a default brand filter that shouldn't be shown
    const isDefaultBrandFilter = isDefaultFilter('brand', filterUpdates.brand);

    if (isDefaultBrandFilter) {
      // If it's a default brand filter, don't show any brand filter chips
      setFilters([]);
    } else {
      // Create a fresh array for filter chips with only the brand
      const brandFilterChips = filterUpdates.brand.map(
        (brand) => brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase()
      );

      // Set the filter chips to only show the brand filter
      setFilters(brandFilterChips);
    }

    let filteredPhones = [...plpData.products];
    let apiFilterSuccess = false;

    // Only apply actual brand filtering if this isn't the default filter state
    if (!isDefaultBrandFilter) {
      // First try API-based filtering
      for (const brand of filterUpdates.brand) {
        try {
          const result = await getFilteredList(brand);
          if (result && result.length > 0) {
            filteredPhones = result;
            apiFilterSuccess = true;
            break;
          }
        } catch (error) {
          console.error(`Error filtering by brand ${brand}:`, error);
        }
      }

      // If API filtering fails, apply client-side brand filtering
      if (!apiFilterSuccess) {
        const brandFilters = filterUpdates.brand.map((brand) =>
          brand.toLowerCase()
        );

        filteredPhones = plpData.products.filter((phone) => {
          const { title } =
            phone.content.section?.find((item) => !!item.title) || {};

          if (!title) return false;

          // Extract brand from phone name using common brand patterns
          const phoneName = title.toLowerCase();

          return brandFilters.some((brandFilter) => {
            // Check for iPhone, iPad -> Apple
            if (
              brandFilter === 'apple' &&
              (phoneName.includes('iphone') ||
                phoneName.includes('ipad') ||
                phoneName.includes('macbook'))
            ) {
              return true;
            }

            // Check for Galaxy, Samsung -> Samsung
            if (
              brandFilter === 'samsung' &&
              (phoneName.includes('galaxy') || phoneName.includes('samsung'))
            ) {
              return true;
            }

            // Check for Pixel, Google -> Google
            if (
              brandFilter === 'google' &&
              (phoneName.includes('pixel') || phoneName.includes('google'))
            ) {
              return true;
            }

            // Check for Moto, Motorola -> Motorola
            if (
              brandFilter === 'motorola' &&
              (phoneName.includes('moto') || phoneName.includes('motorola'))
            ) {
              return true;
            }

            // Check for direct name match
            if (phoneName.includes(brandFilter)) {
              return true;
            }

            return false;
          });
        });
      }
    }

    // Update the phone list with brand-filtered results
    setPhoneList(filteredPhones);

    // Update selected filters in session storage
    try {
      // If it's a default filter, set an empty array
      const filterChipObjects = isDefaultBrandFilter
        ? []
        : filterUpdates.brand.map((brand) => ({
          id: `filter-${Date.now()}-${uuidv4()}`,
          type: 'brand',
          value: brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase(),
        }));

      sessionStorage.setItem(
        'selectedFilters',
        JSON.stringify(filterChipObjects)
      );
    } catch (error) {
      console.error(
        'Error updating selected filters in session storage:',
        error
      );
      try {
        sessionStorage.setItem('selectedFilters', JSON.stringify([]));
      } catch (fallbackError) {
        console.error(
          'Failed to recover from session storage error:',
          fallbackError
        );
      }
    }
  };

  const extractPrice = (priceString: string): number => {
    if (!priceString) return 0;

    // Handle 'free' case explicitly
    if (priceString.toLowerCase() === 'free') return 0;

    // Remove any commas from price
    const cleanedPrice = priceString.replace(/,/g, '');

    // Look for a dollar amount pattern
    const match = cleanedPrice.match(/\$?(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const clearAllFilters = (source: string = 'ui-button') => {
    // Reset phone list to all phones
    setPhoneList(plpData.products);

    // Reset active filters to defaults
    setActiveFilters(CommandDispatcher.DEFAULT_FILTERS);

    // Clear filter chips
    setFilters([]);

    // Clean up all filter-related entries in sessionStorage
    try {
      // Clear selected filters - ensure proper initialization to prevent JSON parse errors
      sessionStorage.setItem('selectedFilters', JSON.stringify([]));

      // Reset last applied filters to defaults - ensure it's always a valid JSON object
      const defaultFilters = { ...CommandDispatcher.DEFAULT_FILTERS };
      sessionStorage.setItem(
        'lastAppliedFilters',
        JSON.stringify(defaultFilters)
      );
      sessionStorage.setItem('filtersTimestamp', Date.now().toString());
      sessionStorage.setItem('filterSource', source);

      // Remove any pending filter commands
      sessionStorage.removeItem('pendingFilterCommand');

      // Clear brand filter tracking
      sessionStorage.removeItem('lastBrandFilter');
      sessionStorage.removeItem('lastBrandFilterTime');

      // Clear special filter flags
      sessionStorage.removeItem('filterIsBrandOnly');
    } catch (error) {
      console.error('Error clearing filter session storage:', error);

      // Attempt recovery - ensure basic session storage items are always valid
      try {
        sessionStorage.setItem('selectedFilters', JSON.stringify([]));
        sessionStorage.setItem(
          'lastAppliedFilters',
          JSON.stringify(CommandDispatcher.DEFAULT_FILTERS)
        );
      } catch (recoveryError) {
        console.error(
          'Failed to recover from session storage error:',
          recoveryError
        );
      }
    }

    // Update chat messages about cleared filters
    try {
      const savedMessages = sessionStorage.getItem('dictionary');
      let messages = [];

      // Safely parse existing messages or initialize with empty array
      if (savedMessages) {
        try {
          messages = JSON.parse(savedMessages);
        } catch (parseError) {
          console.error('Error parsing chat messages, resetting:', parseError);
          messages = [];
        }
      }

      const assistantMessage = {
        id: `assistant-clear-filters-${Date.now()}`,
        content: 'All filters have been cleared. Showing all products.',
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        intent: 'intent:clear_all_filters',
        metadata: {
          action: 'clear-all',
          source: source,
        },
      };

      messages.push(assistantMessage);
      sessionStorage.setItem('dictionary', JSON.stringify(messages));

      const chatUpdateEvent = new CustomEvent('chatMessagesUpdated', {
        detail: {
          source: source,
          action: 'clear-all',
          intent: 'intent:clear_all_filters',
          timestamp: Date.now(),
        },
      });
      window.dispatchEvent(chatUpdateEvent);
      window.location.reload();
    } catch (error) {
      console.error(
        '❌ PhonesPage: Error updating chat messages in session storage:',
        error
      );
    }
  };

  const handleSearch = (filterName: string, filterValue: string) => {
    updateSharedContext('lastUpdateSource', 'chatAI', 'chatAI');
    const chatUpdateEvent = new CustomEvent('chatMessagesUpdated', {
      detail: {
        source: filterName,
        filterValue: filterValue,
      },
    });
    setTimeout(() => {
      window.dispatchEvent(chatUpdateEvent);
    }, 500);
    setFilters([filterValue]);
  };

  const getFilteredList = async (filterValue: string) => {
    try {
      const {
        responseMessages = [],
        components = [],
        narrative: [
          {
            narrative: { longSummary },
          },
        ] = [{ narrative: { longSummary: '' } }],
      } = await aiPlpFilter(subDomain);

      setRecommendedProduct(longSummary);

      const additionalFilters =
        responseMessages.filter(
          (responseMessage: { responseType: string }) =>
            responseMessage.responseType === 'HANDLER_PROMPT'
        )[0]?.payload?.additionalFilterOptions ?? [];

      const additionalFiltersHeader =
        components
          .filter(
            ({
              content: { type } = { type: '', section: [] },
            }: PageComponent) => type === 'CHAT_WINDOW'
          )[0]
          ?.content?.section?.filter(
            (sect: Section) => sect.type === 'CHAT_BODY_TEXT'
          )[0]?.display ?? '';

      if (additionalFiltersHeader) {
        addPrompt(filterValue, false, {
          payload: additionalFilters,
          result: additionalFiltersHeader,
        });
      }

      const filteredProducts =
        components.filter(
          (component: PageComponent) => component.type === 'AIGRIDWALL'
        )[0]?.details?.devices ?? [];

      return filteredProducts;
    } catch (error) {
      console.error('Error getting filtered list:', error);
      return [];
    }
  };

  const handleFilterChange = ({
    value: filterValue,
    title: filterName,
    attr: filterAttr,
    clearAll = false,
  }: {
    value: string;
    title?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attr?: any;
    clearAll?: boolean;
  }) => {
    if (
      prompts.length === 0 ||
      prompts[prompts.length - 1].prompt !== filterValue
    ) {
      addPrompt(filterValue, false);
    }

    // Check if we're adding or removing this filter
    const isAddingFilter = !filters.includes(filterValue);

    // If removing a filter by clicking the X on a chip, handle differently
    if (!isAddingFilter) {
      // Get filter type to determine how to handle removal
      const filterType = getFilterType(filterValue);

      // If it's a price filter, we need to reset the price range
      if (filterType === 'price') {
        // Update active filters to reset price range to default
        setActiveFilters((prevFilters) => {
          // Make sure we have default filters to prevent the TypeError
          const defaultPriceRange = CommandDispatcher.DEFAULT_FILTERS
            ?.priceRange || { min: 0, max: 9999 };
          return {
            ...prevFilters,
            priceRange: defaultPriceRange,
          };
        });

        // Update last applied filters in session storage
        try {
          const currentFiltersJSON =
            sessionStorage.getItem('lastAppliedFilters');
          let currentFilters;

          // Safely parse the current filters or create default if needed
          try {
            currentFilters = currentFiltersJSON
              ? JSON.parse(currentFiltersJSON)
              : {};
          } catch (parseError) {
            console.error('Error parsing lastAppliedFilters:', parseError);
            currentFilters = {};
          }

          // Make sure we have default filters
          const defaultFilters = CommandDispatcher.DEFAULT_FILTERS || {};
          const defaultPriceRange = defaultFilters.priceRange || {
            min: 0,
            max: 9999,
          };

          // Set with safe defaults
          currentFilters.priceRange = defaultPriceRange;
          sessionStorage.setItem(
            'lastAppliedFilters',
            JSON.stringify(currentFilters)
          );
        } catch (error) {
          console.error(
            'Error updating lastAppliedFilters in session storage:',
            error
          );
          // Recover with basic initialization
          try {
            sessionStorage.setItem(
              'lastAppliedFilters',
              JSON.stringify({
                priceRange: { min: 0, max: 9999 },
                brand: [],
                inStock: true,
              })
            );
          } catch (recoveryError) {
            console.error(
              'Failed to recover from session storage error:',
              recoveryError
            );
          }
        }
      }
      // Remove the filter from the filter chips
      setFilters((prevFilters) =>
        prevFilters.filter((filter) => filter !== filterValue)
      );

      // Update selected filters in session storage
      try {
        const selectedFiltersJSON = sessionStorage.getItem('selectedFilters');
        if (selectedFiltersJSON) {
          try {
            const selectedFilters = JSON.parse(selectedFiltersJSON);
            if (Array.isArray(selectedFilters)) {
              const updatedSelectedFilters = selectedFilters.filter(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (f: any) => f.value !== filterValue
              );
              sessionStorage.setItem(
                'selectedFilters',
                JSON.stringify(updatedSelectedFilters)
              );
            } else {
              // If not an array, initialize with empty array
              sessionStorage.setItem('selectedFilters', JSON.stringify([]));
            }
          } catch (parseError) {
            // Handle JSON parse error by resetting the selected filters
            console.error(
              'Error parsing selectedFilters, resetting to empty array',
              parseError
            );
            sessionStorage.setItem('selectedFilters', JSON.stringify([]));
          }
        } else {
          // If selectedFiltersJSON doesn't exist, initialize it
          sessionStorage.setItem('selectedFilters', JSON.stringify([]));
        }
      } catch (error) {
        console.error(
          'Error updating selectedFilters in session storage:',
          error
        );
        // Attempt to recover by removing potentially corrupted data
        try {
          sessionStorage.removeItem('selectedFilters');
        } catch (removeError) {
          console.error(removeError);
        }
      }

      // Reapply remaining filters after removing the current filter
      reapplyRemainingFilters(filterValue, filterType);

      // Notify other components about filter removal
      // const filterEvent = new CustomEvent('filterRemoved', {
      //   detail: {
      //     filter: filterValue,
      //     source: 'phones-page-ui',
      //     timestamp: Date.now(),
      //     filterType: filterType,
      //   },
      // });
      // window.dispatchEvent(filterEvent);

      // Update chat messages about filter removal
      // updateChatAboutFilterChange(filterValue, filterName, 'removed');

      return;
    }

    // Process price filter buttons specifically

    const priceFilter = priceObj.find((pf) => pf.value === filterValue);
    if (priceObj && priceFilter) {
      // Extract price range using utility function - Fix null safety issues
      const min = Number(priceFilter.valueGTE) || 0; // Use logical OR for fallback
      const max = Number(priceFilter.valueLTE) || 2000; // Use logical OR for fallback

      // Create filter update object with the correct price range
      const filterUpdates: FilterState = {
        priceRange: { min, max },
        brand: [],
        inStock: false,
        phoneType: [],
        largeScreen: [],
        ampleStorage: [],
      };

      // Get current filters and update only the price range
      const currentFiltersJSON = sessionStorage.getItem('lastAppliedFilters');
      const currentFilters = currentFiltersJSON
        ? JSON.parse(currentFiltersJSON)
        : { ...CommandDispatcher.DEFAULT_FILTERS };

      // Update only the price range in existing filters
      const updatedFilters = {
        ...currentFilters,
        // TODO: This will clear the phoneType if it was clicked first. Is this needed, else the phoneType will persist?
        phoneType: [],
        brand: [],
        priceRange: { min, max },
      };

      // Save the updated filters back to session storage
      sessionStorage.setItem(
        'lastAppliedFilters',
        JSON.stringify(updatedFilters)
      );
      sessionStorage.setItem('filtersTimestamp', Date.now().toString());
      sessionStorage.setItem('filterSource', 'price-filter-button');

      // Apply filters using the same mechanism as chat AI
      applyFilterUpdates(filterUpdates, 'price-filter-button');

      // Dispatch event for components to react to the filter change
      const filterEvent = new CustomEvent('filtersChanged', {
        detail: {
          filters: updatedFilters,
          source: 'price-filter-button',
          timestamp: Date.now(),
          filterType: 'price',
        },
      });
      window.dispatchEvent(filterEvent);

      // Update selected filters for visual filter chips
      try {
        const selectedFiltersJSON = sessionStorage.getItem('selectedFilters');
        let selectedFilters = selectedFiltersJSON
          ? JSON.parse(selectedFiltersJSON)
          : [];

        // Remove any existing price filters
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        selectedFilters = selectedFilters.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (f: any) =>
            !(
              f.type === 'price' ||
              (f?.value?.toString()?.includes('$'))
            )
        );

        // Add new price filter
        selectedFilters.push({
          id: `price-${min}-${max}`,
          type: 'price',
          value: priceFilter.title,
          min: min,
          max: max,
        });

        // Save updated selected filters
        sessionStorage.setItem(
          'selectedFilters',
          JSON.stringify(selectedFilters)
        );
      } catch (error) {
        console.error(
          'Error updating selected filters in session storage:',
          error
        );
      }

      // Update chat about filter change
      updateChatAboutFilterChange(priceFilter.title, filterName, 'applied');
    } else {
      // Handle non-price filters like brand filters
      // getFilteredList(filterValue).then((filteredProducts) => {
      //   if (filteredProducts && filteredProducts.length > 0) {
      //     setPhoneList(filteredProducts);

      // Add the filter to the UI
      setFilters((prevFilters) => {
        // Check if this is a brand filter - if so, remove any other brand filters
        const isBrandFilter = getFilterType(filterValue) === 'brand';

        // If this is a brand filter, remove other brand filters
        const filteredPrevFilters = isBrandFilter
          ? prevFilters.filter((f) => getFilterType(f) !== 'brand')
          : prevFilters;

        return [...filteredPrevFilters, filterValue];
      });

      // If this is a brand filter, update activeFilters and sessionStorage

      // TODO: This value seems to never be brand, but its the actually title of the CTA. This needs to be fixed
      if (
        getFilterType(filterValue) === 'brand' ||
        getFilterType(filterValue) === 'phoneType' ||
        getFilterType(filterValue) === 'largeScreen' ||
        getFilterType(filterValue) === 'ampleStorage'
      ) {
        // Update active filters
        if (clearAll) {
          setActiveFilters((prevFilters) => ({
            ...prevFilters,
            brand: [],
            phoneType: [],
          }));
        } else {
          setActiveFilters((prevFilters) => ({
            ...prevFilters,
            [filterAttr]: [filterValue],
          }));
        }

        // Update lastAppliedFilters in session storage
        try {
          const currentFiltersJSON =
            sessionStorage.getItem('lastAppliedFilters');
          const currentFilters = currentFiltersJSON
            ? JSON.parse(currentFiltersJSON)
            : { ...CommandDispatcher.DEFAULT_FILTERS };

          let updatedFilters;
          if (clearAll) {
            updatedFilters = {
              ...currentFilters,
              brand: [],
              phoneType: [],
              [filterAttr]: [filterValue],
            };
          } else {
            updatedFilters = {
              ...currentFilters,
              [filterAttr]: [filterValue],
            };
          }

          sessionStorage.setItem(
            'lastAppliedFilters',
            JSON.stringify(updatedFilters)
          );
          sessionStorage.setItem('filtersTimestamp', Date.now().toString());
          sessionStorage.setItem('filterSource', 'filter-button');

          // Apply filters using the same mechanism as chat AI
          applyFilterUpdates(updatedFilters, 'filter-button');

          // Dispatch event for components to react to the filter change
          const filterEvent = new CustomEvent('filtersChanged', {
            detail: {
              filters: updatedFilters,
              source: 'filter-button',
              timestamp: Date.now(),
              // TODO: This needs to be dynamic
              filterType: [filterAttr],
            },
          });
          window.dispatchEvent(filterEvent);
        } catch (error) {
          console.error(
            'Error updating lastAppliedFilters in session storage:',
            error
          );
        }

        // Update selected filters for visual filter chips
        try {
          const selectedFiltersJSON = sessionStorage.getItem('selectedFilters');
          let selectedFilters = selectedFiltersJSON
            ? JSON.parse(selectedFiltersJSON)
            : [];

          // Remove any existing price filters
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          selectedFilters = selectedFilters.filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (f: any) => !(f.type === filterAttr)
          );

          // Add new brand or phoneTpye filter
          selectedFilters.push({
            id: `${filterAttr}-${filterValue}`,
            type: filterAttr,
            value: filterValue,
            name: filterName,
          });

          // Save updated selected filters
          sessionStorage.setItem(
            'selectedFilters',
            JSON.stringify(selectedFilters)
          );
        } catch (error) {
          console.error(
            'Error updating selected filters in session storage:',
            error
          );
        }
      }
      // }

      // Update chat about filter change
      updateChatAboutFilterChange(filterValue, filterName, 'applied');
      // });
    }
  };

  /**
   * Helper function to update chat messages about filter changes
   */
  const updateChatAboutFilterChange = (
    filterValue: string,
    filterName: string | undefined,
    action: 'applied' | 'removed'
  ) => {
    try {
      const savedMessages = sessionStorage.getItem('dictionary');
      const messages = savedMessages ? JSON.parse(savedMessages) : [];

      const assistantMessage = {
        id: `assistant-filter-${Date.now()}`,
        // content: `Filter '${displayName}' ${action}. ${action === 'applied'
        //   ? 'Showing filtered results.'
        //   : 'Returning to previous view.'
        //   }`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      };

      messages.push(assistantMessage);
      sessionStorage.setItem('dictionary', JSON.stringify(messages));

      const chatUpdateEvent = new CustomEvent('chatMessagesUpdated', {
        detail: {
          source: 'filter-button',
          filterValue: filterValue,
          filterType: getFilterType(filterValue),
          action: action,
        },
      });
      setTimeout(() => {
        window.dispatchEvent(chatUpdateEvent);
      }, 500);
    } catch (error) {
      console.error('Error updating chat messages in session storage:', error);
    }
  };

  // Helper function to properly determine filter type
  const getFilterType = (
    filterValue: string
  ):
    | 'price'
    | 'availability'
    | 'brand'
    | 'phoneType'
    | 'largeScreen'
    | 'ampleStorage' => {
    // Check if it's a price filter
    if (filterValue.includes('$')) {
      return 'price';
    }

    // Check if it's an availability filter
    if (filterValue === 'In Stock' || filterValue === 'All Items') {
      return 'availability';
    }

    if (
      filterValue.toLowerCase().includes('basic') ||
      filterValue.toLowerCase().includes('apple') ||
      filterValue.toLowerCase().includes('android')
    ) {
      return 'phoneType';
    }

    if (filterValue === 'Large screen') {
      return 'largeScreen';
    }

    if (filterValue === 'Ample storage') {
      return 'ampleStorage';
    }

    // Default to brand filter for everything else
    return 'brand';
  };

  /**
   * Helper function to check if a filter is just a default filter that shouldn't be shown
   * @param filterType - The type of filter
   * @param filterValue - The value of the filter
   * @returns boolean - True if the filter is a default filter that shouldn't be shown
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isDefaultFilter = (filterType: string, filterValue: any): boolean => {
    if (!filterType || filterValue === undefined || filterValue === null)
      return false;

    // Make sure we have access to CommandDispatcher.DEFAULT_FILTERS
    const defaultFilters = CommandDispatcher.DEFAULT_FILTERS || {
      brand: [],
      priceRange: { min: 0, max: 2000 },
      inStock: false,
    };

    switch (filterType) {
    case 'price':
      try {
        // If the price range matches the default (0-2000), it's a default filter
        const defaultPriceRange = defaultFilters.priceRange;
        let min = 0,
          max = 2000;

        // Handle different input formats in a single try-catch block
        try {
          if (typeof filterValue === 'object' && filterValue !== null) {
            // If it's an object with min/max properties directly
            if ('min' in filterValue && 'max' in filterValue) {
              min = Number(filterValue.min);
              max = Number(filterValue.max);
            }
            // If it's an object with a string value that needs parsing (like '$0-$2000')
            else if (
              'value' in filterValue &&
              typeof filterValue.value === 'string'
            ) {
              const parsedRange = parsePriceFilterValue(filterValue.value);
              min = parsedRange?.min ?? 0;
              max = parsedRange?.max ?? 2000;
            }
          }
          // If it's a string that needs parsing (like '$0-$2000')
          else if (typeof filterValue === 'string') {
            const parsedRange = parsePriceFilterValue(filterValue);
            min = parsedRange?.min ?? 0;
            max = parsedRange?.max ?? 2000;
          }
        } catch (parseError) {
          console.error('Error parsing price filter value:', parseError);
          // Keep default values if parsing fails
        }

        // Check if price range is roughly the default range
        return (
          (min === 0 || min === defaultPriceRange?.min) &&
          (max >= 2000 || max === defaultPriceRange?.max)
        );
      } catch (error) {
        console.error(
          'Error checking if price range is default filter:',
          error
        );
        return false;
      }

    case 'availability':
      // If 'All Items' or inStock is false (show all), it's a default filter
      return filterValue === 'All Items' || filterValue === false;

    case 'brand':
      // If brand array is empty, it's a default filter
      return Array.isArray(filterValue) && filterValue.length === 0;

    default:
      return false;
    }
  };

  // Helper function to reapply all active filters except the one being removed
  const reapplyRemainingFilters = async (
    removedFilterValue: string,
    removedFilterType: string
  ) => {
    try {
      // Get current active filters from session storage
      const currentFiltersJSON = sessionStorage.getItem('lastAppliedFilters');
      if (!currentFiltersJSON) {
        setPhoneList(plpData.products);
        return;
      }

      // Parse current filters
      const currentFilters = JSON.parse(currentFiltersJSON);

      // Create a new filter state without the removed filter
      const updatedFilters: FilterState = { ...currentFilters };
      // Remove the specific filter that was just removed
      if (removedFilterType === 'price') {
        updatedFilters.priceRange = CommandDispatcher.DEFAULT_FILTERS
          ?.priceRange || { min: 0, max: 9999 };
      } else if (removedFilterType === 'brand') {
        updatedFilters.brand = [];
      } else if (removedFilterType === 'availability') {
        updatedFilters.inStock = true; // Default to showing all items
      } else if (removedFilterType === 'phoneType') {
        updatedFilters.phoneType = [];
      } else if (removedFilterType === 'largeScreen') {
        updatedFilters.largeScreen = [];
      } else if (removedFilterType === 'ampleStorage') {
        updatedFilters.ampleStorage = [];
      }
      // Save updated filters back to storage
      sessionStorage.setItem(
        'lastAppliedFilters',
        JSON.stringify(updatedFilters)
      );
      sessionStorage.setItem('filtersTimestamp', Date.now().toString());
      sessionStorage.setItem('filterSource', 'filter-removal');

      // Start with all phones
      let filteredPhones = [...plpData.products];

      // Apply price filter if present
      if (
        updatedFilters.priceRange &&
        (updatedFilters.priceRange.min > 0 ||
          updatedFilters.priceRange.max < 9999)
      ) {
        const { min, max } = updatedFilters.priceRange;

        // First try to find matching predefined filter
        let foundMatchingPredefinedFilter = false;

        if (PRICE_FILTERS) {
          for (const priceFilter of PRICE_FILTERS) {
            const filterName = priceFilter.title.toLowerCase();

            if (
              (min === 0 && max === 499 && filterName.includes('under $500')) ||
              (min === 500 &&
                max === 799 &&
                filterName.includes('$500-$799')) ||
              (min === 800 &&
                max === 999 &&
                filterName.includes('$800-$999')) ||
              (min >= 1000 && filterName.includes('$1000+'))
            ) {
              try {
                const result = await getFilteredList(priceFilter.title);
                if (result && result.length > 0) {
                  filteredPhones = result;
                  foundMatchingPredefinedFilter = true;
                  break;
                }
              } catch (error) {
                console.error(
                  `Error filtering by price range ${priceFilter.value}:`,
                  error
                );
              }
            }
          }
        }

        // If we don't find a matching predefined filter, filter the products directly by price
        if (!foundMatchingPredefinedFilter) {
          filteredPhones = filteredPhones.filter((phone) => {
            const { price } =
              phone.content.section?.find((item) => !!item.price) || {};
            const phonePrice = extractPrice(price?.fullPrice ?? '0');
            return phonePrice >= min && phonePrice <= max;
          });
        }
      }
      // Process phoneType filters
      if (updatedFilters.phoneType && updatedFilters.phoneType.length !== 0) {
        const apiFilterSuccess = false;

        // Fallback: If API filtering fails, implement client-side brand filtering
        if (!apiFilterSuccess) {
          const phoneTypeFilters = updatedFilters.phoneType.map((phoneType) =>
            // TODO: Remove the split once the values are updated
            phoneType.split(' ')[0].toLowerCase()
          );

          filteredPhones = filteredPhones.filter((phone) => {
            const { title } =
              phone.content.section?.find((item) => !!item.title) || {};

            if (!title) return false;

            // Extract brand from phone name using common brand patterns
            const phoneName = title.toLowerCase();
            // Apply brand identification logic matching CommandDispatcher.filterByBrand
            return phoneTypeFilters.some((phoneType) => {
              // Check for iPhone, iPad -> Apple
              if (
                phoneType === 'apple' &&
                (phoneName.includes('iphone') ||
                  phoneName.includes('ipad') ||
                  phoneName.includes('macbook'))
              ) {
                return true;
              }

              // Checks for android phone types
              if (
                phoneType === 'android' &&
                (phoneName.includes('moto') ||
                  phoneName.includes('motorola') ||
                  phoneName.includes('pixel') ||
                  phoneName.includes('google') ||
                  phoneName.includes('galaxy') ||
                  phoneName.includes('samsung'))
              ) {
                return true;
              }

              if (phoneType === 'basic' && phoneName.includes('tcl flip')) {
                return true;
              }
              return false;
            });
          });
        }
      }
      // Apply brand filter if present
      if (updatedFilters.brand && updatedFilters.brand.length > 0) {
        // First attempt API-based filtering
        const apiFilterSuccess = false;

        // Fall back to client-side filtering if API fails
        if (!apiFilterSuccess) {
          const brandFilters = updatedFilters.brand.map((brand) =>
            brand.toLowerCase()
          );

          filteredPhones = filteredPhones.filter((phone) => {
            const { title } =
              phone.content.section?.find((item) => !!item.title) || {};

            if (!title) return false;

            const phoneName = title.toLowerCase();

            return brandFilters.some((brandFilter) => {
              // Check for iPhone, iPad -> Apple
              if (
                brandFilter === 'apple' &&
                (phoneName.includes('iphone') ||
                  phoneName.includes('ipad') ||
                  phoneName.includes('macbook'))
              ) {
                return true;
              }

              // Check for Galaxy, Samsung -> Samsung
              if (
                brandFilter === 'samsung' &&
                (phoneName.includes('galaxy') || phoneName.includes('samsung'))
              ) {
                return true;
              }

              // Check for Pixel, Google -> Google
              if (
                brandFilter === 'google' &&
                (phoneName.includes('pixel') || phoneName.includes('google'))
              ) {
                return true;
              }

              // Check for Moto, Motorola -> Motorola
              if (
                brandFilter === 'motorola' &&
                (phoneName.includes('moto') || phoneName.includes('motorola'))
              ) {
                return true;
              }

              // Check for direct name match
              if (phoneName.includes(brandFilter)) {
                return true;
              }

              return false;
            });
          });
        }
      }
      updateSharedContext('filters', updatedFilters, 'filter-button');

      // Update the phone list with filtered results
      setPhoneList(filteredPhones);
      // Update active filters state
      setActiveFilters(updatedFilters);
    } catch (error) {
      console.error('Error reapplying filters:', error);
      // Fallback to showing all phones
      setPhoneList(plpData.products);
    }
  };

  return (
    <>
      {loading && <Loader isOpaqueLayover={true} subdomain={subDomain} />}
      <Container bgImage={true}>
        {filters.length === 0 && (
          <div className='products-list__header'>
            <h1 className='products-list__header-icon'>
              <StarryIcon className='mr-2' size={80} />
              <AITypewriter
                text={bannerData.header}
                className='text-center'
                speed={20}
              />
            </h1>
            <div className='products-list__search-bar'>
              <SearchBar
                placeholder={bannerData.searchPlaceHolder}
                onSearch={(filtervalue: string) =>
                  handleSearch('search-text', filtervalue)
                }
              />
            </div>
            <div className='products-list__filter-buttons'>
              {bannerData?.primaryFilters?.map((filter, i) => (
                <Button
                  key={`${filter.title}_${i}`}
                  size='medium'
                  label={filter.title}
                  className='mr-2 rounded-full'
                  primary={false}
                  onClick={() =>
                    handleFilterChange({
                      // TODO: This needs to come as lower case value, similar to the intent payload
                      value: filter.value,
                      title: filter.title,
                      // TODO: This will come from the BE as the correct type
                      attr: 'phoneType',
                      clearAll: true,
                    })
                  }
                />
              ))}
            </div>
          </div>
        )}

        <div className='products-list__grid'>
          <div
            className={`products-list__product-list ${
              filters.length > 0 && 'products-list__product-list--has-filters'
            }`}
            style={{
              backdropFilter: 'blur(5px)',
              boxShadow:
                '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div className='list-header'>
              <h1 className='list-header__text'>{plpData.title}</h1>
              <div className='list-header__filters'>
                {(showAllFilters ? filters : filters.slice(0, 2))?.map(
                  (filter, i) => (
                    <Badge
                      key={`${i}-${filter}`}
                      showRightIcon
                      showEllipses
                      textMaxWidth='80px'
                      className={'products-list__badge'}
                      onRightIconClick={() => {
                        handleFilterChange({ value: filter });
                      }}
                      text={filter}
                    />
                  )
                )}
                {!showAllFilters && filters.length > 2 && (
                  <Button
                    size='medium'
                    label={`+${filters.length - 2}`}
                    className='mr-2 rounded-full'
                    primary={false}
                    onClick={() => setShowAllFilters(true)}
                  />
                )}
              </div>
              {/* <button className='list-header__button'>{plpData.cta}</button> */}
              <div className=''>
                <TextLinkButton
                  className='list-header__button'
                  kind='standalone'
                  onClick={() => toggleShowAllFilters()}
                >
                  {plpData.cta}
                  {allFiltersOpenState ? <UpCaret /> : <DownCaret />}
                </TextLinkButton>
              </div>
            </div>

            <AllFilters
              selectedAllFilters={selectedAllFilters}
              handleSelectedAllFiltersChange={handleSelectedAllFiltersChange}
              showAllFilters={allFiltersOpenState}
              handleAllFiltersClearAll={handleAllFiltersClearAll}
              {...ALL_FITLERS}
              handleApplyFilters={handleApplyFilters}
              phoneListLen={allFilteredResult.length}
            />

            <div
              className={`products-list__product-grid ${
                filters.length > 0 && 'products-list__product-grid--has-filters'
              }`}
            >
              {phoneList.map((data, index) => (
                <ProductTile
                  key={`${data?.productId + index}`}
                  product={data}
                  destination={phoneProductData?.[data?.productId]?.url}
                  setLoading={setLoading}
                />
              ))}
            </div>
          </div>

          {filters.length > 0 && (
            <ChatInterface
              step={1}
              subDomain={subDomain}
              productRecommendData={recommendedProduct}
              handleFilterChange={handleFilterChange}
            />
          )}
        </div>
      </Container>
    </>
  );
}



[{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "sonarlint",
	"code": "typescript:S6754",
	"severity": 4,
	"message": "useState call is not destructured into value + setter pair",
	"source": "sonarqube",
	"startLineNumber": 106,
	"startColumn": 28,
	"endLineNumber": 108,
	"endColumn": 4
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "eslint",
	"code": {
		"value": "react-hooks/exhaustive-deps",
		"target": {
			"$mid": 1,
			"path": "/facebook/react/issues/14920",
			"scheme": "https",
			"authority": "github.com"
		}
	},
	"severity": 4,
	"message": "React Hook useEffect has missing dependencies: 'getFilteredList', 'phoneList', 'phoneProductData', 'plpData.products', 'setActiveFilters', and 'setFilters'. Either include them or remove the dependency array. You can also replace multiple useState variables with useReducer if 'setAllFilteredResult' needs the current value of 'phoneList'.",
	"source": "eslint",
	"startLineNumber": 156,
	"startColumn": 6,
	"endLineNumber": 156,
	"endColumn": 26
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "eslint",
	"code": {
		"value": "react-hooks/exhaustive-deps",
		"target": {
			"$mid": 1,
			"path": "/facebook/react/issues/14920",
			"scheme": "https",
			"authority": "github.com"
		}
	},
	"severity": 4,
	"message": "React Hook useEffect has missing dependencies: 'applyBrandOnlyFilter' and 'clearAllFilters'. Either include them or remove the dependency array.",
	"source": "eslint",
	"startLineNumber": 268,
	"startColumn": 6,
	"endLineNumber": 268,
	"endColumn": 52
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "sonarlint",
	"code": "typescript:S3776",
	"severity": 4,
	"message": "Refactor this function to reduce its Cognitive Complexity from 60 to the 15 allowed. [+32 locations]",
	"source": "sonarqube",
	"startLineNumber": 273,
	"startColumn": 5,
	"endLineNumber": 273,
	"endColumn": 7
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "sonarlint",
	"code": "typescript:S1135",
	"severity": 4,
	"message": "Complete the task associated to this \"TODO\" comment.",
	"source": "sonarqube",
	"startLineNumber": 302,
	"startColumn": 14,
	"endLineNumber": 302,
	"endColumn": 18
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "sonarlint",
	"code": "typescript:S1135",
	"severity": 4,
	"message": "Complete the task associated to this \"TODO\" comment.",
	"source": "sonarqube",
	"startLineNumber": 313,
	"startColumn": 14,
	"endLineNumber": 313,
	"endColumn": 18
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "sonarlint",
	"code": "typescript:S1135",
	"severity": 4,
	"message": "Complete the task associated to this \"TODO\" comment.",
	"source": "sonarqube",
	"startLineNumber": 379,
	"startColumn": 14,
	"endLineNumber": 379,
	"endColumn": 18
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "sonarlint",
	"code": "typescript:S2004",
	"severity": 4,
	"message": "Refactor this code to not nest functions more than 4 levels deep. [+4 locations]",
	"source": "sonarqube",
	"startLineNumber": 570,
	"startColumn": 37,
	"endLineNumber": 570,
	"endColumn": 39
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "sonarlint",
	"code": "typescript:S2004",
	"severity": 4,
	"message": "Refactor this code to not nest functions more than 4 levels deep. [+4 locations]",
	"source": "sonarqube",
	"startLineNumber": 577,
	"startColumn": 37,
	"endLineNumber": 577,
	"endColumn": 39
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "sonarlint",
	"code": "typescript:S3776",
	"severity": 4,
	"message": "Refactor this function to reduce its Cognitive Complexity from 19 to the 15 allowed. [+12 locations]",
	"source": "sonarqube",
	"startLineNumber": 594,
	"startColumn": 67,
	"endLineNumber": 594,
	"endColumn": 69
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "sonarlint",
	"code": "typescript:S6594",
	"severity": 4,
	"message": "Use the \"RegExp.exec()\" method instead.",
	"source": "sonarqube",
	"startLineNumber": 746,
	"startColumn": 32,
	"endLineNumber": 746,
	"endColumn": 37
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "sonarlint",
	"code": "typescript:S3776",
	"severity": 4,
	"message": "Refactor this function to reduce its Cognitive Complexity from 63 to the 15 allowed. [+29 locations]",
	"source": "sonarqube",
	"startLineNumber": 924,
	"startColumn": 6,
	"endLineNumber": 924,
	"endColumn": 8
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "sonarlint",
	"code": "typescript:S1135",
	"severity": 4,
	"message": "Complete the task associated to this \"TODO\" comment.",
	"source": "sonarqube",
	"startLineNumber": 1101,
	"startColumn": 12,
	"endLineNumber": 1101,
	"endColumn": 16
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "sonarlint",
	"code": "typescript:S1135",
	"severity": 4,
	"message": "Complete the task associated to this \"TODO\" comment.",
	"source": "sonarqube",
	"startLineNumber": 1191,
	"startColumn": 10,
	"endLineNumber": 1191,
	"endColumn": 14
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "sonarlint",
	"code": "typescript:S1135",
	"severity": 4,
	"message": "Complete the task associated to this \"TODO\" comment.",
	"source": "sonarqube",
	"startLineNumber": 1251,
	"startColumn": 18,
	"endLineNumber": 1251,
	"endColumn": 22
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "sonarlint",
	"code": "typescript:S1940",
	"severity": 4,
	"message": "Use the opposite operator (!==) instead.",
	"source": "sonarqube",
	"startLineNumber": 1274,
	"startColumn": 25,
	"endLineNumber": 1274,
	"endColumn": 49
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "sonarlint",
	"code": "typescript:S3776",
	"severity": 4,
	"message": "Refactor this function to reduce its Cognitive Complexity from 18 to the 15 allowed. [+13 locations]",
	"source": "sonarqube",
	"startLineNumber": 1393,
	"startColumn": 75,
	"endLineNumber": 1393,
	"endColumn": 77
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "sonarlint",
	"code": "typescript:S3776",
	"severity": 4,
	"message": "Refactor this function to reduce its Cognitive Complexity from 44 to the 15 allowed. [+27 locations]",
	"source": "sonarqube",
	"startLineNumber": 1471,
	"startColumn": 5,
	"endLineNumber": 1471,
	"endColumn": 7
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "sonarlint",
	"code": "typescript:S1135",
	"severity": 4,
	"message": "Complete the task associated to this \"TODO\" comment.",
	"source": "sonarqube",
	"startLineNumber": 1570,
	"startColumn": 16,
	"endLineNumber": 1570,
	"endColumn": 20
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "sonarlint",
	"code": "typescript:S1135",
	"severity": 4,
	"message": "Complete the task associated to this \"TODO\" comment.",
	"source": "sonarqube",
	"startLineNumber": 1724,
	"startColumn": 26,
	"endLineNumber": 1724,
	"endColumn": 30
},{
	"resource": "/C:/Users/pplepo/Desktop/VProject/onevz-value-digital-mfe-shop/app/[subdomain]/(aiConversation)/phones/page-client.tsx",
	"owner": "sonarlint",
	"code": "typescript:S1135",
	"severity": 4,
	"message": "Complete the task associated to this \"TODO\" comment.",
	"source": "sonarqube",
	"startLineNumber": 1727,
	"startColumn": 26,
	"endLineNumber": 1727,
	"endColumn": 30
}]




const applyFilterUpdates = async (filterUpdates: FilterState, source: string) => {
  setActiveFilters((prev) => ({ ...prev, ...filterUpdates }));
  let filtered = [...plpData.products];
  let chips: string[] = [];

  if (filterUpdates.brand?.length) {
    filtered = filterByBrand(filtered, filterUpdates.brand);
    chips.push(...getBrandChips(filterUpdates.brand));
  }

  if (filterUpdates.phoneType?.length) {
    filtered = filterByPhoneType(filtered, filterUpdates.phoneType);
    chips.push(...getPhoneTypeChips(filterUpdates.phoneType));
  }

  if (filterUpdates.priceRange) {
    const { min, max } = filterUpdates.priceRange;
    if (!isDefaultFilter('price', { min, max })) {
      filtered = filterByPrice(filtered, min, max);
      chips.push(getPriceChip(min, max));
    }
  }

  if (filterUpdates.inStock !== undefined && !isDefaultFilter('availability', filterUpdates.inStock)) {
    chips.push(getAvailabilityChip(filterUpdates.inStock));
  }

  if (filterUpdates.ampleStorage?.length) {
    filtered = filtered.filter((p) => phoneProductData[p.productId].ampleStorage);
  }

  if (filterUpdates.largeScreen?.length) {
    filtered = filtered.filter((p) => phoneProductData[p.productId].largeScreen);
  }

  setPhoneList(filtered);

  if (source.includes('chat-intent') || source.includes('command-dispatcher')) {
    setFilters(chips);
    syncToSessionStorage(chips);
  } else {
    mergeWithExistingFilters(chips);
  }
};

function filterByPrice(phones: Phone[], min: number, max: number): Phone[] {
  return phones.filter((phone) => {
    const price = phone.content.section?.find((item) => !!item.price)?.price?.fullPrice ?? '0';
    const numericPrice = extractPrice(price);
    return numericPrice >= min && numericPrice <= max;
  });
}

function filterByPhoneType(phones: Phone[], phoneTypes: string[]): Phone[] {
  const typeFilters = phoneTypes.map((type) => type.split(' ')[0].toLowerCase());

  return phones.filter((phone) => {
    const title = phone.content.section?.find((item) => !!item.title)?.title?.toLowerCase();
    if (!title) return false;

    return typeFilters.some((type) => {
      if (type === 'apple') return /(iphone|ipad|macbook)/.test(title);
      if (type === 'android') return /(moto|motorola|pixel|google|galaxy|samsung)/.test(title);
      if (type === 'basic') return title.includes('tcl flip');
      return false;
    });
  });
}

function filterByBrand(phones: Phone[], brands: string[]): Phone[] {
  const brandFilters = brands.map((b) => b.toLowerCase());

  return phones.filter((phone) => {
    const title = phone.content.section?.find((item) => !!item.title)?.title?.toLowerCase();
    if (!title) return false;

    return brandFilters.some((brand) => {
      if (brand === 'apple') return /(iphone|ipad|macbook)/.test(title);
      if (brand === 'samsung') return /(galaxy|samsung)/.test(title);
      if (brand === 'google') return /(pixel|google)/.test(title);
      if (brand === 'motorola') return /(moto|motorola)/.test(title);
      return title.includes(brand);
    });
  });
}


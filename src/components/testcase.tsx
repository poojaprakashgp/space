export function handleFilterChipsAndSession({
  source,
  newFilterChips,
  setFilters,
}: any) {
  if (source.includes('chat-intent') || source.includes('command-dispatcher')) {
    setFilters(newFilterChips);
    try {
      const filterChipObjects = newFilterChips.map((chip: any) => ({
        id: `filter-${Date.now()}-${uuidv4()}`,
        type: getFilterType(chip),
        value: chip,
      }));
      sessionStorage.setItem(
        'selectedFilters',
        JSON.stringify(filterChipObjects),
      );
    } catch (error) {
      console.error(
        'Error updating selected filters in session storage:',
        error,
      );
      try {
        sessionStorage.setItem('selectedFilters', JSON.stringify([]));
      } catch (fallbackError) {
        console.error(
          'Failed to recover from session storage error:',
          fallbackError,
        );
      }
    }
  } else {
    setFilters((prevFilters: any) => {
      const deduplicatedPrevFilters = prevFilters.filter((prevFilter: any) => {
        const isPriceFilter = getFilterType(prevFilter) === 'price';
        const isStockFilter = getFilterType(prevFilter) === 'availability';
        Iif (
          isPriceFilter &&
          newFilterChips.some((f: any) => getFilterType(f) === 'price')//
        )
          return false;//
        Iif (
          isStockFilter &&
          newFilterChips.some((f: any) => getFilterType(f) === 'availability')
        )
          return false;//
        if (!isPriceFilter && !isStockFilter) {
          return !newFilterChips.includes(prevFilter);
        }
        return true;
      });
      return [...deduplicatedPrevFilters, ...newFilterChips];
    });
  }
}



import { handleFilterChipsAndSession } from './your-utils-file'; // change path
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({ v4: jest.fn(() => 'mock-uuid') }));

const mockGetFilterType = jest.fn();
jest.mock('./your-utils-file', () => {
  const actual = jest.requireActual('./your-utils-file');
  return {
    ...actual,
    getFilterType: (value: string) => {
      if (value.includes('Price')) return 'price';
      if (value.includes('Stock')) return 'availability';
      return 'other';
    },
  };
});

describe('handleFilterChipsAndSession', () => {
  it('removes old price and stock filters when new ones exist', () => {
    const prevFilters = ['OldPriceFilter', 'OldStockFilter', 'KeepThisFilter'];
    const newFilterChips = ['NewPriceFilter', 'NewStockFilter'];

    const setFilters = jest.fn((cb) => {
      const final = cb(prevFilters);
      expect(final).toEqual([
        'KeepThisFilter', // ✅ kept
        'NewPriceFilter', // ✅ new
        'NewStockFilter', // ✅ new
      ]);
    });

    handleFilterChipsAndSession({
      source: 'other',
      newFilterChips,
      setFilters,
    });

    expect(setFilters).toHaveBeenCalled();
  });
});


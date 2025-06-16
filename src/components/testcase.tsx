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

 // render the page with filtered results from session storage if available.
  // To handle global redirection.  Handle SSR & CSR rendering
  if (typeof window !== 'undefined') {
    const filteredProductData = sessionStorage.getItem(
      'agenticFilteredResults',
    );
    const queryUsed = sessionStorage.getItem('agenticQuery');
    const isChooseDifferentPhone = sessionStorage.getItem(
      'chooseDifferentPhone',
    );
    if (isChooseDifferentPhone && filteredProductData) {
      try {
        const parsedResults = JSON.parse(filteredProductData);
 
        // Dispatch action to update products in plpContext
        dispatch(fetchFilteredProductsSuccess(parsedResults));
 
        // Set the filter with the original search query if available
        if (queryUsed) {
          setFilters([queryUsed]);
        }
 
        // Clear the stored results after using them to prevent reuse on subsequent visits
        // Comment this out if you want the results to persist across multiple visits
        sessionStorage.removeItem('agenticFilteredResults');
        sessionStorage.removeItem('agenticQuery');
        sessionStorage.removeItem('chooseDifferentPhone');
      } catch (error) {
        console.error('Error parsing stored search results:', error);
        // Clear the stored results after using them to prevent reuse on subsequent visits
        // Comment this out if you want the results to persist across multiple visits
        sessionStorage.removeItem('agenticFilteredResults');
        sessionStorage.removeItem('agenticQuery');
        sessionStorage.removeItem('chooseDifferentPhone');
      }
    }
  }
please cover the catch block lines of code under unit test cases apart from console.error and comments



import { render } from '@testing-library/react';
import YourComponent from './YourComponent'; // Replace with actual file
import { fetchFilteredProductsSuccess } from 'your-actions-file';
import * as ReactRedux from 'react-redux';

// 🧠 Mock dispatch
const dispatchMock = jest.fn();

jest.mock('your-actions-file', () => ({
  fetchFilteredProductsSuccess: jest.fn(),
}));

describe('Filter logic inside component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // 🧪 force an invalid JSON so JSON.parse fails
    sessionStorage.setItem('agenticFilteredResults', '{ invalid json ');
    sessionStorage.setItem('agenticQuery', 'bad-query');
    sessionStorage.setItem('chooseDifferentPhone', 'true');

    // 🧠 mock Redux useDispatch
    jest.spyOn(ReactRedux, 'useDispatch').mockReturnValue(dispatchMock);
  });

  it('should handle JSON.parse failure and clear session storage items', () => {
    render(<YourComponent />); // ⬅️ mounts your component that runs the logic

    // ✅ Check sessionStorage was cleared
    expect(sessionStorage.getItem('agenticFilteredResults')).toBeNull();
    expect(sessionStorage.getItem('agenticQuery')).toBeNull();
    expect(sessionStorage.getItem('chooseDifferentPhone')).toBeNull();

    // ❌ dispatch should NOT be called since JSON.parse failed
    expect(dispatchMock).not.toHaveBeenCalled();
  });
});


ProductsList Component > should handle JSON.parse failure and clear session storage items
-----
Error: expect(received).toBeNull()

Received: "[{\"productId\":\"phone1\",\"content\":{\"section\":[]}}]"Jest
(method) Storage.getItem(key: string): string | null
Returns the current value associated with the given key, or null if the given key does not exist.

MDN Reference



  if (unselectedPriceFilters.length > 0) {
          // For each price object, check if any of its specific filters were unselected
          priceObj.forEach((priceObjItem) => {
            const specificFiltersForPriceObj =
              priceObjToFiltersMapRef.current[priceObjItem.title] || [];

            // Check if any of the unselected filters belong to this price object
            const hasUnselectedFilters = unselectedPriceFilters.some((title) =>
              specificFiltersForPriceObj.includes(title),
            );

            if (hasUnselectedFilters) {
              // Check if this price object is currently selected
              const isPriceObjItemSelected = updatedFilters.priceRange.some(
                (range: { title?: string }) =>
                  range.title === priceObjItem.title,
              );

              if (isPriceObjItemSelected) {
                // Remove the price object
                updatedFilters.priceRange = updatedFilters.priceRange.filter(
                  (range: { title?: string }) =>
                    range.title !== priceObjItem.title,
                );

                // Add back the remaining all filters price ranges that weren't unselected
                const remainingSpecificFilters =
                  specificFiltersForPriceObj.filter(
                    (title) => !unselectedTitles.includes(title),
                  );

                // Find the corresponding price filter options and add them to the priceRange
                if (remainingSpecificFilters.length > 0 && PRICE_FILTERS) {
                  remainingSpecificFilters.forEach((title) => {
                    const matchingFilter = PRICE_FILTERS.find(
                      (option) => option.title === title,
                    );
                    if (matchingFilter) {
                      // Convert valueGTE and valueLTE to numbers if they're strings
                      const min =
                        typeof matchingFilter.valueGTE === 'string'
                          ? Number(matchingFilter.valueGTE)
                          : matchingFilter.valueGTE;
                      const max =
                        typeof matchingFilter.valueLTE === 'string'
                          ? Number(matchingFilter.valueLTE)
                          : matchingFilter.valueLTE;

                      updatedFilters.priceRange.push({
                        min,
                        max,
                        title: matchingFilter.title,
                      });
                    }
                  });
                }
              }
            }
          });
        } give me test case which coveres all if statments codes inside it 

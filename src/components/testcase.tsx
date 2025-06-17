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


// Explicitly check for cases where a price object in the current filters
    // needs to be replaced by its remaining specific filter options
    filters.forEach((filter) => {
      priceObj.forEach((priceObjItem) => {
        Iif (filter === priceObjItem.title) {
          const specificFiltersForPriceObj =
            priceObjToFiltersMapRef.current[priceObjItem.title] || [];
          const hasUnselectedSpecificFilters = unselectedTitles.some((title) =>
            specificFiltersForPriceObj.includes(title),
          );
 
          Iif (hasUnselectedSpecificFilters) {
            priceObjToRemove.push(priceObjItem.title);
 
            // Add any remaining filters not in unselectedTitles
            const retainedSpecificFilters = specificFiltersForPriceObj.filter(
              (title) => !unselectedTitles.includes(title),
            );
            specificPriceFiltersToAdd.push(...retainedSpecificFilters);
          }
        }
      });
    });please cover all the lines which is mentioend inside Iif

it('should replace a priceObj title with its remaining specific filters when some are unselected', () => {
  const filters = ['Mid Range']; // This matches `priceObjItem.title`
  const priceObj = [{ title: 'Mid Range' }];

  const priceObjToFiltersMapRef = {
    current: {
      'Mid Range': ['$100-$200', '$150-$250', '$200-$300'],
    },
  };

  const unselectedTitles = ['$100-$200']; // One is unselected
  const priceObjToRemove: string[] = [];
  const specificPriceFiltersToAdd: string[] = [];

  // 💥 Run the logic you're testing
  filters.forEach((filter) => {
    priceObj.forEach((priceObjItem) => {
      if (filter === priceObjItem.title) {
        const specificFiltersForPriceObj =
          priceObjToFiltersMapRef.current[priceObjItem.title] || [];

        const hasUnselectedSpecificFilters = unselectedTitles.some((title) =>
          specificFiltersForPriceObj.includes(title),
        );

        if (hasUnselectedSpecificFilters) {
          priceObjToRemove.push(priceObjItem.title);

          const retainedSpecificFilters = specificFiltersForPriceObj.filter(
            (title) => !unselectedTitles.includes(title),
          );
          specificPriceFiltersToAdd.push(...retainedSpecificFilters);
        }
      }
    });
  });

  // ✅ Asserts
  expect(priceObjToRemove).toEqual(['Mid Range']);
  expect(specificPriceFiltersToAdd).toEqual(['$150-$250', '$200-$300']);
});

 setFilters((prevFilters) => {
      // First remove any directly unselected titles from the filters
      let updatedFilters = prevFilters.filter(
        (title) => !unselectedTitles.includes(title),
      );
 
      // Then remove any price objects that need to be removed due to partial deselection
      updatedFilters = updatedFilters.filter(
        (title) => !priceObjToRemove.includes(title),
      );
 
      // Add new filters that weren't in the previous filters
      const newFilters = selectedTitles.filter(
        (title) =>
          !prevFilters.includes(title) && !priceObjToRemove.includes(title),
      );
 
      // Add specific price filters that need to be added due to price object removal
      specificPriceFiltersToAdd.forEach((title) => {
        Iif (!updatedFilters.includes(title) && !newFilters.includes(title)) {
          newFilters.push(title);
        }
      });
 
      return [...updatedFilters, ...newFilters];
    }); give me test cases to cover the lines inside setFilters

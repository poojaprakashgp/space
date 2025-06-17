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



  selectedAllFilters.forEach((filter) => {
        switch (filter.attr) {
        case 'brand':
          if (filter.title && !updatedFilters.brand.includes(filter.title)) {
            updatedFilters.brand.push(filter.title);
          }
          break;
 
        case 'phoneType':
          Iif (
            filter.title &&
              !updatedFilters.phoneType.includes(filter.title)
          ) {
            updatedFilters.phoneType.push(filter.title);
          }
          break;
        case 'offerPrice': {
          const titleExists = updatedFilters.priceRange.some(
            (range: { title?: string }) => range.title === filter.title,
          );
 
          if (!titleExists) {
            updatedFilters.priceRange.push({
              min: filter.valueGTE,
              max: filter.valueLTE,
              title: filter.title,
            });
          }
          break;
        }
        case '5G':
          updatedFilters['5G'] = filter.title?.toLowerCase() !== 'no';
          break;
        default:
          break;
        }
      });cover the lines under case 'phonetype', '5G' and default

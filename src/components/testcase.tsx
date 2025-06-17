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

it('should handle JSON.parse failure and clear session storage items', () => {
  // Mock invalid JSON
  sessionStorage.setItem('agenticFilteredResults', 'INVALID_JSON'); // <-- 💥 force parse failure
  sessionStorage.setItem('agenticQuery', 'query');
  sessionStorage.setItem('chooseDifferentPhone', 'true');

  // Spy and mock JSON.parse to throw
  jest.spyOn(JSON, 'parse').mockImplementation(() => {
    throw new Error('Invalid JSON');
  });

  render(<YourComponent />); // This will trigger the logic in your useEffect

  // ✅ Check sessionStorage was cleared
  expect(sessionStorage.getItem('agenticFilteredResults')).toBeNull();
  expect(sessionStorage.getItem('agenticQuery')).toBeNull();
  expect(sessionStorage.getItem('chooseDifferentPhone')).toBeNull();

  // ❌ dispatch should NOT be called since JSON.parse failed
  expect(dispatchMock).not.toHaveBeenCalled();

  // ✅ Clean up the mock to avoid side effects in other tests
  jest.restoreAllMocks();
});

ProductsList Component > should handle JSON.parse failure and clear session storage items
-----
Error: Invalid JSONJest
var Error: ErrorConstructor
new (message?: string, options?: ErrorOptions) => Error (+1 overload)
No quick fixes available



import { render } from '@testing-library/react';
import YourComponent from './YourComponent';
import { fetchFilteredProductsSuccess } from 'path-to-your-actions'; // adjust this
import { useDispatch } from 'react-redux';

// 🧪 Mock your dispatch
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

describe('ProductsList Component', () => {
  let dispatchMock: jest.Mock;

  beforeEach(() => {
    // 🔁 Fresh mock for each test
    dispatchMock = jest.fn();
    (useDispatch as jest.Mock).mockReturnValue(dispatchMock);

    // 🔧 Set sessionStorage
    sessionStorage.setItem('agenticFilteredResults', 'INVALID_JSON');
    sessionStorage.setItem('agenticQuery', 'some-query');
    sessionStorage.setItem('chooseDifferentPhone', 'true');

    // 💥 Force JSON.parse to fail
    jest.spyOn(JSON, 'parse').mockImplementation(() => {
      throw new Error('Invalid JSON');
    });
  });

  afterEach(() => {
    // 🧼 Clean mocks & session
    jest.restoreAllMocks();
    sessionStorage.clear();
  });

  it('should handle JSON.parse failure and clear session storage items', () => {
    render(<YourComponent />); // ⬅️ this triggers the logic

    // ✅ Make sure session storage got cleared
    expect(sessionStorage.getItem('agenticFilteredResults')).toBeNull();
    expect(sessionStorage.getItem('agenticQuery')).toBeNull();
    expect(sessionStorage.getItem('chooseDifferentPhone')).toBeNull();

    // ✅ Dispatch should NOT be called due to parse error
    expect(dispatchMock).not.toHaveBeenCalled();
  });
});


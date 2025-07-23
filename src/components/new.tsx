
    it('handles veriff price when veriffPrice is empty string', () => {
      const modifiedOptions = [...mockPaymentOptions];
      modifiedOptions[2] = {
        ...modifiedOptions[2],
        price: {
          ...modifiedOptions[2].price!,
          veriffPrice: '',
        },
      };

      const modifiedContent = [
        {
          ...mockDeviceDetailsContent[0],
          content: {
            section: [{ options: modifiedOptions }],
          },
        },
      ];

      render(
        <ChoosePayment
          {...defaultProps}
          DEVICE_DETAILS_CONTENT_SECTION={modifiedContent}
        />
      );

      // Should default to 0 when veriffPrice is empty
      expect(screen.getByText('$0')).toBeInTheDocument();
    });


 ChoosePayment › ChoosePaymentSelection Component › handles veriff price when veriffPrice is empty string

    Found multiple elements with the text: $0

    Here are the matching elements:

    The detailed error message is suppressed by waitFor

    The detailed error message is suppressed by waitFor

    The detailed error message is suppressed by waitFor

    (If this is intentional, then use the `*AllBy*` variant of the query (like `queryAllByText`, `getAllByText`, or `findAllByText`)).

      263 |
      264 |       // Should default to 0 when veriffPrice is empty
    > 265 |       expect(screen.getByText('$0')).toBeInTheDocument();
          |                     ^
      266 |     });
      267 |   });
      268 |

      at Object.getElementError (node_modules/@evinced/unit-tester/dist/index.js:41:1501782)
      at getElementError (node_modules/@testing-library/dom/dist/query-helpers.js:20:35)
      at getMultipleElementsFoundError (node_modules/@testing-library/dom/dist/query-helpers.js:23:10)
      at node_modules/@testing-library/dom/dist/query-helpers.js:55:13
      at node_modules/@testing-library/dom/dist/query-helpers.js:95:19
      at Object.getByText (common/organisms/ProductDescription/Components/DeviceDetails/components/test/ChoosePayment.test.tsx:265:21)

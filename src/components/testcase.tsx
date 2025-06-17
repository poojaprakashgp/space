 const PRICE_FILTERS =
    PLP_NODE &&
    (
      PLP_NODE.details.accordion.content.section?.find(
        (comp) => comp?.id === 'price',
      ) || { options: [] }//
    ).options;
 
  const plpData = {
    title: PLP_NODE?.details?.title,
    cta: PLP_NODE?.details?.cta?.text,
    products: PLP_NODE?.details?.content?.section || [],//
    data: main?.data?.products,
  };


  it('should fallback to empty options when price component is not found', () => {
    const mockPLP_NODE = {
      details: {
        accordion: {
          content: {
            section: [
              { id: 'not-price', options: ['x'] } // 💥 no 'price' id here
            ]
          }
        },
        content: {} // section is undefined
      }
    };

    render(<MyComponent PLP_NODE={mockPLP_NODE} />); // or pass as prop, or mock globally

    // ✅ Now test behavior/output based on:
    // - PRICE_FILTERS === [] 
    // - products === []
    // Example (adjust based on component):
    expect(screen.queryByText('Some Option')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('product-tile')).toHaveLength(0);
  });

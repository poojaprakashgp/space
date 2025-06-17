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

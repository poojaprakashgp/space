  const removeLeasePlan = async () => {
    setOrderSummaryLoader(true);

    const parsedDeviceDetails = JSON.parse(
      sessionStorage.getItem('deviceDetails') ?? '{}',
    );
    parsedDeviceDetails['devicePayment'] = 'retail';
    updateSessionStorage('deviceDetails', false, parsedDeviceDetails);

    const summary = await removeSmartPayLeasePlan(subDomain);
    updateOrderSummary(summary);

    setOrderSummaryLoader(false);
  };
cover this function which is called from other component after click of button with data-testid="remove lease"

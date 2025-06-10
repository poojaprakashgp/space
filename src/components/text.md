The iPhone 15 has several improvements over the iPhone 14. The iPhone 15 features Dynamic Island, a 48MP Main camera, and an A16 Bionic Chip. The iPhone 15's Super Retina XDR display is also brighter. Here's a comparison: * **Display:** iPhone 15's display is up to 2x brighter in the sun compared to iPhone 14. * **Camera:** iPhone 15 has a 48MP Main camera. * **Chip:** iPhone 15 uses the A16 Bionic Chip. * **Features:** iPhone 15 has Dynamic Island.


If navigatedViaApp === 'true':
It means the user reached this page through the proper app flow.
We then remove the flag after confirming it, so that on subsequent reloads it doesn't persist.
 
If navigatedViaApp is not set or false:
We treat it as an unauthorized access or a page reload, and redirect the user to the /phones page.



 const navigatedViaApp = sessionStorage.getItem('navigatedViaApp') === 'true';
    if(navigatedViaApp) {
      sessionStorage.removeItem('navigatedViaApp');
    } else E{
      router.push(`${getBaseURL()}/phones`);
    }
 
it('should redirect to /phones if navigatedViaApp is not true', () => {
    sessionStorage.removeItem('navigatedViaApp'); // ensure it's gone
    const removeItemSpy = jest.spyOn(sessionStorage, 'removeItem');

    yourFunctionOrComponent(); // this must run the logic

    expect(removeItemSpy).not.toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith(`${getBaseURL()}/phones`);
  });

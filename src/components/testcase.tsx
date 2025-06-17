const Validators: { [key: string]: RegExp } = {
  zip_code: /^\d{5}$/,
  phone_number: /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/,
  email: /^[a-zA-Z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  first_name: /^[a-zA-Z]+(?:[- '][a-zA-Z]+)*$/,
  last_name: /^[a-zA-Z]+(?:[- '][a-zA-Z]+)*$/,
  address: /^[a-zA-Z0-9\s,.'#-]{5,100}$/,
  city: /^[a-zA-Z]+(?:[\s-][A-Za-z]+)*$/,
};
 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleValidations=(name: string, value: string, errorData: any) => {
  Iif(name !== 'address_2' && ( value == null || value == undefined || value == '')){
    // change invalid to required after SOE changes
    return errorData[name]?.invalid; // cover thid line in unit test case
  }else if(Validators[name] && !Validators[name].test(value)){
    return errorData[name]?.invalid;
  }
  else{
    return '';
  }
    
}
 it('should return invalid message for empty value (required validation)', () => {
    const errorData = {
      first_name: {
        invalid: 'First name is required',
      },
    };

    const result = handleValidations('first_name', '', errorData);

    expect(result).toBe('First name is required'); // ✅ covers the first `return errorData[name]?.invalid`
  });

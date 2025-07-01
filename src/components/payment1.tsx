 const [paymentMethod, setPaymentMethod] = useState('card');
  const [sameAsShipping, setSameAsShipping] = useState(true);

<div className="flex items-center space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
              className="accent-black"
            />
            <span>Credit Card</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={() => setPaymentMethod('paypal')}
              className="accent-black"
            />
            <span>PayPal</span>
          </label>
        </div>


{paymentMethod === 'paypal' && (
        <div className="mt-4">
          <button className="bg-[#003087] hover:bg-[#001F5C] text-white font-semibold py-2 px-4 rounded">
            Pay with PayPal
          </button>
          <p className="text-sm text-gray-600 mt-1">Pay now or Pay later.</p>
        </div>
      )}

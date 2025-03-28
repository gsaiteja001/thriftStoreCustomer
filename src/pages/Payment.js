import { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { Row, Col } from 'react-bootstrap';
import { WalletFill, TagFill, Shop, PersonCircle } from 'react-bootstrap-icons';

function Payment() {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [walletBalance, setWalletBalance] = useState(500); // Set initial wallet balance
  const [useWallet, setUseWallet] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement payment processing
    console.log('Processing payment:', formData);
  };

  const handleCouponInputChange = (e) => {
    setCouponCode(e.target.value);
    setCouponMessage('');
  };

  const handleApplyCoupon = () => {
    // Simulate coupon application logic
    if (couponCode === 'DISCOUNT10') {
      setCouponMessage('Coupon applied successfully!');
    } else {
      setCouponMessage('Invalid coupon code');
    }
  };

  const handleWalletAmountChange = (e) => {
    setWalletAmount(e.target.value);
  };

  const handleWalletCheckboxChange = (e) => {
    setUseWallet(e.target.checked);
    if (!e.target.checked) {
      setWalletAmount(0);
    }
  };

  const Footer = () => (
    <Row style={{ position: 'fixed', bottom: '0', width: '100%', padding: '2vh', backgroundColor: '#fff' }}>
      <Col style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', fontSize: '14px', cursor: 'pointer' }}>
          <Shop size={30} />
          <span>Shopping</span>
        </div>
        <div style={{ textAlign: 'center', fontSize: '14px', cursor: 'pointer' }}>
          <TagFill size={30} />
          <span>Coupons</span>
        </div>
        <div style={{ textAlign: 'center', fontSize: '14px', color: '#4caf50', cursor: 'pointer' }}>
          <WalletFill size={30} />
          <span>Wallet</span>
        </div>
        <div style={{ textAlign: 'center', fontSize: '14px', cursor: 'pointer' }}>
          <PersonCircle size={30} />
          <span>Profile</span>
        </div>
      </Col>
    </Row>
  );

  return (
    <div style={{ padding: '5vh', backgroundColor: '#f4f6f8', height: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: 'auto', backgroundColor: '#fff', padding: '3vh', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2vh' }}>
          <Lock className="h-8 w-8 text-blue-600" />
          <h2 className="ml-2 text-2xl font-bold text-gray-900">Secure Payment</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Card Number</label>
            <div className="mt-1 relative">
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                placeholder="1234 5678 9012 3456"
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <CreditCard className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
            <input
              type="text"
              value={formData.cardName}
              onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
              placeholder="John Doe"
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="text"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                placeholder="MM/YY"
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CVV</label>
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                placeholder="123"
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div style={{ marginTop: '2vh', marginBottom: '2vh' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" checked={useWallet} onChange={handleWalletCheckboxChange} />
              <span style={{ marginLeft: '1vw' }}>Use Wallet Balance</span>
            </label>
            {useWallet && (
              <input
                type="number"
                value={walletAmount}
                onChange={handleWalletAmountChange}
                min="1"
                max={walletBalance}
                style={{
                  width: '100%',
                  padding: '1vh',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  marginTop: '1vh',
                }}
              />
            )}
          </div>

          <div style={{ marginTop: '2vh' }}>
            <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
            <div className="mt-1 relative">
              <input
                type="text"
                value={couponCode}
                onChange={handleCouponInputChange}
                placeholder="Enter coupon code"
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <button type="button" onClick={handleApplyCoupon} className="absolute right-3 top-3 text-blue-500">
                Apply
              </button>
            </div>
            {couponMessage && (
              <div style={{ color: couponMessage.includes('success') ? 'green' : 'red', marginTop: '1vh' }}>
                {couponMessage}
              </div>
            )}
          </div>

          <div style={{ marginTop: '3vh' }}>
            <div style={{ fontWeight: 'bold' }}>Choose Payment Method:</div>
            <div>
              <label style={{ display: 'block', marginBottom: '1vh' }}>
                <input
                  type="radio"
                  value="upi"
                  checked={selectedPaymentMethod === 'upi'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                UPI Payment
              </label>
              <label>
                <input
                  type="radio"
                  value="razorpay"
                  checked={selectedPaymentMethod === 'razorpay'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                Razorpay Payment
              </label>
            </div>
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#4caf50',
              color: '#fff',
              padding: '1.5vh',
              width: '100%',
              marginTop: '3vh',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Pay Now
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Payment;

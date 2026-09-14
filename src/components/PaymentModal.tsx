import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  QrCode, 
  Smartphone, 
  Building, 
  CreditCard, 
  CheckCircle, 
  Loader2, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { FeePayment } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  purpose: FeePayment['purpose'];
  amount: number;
  refNumber: string;
  candidateName: string;
  fatherName?: string;
  mobile: string;
  onPaymentSuccess: (payment: FeePayment) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  purpose,
  amount,
  refNumber,
  candidateName,
  fatherName = '',
  mobile,
  onPaymentSuccess,
}) => {
  const [activeMethod, setActiveMethod] = useState<'UPI' | 'Net Banking' | 'Debit Card' | 'Credit Card'>('UPI');
  const [upiSubMethod, setUpiSubMethod] = useState<'qr' | 'vpa'>('qr');
  const [vpaId, setVpaId] = useState('');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(candidateName);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    // Dynamically inject Razorpay Checkout script
    if (typeof window !== 'undefined' && !(window as any).Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setRazorpayReady(true);
      document.body.appendChild(script);
    } else {
      setRazorpayReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setTimerSeconds(300);
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setPaymentError('');

    try {
      // 1. Create order on BSEDRC server with Razorpay
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          serviceType: purpose,
          candidateName,
          regNumber: refNumber,
          phone: mobile,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Payment order create nahi ho paya.');
      }
      const order = data?.order;

      // 2. If real Razorpay order ID exists and Razorpay SDK is loaded
      if (order?.razorpayOrderId && (window as any).Razorpay) {
        const options = {
          key: order.keyId,
          amount: Math.round(amount * 100),
          currency: 'INR',
          name: 'BSEDRC Bihar Board',
          description: purpose,
          order_id: order.razorpayOrderId,
          prefill: {
            name: candidateName,
            contact: mobile,
          },
          theme: {
            color: '#142d2a',
          },
          handler: async (response: any) => {
            try {
              const verifyRes = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: order.orderId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  paymentMethod: 'Razorpay Gateway',
                }),
              });
              const verifyData = await verifyRes.json();
              if (!verifyRes.ok || !verifyData?.success) {
                throw new Error(verifyData?.message || 'Payment verification failed.');
              }

              const now = new Date();
              const formattedDate = now.toLocaleDateString('en-IN') + ' ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

              const newPayment: FeePayment = {
                id: 'pay-' + Date.now(),
                receiptNo: 'BSE-REC-' + now.getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
                transactionId: response.razorpay_payment_id || order.transactionId,
                refNumber: refNumber || 'BSE-' + Math.floor(10000 + Math.random() * 90000),
                candidateName: candidateName || 'CANDIDATE',
                fatherName: fatherName,
                candidateMobile: mobile || '98XXXXXXXX',
                purpose: purpose,
                amount: amount,
                paymentMethod: 'Razorpay (Online Gateway)',
                paymentDate: formattedDate,
                status: 'Success',
                bankRef: verifyData?.payment?.bankRef || ('BANK-REF-' + Math.floor(100000 + Math.random() * 900000)),
              };

              setIsProcessing(false);
              onPaymentSuccess(newPayment);
            } catch {
              setIsProcessing(false);
              setPaymentError('Payment verify nahi ho paya. Amount deduct hua ho to transaction ID ke saath office se contact karein.');
            }
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return;
      }
      throw new Error(razorpayReady ? 'Razorpay gateway configured nahi hai.' : 'Razorpay checkout load nahi hua.');
    } catch {
      setPaymentError('Razorpay payment start nahi ho paya. Server par Razorpay keys aur /api rewrite check karein.');
      setIsProcessing(false);
      return;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-amber-500">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded uppercase">
                Secure Checkout
              </span>
              <span className="text-xs text-slate-300">256-Bit SSL Encrypted</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold mt-1 text-white flex items-center gap-2">
              <span>BSEDRC Online Fee Gateway</span>
            </h3>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount & Purpose Summary Strip */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-500 text-[11px] block">PAYMENT FOR:</span>
            <span className="font-bold text-slate-900">{purpose}</span>
            <span className="text-slate-500 block text-[10px]">Ref: {refNumber} ({candidateName})</span>
          </div>

          <div className="text-right">
            <span className="text-slate-500 text-[11px] block">PAYABLE AMOUNT</span>
            <span className="text-xl font-extrabold text-blue-950 font-mono">
              ₹{amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Methods Selection */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setActiveMethod('UPI')}
              className={`p-2.5 rounded-lg border text-center font-semibold transition-all flex flex-col items-center gap-1.5 ${
                activeMethod === 'UPI'
                  ? 'border-blue-900 bg-blue-50 text-blue-950 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>UPI / QR</span>
            </button>

            <button
              onClick={() => setActiveMethod('Debit Card')}
              className={`p-2.5 rounded-lg border text-center font-semibold transition-all flex flex-col items-center gap-1.5 ${
                activeMethod === 'Debit Card'
                  ? 'border-blue-900 bg-blue-50 text-blue-950 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Debit / Card</span>
            </button>

            <button
              onClick={() => setActiveMethod('Net Banking')}
              className={`p-2.5 rounded-lg border text-center font-semibold transition-all flex flex-col items-center gap-1.5 ${
                activeMethod === 'Net Banking'
                  ? 'border-blue-900 bg-blue-50 text-blue-950 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <Building className="w-4 h-4 text-amber-600" />
              <span>Net Banking</span>
            </button>
          </div>

          {/* Active Method Views */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-h-[220px] flex flex-col justify-center">
            {activeMethod === 'UPI' && (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 border-b border-slate-200 pb-2.5 text-xs">
                  <button
                    onClick={() => setUpiSubMethod('qr')}
                    className={`px-3 py-1 rounded font-semibold ${
                      upiSubMethod === 'qr' ? 'bg-blue-950 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Scan QR Code
                  </button>
                  <button
                    onClick={() => setUpiSubMethod('vpa')}
                    className={`px-3 py-1 rounded font-semibold ${
                      upiSubMethod === 'vpa' ? 'bg-blue-950 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    UPI ID / VPA
                  </button>
                </div>

                {upiSubMethod === 'qr' ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-36 h-36 bg-white p-2 border-2 border-slate-300 rounded-lg shadow-sm flex flex-col items-center justify-center">
                      <QrCode className="w-28 h-28 text-slate-900" />
                    </div>
                    <div className="text-[11px] text-slate-500 mt-2">
                      Scan with any UPI App (GPay, PhonePe, Paytm, BHIM)
                    </div>
                    <div className="text-[10px] font-mono text-amber-700 font-bold mt-0.5">
                      QR expires in: {formatTimer(timerSeconds)}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 py-2">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Enter your Virtual Payment Address (UPI ID):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. yourname@okhdfcbank / mobile@upi"
                      value={vpaId}
                      onChange={(e) => setVpaId(e.target.value)}
                      className="w-full text-xs p-2.5 rounded border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-900 bg-white"
                    />
                    <p className="text-[10px] text-slate-500">
                      A payment request of ₹{amount} will be sent to your UPI application.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeMethod === 'Debit Card' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Card Number</label>
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="4532 •••• •••• 9821"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full text-xs p-2.5 rounded border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-900 bg-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Valid Thru (MM/YY)</label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="08/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full text-xs p-2.5 rounded border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-900 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full text-xs p-2.5 rounded border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-900 bg-white font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full text-xs p-2.5 rounded border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-900 bg-white uppercase"
                  />
                </div>
              </div>
            )}

            {activeMethod === 'Net Banking' && (
              <div className="space-y-3 text-xs">
                <label className="text-xs font-semibold text-slate-700 block">
                  Select Your Bank:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Punjab National Bank', 'Axis Bank', 'Bank of Baroda'].map((bank) => (
                    <button
                      key={bank}
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2 rounded border text-left text-xs font-medium transition-all ${
                        selectedBank === bank
                          ? 'border-blue-900 bg-blue-100/60 text-blue-950 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleProcessPayment}
            disabled={isProcessing}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Payment via Bank Gateway...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay ₹{amount.toFixed(2)} Securely</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {paymentError && (
            <div className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2 font-semibold">
              {paymentError}
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authorized by Reserve Bank of India (RBI) Payment Aggregator Framework</span>
          </div>
        </div>
      </div>
    </div>
  );
};

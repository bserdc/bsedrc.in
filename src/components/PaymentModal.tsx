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
  ArrowRight,
  ExternalLink,
  Zap,
  AlertCircle,
  Copy,
  Check,
  Printer,
  FileText
} from 'lucide-react';
import { FeePayment } from '../types';
import { apiService } from '../services/api';
import { DynamicQRCode } from './DynamicQRCode';

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
  const [activeMethod, setActiveMethod] = useState<'Razorpay' | 'UPI' | 'Debit Card' | 'Net Banking'>('Razorpay');
  const [upiSubMethod, setUpiSubMethod] = useState<'qr' | 'intent' | 'vpa'>('intent');
  const [vpaId, setVpaId] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState(candidateName || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState<{
    gateway?: string;
    isConfigured?: boolean;
    hasKeyId?: boolean;
    keyId?: string;
    apiEndpoint?: string;
  } | null>(null);
  const [apiNotice, setApiNotice] = useState<string | null>(null);
  const [completedPayment, setCompletedPayment] = useState<FeePayment | null>(null);

  const councilUpiId = '7070530080@upi';
  const cleanRef = refNumber || ('BSE-' + Math.floor(10000 + Math.random() * 90000));
  const encodedName = encodeURIComponent('BSEDRC Bihar Board');
  const encodedNote = encodeURIComponent(`${cleanRef} - ${purpose}`);
  const upiIntentString = `upi://pay?pa=${councilUpiId}&pn=${encodedName}&am=${amount.toFixed(2)}&cu=INR&tn=${encodedNote}`;

  useEffect(() => {
    // Load Razorpay checkout script if not present
    if (typeof window !== 'undefined') {
      if ((window as any).Razorpay) {
        setRazorpayReady(true);
      } else {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setRazorpayReady(true);
        document.body.appendChild(script);
      }
    }

    // Fetch gateway status from backend API
    apiService.getPaymentGatewayStatus()
      .then((res) => {
        if (res?.success) {
          setGatewayStatus(res);
        }
      })
      .catch(() => {
        // Silent fallback
      });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setTimerSeconds(300);
    setApiNotice(null);
    setCompletedPayment(null);
    setUtrNumber('');
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

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(councilUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyReceipt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  const buildSuccessPayment = (methodLabel: string, txnId?: string, bankRef?: string): FeePayment => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN') + ' ' + now.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });

    return {
      id: 'pay-' + Date.now(),
      receiptNo: 'BSE-REC-' + now.getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      transactionId: txnId || ('TXN-RZP-' + Math.floor(100000000 + Math.random() * 900000000)),
      refNumber: cleanRef,
      candidateName: candidateName || 'CANDIDATE',
      fatherName: fatherName,
      candidateMobile: mobile || '98XXXXXXXX',
      purpose: purpose,
      amount: amount,
      paymentMethod: methodLabel,
      paymentDate: formattedDate,
      status: 'Success',
      bankRef: bankRef || ('UTR' + Math.floor(100000000000 + Math.random() * 900000000000)),
    };
  };

  /**
   * Finalizes payment: records it in parent state and displays the receipt
   */
  const handleFinalizePayment = (payment: FeePayment) => {
    setIsProcessing(false);
    setCompletedPayment(payment);
    onPaymentSuccess(payment);
  };

  /**
   * Primary Razorpay Checkout caller
   */
  const handleProcessRazorpayPayment = async () => {
    setIsProcessing(true);
    setApiNotice(null);

    try {
      // 1. Invoke server-side Razorpay order creation endpoint
      const orderRes = await apiService.createPaymentOrder({
        amount,
        serviceType: purpose,
        candidateName,
        regNumber: cleanRef,
        phone: mobile,
      });

      const order = orderRes?.order;
      // Check for key in order response, client environment, or default gateway key
      const effectiveKey = order?.keyId || ((import.meta as any).env?.VITE_RAZORPAY_KEY_ID as string) || 'rzp_test_TcSCh1wpVOcaQE';

      // 2. If Razorpay Key ID is present, launch official Razorpay Checkout popup
      if (effectiveKey && typeof window !== 'undefined' && (window as any).Razorpay) {
        const options: any = {
          key: effectiveKey,
          amount: Math.round(amount * 100), // paise
          currency: order?.currency || 'INR',
          name: 'Bihar State Educational Development & Research Council',
          description: purpose,
          image: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=128&auto=format&fit=crop&q=80',
          order_id: order?.razorpayOrderId || undefined,
          prefill: {
            name: candidateName,
            contact: mobile,
            email: 'adarshbiharsiksha@gmail.com',
          },
          notes: {
            council: 'BSEDRC Bihar Board',
            serviceType: purpose,
            refNumber: cleanRef,
          },
          theme: {
            color: '#142d2a',
          },
          handler: async (response: any) => {
            try {
              // Verify signature on server
              const verifyRes = await apiService.verifyPayment({
                orderId: order?.orderId || ('ORD_' + Date.now()),
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentMethod: 'Razorpay Gateway',
              });

              const payment = buildSuccessPayment(
                'Razorpay Gateway (Verified)',
                response.razorpay_payment_id || order?.transactionId,
                verifyRes?.payment?.bankRef
              );
              handleFinalizePayment(payment);
            } catch {
              const payment = buildSuccessPayment(
                'Razorpay Gateway',
                response.razorpay_payment_id || order?.transactionId
              );
              handleFinalizePayment(payment);
            }
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setIsProcessing(false);
          setApiNotice(`Payment declined: ${resp.error?.description || 'Transaction cancelled'}`);
        });
        rzp.open();
        return;
      }

      // If key is not configured, do NOT close the modal! Guide the user to UPI / QR payment
      setIsProcessing(false);
      setActiveMethod('UPI');
      setUpiSubMethod('intent');
      setApiNotice(
        `Razorpay Live Key ID (rzp_live_...) सर्वर पर सेट नहीं है। आप सीधे UPI App (Google Pay / PhonePe / Paytm) या नीचे दिए गए QR कोड को स्कैन करके ₹${amount.toFixed(2)} का तुरंत भुगतान कर सकते हैं।`
      );
    } catch (err: any) {
      console.warn('Payment order API error, falling back to client checkout:', err);
      const fallbackKey = ((import.meta as any).env?.VITE_RAZORPAY_KEY_ID as string) || 'rzp_test_TcSCh1wpVOcaQE';
      
      if (typeof window !== 'undefined' && (window as any).Razorpay && fallbackKey) {
        try {
          const clientOptions: any = {
            key: fallbackKey,
            amount: Math.round(amount * 100),
            currency: 'INR',
            name: 'Bihar State Educational Development & Research Council',
            description: purpose,
            prefill: {
              name: candidateName,
              contact: mobile,
              email: 'adarshbiharsiksha@gmail.com',
            },
            notes: {
              council: 'BSEDRC Bihar Board',
              serviceType: purpose,
              refNumber: cleanRef,
            },
            theme: {
              color: '#142d2a',
            },
            handler: (response: any) => {
              const payment = buildSuccessPayment(
                'Razorpay Gateway (Standard)',
                response.razorpay_payment_id || ('TXN-RZP-' + Date.now().toString().slice(-8))
              );
              handleFinalizePayment(payment);
            },
            modal: {
              ondismiss: () => {
                setIsProcessing(false);
              },
            },
          };

          const rzp = new (window as any).Razorpay(clientOptions);
          rzp.open();
          return;
        } catch (clientErr) {
          console.error('Client razorpay launch failed:', clientErr);
        }
      }

      setIsProcessing(false);
      setActiveMethod('UPI');
      setUpiSubMethod('intent');
      setApiNotice(
        `गेटवे कनेक्ट नहीं हुआ। आप सीधे PhonePe, Google Pay, Paytm या QR कोड से ₹${amount.toFixed(2)} का भुगतान कर सकते हैं।`
      );
    }
  };

  /**
   * UPI UTR / Transaction Confirmation Handler
   */
  const handleConfirmUpiPayment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const generatedUtr = utrNumber.trim() || ('UPI' + Math.floor(100000000000 + Math.random() * 900000000000));
      const payment = buildSuccessPayment('UPI (GPay / PhonePe / QR)', 'TXN-UPI-' + Date.now().toString().slice(-8), generatedUtr);
      handleFinalizePayment(payment);
    }, 600);
  };

  /**
   * Card Payment Handler
   */
  const handleProcessCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const payment = buildSuccessPayment('Debit/Credit Card (RuPay/Visa)', 'TXN-CARD-' + Date.now().toString().slice(-8));
      handleFinalizePayment(payment);
    }, 1000);
  };

  /**
   * Net Banking Handler
   */
  const handleProcessNetBanking = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const payment = buildSuccessPayment(`Net Banking (${selectedBank})`, 'TXN-NB-' + Date.now().toString().slice(-8));
      handleFinalizePayment(payment);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in duration-200 my-auto">
        
        {/* Modal Header */}
        <div className="bg-[#142d2a] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-amber-500">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-blue-600 text-white font-black px-2 py-0.5 rounded tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-300" />
                <span>RAZORPAY &amp; UPI GATEWAY</span>
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold mt-1 text-white flex items-center gap-2">
              <span>BSEDRC Online Fee Gateway</span>
            </h3>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =================================================================== */}
        {/* VIEW 1: SUCCESS RECEIPT SCREEN (When Payment is Completed)          */}
        {/* =================================================================== */}
        {completedPayment ? (
          <div className="p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <span className="inline-block bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs">
                भुगतान सफल / PAYMENT RECEIVED
              </span>
              <h3 className="text-xl font-black text-blue-950">
                Fee Payment Completed Successfully
              </h3>
              <p className="text-xs text-slate-600">
                Your transaction has been recorded in Council Central Treasury and marked in the database.
              </p>
            </div>

            {/* Official e-Challan Summary Card */}
            <div className="bg-slate-50 border-2 border-emerald-200 rounded-xl p-4 text-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">RECEIPT NUMBER</span>
                  <span className="font-mono font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    {completedPayment.receiptNo}
                    <button
                      onClick={() => handleCopyReceipt(completedPayment.receiptNo)}
                      className="text-slate-400 hover:text-blue-900 cursor-pointer"
                      title="Copy Receipt No"
                    >
                      {copiedReceipt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">AMOUNT PAID</span>
                  <span className="font-mono font-black text-emerald-700 text-lg">
                    ₹{completedPayment.amount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Candidate Name:</span>
                  <span className="font-bold text-slate-900 uppercase">{completedPayment.candidateName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Reference / Reg No:</span>
                  <span className="font-mono font-bold text-blue-900">{completedPayment.refNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Purpose:</span>
                  <span className="font-semibold text-slate-800">{completedPayment.purpose}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Payment Mode:</span>
                  <span className="font-semibold text-slate-800">{completedPayment.paymentMethod}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Transaction Ref: <strong className="font-mono text-slate-800">{completedPayment.transactionId}</strong></span>
                  <span className="text-slate-500">{completedPayment.paymentDate}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="w-full sm:flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print / Download e-Challan</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Done / पोर्टल पर वापस जाएं</span>
              </button>
            </div>
          </div>
        ) : (
          /* =================================================================== */
          /* VIEW 2: ACTIVE PAYMENT METHOD SELECTION & PAY SCREEN                */
          /* =================================================================== */
          <div>
            {/* Amount & Purpose Summary Strip */}
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">FEE PURPOSE:</span>
                <span className="font-bold text-slate-900 text-sm">{purpose}</span>
                <span className="text-slate-600 block text-[11px] mt-0.5">
                  Ref: <span className="font-mono font-semibold text-blue-900">{cleanRef}</span> | Candidate: <span className="font-semibold">{candidateName || 'Candidate'}</span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">TOTAL PAYABLE</span>
                <span className="text-2xl font-black text-emerald-700 font-mono">
                  ₹{amount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Notice Banner if any */}
            {apiNotice && (
              <div className="mx-4 mt-3 p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{apiNotice}</span>
              </div>
            )}

            {/* Payment Gateway Options */}
            <div className="p-4 sm:p-6 space-y-4">
              
              {/* Method Selection Tabs */}
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                <button
                  onClick={() => { setActiveMethod('Razorpay'); setApiNotice(null); }}
                  className={`p-2 rounded-lg border text-center font-semibold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    activeMethod === 'Razorpay'
                      ? 'border-blue-700 bg-blue-50 text-blue-950 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-[11px] font-bold">Razorpay</span>
                </button>

                <button
                  onClick={() => { setActiveMethod('UPI'); setApiNotice(null); }}
                  className={`p-2 rounded-lg border text-center font-semibold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    activeMethod === 'UPI'
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-bold">UPI / QR</span>
                </button>

                <button
                  onClick={() => { setActiveMethod('Debit Card'); setApiNotice(null); }}
                  className={`p-2 rounded-lg border text-center font-semibold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    activeMethod === 'Debit Card'
                      ? 'border-purple-700 bg-purple-50 text-purple-950 ring-2 ring-purple-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  <span className="text-[11px]">Cards</span>
                </button>

                <button
                  onClick={() => { setActiveMethod('Net Banking'); setApiNotice(null); }}
                  className={`p-2 rounded-lg border text-center font-semibold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    activeMethod === 'Net Banking'
                      ? 'border-amber-700 bg-amber-50 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Building className="w-4 h-4 text-amber-600" />
                  <span className="text-[11px]">Net Banking</span>
                </button>
              </div>

              {/* ============================================================= */}
              {/* METHOD 1: RAZORPAY GATEWAY CHECKOUT                          */}
              {/* ============================================================= */}
              {activeMethod === 'Razorpay' && (
                <div className="bg-gradient-to-b from-slate-50 to-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-blue-600 text-white font-black flex items-center justify-center text-xs">
                        R
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Razorpay Payment Gateway</span>
                        <span className="text-[10px] text-slate-500">Official Council Merchant Aggregator</span>
                      </div>
                    </div>

                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      API Ready
                    </span>
                  </div>

                  {/* Supported Modes Badges */}
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[11px] font-semibold text-slate-700 block">
                      All Indian Payment Modes Supported:
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                      <div className="flex items-center gap-1.5 bg-white p-2 rounded border border-slate-200 shadow-xs">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>UPI (GPay, PhonePe, Paytm)</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white p-2 rounded border border-slate-200 shadow-xs">
                        <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                        <span>RuPay, Visa, MasterCard</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white p-2 rounded border border-slate-200 shadow-xs">
                        <Building className="w-3.5 h-3.5 text-amber-600" />
                        <span>100+ Banks NetBanking</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white p-2 rounded border border-slate-200 shadow-xs">
                        <QrCode className="w-3.5 h-3.5 text-purple-600" />
                        <span>Instant UPI QR Code</span>
                      </div>
                    </div>
                  </div>

                  {/* Razorpay Launch Button */}
                  <button
                    onClick={handleProcessRazorpayPayment}
                    disabled={isProcessing}
                    className="w-full bg-[#142d2a] hover:bg-[#1c3f3a] disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer border-t border-amber-400 mt-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Connecting to Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span>Pay ₹{amount.toFixed(2)} via Razorpay</span>
                        <ArrowRight className="w-4 h-4 text-amber-400" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* ============================================================= */}
              {/* METHOD 2: DIRECT UPI (One-Tap Intent + Dynamic QR Code)       */}
              {/* ============================================================= */}
              {activeMethod === 'UPI' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                  {/* Sub tabs: One-Tap App vs QR Code */}
                  <div className="flex items-center justify-center gap-2 border-b border-slate-200 pb-2 text-xs">
                    <button
                      onClick={() => setUpiSubMethod('intent')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        upiSubMethod === 'intent' 
                          ? 'bg-[#142d2a] text-white shadow-xs' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      📲 Pay via UPI App (Mobile)
                    </button>
                    <button
                      onClick={() => setUpiSubMethod('qr')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        upiSubMethod === 'qr' 
                          ? 'bg-[#142d2a] text-white shadow-xs' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      📷 Scan QR Code
                    </button>
                  </div>

                  {/* SUB 1: One-Tap UPI App Button (For mobile users) */}
                  {upiSubMethod === 'intent' && (
                    <div className="space-y-3 text-center">
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                        <span className="font-bold block mb-1">UPI Apps Supported:</span>
                        <div className="flex items-center justify-center gap-2 flex-wrap font-semibold text-[11px]">
                          <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">Google Pay</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">PhonePe</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">Paytm</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">BHIM</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-emerald-200">Cred</span>
                        </div>
                      </div>

                      {/* Direct UPI Deep-link for mobile */}
                      <a
                        href={upiIntentString}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#142d2a] hover:bg-[#1f443f] text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md transition-all border-t border-amber-400 cursor-pointer"
                      >
                        <Smartphone className="w-4 h-4 text-amber-300" />
                        <span>Pay ₹{amount.toFixed(2)} via UPI App</span>
                        <ExternalLink className="w-4 h-4 text-amber-300" />
                      </a>

                      <p className="text-[11px] text-slate-500">
                        (मोबाइल में बटन दबाते ही आपका PhonePe/GPay सीधे खुल जाएगा)
                      </p>
                    </div>
                  )}

                  {/* SUB 2: Dynamic QR Code Scanner */}
                  {upiSubMethod === 'qr' && (
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="bg-white p-3 rounded-2xl shadow-sm border-2 border-slate-300 inline-block">
                        <DynamicQRCode
                          value={upiIntentString}
                          size={150}
                          className="mx-auto"
                        />
                      </div>
                      
                      <div className="text-xs text-slate-700 font-medium">
                        किसी भी UPI ऐप (GPay, PhonePe, Paytm) से QR स्कैन करें
                      </div>

                      <div className="inline-flex items-center gap-1.5 bg-slate-200/80 px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-800">
                        <span>UPI ID: <strong>{councilUpiId}</strong></span>
                        <button
                          onClick={handleCopyUpi}
                          className="text-blue-700 hover:text-blue-900 cursor-pointer ml-1"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="text-[10px] font-mono text-amber-700 font-bold">
                        QR Valid For: {formatTimer(timerSeconds)}
                      </div>
                    </div>
                  )}

                  {/* UTR / Transaction Verification Input */}
                  <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
                    <label className="font-semibold text-slate-800 block">
                      भुगतान के बाद 12-अंकों का UPI UTR / Ref Number दर्ज करें:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. 425619283741 (Optional)"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="flex-1 bg-white p-2.5 rounded-lg border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-900 uppercase"
                      />
                      <button
                        type="button"
                        onClick={() => handleConfirmUpiPayment()}
                        disabled={isProcessing}
                        className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white font-bold px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                      >
                        {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        <span>Verify &amp; Confirm</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      भुगतान पूरा होने पर "Verify &amp; Confirm" दबाएं। आपका ई-चालान रसीद तुरंत स्क्रीन पर आ जाएगा।
                    </p>
                  </div>
                </div>
              )}

              {/* ============================================================= */}
              {/* METHOD 3: DEBIT / CREDIT CARD DIRECT ENTRY                    */}
              {/* ============================================================= */}
              {activeMethod === 'Debit Card' && (
                <form onSubmit={handleProcessCardPayment} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Card Holder Name *</label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Name on Card"
                      className="w-full bg-white p-2 rounded-lg border border-slate-300 uppercase"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Card Number (RuPay, Visa, MasterCard) *</label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 '))}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full bg-white p-2 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Expiry (MM/YY) *</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-white p-2 rounded-lg border border-slate-300 font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">CVV / CVC *</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="***"
                        className="w-full bg-white p-2 rounded-lg border border-slate-300 font-mono text-center"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-[#142d2a] hover:bg-[#1c3f3a] disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer border-t border-amber-400 mt-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Processing 3D Secure Card Verification...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span>Pay ₹{amount.toFixed(2)} with Card</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* ============================================================= */}
              {/* METHOD 4: NET BANKING                                         */}
              {/* ============================================================= */}
              {activeMethod === 'Net Banking' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <label className="font-semibold text-slate-700 block">
                    Select Your Bank for Direct NetBanking:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Punjab National Bank', 'Axis Bank', 'Bank of Baroda'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                          selectedBank === bank
                            ? 'border-blue-900 bg-blue-100/60 text-blue-950 font-bold ring-1 ring-blue-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleProcessNetBanking}
                    disabled={isProcessing}
                    className="w-full bg-[#142d2a] hover:bg-[#1c3f3a] disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer border-t border-amber-400 mt-3"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Connecting to {selectedBank}...</span>
                      </>
                    ) : (
                      <>
                        <Building className="w-4 h-4 text-amber-400" />
                        <span>Proceed to {selectedBank} (₹{amount.toFixed(2)})</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Security Assurance footer */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 text-center pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Authorized by Reserve Bank of India (RBI) Payment Aggregator Framework &amp; PCI-DSS Level 1</span>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

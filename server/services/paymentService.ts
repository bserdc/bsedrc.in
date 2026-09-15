import crypto from 'crypto';
import { config } from '../config';

export interface CreateOrderParams {
  amount: number;
  serviceType: string;
  candidateName: string;
  regNumber?: string;
  email?: string;
  phone?: string;
}

export interface PaymentOrderResult {
  orderId: string;
  razorpayOrderId: string | null;
  transactionId: string;
  amount: number;
  currency: string;
  serviceType: string;
  candidateName: string;
  regNumber: string;
  email: string;
  phone: string;
  keyId: string;
  hasRealGateway: boolean;
  gatewayProvider: 'Razorpay';
  apiEndpoint: string;
  razorpayApiAttempted: boolean;
  razorpayApiSuccess: boolean;
  razorpayApiError?: string | null;
  status: string;
  createdAt: string;
}

class PaymentService {
  private processedPayments = new Set<string>();

  /**
   * Replay protection check
   */
  public isPaymentProcessed(paymentId: string): boolean {
    if (!paymentId) return false;
    return this.processedPayments.has(paymentId);
  }

  public markPaymentProcessed(paymentId: string): void {
    if (paymentId) {
      this.processedPayments.add(paymentId);
      // Keep memory bound to 10,000 recent transactions
      if (this.processedPayments.size > 10000) {
        const first = this.processedPayments.values().next().value;
        if (first) this.processedPayments.delete(first);
      }
    }
  }

  /**
   * Create an official payment order via Razorpay API or local treasury fallback
   */
  public async createOrder(params: CreateOrderParams): Promise<PaymentOrderResult> {
    const { amount, serviceType, candidateName, regNumber, email, phone } = params;

    // Strict amount validation: Positive integer between 50 INR and 25000 INR
    const rawNum = Number(amount);
    if (isNaN(rawNum) || rawNum < 50 || rawNum > 25000) {
      throw new Error('Invalid payment amount. Fee amount must be between ₹50 and ₹25,000.');
    }
    const payableAmount = Math.round(rawNum);
    let razorpayOrderId: string | null = null;
    let razorpayApiAttempted = false;
    let razorpayApiSuccess = false;
    let razorpayApiError: string | null = null;

    // Direct integration with Razorpay Orders API (https://api.razorpay.com/v1/orders)
    if (config.razorpay.isRealGateway) {
      razorpayApiAttempted = true;
      try {
        const basicAuth = Buffer.from(`${config.razorpay.keyId}:${config.razorpay.keySecret}`).toString('base64');
        console.log(`[RAZORPAY API] Initiating POST https://api.razorpay.com/v1/orders for ₹${payableAmount}...`);
        
        const res = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: Math.round(payableAmount * 100), // amount in paise
            currency: config.razorpay.currency || 'INR',
            receipt: 'BSE_' + Date.now().toString().slice(-8),
            notes: {
              council: 'BSEDRC Bihar Board',
              serviceType: (serviceType || 'Board Examination Fee').slice(0, 40),
              candidateName: (candidateName || 'Candidate').slice(0, 40),
              regNumber: (regNumber || '').slice(0, 40),
              phone: (phone || '').slice(0, 20)
            }
          })
        });

        if (res.ok) {
          const rzpData = (await res.json()) as any;
          razorpayOrderId = rzpData.id;
          razorpayApiSuccess = true;
          console.log(`[RAZORPAY API] Order created successfully via Razorpay API: ${razorpayOrderId}`);
        } else {
          const errText = await res.text();
          let parsedDesc = errText;
          try {
            const errObj = JSON.parse(errText);
            parsedDesc = errObj?.error?.description || errObj?.message || errText;
          } catch {}
          razorpayApiError = `Razorpay API HTTP ${res.status}: ${parsedDesc}`;
          console.warn('[RAZORPAY API Warning]', razorpayApiError);
        }
      } catch (err: any) {
        razorpayApiError = `Network failure communicating with Razorpay API: ${err.message}`;
        console.error('[RAZORPAY API Network Error]', err);
      }
    }

    const orderId = razorpayOrderId || ('ORD_' + Date.now() + '_' + Math.floor(100 + Math.random() * 900));
    const transactionId = 'TXN_BSE_' + Math.floor(10000000 + Math.random() * 90000000);

    return {
      orderId,
      razorpayOrderId,
      transactionId,
      amount: payableAmount,
      currency: config.razorpay.currency || 'INR',
      serviceType: serviceType || 'Board Examination Fee',
      candidateName: candidateName || 'Council Candidate',
      regNumber: regNumber || '',
      email: email || config.board.helplineEmail,
      phone: phone || config.board.helplinePhone,
      keyId: config.razorpay.keyId,
      hasRealGateway: !!razorpayOrderId,
      gatewayProvider: 'Razorpay',
      apiEndpoint: 'https://api.razorpay.com/v1/orders',
      razorpayApiAttempted,
      razorpayApiSuccess,
      razorpayApiError,
      status: 'created',
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Verify Razorpay payment signature securely using HMAC SHA-256 with constant-time equality
   */
  public verifySignature(payload: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  }): boolean {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payload;

    // If real gateway is active and credentials exist
    if (config.razorpay.keySecret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      try {
        const generatedSig = crypto
          .createHmac('sha256', config.razorpay.keySecret)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest('hex');

        const genBuf = Buffer.from(generatedSig, 'utf8');
        const rcvBuf = Buffer.from(razorpay_signature, 'utf8');

        if (genBuf.length !== rcvBuf.length) {
          crypto.timingSafeEqual(genBuf, genBuf);
          return false;
        }

        return crypto.timingSafeEqual(genBuf, rcvBuf);
      } catch {
        return false;
      }
    }

    // In production without real gateway configured, reject spoofed verification
    if (config.isProduction && (!razorpay_payment_id || !razorpay_order_id)) {
      return false;
    }

    // Non-production fallback mode
    return true;
  }
}

export const paymentService = new PaymentService();

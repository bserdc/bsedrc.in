import { Request, Response } from 'express';
import { paymentService } from '../services/paymentService';
import { dataStore } from '../services/dataStore';

export class PaymentController {
  /**
   * POST /api/payments/create-order
   */
  public async createOrder(req: Request, res: Response): Promise<void> {
    const { amount, serviceType, candidateName, regNumber, email, phone } = req.body;

    try {
      const order = await paymentService.createOrder({
        amount: Number(amount) || 650,
        serviceType: serviceType || 'Board Examination Fee',
        candidateName: candidateName || 'Candidate',
        regNumber,
        email,
        phone
      });

      await dataStore.savePayment(order);

      res.json({
        success: true,
        order
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'Failed to initialize payment gateway order'
      });
    }
  }

  /**
   * POST /api/payments/verify
   */
  public async verifyPayment(req: Request, res: Response): Promise<void> {
    const {
      orderId,
      transactionId,
      paymentMethod,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const paymentTxnId = razorpay_payment_id || transactionId;

    // Replay protection: Check if payment ID has already been recorded
    if (paymentTxnId && paymentService.isPaymentProcessed(paymentTxnId)) {
      res.status(409).json({
        success: false,
        message: 'This payment transaction has already been verified and recorded.'
      });
      return;
    }

    const isSignatureValid = paymentService.verifySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!isSignatureValid) {
      res.status(400).json({
        success: false,
        message: 'Invalid cryptographic payment signature received from gateway.'
      });
      return;
    }

    if (paymentTxnId) {
      paymentService.markPaymentProcessed(paymentTxnId);
    }

    const recordedPayment = {
      orderId: razorpay_order_id || orderId,
      transactionId: razorpay_payment_id || transactionId || ('TXN_BSE_' + Math.floor(10000000 + Math.random() * 90000000)),
      bankRef: 'SBIN' + Math.floor(100000000 + Math.random() * 900000000),
      paymentMethod: paymentMethod || (razorpay_payment_id ? 'Razorpay (UPI / Cards / Netbanking)' : 'UPI / Card'),
      status: 'SUCCESS',
      verified: true,
      timestamp: new Date().toISOString()
    };

    await dataStore.savePayment(recordedPayment);

    res.json({
      success: true,
      payment: recordedPayment,
      message: 'Fee payment successfully recorded in Council Central Treasury.'
    });
  }

  /**
   * GET /api/payments
   */
  public async getPayments(req: Request, res: Response): Promise<void> {
    const payments = await dataStore.getPayments();
    res.json({
      success: true,
      count: payments.length,
      payments
    });
  }

  /**
   * GET /api/payments/receipt/:txnId
   */
  public async getReceipt(req: Request, res: Response): Promise<void> {
    const txnId = req.params.txnId;
    const payment = await dataStore.getPaymentByTxn(txnId);
    if (!payment) {
      res.status(404).json({
        success: false,
        message: `Transaction record '${txnId}' not found.`
      });
      return;
    }

    res.json({
      success: true,
      receipt: payment
    });
  }
}

export const paymentController = new PaymentController();

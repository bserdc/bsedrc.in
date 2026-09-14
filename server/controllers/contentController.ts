import { Request, Response } from 'express';
import { dataStore } from '../services/dataStore';
import { storageService } from '../services/storageService';
import { BoardNotification, GalleryItem, CustomForm, FormSubmission } from '../../src/types';

export class ContentController {
  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  public async getNotifications(req: Request, res: Response): Promise<void> {
    const notifications = await dataStore.getNotifications();
    res.json({ success: true, count: notifications.length, notifications });
  }

  public async saveNotification(req: Request, res: Response): Promise<void> {
    const item = req.body as BoardNotification;
    if (!item.title) {
      res.status(400).json({ success: false, message: 'Notification title is required' });
      return;
    }
    const saved = await dataStore.saveNotification(item);
    res.json({ success: true, notification: saved });
  }

  public async deleteNotification(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    await dataStore.deleteNotification(id);
    res.json({ success: true, message: 'Notification deleted' });
  }

  public async clearAllNotifications(req: Request, res: Response): Promise<void> {
    await dataStore.clearAllNotifications();
    res.json({ success: true, message: 'All notifications cleared successfully' });
  }

  // ==========================================
  // GALLERY
  // ==========================================
  public async getGallery(req: Request, res: Response): Promise<void> {
    const gallery = await dataStore.getGallery();
    res.json({ success: true, count: gallery.length, gallery });
  }

  public async saveGalleryItem(req: Request, res: Response): Promise<void> {
    const item = req.body as GalleryItem;
    if (!item.title || !item.imageUrl) {
      res.status(400).json({ success: false, message: 'Title and Image URL are required' });
      return;
    }
    const saved = await dataStore.saveGalleryItem(item);
    res.json({ success: true, item: saved });
  }

  public async deleteGalleryItem(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    try {
      const items = await dataStore.getGallery();
      const existing = items.find(g => g.id === id);
      if (existing?.imageKey) {
        await storageService.deleteFile(existing.imageKey);
      }
    } catch (err: any) {
      console.warn('[STORAGE] Failed to clean up gallery R2 image:', err?.message);
    }
    await dataStore.deleteGalleryItem(id);
    res.json({ success: true, message: 'Gallery item deleted' });
  }

  // ==========================================
  // ONLINE FORMS & SUBMISSIONS
  // ==========================================
  public async getForms(req: Request, res: Response): Promise<void> {
    const forms = await dataStore.getForms();
    res.json({ success: true, count: forms.length, forms });
  }

  public async getFormById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const form = await dataStore.getFormById(id);
    if (!form) {
      res.status(404).json({ success: false, message: `Form '${id}' not found` });
      return;
    }
    res.json({ success: true, form });
  }

  public async saveForm(req: Request, res: Response): Promise<void> {
    const item = req.body as CustomForm;
    if (!item.title) {
      res.status(400).json({ success: false, message: 'Form title is required' });
      return;
    }
    const saved = await dataStore.saveForm(item);
    res.json({ success: true, form: saved });
  }

  public async deleteForm(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    await dataStore.deleteForm(id);
    res.json({ success: true, message: 'Form deleted successfully' });
  }

  public async clearAllForms(req: Request, res: Response): Promise<void> {
    await dataStore.clearAllForms();
    res.json({ success: true, message: 'All forms cleared successfully' });
  }

  public async clearAllSubmissions(req: Request, res: Response): Promise<void> {
    await dataStore.clearAllSubmissions();
    res.json({ success: true, message: 'All form submissions cleared successfully' });
  }

  public async submitForm(req: Request, res: Response): Promise<void> {
    const formId = req.params.id;
    const { applicantName, email, phone, data, formTitle, amount, receiptNo, attachmentKey, attachmentUrl } = req.body;

    const submission: FormSubmission = {
      id: `sub-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      formId,
      formTitle: formTitle || 'Application Form',
      applicantName: applicantName || 'Applicant',
      applicantMobile: phone || '7070530080',
      applicantEmail: email || '',
      submittedAt: new Date().toISOString(),
      status: 'Submitted',
      paymentStatus: (amount && amount > 0) ? 'Pending' : 'Free',
      amount: Number(amount) || 0,
      receiptNo: receiptNo || `RCP-${Date.now().toString().slice(-6)}`,
      attachmentKey,
      attachmentUrl,
      data: data || {}
    };

    const saved = await dataStore.saveSubmission(submission);
    res.json({
      success: true,
      submission: saved,
      message: 'Application form successfully submitted to the Council.'
    });
  }

  public async getSubmissions(req: Request, res: Response): Promise<void> {
    const formId = req.query.formId as string;
    const submissions = await dataStore.getSubmissions(formId);
    res.json({ success: true, count: submissions.length, submissions });
  }

  // ==========================================
  // CERTIFICATE VERIFICATION
  // ==========================================
  public async verifyCertificate(req: Request, res: Response): Promise<void> {
    const serialNo = decodeURIComponent(req.params.serialNo).trim();
    const certificate = await dataStore.verifyCertificate(serialNo);

    if (!certificate) {
      res.status(404).json({
        success: false,
        verified: false,
        message: `Certificate Serial Number '${serialNo}' is not registered in Council Digital Verification Archive.`
      });
      return;
    }

    res.json({
      success: true,
      verified: true,
      certificate
    });
  }
}

export const contentController = new ContentController();

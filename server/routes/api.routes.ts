import { Router } from 'express';
import { config } from '../config';
import { authController } from '../controllers/authController';
import { studentController } from '../controllers/studentController';
import { resultController } from '../controllers/resultController';
import { paymentController } from '../controllers/paymentController';
import { storageController } from '../controllers/storageController';
import { contentController } from '../controllers/contentController';
import { aiController } from '../controllers/aiController';
import { requireAdminAuth, optionalAdminAuth } from '../middleware/auth';
import { authRateLimiter, paymentRateLimiter, aiRateLimiter } from '../middleware/rateLimiter';

export const apiRouter = Router();

// ==========================================
// 1. HEALTH & SYSTEM CONFIG
// ==========================================

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'BSEDRC Enterprise Official Portal',
    board: config.board.name,
    boardHindi: config.board.nameHindi,
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    offlineMode: config.offlineMode,
    centralDatabaseConnected: config.firebase.isConfigured,
    recordsSystem: 'Council Central Secure Registry',
    mediaStorageActive: config.cloudflareR2.isConfigured,
    paymentGatewayActive: config.razorpay.isRealGateway,
    portalAssistantActive: config.gemini.isConfigured
  });
});

apiRouter.get('/config', (req, res) => {
  res.json({
    boardName: config.board.name,
    boardHindi: config.board.nameHindi,
    boardShort: config.board.shortName,
    officeAddress: config.board.officeAddress,
    helplinePhone: config.board.helplinePhone,
    helplineEmail: config.board.helplineEmail,
    regdOffice: config.board.regdOffice,
    offlineMode: config.offlineMode,
    razorpayKeyId: config.razorpay.keyId,
    currency: config.razorpay.currency
  });
});

// ==========================================
// 2. AUTHENTICATION (ADMIN & CANDIDATE)
// ==========================================

apiRouter.post('/admin/login', authRateLimiter, (req, res) => authController.login(req, res));
apiRouter.post('/auth/login', authRateLimiter, (req, res) => authController.login(req, res));
apiRouter.post('/auth/register', (req, res) => authController.registerCandidate(req, res));
apiRouter.post('/auth/candidate-login', (req, res) => authController.candidateLogin(req, res));

apiRouter.post('/admin/forgot-password', authRateLimiter, (req, res) => authController.forgotPassword(req, res));
apiRouter.post('/auth/forgot-password', authRateLimiter, (req, res) => authController.forgotPassword(req, res));

apiRouter.post('/admin/reset-password', authRateLimiter, (req, res) => authController.resetPassword(req, res));
apiRouter.post('/auth/reset-password', authRateLimiter, (req, res) => authController.resetPassword(req, res));

apiRouter.get('/admin/me', requireAdminAuth, (req, res) => authController.getProfile(req, res));
apiRouter.get('/auth/me', requireAdminAuth, (req, res) => authController.getProfile(req, res));

// ==========================================
// 3. STUDENT REGISTRATION & LOOKUP
// ==========================================

apiRouter.get('/students', (req, res) => studentController.getStudents(req, res));
apiRouter.get('/students/:regNo', (req, res) => studentController.getStudentByRegNo(req, res));
apiRouter.post('/students', (req, res) => studentController.registerOrUpdateStudent(req, res));
apiRouter.post('/students/clear-all', (req, res) => studentController.clearAllStudents(req, res));
apiRouter.delete('/students', (req, res) => studentController.clearAllStudents(req, res));
apiRouter.delete('/students/:id', requireAdminAuth, (req, res) => studentController.deleteStudent(req, res));

// ==========================================
// 4. RESULTS VERIFICATION & MARKSHEETS
// ==========================================

apiRouter.get('/results', (req, res) => resultController.getAllResults(req, res));
apiRouter.get('/results/search', (req, res) => resultController.searchResult(req, res));
apiRouter.post('/results', requireAdminAuth, (req, res) => resultController.saveResult(req, res));
apiRouter.post('/results/clear-all', (req, res) => resultController.clearAllResults(req, res));
apiRouter.delete('/results', (req, res) => resultController.clearAllResults(req, res));

// ==========================================
// 5. PAYMENTS & TREASURY
// ==========================================

apiRouter.post('/payments/create-order', paymentRateLimiter, (req, res) => paymentController.createOrder(req, res));
apiRouter.post('/payments/verify', paymentRateLimiter, (req, res) => paymentController.verifyPayment(req, res));
apiRouter.get('/payments', requireAdminAuth, (req, res) => paymentController.getPayments(req, res));
apiRouter.get('/payments/receipt/:txnId', (req, res) => paymentController.getReceipt(req, res));

// ==========================================
// 6. STORAGE & ARCHIVE (CLOUDFLARE R2)
// ==========================================

apiRouter.post('/storage/upload', (req, res) => storageController.upload(req, res));
apiRouter.get('/storage/status', (req, res) => storageController.getStatus(req, res));
apiRouter.get('/storage/signed-url', (req, res) => storageController.getSignedUrl(req, res));
apiRouter.get('/storage/file', (req, res) => storageController.getFile(req, res));
apiRouter.get('/storage/file/:key(*)', (req, res) => storageController.getFile(req, res));
apiRouter.get('/storage/verify', (req, res) => storageController.verifyFile(req, res));
apiRouter.get('/storage/verify/:key(*)', (req, res) => storageController.verifyFile(req, res));
apiRouter.delete('/storage/file', requireAdminAuth, (req, res) => storageController.deleteFile(req, res));
apiRouter.delete('/storage/file/:key(*)', requireAdminAuth, (req, res) => storageController.deleteFile(req, res));
apiRouter.get('/storage/list', requireAdminAuth, (req, res) => storageController.list(req, res));

// ==========================================
// 7. NOTIFICATIONS & PRESS RELEASES
// ==========================================

apiRouter.get('/notifications', (req, res) => contentController.getNotifications(req, res));
apiRouter.post('/notifications', requireAdminAuth, (req, res) => contentController.saveNotification(req, res));
apiRouter.post('/notifications/clear-all', (req, res) => contentController.clearAllNotifications(req, res));
apiRouter.delete('/notifications', (req, res) => contentController.clearAllNotifications(req, res));
apiRouter.delete('/notifications/:id', requireAdminAuth, (req, res) => contentController.deleteNotification(req, res));

// ==========================================
// 8. GALLERY & MEDIA
// ==========================================

apiRouter.get('/gallery', (req, res) => contentController.getGallery(req, res));
apiRouter.post('/gallery', requireAdminAuth, (req, res) => contentController.saveGalleryItem(req, res));
apiRouter.delete('/gallery/:id', requireAdminAuth, (req, res) => contentController.deleteGalleryItem(req, res));

// ==========================================
// 9. ONLINE CUSTOM FORMS & SUBMISSIONS
// ==========================================

apiRouter.get('/forms', (req, res) => contentController.getForms(req, res));
apiRouter.get('/forms/:id', (req, res) => contentController.getFormById(req, res));
apiRouter.post('/forms', requireAdminAuth, (req, res) => contentController.saveForm(req, res));
apiRouter.delete('/forms/:id', requireAdminAuth, (req, res) => contentController.deleteForm(req, res));
apiRouter.post('/forms/clear-all', (req, res) => contentController.clearAllForms(req, res));
apiRouter.delete('/forms', (req, res) => contentController.clearAllForms(req, res));
apiRouter.post('/forms/:id/submit', (req, res) => contentController.submitForm(req, res));
apiRouter.get('/forms/submissions', requireAdminAuth, (req, res) => contentController.getSubmissions(req, res));
apiRouter.post('/forms/submissions/clear-all', (req, res) => contentController.clearAllSubmissions(req, res));
apiRouter.delete('/forms/submissions', (req, res) => contentController.clearAllSubmissions(req, res));

// ==========================================
// 10. CERTIFICATES VERIFICATION
// ==========================================

apiRouter.get('/certificates/verify/:serialNo', (req, res) => contentController.verifyCertificate(req, res));

// ==========================================
// 11. SERVER-SIDE GEMINI AI ASSISTANT
// ==========================================

apiRouter.post('/ai/assistant', aiRateLimiter, (req, res) => aiController.handleAssistantQuery(req, res));

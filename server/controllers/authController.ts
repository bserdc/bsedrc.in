import { Request, Response } from 'express';
import { 
  isAuthorizedAdminEmail,
  verifyFirebaseIdToken,
  generateAdminToken
} from '../services/authService';
import { config } from '../config';
import { AuthenticatedRequest } from '../middleware/auth';
import { dataStore } from '../services/dataStore';
import { serverDb, doc, setDoc, serverTimestamp } from '../services/firebaseServer';

export class AuthController {
  /**
   * POST /api/admin/login or /api/auth/login
   * Validates Firebase ID tokens for administrative authorization.
   */
  public async login(req: Request, res: Response): Promise<void> {
    const idToken = req.body.idToken || req.body.token;

    if (idToken) {
      const result = await verifyFirebaseIdToken(idToken);
      if (result.valid && result.user) {
        res.json({
          success: true,
          token: idToken,
          user: result.user,
          message: 'Firebase Administrative authentication successful.'
        });
        return;
      }

      res.status(result.forbidden ? 403 : 401).json({
        success: false,
        message: result.message || 'Firebase authentication verification failed.'
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: 'Administrative login must be authenticated directly via Firebase Email/Password Authentication.'
    });
  }

  /**
   * POST /api/auth/register (Student / Candidate Account Registration)
   */
  public async registerCandidate(req: Request, res: Response): Promise<void> {
    const { name, email, phone, course, dob, password, fatherName, motherName } = req.body;

    if (!name || !course) {
      res.status(400).json({
        success: false,
        message: 'Candidate Name and Course are mandatory fields for registration.'
      });
      return;
    }

    const currentYear = new Date().getFullYear();
    const regNo = `BSE/${currentYear}/${Math.floor(1000 + Math.random() * 9000)}`;
    const rollNo = `${currentYear}08${Math.floor(100 + Math.random() * 900)}`;

    const studentRecord = {
      id: `std-${Date.now()}`,
      regNo,
      rollNo,
      name: name.toUpperCase().trim(),
      fatherName: (fatherName || '').toUpperCase().trim(),
      motherName: (motherName || '').toUpperCase().trim(),
      dob: dob || '01-01-2010',
      gender: req.body.gender || 'Male',
      category: req.body.category || 'General',
      course,
      stream: req.body.stream || 'General',
      session: `${currentYear}-${currentYear + 1}`,
      centerCode: '10110901003',
      centerName: 'मध्य विद्यालय, अर्राहा, घैलाढ़',
      schoolNameHindi: 'मध्य विद्यालय, अर्राहा, घैलाढ़',
      udiseCode: '10110901003',
      mobile: phone || '7070530080',
      email: email || 'candidate@example.com',
      address: req.body.address || 'मधेपुरा, बिहार - 852113',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      subjects: [
        { code: '081', name: 'हिन्दी', type: 'Theory' as const },
        { code: '082', name: 'गणित', type: 'Theory' as const },
        { code: '083', name: 'विज्ञान', type: 'Theory' as const },
        { code: '084', name: 'सामाजिक विज्ञान', type: 'Theory' as const },
        { code: '085', name: 'सामान्य ज्ञान', type: 'Theory' as const }
      ],
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'Verified' as const,
      feeStatus: 'Paid' as const,
      examCenter: 'मध्य विद्यालय, अर्राहा, घैलाढ़ (10110901003)'
    };

    // Save in unified data store (which writes to Cloud Firestore `students`)
    await dataStore.saveStudent(studentRecord);

    // Also persist in `users` collection in Firestore if serverDb is ready
    if (serverDb) {
      try {
        const userId = email ? email.replace(/[^a-zA-Z0-9]/g, '_') : regNo.replace(/\//g, '_');
        await setDoc(doc(serverDb, 'users', userId), {
          uid: userId,
          regNo,
          rollNo,
          name: studentRecord.name,
          email: email || '',
          phone: phone || '',
          course,
          role: 'candidate',
          createdAt: serverTimestamp()
        }, { merge: true });
      } catch (err: any) {
        console.warn('[AUTH] Error storing user profile in Firestore:', err?.message);
      }
    }

    const token = generateAdminToken({
      username: regNo,
      email: email || '',
      role: 'Candidate',
      organization: config.board.name
    });

    res.json({
      success: true,
      message: 'Candidate Registration successfully registered in Central Council Registry!',
      regNo,
      rollNo,
      token,
      student: studentRecord
    });
  }

  /**
   * POST /api/auth/candidate-login
   */
  public async candidateLogin(req: Request, res: Response): Promise<void> {
    const { identifier, dob } = req.body;

    if (!identifier) {
      res.status(400).json({
        success: false,
        message: 'Registration Number or Roll Number is required.'
      });
      return;
    }

    const student = await dataStore.getStudentByRegOrRoll(identifier);
    if (!student) {
      res.status(404).json({
        success: false,
        message: `Candidate record not found for '${identifier}'.`
      });
      return;
    }

    // If DOB is supplied, verify it
    if (dob && student.dob && student.dob.trim() !== dob.trim()) {
      res.status(401).json({
        success: false,
        message: 'Date of Birth does not match Council Records for this Registration Number.'
      });
      return;
    }

    const token = generateAdminToken({
      username: student.regNo,
      email: student.email || '',
      role: 'Candidate',
      organization: config.board.name
    });

    res.json({
      success: true,
      token,
      student,
      message: 'Candidate authentication successful.'
    });
  }

  /**
   * POST /api/admin/forgot-password or /api/auth/forgot-password
   */
  public async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();

    if (isAuthorizedAdminEmail(cleanEmail)) {
      res.json({
        success: true,
        message: 'Council Admin email confirmed. Please use the Firebase password reset option to receive your reset link.'
      });
      return;
    }

    res.status(404).json({
      success: false,
      message: 'The email provided is not registered as an authorized Council Administrator.'
    });
  }

  /**
   * POST /api/admin/reset-password or /api/auth/reset-password
   */
  public async resetPassword(req: Request, res: Response): Promise<void> {
    res.status(400).json({
      success: false,
      message: 'Administrative passwords can only be reset via official Firebase password reset email.'
    });
  }

  /**
   * GET /api/admin/me or /api/auth/me
   */
  public async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.adminUser) {
      res.status(401).json({ success: false, message: 'Unauthenticated' });
      return;
    }

    res.json({
      success: true,
      user: req.adminUser
    });
  }
}

export const authController = new AuthController();

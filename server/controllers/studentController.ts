import { Request, Response } from 'express';
import { dataStore } from '../services/dataStore';
import { storageService } from '../services/storageService';
import { Student } from '../../src/types';

export class StudentController {
  /**
   * GET /api/students
   */
  public async getStudents(req: Request, res: Response): Promise<void> {
    const search = req.query.search as string;
    const course = req.query.course as string;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const students = await dataStore.getStudents({ search, course, limit });
    res.json({
      success: true,
      count: students.length,
      students
    });
  }

  /**
   * GET /api/students/:regNo
   */
  public async getStudentByRegNo(req: Request, res: Response): Promise<void> {
    const regNo = decodeURIComponent(req.params.regNo).trim();
    if (!regNo) {
      res.status(400).json({ success: false, message: 'Registration number is required.' });
      return;
    }

    const student = await dataStore.getStudentByRegOrRoll(regNo);
    if (!student) {
      res.status(404).json({
        success: false,
        message: `Candidate with Registration/Roll No '${regNo}' not found in Council Central Database.`
      });
      return;
    }

    res.json({
      success: true,
      student
    });
  }

  /**
   * POST /api/students
   */
  public async registerOrUpdateStudent(req: Request, res: Response): Promise<void> {
    const body = req.body as Partial<Student>;

    if (!body.name || !body.course) {
      res.status(400).json({
        success: false,
        message: 'Candidate Name and Course are mandatory fields.'
      });
      return;
    }

    const currentYear = new Date().getFullYear();
    const regNo = body.regNo || `BSE/${currentYear}/${Math.floor(1000 + Math.random() * 9000)}`;
    const rollNo = body.rollNo || `${currentYear}08${Math.floor(100 + Math.random() * 900)}`;

    const newStudent: Student = {
      id: body.id || `std-${Date.now()}`,
      regNo,
      rollNo,
      name: body.name.toUpperCase().trim(),
      fatherName: (body.fatherName || '').toUpperCase().trim(),
      motherName: (body.motherName || '').toUpperCase().trim(),
      dob: body.dob || '01-01-2010',
      gender: body.gender || 'Male',
      category: body.category || 'General',
      course: body.course,
      stream: body.stream || 'General',
      session: body.session || `${currentYear}-${currentYear + 1}`,
      centerCode: body.centerCode || '10110901003',
      centerName: body.centerName || 'मध्य विद्यालय, अर्राहा, घैलाढ़',
      schoolNameHindi: body.schoolNameHindi || body.centerName || 'मध्य विद्यालय, अर्राहा, घैलाढ़',
      udiseCode: body.udiseCode || '10110901003',
      mobile: body.mobile || '7070530080',
      email: body.email || 'candidate@example.com',
      address: body.address || 'मधेपुरा, बिहार - 852113',
      photoUrl: body.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      subjects: body.subjects && body.subjects.length > 0 ? body.subjects : [
        { code: '081', name: 'हिन्दी', type: 'Theory' },
        { code: '082', name: 'गणित', type: 'Theory' },
        { code: '083', name: 'विज्ञान', type: 'Theory' },
        { code: '084', name: 'सामाजिक विज्ञान', type: 'Theory' },
        { code: '085', name: 'सामान्य ज्ञान', type: 'Theory' }
      ],
      registrationDate: body.registrationDate || new Date().toISOString().split('T')[0],
      status: body.status || 'Verified',
      feeStatus: body.feeStatus || 'Paid',
      examCenter: body.examCenter || 'मध्य विद्यालय, अर्राहा, घैलाढ़ (10110901003)'
    };

    const saved = await dataStore.saveStudent(newStudent);
    res.json({
      success: true,
      student: saved,
      message: 'Student record successfully saved.'
    });
  }

  /**
   * DELETE /api/students/:id
   */
  public async deleteStudent(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const student = await dataStore.getStudentByRegOrRoll(id);
    if (student?.photoKey) {
      try {
        await storageService.deleteFile(student.photoKey);
      } catch (err: any) {
        console.warn('[STORAGE] Failed to clean up student R2 photo:', err?.message);
      }
    }
    await dataStore.deleteStudent(id);
    res.json({
      success: true,
      message: 'Student record deleted successfully.'
    });
  }

  /**
   * POST /api/students/clear-all or DELETE /api/students
   */
  public async clearAllStudents(req: Request, res: Response): Promise<void> {
    await dataStore.clearAllStudents();
    res.json({
      success: true,
      message: 'All student records have been permanently cleared from Council database.'
    });
  }
}

export const studentController = new StudentController();

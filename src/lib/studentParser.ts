import { Student } from '../types';

export interface ParsedStudentRowPreview {
  name: string;
  dob: string;
  mother: string;
  father: string;
  gender: string;
  studentClass: string;
  registration: string;
  registrationYear: string;
  isValid: boolean;
}

/**
 * Standard bulk student format mandated:
 * "Name	DOB	Mother	Father	Gender	Class	Registration	Registration year"
 * 
 * Supports:
 * - Direct Excel / Google Sheets copy-paste (Tab delimited: \t)
 * - Comma-Separated Values (CSV delimited: ,)
 * - Semicolon or pipe delimiters as fallback
 * - Automatic detection & skipping of header row
 */
export function parseBulkStudentInput(
  rawInput: string,
  existingCount: number = 0
): Student[] {
  if (!rawInput || !rawInput.trim()) return [];

  const lines = rawInput
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const students: Student[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Determine delimiter: tab (\t) preferred if present, otherwise comma (,)
    let parts: string[] = [];
    if (line.includes('\t')) {
      parts = line.split('\t').map((p) => p.trim().replace(/^["']|["']$/g, ''));
    } else if (line.includes(',')) {
      parts = line.split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
    } else if (line.includes('|')) {
      parts = line.split('|').map((p) => p.trim().replace(/^["']|["']$/g, ''));
    } else {
      parts = line.split(/\s{2,}/).map((p) => p.trim().replace(/^["']|["']$/g, ''));
    }

    // Check if this is a header line (e.g., Name, DOB, Mother, Father...)
    const lineLower = line.toLowerCase();
    if (
      i === 0 &&
      (lineLower.includes('name') || lineLower.includes('नाम')) &&
      (lineLower.includes('dob') ||
        lineLower.includes('mother') ||
        lineLower.includes('father') ||
        lineLower.includes('registration') ||
        lineLower.includes('gender') ||
        lineLower.includes('class') ||
        lineLower.includes('जन्म') ||
        lineLower.includes('पंजीयन'))
    ) {
      // Skip header row
      continue;
    }

    // Extract 8 columns in the exact mandated order:
    // 0: Name
    // 1: DOB
    // 2: Mother
    // 3: Father
    // 4: Gender
    // 5: Class
    // 6: Registration
    // 7: Registration year

    const rawName = parts[0] || '';
    const rawDob = parts[1] || '';
    const rawMother = parts[2] || '';
    const rawFather = parts[3] || '';
    const rawGender = parts[4] || '';
    const rawClass = parts[5] || '';
    const rawReg = parts[6] || '';
    const rawYear = parts[7] || '';

    // If row has no substantive content, skip
    if (!rawName && !rawReg) continue;

    const nextIndex = existingCount + students.length + 1;
    const defaultYear = rawYear.trim() || '2026';
    const regNo = rawReg.trim() || `BSE/${defaultYear}/${1050 + nextIndex}`;
    const studentName = (rawName || `STUDENT CANDIDATE ${nextIndex}`).trim().toUpperCase();
    const motherName = (rawMother || 'माता का नाम').trim().toUpperCase();
    const fatherName = (rawFather || 'पिता का नाम').trim().toUpperCase();

    // Gender parsing
    let gender: 'Male' | 'Female' | 'Other' = 'Male';
    const gLower = rawGender.toLowerCase().trim();
    if (
      gLower.includes('fe') ||
      gLower === 'f' ||
      gLower.includes('girl') ||
      gLower.includes('महिला') ||
      gLower.includes('बालिका') ||
      gLower.includes('स्त्री')
    ) {
      gender = 'Female';
    } else if (gLower.includes('oth') || gLower.includes('trans')) {
      gender = 'Other';
    } else {
      gender = 'Male';
    }

    // DOB normalizing
    let dob = rawDob.trim();
    if (!dob) {
      dob = '15-08-2012';
    }

    // Class parsing
    let course: Student['course'] = 'Middle Foundation (Class 8th)';
    const cStr = rawClass.toLowerCase().trim();
    if (/10th|\b10\b|\bx\b|मैट्रिक|दसवीं/i.test(cStr)) {
      course = 'Secondary Examination (Class 10th)';
    } else if (/9th|\b9\b|\bix\b|नवमी|नौवीं/i.test(cStr)) {
      course = 'Secondary Foundation (Class 9th)';
    } else if (/8th|\b8\b|\bviii\b|आठवीं/i.test(cStr)) {
      course = 'Middle Foundation (Class 8th)';
    } else if (/7th|\b7\b|\bvii\b|सातवीं/i.test(cStr)) {
      course = 'Middle Foundation (Class 7th)';
    } else if (/6th|\b6\b|\bvi\b|छठी|छठा/i.test(cStr)) {
      course = 'Middle Foundation (Class 6th)';
    } else if (/5th|\b5\b|\bv\b|पांचवी|पांचवा/i.test(cStr)) {
      course = 'Primary/Middle Foundation (Class 5th)';
    }

    const session = rawYear.trim() || '2026';
    const numericYear = session.replace(/[^0-9]/g, '').slice(-2) || '26';

    students.push({
      id: 'std-bulk-' + Date.now() + '-' + nextIndex,
      regNo: regNo,
      rollNo: `${numericYear}${1000 + nextIndex}`,
      name: studentName,
      fatherName: fatherName,
      motherName: motherName,
      dob: dob,
      gender: gender,
      category: 'General',
      course: course,
      stream: 'General',
      session: session,
      centerCode: '10110901003',
      centerName: 'मध्य विद्यालय, अर्राहा, घैलाढ़',
      schoolNameHindi: 'मध्य विद्यालय, अर्राहा, घैलाढ़',
      udiseCode: '10110901003',
      nationality: 'INDIAN',
      mobile: '9876543210',
      email: `${studentName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'candidate'}@bsedrc.in`,
      address: 'मधेपुरा, बिहार - 852113',
      photoUrl:
        gender === 'Female'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      subjects: [
        { code: '101', name: 'हिन्दी', type: 'Theory' },
        { code: '102', name: 'गणित', type: 'Theory' },
        { code: '103', name: 'विज्ञान', type: 'Theory' },
        { code: '104', name: 'सामाजिक विज्ञान', type: 'Theory' },
        { code: '105', name: 'सामान्य ज्ञान', type: 'Theory' },
      ],
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'Verified',
      feeStatus: 'Paid',
      examCenter: 'मध्य विद्यालय, अर्राहा, घैलाढ़ (10110901003)',
    });
  }

  return students;
}

export const SAMPLE_BULK_STUDENTS_EXCEL = `Name\tDOB\tMother\tFather\tGender\tClass\tRegistration\tRegistration year
PRIYA KUMARI\t15/08/2012\tSUNITA DEVI\tRAMESHWAR YADAV\tFemale\tClass 8th\tBSE/2026/801\t2026
SANJAY KUMAR\t10/05/2011\tMEENA DEVI\tSHIV CHARAN\tMale\tClass 10th\tBSE/2026/802\t2026
ANITA ROY\t22/11/2013\tSUSHILA DEVI\tRAJENDRA ROY\tFemale\tClass 7th\tBSE/2026/803\t2026
MOHIT SHARMA\t04/02/2014\tPOOJA DEVI\tSATISH SHARMA\tMale\tClass 6th\tBSE/2026/804\t2026
RAHUL KUMAR\t18/09/2012\tKAVITA DEVI\tDILIP PASWAN\tMale\tClass 9th\tBSE/2026/805\t2026`;

export interface Subject {
  code: string;
  name: string;
  type: 'Theory' | 'Practical' | 'Compulsory';
  theoryMax?: number;
  theoryObt?: number;
  practicalMax?: number;
  practicalObt?: number;
  totalMax?: number;
  totalObt?: number;
  grade?: string;
}

export interface Student {
  id: string;
  regNo: string;
  rollNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  course: 
    | 'Secondary Examination (Class 10th)' 
    | 'Secondary Foundation (Class 9th)' 
    | 'Middle Foundation (Class 8th)' 
    | 'Middle Foundation (Class 7th)' 
    | 'Middle Foundation (Class 6th)'
    | 'Primary/Middle Foundation (Class 5th)'
    | 'Foundation Bridge & Skill (Class 5th-10th)';
  stream: 'General' | 'Science & Math' | 'Social & Humanities' | 'Information Technology' | 'Skill & Vocational';
  session: string;
  centerCode: string;
  centerName: string;
  mobile: string;
  email: string;
  address: string;
  photoUrl: string;
  photoKey?: string;
  documentUrls?: string[];
  documentKeys?: string[];
  nationality?: string;
  schoolNameHindi?: string;
  udiseCode?: string;
  subjects: {
    code: string;
    name: string;
    type: 'Theory' | 'Practical' | 'Compulsory';
  }[];
  registrationDate: string;
  status: 'Registered' | 'Verified' | 'Admit Card Issued' | 'Passed';
  feeStatus: 'Paid' | 'Pending';
  examCenter: string;
}

export interface ResultSubject {
  code: string;
  name: string;
  theoryMax: number;
  theoryObt: number;
  practicalMax: number;
  practicalObt: number;
  totalMax: number;
  totalObt: number;
  grade: string;
  status: 'Pass' | 'Fail';
}

export interface ExamResult {
  id: string;
  studentRegNo: string;
  rollNo: string;
  candidateName: string;
  fatherName: string;
  motherName: string;
  course: string;
  stream: string;
  session: string;
  examYear: number;
  centerCode: string;
  centerName: string;
  subjects: ResultSubject[];
  totalMax: number;
  totalObt: number;
  percentage: number;
  division: '1st Division' | '2nd Division' | '3rd Division' | 'Compartment' | 'Failed';
  resultStatus: 'PASS' | 'COMPARTMENT' | 'FAIL';
  issueDate: string;
  isPublished: boolean;
}

export interface JobVacancy {
  id: string;
  postCode: string;
  title: string;
  department: string;
  vacancies: number;
  qualification: string;
  experience: string;
  ageLimit: string;
  payScale: string;
  applicationFee: number;
  lastDate: string;
  status: 'Active' | 'Closing Soon' | 'Closed';
  description: string;
  requirements: string[];
}

export interface JobApplication {
  id: string;
  applicationNo: string;
  vacancyId: string;
  postTitle: string;
  candidateName: string;
  fatherName: string;
  dob: string;
  gender: string;
  category: string;
  email: string;
  phone: string;
  qualification: string;
  percentage: string;
  address: string;
  appliedDate: string;
  paymentStatus: 'Paid' | 'Pending';
  amount: number;
  examCenterPref: string;
  status: 'Submitted' | 'Under Review' | 'Shortlisted' | 'Admit Card Available' | 'Rejected';
  admitCardReady?: boolean;
}

export interface FeePayment {
  id: string;
  receiptNo: string;
  transactionId: string;
  refNumber: string;
  candidateName: string;
  fatherName: string;
  candidateMobile: string;
  purpose: 'Registration Fee' | 'Annual Board Exam Fee' | 'Migration Certificate' | 'Duplicate Marksheet' | 'Re-evaluation Fee' | 'Job Application Fee';
  amount: number;
  paymentMethod: 'UPI' | 'Net Banking' | 'Debit Card' | 'Credit Card' | 'Razorpay (Online Gateway)' | 'Razorpay Gateway' | string;
  paymentDate: string;
  status: 'Success' | 'Pending' | 'Failed';
  bankRef: string;
}

export interface CertificateRecord {
  id: string;
  certificateType: 'Migration Certificate' | 'Passing Certificate' | 'Provisional Certificate' | 'Character Certificate';
  certificateNo: string;
  studentRegNo: string;
  studentRollNo: string;
  candidateName: string;
  fatherName: string;
  motherName: string;
  course: string;
  passingYear: string;
  division: string;
  issueDate: string;
  verificationHash: string;
  documentKey?: string;
  documentUrl?: string;
}

export interface BoardNotification {
  id: string;
  title: string;
  category: 'Examination' | 'Admission' | 'Recruitment' | 'Results' | 'General Notice';
  date: string;
  isNew: boolean;
  isMarquee: boolean;
  linkText?: string;
  description: string;
}

export interface SchoolInfo {
  id: string;
  udiseCode: string;
  name: string;
  district: 'Saharsa' | 'Madhepura' | string;
  block: string;
  category: 'High School / +2' | 'Middle School' | 'Primary School' | 'Public / Private School' | 'Madarsa / Sanskrit' | 'Girls School';
  address?: string;
}

export type FormFieldType = 
  | 'text' 
  | 'number' 
  | 'email' 
  | 'phone' 
  | 'date' 
  | 'select' 
  | 'textarea' 
  | 'file' 
  | 'school_select';

export interface CustomFormField {
  id: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select dropdown
  helpText?: string;
}

export interface CustomForm {
  id: string;
  title: string;
  description: string;
  category: 'Examination' | 'Admission' | 'Affiliation' | 'Scholarship' | 'Certificate' | 'General';
  status: 'Published' | 'Draft' | 'Archived';
  applicationFee: number;
  lastDate?: string;
  createdAt: string;
  fields: CustomFormField[];
  submissionsCount?: number;
}

export interface FormSubmission {
  id: string;
  formId: string;
  formTitle: string;
  applicantName: string;
  applicantMobile: string;
  applicantEmail?: string;
  submittedAt: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  paymentStatus: 'Free' | 'Paid' | 'Pending';
  amount: number;
  data: Record<string, any>;
  receiptNo: string;
  attachmentKey?: string;
  attachmentUrl?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  titleHindi?: string;
  category: 'Annual Function' | 'Examination' | 'Science & Tech' | 'Sports & Cultural' | 'Awards & Distribution' | 'Campus Life';
  imageUrl: string;
  imageKey?: string;
  date: string;
  caption?: string;
  featured?: boolean;
}

import { 
  Student, 
  ExamResult, 
  JobVacancy, 
  JobApplication, 
  FeePayment, 
  CertificateRecord, 
  BoardNotification,
  CustomForm,
  FormSubmission,
  GalleryItem
} from '../types';

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_RESULTS: ExamResult[] = [];

export const INITIAL_VACANCIES: JobVacancy[] = [
  {
    id: 'vac-1',
    postCode: 'BSE/EMP/2025/01',
    title: 'Examination Center Superintendent',
    department: 'Examination & Evaluation Cell',
    vacancies: 18,
    qualification: 'Post Graduate with B.Ed / M.Ed and minimum 5 years administrative/educational experience in secondary schools.',
    experience: '5+ Years in Educational Administration',
    ageLimit: '30 - 50 Years (Age relaxation for SC/ST/OBC as per rules)',
    payScale: 'Level 10 (₹56,100 - ₹1,77,500)',
    applicationFee: 750,
    lastDate: '2025-10-30',
    status: 'Active',
    description: 'Responsible for overall conduct of annual board examinations, maintaining integrity of question paper custody, center vigilance, and coordinate evaluation.',
    requirements: ['Master Degree with 55% Marks', 'B.Ed / M.Ed from Recognized University', 'Clean administrative vigilance record']
  },
  {
    id: 'vac-2',
    postCode: 'BSE/EMP/2025/02',
    title: 'Computer & Data Entry Operator (Grade-II)',
    department: 'IT & Student Registry Wing',
    vacancies: 34,
    qualification: 'Graduation in any stream with Diploma in Computer Application (DCA/O Level) and typing speed 35 wpm in English / 30 wpm in Hindi.',
    experience: '1-3 Years in MIS / Data Processing',
    ageLimit: '21 - 35 Years',
    payScale: 'Level 4 (₹25,500 - ₹81,100)',
    applicationFee: 450,
    lastDate: '2025-11-15',
    status: 'Active',
    description: 'Manage student registration database, mark-sheet data entry, verification processing, and assist candidates in digital grievance redressal.',
    requirements: ['Bachelor Degree', 'Typing speed 35 WPM (Eng) / 30 WPM (Hindi)', 'Expertise in Excel and Web Databases']
  },
  {
    id: 'vac-3',
    postCode: 'BSE/EMP/2025/03',
    title: 'Assistant Teacher / Subject Specialist (Secondary)',
    department: 'Academic Curriculum & Pedagogy',
    vacancies: 42,
    qualification: 'Bachelor Degree in Science / Maths / English with B.Ed and qualified Central / State Teacher Eligibility Test (TET/CTET).',
    experience: '2+ Years teaching experience preferred',
    ageLimit: '21 - 38 Years',
    payScale: 'Level 7 (₹44,900 - ₹1,42,400)',
    applicationFee: 600,
    lastDate: '2025-10-25',
    status: 'Active',
    description: 'Design syllabus blueprints, question paper moderation, prepare model answers, and conduct virtual teacher orientation programmes.',
    requirements: ['B.Sc / B.A with 50% Marks', 'B.Ed Degree', 'CTET Paper II Passed']
  },
  {
    id: 'vac-4',
    postCode: 'BSE/EMP/2025/04',
    title: 'Senior IT Coordinator & Cyber Security Officer',
    department: 'Digital Governance & Portal Infrastructure',
    vacancies: 6,
    qualification: 'B.Tech / B.E in Computer Science / IT / MCA with experience in cloud portals, SSL security, and web portal maintenance.',
    experience: '3-6 Years in Web Portals & Database Management',
    ageLimit: '25 - 42 Years',
    payScale: 'Level 11 (₹67,700 - ₹2,08,700)',
    applicationFee: 850,
    lastDate: '2025-11-20',
    status: 'Active',
    description: 'Manage server uptime, result publishing portal security, data backups, and integrate online fee payment gateways.',
    requirements: ['B.Tech / MCA in Computer Science/IT', 'Hands-on experience in full-stack web platforms', 'Knowledge of ISO 27001 data safety']
  }
];

export const INITIAL_JOB_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-1',
    applicationNo: 'JOB-2025-DEO-8812',
    vacancyId: 'vac-2',
    postTitle: 'Computer & Data Entry Operator (Grade-II)',
    candidateName: 'SUMIT KUMAR CHOUDHARY',
    fatherName: 'HARISH CHANDRA CHOUDHARY',
    dob: '1998-04-12',
    gender: 'Male',
    category: 'OBC',
    email: 'sumit.choudhary@example.com',
    phone: '9812349988',
    qualification: 'BCA (Bachelor of Computer Applications) - 78%',
    percentage: '78.50%',
    address: 'Neha Bhawan, Near BNMV College, Sahugarh, Madhepura, Bihar - 852113',
    appliedDate: '2025-08-14',
    paymentStatus: 'Paid',
    amount: 450,
    examCenterPref: 'Madhepura Center (Zone 1)',
    status: 'Admit Card Available',
    admitCardReady: true,
  },
  {
    id: 'app-2',
    applicationNo: 'JOB-2025-SUP-9104',
    vacancyId: 'vac-1',
    postTitle: 'Examination Center Superintendent',
    candidateName: 'DR. MEENAKSHI SHARMA',
    fatherName: 'SATISH CHANDRA SHARMA',
    dob: '1987-09-18',
    gender: 'Female',
    category: 'General',
    email: 'dr.meenakshi@example.com',
    phone: '9910238844',
    qualification: 'M.A., M.Ed, Ph.D in Education - 82%',
    percentage: '82.00%',
    address: 'College Road, Ward 12, Madhepura, Bihar - 852113',
    appliedDate: '2025-08-20',
    paymentStatus: 'Paid',
    amount: 750,
    examCenterPref: 'Madhepura Center (Zone 2)',
    status: 'Shortlisted',
    admitCardReady: true,
  }
];

export const INITIAL_PAYMENTS: FeePayment[] = [];

export const INITIAL_CERTIFICATES: CertificateRecord[] = [];

export const INITIAL_NOTIFICATIONS: BoardNotification[] = [];

export const INITIAL_CUSTOM_FORMS: CustomForm[] = [];

export const INITIAL_FORM_SUBMISSIONS: FormSubmission[] = [];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Annual Girl Student Merit Felicitation & Shield Distribution',
    titleHindi: 'वार्षिक मेधा सम्मान एवं बालिका प्रतिभा पुरस्कार समारोह',
    category: 'Awards & Distribution',
    imageUrl: '/assets/images/bihar_student_awards_1789140543552.jpg',
    date: '2025-05-18',
    caption: 'मधेपुरा परिषद द्वारा आयोजित भव्य समारोह में उत्कृष्ट प्रदर्शन करने वाली मेधावी छात्रा को मंच पर शील्ड, मेडल एवं प्रशस्ति पत्र प्रदान करते विशिष्ट अतिथिगण।',
    featured: true
  },
  {
    id: 'gal-2',
    title: 'Madhepura Teachers Council & Academic Delegation Assembly',
    titleHindi: 'मध्य विद्यालय जगजीवन आश्रम मधेपुरा शिक्षक एवं परिषद प्रतिनिधि मंडल',
    category: 'Campus Life',
    imageUrl: '/assets/images/madhepura_school_teachers_1789140526358.jpg',
    date: '2025-04-12',
    caption: 'मध्य विद्यालय जगजीवन आश्रम (मधेपुरा) परिसर में शैक्षणिक गुणवत्ता उन्नयन, डिजिटल पंजीयन तथा मूल्यांकन मानकों पर समीक्षा बैठक।',
    featured: true
  },
  {
    id: 'gal-3',
    title: 'State Level Fine Arts & Cultural Student Excellence Award',
    titleHindi: 'राज्य स्तरीय चित्रकला एवं सांस्कृतिक प्रतिभा सम्मान',
    category: 'Awards & Distribution',
    imageUrl: '/assets/images/girl_art_award_ceremony_1789140696861.jpg',
    date: '2025-03-05',
    caption: 'माध्यमिक विद्यालय की छात्रा को उत्कृष्ट चित्रकला एवं नवाचार प्रदर्शन हेतु विशिष्ट अतिथि द्वारा मेडल एवं सम्मान पत्र भेंट।',
    featured: true
  },
  {
    id: 'gal-4',
    title: 'Grand Annual Students Assembly & Academic Convention',
    titleHindi: 'विशाल वार्षिक छात्र सम्मेलन एवं प्रतिभा सम्मान मंडप, मधेपुरा',
    category: 'Campus Life',
    imageUrl: '/assets/images/bihar_student_gathering_1789140582732.jpg',
    date: '2025-02-14',
    caption: 'भव्य शामियाना मंडप में एकत्रित सैकड़ों ग्रामीण व माध्यमिक छात्र-छात्राएं, शिक्षक एवं अभिभावकगण।',
    featured: true
  },
  {
    id: 'gal-5',
    title: 'Board Examination Registration & Admit Card Distribution',
    titleHindi: 'आदर्श संकुल मध्य विद्यालय परीक्षा पंजीयन पत्र वितरण',
    imageUrl: '/assets/images/students_exam_forms_1789140710491.jpg',
    category: 'Examination',
    date: '2025-01-20',
    caption: 'परिषद से संबद्ध विद्यालयों में छात्रों को आधिकारिक बोर्ड पंजीयन प्रपत्र एवं डिजिटल प्रवेश पत्र प्रदान करते शिक्षक।',
    featured: false
  },
  {
    id: 'gal-6',
    title: 'Utkramit Madhya Vidyalaya Morsanda Madhepura Students Queue',
    titleHindi: 'उत्क्रमित मध्य विद्यालय मोरसंडा मधेपुरा अनुशासित कतार',
    imageUrl: '/assets/images/madhepura_school_queue_1789140682148.jpg',
    category: 'Campus Life',
    date: '2025-01-26',
    caption: 'गुलाबी-नारंगी विद्यालय भवन के बाहर प्रार्थना सभा एवं नियमित कक्षा संचालन हेतु अनुशासित पंक्तिबद्ध छात्र-छात्राएं।',
    featured: false
  },
  {
    id: 'gal-7',
    title: 'Utkramit Uccha Madhyamik +2 School Tiyar Tola Phulaut Assembly',
    titleHindi: 'उत्क्रमित उच्च माध्यमिक +2 विद्यालय तियर टोला फुलौत परिसर',
    imageUrl: '/assets/images/bihar_school_assembly_1789140559004.jpg',
    category: 'Campus Life',
    date: '2024-11-14',
    caption: 'चौसा, मधेपुरा स्थित उच्च माध्यमिक विद्यालय परिसर में अनुशासित प्रार्थना एवं शैक्षणिक मार्गदर्शन सत्र।',
    featured: false
  },
  {
    id: 'gal-8',
    title: 'Council Merit Medal & Educational Scholarship Conferment',
    titleHindi: 'परिषद मेधावी छात्र-छात्रा मेडल एवं छात्रवृत्ति वितरण',
    imageUrl: '/assets/images/bihar_student_awards_1789140543552.jpg',
    category: 'Awards & Distribution',
    date: '2024-12-05',
    caption: 'कक्षा 6ठी से 10वीं तक के मेधावी छात्र-छात्राओं को वार्षिक परीक्षा में श्रेष्ठ अंक प्राप्त करने पर सम्मान।',
    featured: true
  }
];

export const initialStudents = INITIAL_STUDENTS;
export const initialResults = INITIAL_RESULTS;
export const initialVacancies = INITIAL_VACANCIES;
export const initialApplications = INITIAL_JOB_APPLICATIONS;
export const initialPayments = INITIAL_PAYMENTS;
export const initialCertificates = INITIAL_CERTIFICATES;
export const initialNotifications = INITIAL_NOTIFICATIONS;
export const initialCustomForms = INITIAL_CUSTOM_FORMS;
export const initialFormSubmissions = INITIAL_FORM_SUBMISSIONS;
export const initialGallery = INITIAL_GALLERY;


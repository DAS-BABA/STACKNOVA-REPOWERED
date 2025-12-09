export enum UserRole {
  STUDENT = 'STUDENT',
  CR = 'CR',
  TEACHER = 'TEACHER',
  HOD = 'HOD'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  enrollmentNo?: string; // For students/CR
  division?: string;
  classTeacherId?: string;
  avatar?: string;
  password?: string; // Encrypted (mock) or plain for now
  phoneNumber?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  date: string;
  targetAudience: 'ALL' | 'CLASS' | 'DIVISION';
}

export interface AttendanceSession {
  id: string;
  code: string;
  creatorId: string;
  subject: string;
  createdAt: string;
  isActive: boolean;
  division: string;
  attendees: AttendanceRecord[];
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  enrollmentNo: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacherId: string;
  assignments: Assignment[];
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  description: string;
}

export interface Mark {
  id: string;
  subjectId: string;
  studentId: string;
  marksObtained: number;
  totalMarks: number;
  examType: string;
}
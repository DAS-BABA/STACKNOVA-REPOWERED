import { User, UserRole, Notice, AttendanceSession, Subject, Mark } from '../types';

// Initial Seed Data
const SEED_USERS: User[] = [
  {
    id: 'u1',
    name: 'Dr. Robert Ford',
    email: 'hod@stacknova.edu',
    role: UserRole.HOD,
    avatar: 'https://picsum.photos/200/200?random=1'
  },
  {
    id: 'u2',
    name: 'Prof. Minerva',
    email: 'teacher@stacknova.edu',
    role: UserRole.TEACHER,
    division: 'A',
    avatar: 'https://picsum.photos/200/200?random=2'
  },
  {
    id: 'u3',
    name: 'John Doe',
    email: 'cr@stacknova.edu',
    role: UserRole.CR,
    enrollmentNo: 'SN2024001',
    division: 'A',
    classTeacherId: 'u2',
    avatar: 'https://picsum.photos/200/200?random=3'
  },
  {
    id: 'u4',
    name: 'Alice Smith',
    email: 'student@stacknova.edu',
    role: UserRole.STUDENT,
    enrollmentNo: 'SN2024002',
    division: 'A',
    classTeacherId: 'u2',
    avatar: 'https://picsum.photos/200/200?random=4'
  }
];

const SEED_SUBJECTS: Subject[] = [
  {
    id: 's1',
    name: 'Advanced Algorithms',
    code: 'CS401',
    teacherId: 'u2',
    assignments: [
      { id: 'a1', title: 'Dynamic Programming Problem Set', dueDate: '2024-12-01', description: 'Solve problems 1-10 from Chapter 4.' }
    ]
  },
  {
    id: 's2',
    name: 'Database Systems',
    code: 'CS402',
    teacherId: 'u2',
    assignments: []
  }
];

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockStore {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem('stacknova_users')) {
      localStorage.setItem('stacknova_users', JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem('stacknova_subjects')) {
      localStorage.setItem('stacknova_subjects', JSON.stringify(SEED_SUBJECTS));
    }
    if (!localStorage.getItem('stacknova_notices')) {
      localStorage.setItem('stacknova_notices', JSON.stringify([]));
    }
    if (!localStorage.getItem('stacknova_attendance')) {
      localStorage.setItem('stacknova_attendance', JSON.stringify([]));
    }
  }

  getUsers(): User[] {
    return JSON.parse(localStorage.getItem('stacknova_users') || '[]');
  }

  getUserByEmail(email: string): User | undefined {
    const users = this.getUsers();
    return users.find(u => u.email === email);
  }

  async login(email: string): Promise<User> {
    await delay(500); // Simulate network
    const user = this.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found. Try hod@stacknova.edu, teacher@stacknova.edu, cr@stacknova.edu, or student@stacknova.edu');
    }
    return user;
  }

  getNotices(): Notice[] {
    return JSON.parse(localStorage.getItem('stacknova_notices') || '[]');
  }

  addNotice(notice: Notice) {
    const notices = this.getNotices();
    notices.unshift(notice);
    localStorage.setItem('stacknova_notices', JSON.stringify(notices));
  }

  getAttendanceSessions(): AttendanceSession[] {
    return JSON.parse(localStorage.getItem('stacknova_attendance') || '[]');
  }

  createAttendanceSession(session: AttendanceSession) {
    const sessions = this.getAttendanceSessions();
    sessions.push(session);
    localStorage.setItem('stacknova_attendance', JSON.stringify(sessions));
  }

  joinAttendance(code: string, student: User, location: { lat: number; lng: number }) {
    const sessions = this.getAttendanceSessions();
    const sessionIndex = sessions.findIndex(s => s.code === code && s.isActive);
    
    if (sessionIndex === -1) {
      throw new Error('Invalid or inactive code.');
    }

    const session = sessions[sessionIndex];
    if (session.attendees.some(a => a.studentId === student.id)) {
      throw new Error('You have already marked attendance for this session.');
    }

    session.attendees.push({
      studentId: student.id,
      studentName: student.name,
      enrollmentNo: student.enrollmentNo || 'N/A',
      timestamp: new Date().toISOString(),
      location
    });

    sessions[sessionIndex] = session;
    localStorage.setItem('stacknova_attendance', JSON.stringify(sessions));
    return session;
  }

  getSubjects(userId?: string, role?: UserRole): Subject[] {
    const subjects = JSON.parse(localStorage.getItem('stacknova_subjects') || '[]');
    // In a real app, filter by enrollment. Here we return all for demo.
    return subjects;
  }
}

export const mockStore = new MockStore();
import { User, UserRole } from '../types';

// Constants
const STORAGE_KEY = 'stacknova_users_db';
const ACTIVE_USER_KEY = 'stacknova_active_user';

// Initial HOD Account
const DEFAULT_HOD: User = {
  id: 'root-hod-001',
  name: 'Head of Department',
  email: 'HOD@stacknova.com',
  password: 'admin', // Default password, should be changed
  role: UserRole.HOD,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HOD',
  phoneNumber: '9999999999'
};

class MockStore {
  private users: User[];

  constructor() {
    this.users = this.loadUsers();
  }

  private loadUsers(): User[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Initialize with default HOD if no DB exists
      const initial = [DEFAULT_HOD];
      this.saveUsers(initial);
      return initial;
    }
    return JSON.parse(stored);
  }

  private saveUsers(users: User[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    this.users = users;
  }

  // --- Authentication ---

  async login(email: string, password?: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('User not found');
    }

    // Direct password check (In real app, hash checking)
    if (user.password !== password) {
      throw new Error('Invalid password');
    }

    return user;
  }

  async logout(): Promise<void> {
    localStorage.removeItem(ACTIVE_USER_KEY);
  }

  // --- User Management (RBAC) ---

  async registerUser(currentUser: User, newUser: User): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!this.canRegister(currentUser, newUser.role)) {
      throw new Error(`Permission denied: ${currentUser.role} cannot register ${newUser.role}`);
    }

    if (this.users.some(u => u.email === newUser.email)) {
      throw new Error('User with this email already exists');
    }

    const createdUser: User = {
      ...newUser,
      id: crypto.randomUUID(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.name}`
    };

    const updatedUsers = [...this.users, createdUser];
    this.saveUsers(updatedUsers);

    return createdUser;
  }

  // RBAC Rules
  private canRegister(registrar: User, targetRole: UserRole): boolean {
    switch (registrar.role) {
      case UserRole.HOD:
        // HOD can register anyone
        return true;
      case UserRole.TEACHER:
        // Teacher can only register Students (and potentially CRs)
        return targetRole === UserRole.STUDENT || targetRole === UserRole.CR;
      default:
        return false;
    }
  }

  // --- Data Access ---

  getUsersByRole(role: UserRole): User[] {
    return this.users.filter(u => u.role === role);
  }

  getAllUsers(): User[] {
    return this.users;
  }
}

export const mockStore = new MockStore();
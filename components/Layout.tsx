import React from 'react';
import { User, UserRole } from '../types';
import { 
  LogOut, 
  User as UserIcon, 
  BookOpen, 
  Calendar, 
  Bell, 
  MapPin, 
  Users, 
  Shield,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User;
  onLogout: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentUser, onLogout, activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const getMenuItems = () => {
    const common = [
      { id: 'dashboard', label: 'Dashboard', icon: <UserIcon size={20} /> },
      { id: 'notices', label: 'Notices', icon: <Bell size={20} /> },
      { id: 'curriculum', label: 'Curriculum', icon: <BookOpen size={20} /> },
    ];

    if (currentUser.role === UserRole.STUDENT || currentUser.role === UserRole.CR) {
      common.push({ id: 'attendance_student', label: 'Mark Attendance', icon: <MapPin size={20} /> });
      common.push({ id: 'transport', label: 'Transport', icon: <Users size={20} /> });
      common.push({ id: 'marks', label: 'Marks', icon: <Calendar size={20} /> });
    }

    if (currentUser.role === UserRole.CR) {
      common.push({ id: 'attendance_monitor', label: 'Monitor Class', icon: <Shield size={20} /> });
    }

    if (currentUser.role === UserRole.TEACHER) {
      common.push({ id: 'class_management', label: 'Class Management', icon: <Users size={20} /> });
      common.push({ id: 'attendance_teacher', label: 'Attendance Control', icon: <MapPin size={20} /> });
    }

    if (currentUser.role === UserRole.HOD) {
      common.push({ id: 'admin_panel', label: 'Admin Panel', icon: <Shield size={20} /> });
      common.push({ id: 'all_attendance', label: 'All Attendance', icon: <MapPin size={20} /> });
    }

    return common;
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 shadow-sm z-20">
        <div className="p-8 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-200">
            S
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            STACKNOVA
          </span>
        </div>
        
        <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-2">Menu</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <img 
              src={currentUser.avatar} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" 
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate font-medium">{currentUser.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 p-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all text-sm font-semibold"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-6" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">S</div>
                  <span className="text-xl font-bold text-slate-900">STACKNOVA</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-md hover:bg-slate-100">
                  <X className="text-slate-500" />
                </button>
             </div>
             <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onTabChange(item.id); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
             </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-50/50">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm z-10">
          <div className="flex items-center space-x-2">
             <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-200">S</div>
             <span className="font-bold text-lg text-slate-900">STACKNOVA</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-500 p-2 hover:bg-slate-50 rounded-lg">
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 relative scroll-smooth">
           <div className="max-w-7xl mx-auto">
             {children}
           </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
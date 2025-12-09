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
  X,
  ChevronRight,
  Sparkles
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
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-80 bg-white border-r border-slate-200 shadow-xl shadow-slate-200/50 z-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-slate-50 pointer-events-none"></div>

        <div className="p-8 flex items-center space-x-3 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white text-2xl shadow-lg shadow-indigo-500/30">
            S
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 tracking-tight block leading-none">
              STACKNOVA
            </span>
            <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-widest">
              Repowered
            </span>
          </div>
        </div>

        <div className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto scrollbar-hide relative z-10">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 mt-2">Menu</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 font-bold group relative overflow-hidden ${activeTab === item.id
                  ? 'text-white shadow-lg shadow-indigo-500/30'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                }`}
            >
              {activeTab === item.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600"></div>
              )}
              <div className="flex items-center space-x-3 relative z-10">
                <span className={`${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {activeTab === item.id && (
                <div className="relative z-10">
                  <ChevronRight size={16} />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 relative z-10 bg-white/80 backdrop-blur-md border-t border-slate-100">
          <div className="flex items-center space-x-3 mb-4 p-2 bg-slate-50 rounded-2xl border border-slate-100">
            <img
              src={currentUser.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-xl border border-white shadow-sm object-cover"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-indigo-600 truncate font-bold uppercase tracking-wider">{currentUser.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl border border-red-100 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-200 transition-all text-sm font-bold group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm md:hidden animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl p-6 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
                  S
                </div>
                <div>
                  <span className="text-xl font-black text-slate-900 tracking-tight block leading-none">
                    STACKNOVA
                  </span>
                </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-hide py-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onTabChange(item.id); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all font-bold text-lg ${activeTab === item.id
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                      : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                  <span className={`${activeTab === item.id ? 'text-white' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl">
                <img src={currentUser.avatar} alt="Avatar" className="w-12 h-12 rounded-xl object-cover shadow-sm bg-white" />
                <div>
                  <p className="font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-xs text-indigo-600 font-bold uppercase">{currentUser.role}</p>
                </div>
              </div>
              <button
                onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center space-x-2 py-4 rounded-2xl bg-red-50 text-red-600 font-bold text-lg hover:bg-red-100 transition-colors"
              >
                <LogOut size={20} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-50">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">S</div>
            <span className="font-black text-lg text-slate-900 tracking-tight">STACKNOVA</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="w-10 h-10 flex items-center justify-center text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
            <Menu size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto relative scroll-smooth">
          {/* Content Background */}
          <div className="fixed inset-0 pointer-events-none z-0 opacity-50">
            <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-blue-200/20 rounded-full blur-[80px]"></div>
          </div>

          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 relative z-10 pb-24 md:pb-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
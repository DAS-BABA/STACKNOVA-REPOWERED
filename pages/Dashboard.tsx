import React, { useState, useEffect } from 'react';
import { User, UserRole, Notice, AttendanceSession } from '../types';
import { mockStore } from '../services/mockStore';
import { MapPin, Users, BookOpen, Clock, Download, Plus, CheckCircle, AlertTriangle, Bell, Search, Calendar } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

// --- SUB-COMPONENTS ---

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }: any) => (
  <div className="bg-white p-6 rounded-2xl flex items-center space-x-4 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
    <div className={`p-4 rounded-xl ${bgClass} ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

const SectionHeader = ({ title, description, action }: any) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
    <div>
      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
      <p className="text-slate-500 mt-1 text-lg">{description}</p>
    </div>
    {action && <div>{action}</div>}
  </div>
);

const NoticeBoard = ({ user }: { user: User }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');

  useEffect(() => {
    setNotices(mockStore.getNotices());
  }, []);

  const handlePost = () => {
    if (!newNoticeTitle || !newNoticeContent) return;
    const notice: Notice = {
      id: Date.now().toString(),
      title: newNoticeTitle,
      content: newNoticeContent,
      authorId: user.id,
      authorName: user.name,
      date: new Date().toISOString(),
      targetAudience: 'ALL'
    };
    mockStore.addNotice(notice);
    setNotices(mockStore.getNotices());
    setNewNoticeTitle('');
    setNewNoticeContent('');
  };

  const canPost = user.role !== UserRole.STUDENT;

  return (
    <div className="space-y-6">
      <SectionHeader title="Notice Board" description="Latest announcements and updates." />
      
      {canPost && (
        <div className="bg-white p-6 rounded-2xl space-y-4 shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" />
            Create Announcement
          </h3>
          <input 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
            placeholder="Notice Title"
            value={newNoticeTitle}
            onChange={e => setNewNoticeTitle(e.target.value)}
          />
          <textarea 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all h-32 resize-none placeholder:text-slate-400"
            placeholder="Write your announcement details here..."
            value={newNoticeContent}
            onChange={e => setNewNoticeContent(e.target.value)}
          />
          <div className="flex justify-end">
            <button 
              onClick={handlePost}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-indigo-200"
            >
              Post Notice
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {notices.map(notice => (
          <div key={notice.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{notice.title}</h4>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{format(new Date(notice.date), 'MMM dd, yyyy')}</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">{notice.content}</p>
            <div className="flex items-center space-x-2 pt-4 border-t border-slate-50">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                 {notice.authorName.charAt(0)}
              </div>
              <div className="text-sm">
                <span className="text-slate-500">Posted by </span>
                <span className="font-semibold text-slate-800">{notice.authorName}</span>
              </div>
              <div className="flex-1"></div>
              <UserRoleBadge role={notice.authorId === user.id ? user.role : 'Admin'} />
            </div>
          </div>
        ))}
        {notices.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Bell size={24} />
            </div>
            <p className="text-slate-500 font-medium">No notices published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const UserRoleBadge = ({ role }: { role: string }) => {
  const styles: Record<string, string> = {
    STUDENT: 'bg-blue-50 text-blue-700 border-blue-200',
    CR: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    TEACHER: 'bg-purple-50 text-purple-700 border-purple-200',
    HOD: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${styles[role] || styles['STUDENT']}`}>
      {role}
    </span>
  );
};

// --- ROLE SPECIFIC VIEWS ---

// 1. STUDENT / CR VIEW (Attendance Marking)
const AttendanceMarking = ({ user }: { user: User }) => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleSubmit = async () => {
    if (code.length !== 6) {
      setMsg("Code must be 6 digits");
      setStatus('error');
      return;
    }
    setStatus('loading');
    setMsg("Acquiring location...");

    if (!navigator.geolocation) {
      setMsg("Geolocation is not supported by your browser.");
      setStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        try {
          const { latitude, longitude } = position.coords;
          mockStore.joinAttendance(code, user, { lat: latitude, lng: longitude });
          setStatus('success');
          setMsg("Attendance Marked Successfully!");
        } catch (err: any) {
          setStatus('error');
          setMsg(err.message);
        }
      },
      (err) => {
        setStatus('error');
        setMsg("Unable to retrieve location. Please allow location access.");
      }
    );
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="bg-white p-10 rounded-3xl text-center space-y-8 shadow-xl shadow-slate-200 border border-slate-100">
        <div className="mx-auto w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shadow-inner">
          <MapPin size={40} />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Mark Attendance</h2>
          <p className="text-slate-500 text-lg">Enter the 6-digit session code.</p>
        </div>
        
        <div className="relative max-w-xs mx-auto">
          <input 
            type="text" 
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g,''))}
            className="w-full text-center text-5xl font-mono tracking-[0.5em] bg-slate-50 border-2 border-slate-200 rounded-2xl py-6 text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-300"
            placeholder="000000"
          />
        </div>

        <button 
          onClick={handleSubmit}
          disabled={status === 'loading' || status === 'success'}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 ${
            status === 'success' 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200'
          } disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          {status === 'loading' ? 'Verifying...' : status === 'success' ? 'Marked Successfully!' : 'Submit Attendance'}
        </button>

        {msg && (
          <div className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 ${
            status === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 
            status === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'text-slate-500'
          }`}>
            {status === 'error' && <AlertTriangle size={16} />}
            {status === 'success' && <CheckCircle size={16} />}
            <span>{msg}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// 2. TEACHER / CR / HOD VIEW (Attendance Monitor)
const AttendanceMonitor = ({ user }: { user: User }) => {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);

  useEffect(() => {
    // Polling simulation
    const interval = setInterval(() => {
      setSessions(mockStore.getAttendanceSessions());
      if (selectedSession) {
        const updated = mockStore.getAttendanceSessions().find(s => s.id === selectedSession.id);
        if (updated) setSelectedSession(updated);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedSession]);

  const generateCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const session: AttendanceSession = {
      id: Date.now().toString(),
      code,
      creatorId: user.id,
      subject: 'Advanced Algorithms', // Hardcoded for demo
      createdAt: new Date().toISOString(),
      isActive: true,
      division: user.division || 'A',
      attendees: []
    };
    mockStore.createAttendanceSession(session);
    setSessions(mockStore.getAttendanceSessions());
  };

  const downloadPDF = (session: AttendanceSession) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`Attendance Report: ${session.subject}`, 14, 22);
    doc.setFontSize(12);
    doc.text(`Date: ${format(new Date(session.createdAt), 'PPP p')}`, 14, 32);
    doc.text(`Code: ${session.code}`, 14, 38);
    doc.text(`Total Attendees: ${session.attendees.length}`, 14, 44);

    const tableData = session.attendees.map(a => [
      a.studentName,
      a.enrollmentNo,
      format(new Date(a.timestamp), 'p'),
      `${a.location.lat.toFixed(4)}, ${a.location.lng.toFixed(4)}`
    ]);

    autoTable(doc, {
      head: [['Name', 'Enrollment', 'Time', 'Location (Lat, Lng)']],
      body: tableData,
      startY: 50,
      theme: 'grid',
    });

    // Add a note about the map
    doc.text("Note: Live locations were verified via geolocation at the time of submission.", 14, (doc as any).lastAutoTable.finalY + 10);
    
    doc.save(`attendance_${session.code}.pdf`);
  };

  const locations = selectedSession ? selectedSession.attendees.map(a => ({
    lat: a.location.lat,
    lng: a.location.lng,
    label: a.studentName
  })) : [];

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Attendance Monitor" 
        description="Generate codes and track real-time student location."
        action={
          <button 
            onClick={generateCode}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center space-x-2 transition-all transform hover:-translate-y-1"
          >
            <Plus size={20} />
            <span>New Session</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-lg font-bold text-slate-800">Active Sessions</h3>
             <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{sessions.length} total</span>
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {sessions.slice().reverse().map(session => (
              <div 
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className={`p-5 rounded-xl cursor-pointer border-2 transition-all group ${
                  selectedSession?.id === session.id 
                    ? 'bg-indigo-50 border-indigo-500 shadow-md' 
                    : 'bg-white border-transparent hover:border-indigo-100 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-mono font-bold text-slate-800 tracking-wider group-hover:text-indigo-600 transition-colors">{session.code}</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${session.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {session.isActive ? 'LIVE' : 'CLOSED'}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-600 mb-3">{session.subject}</p>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400 font-medium">{format(new Date(session.createdAt), 'p')}</span>
                  <div className="flex items-center text-indigo-600 text-sm font-bold bg-indigo-50 px-2 py-1 rounded-lg">
                    <Users size={14} className="mr-1.5" />
                    {session.attendees.length}
                  </div>
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="text-slate-400 text-center py-10 bg-white rounded-xl border border-dashed border-slate-200">
                <p>No active sessions.</p>
                <p className="text-xs mt-1">Generate a code to start.</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2 bg-white rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-lg border border-slate-100 relative">
          {selectedSession ? (
            <>
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10 shadow-sm">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    Live Monitor: {selectedSession.code}
                  </h3>
                  <p className="text-xs text-slate-500 pl-4">Updating in real-time...</p>
                </div>
                <button 
                  onClick={() => downloadPDF(selectedSession)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
                >
                  <Download size={16} />
                  <span>Export Report</span>
                </button>
              </div>
              
              <div className="flex-1 relative bg-slate-100">
                {/* Map */}
                <div className="absolute inset-0 z-0">
                  <MapComponent locations={locations} />
                </div>
                
                {/* Overlay List */}
                <div className="absolute top-4 right-4 w-72 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl max-h-[calc(100%-2rem)] overflow-y-auto z-[1000] shadow-xl p-3">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendees</h4>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{selectedSession.attendees.length}</span>
                  </div>
                  <div className="space-y-1">
                    {selectedSession.attendees.map((a, i) => (
                      <div key={i} className="flex items-center space-x-3 p-2.5 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200">
                          {a.studentName.charAt(0)}
                        </div>
                        <div className="overflow-hidden flex-1">
                          <p className="text-sm font-semibold text-slate-800 truncate">{a.studentName}</p>
                          <p className="text-xs text-slate-500 font-mono">{a.enrollmentNo}</p>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {format(new Date(a.timestamp), 'HH:mm')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                <MapPin size={32} className="opacity-50" />
              </div>
              <p className="font-medium text-lg">Select a session to view live tracking.</p>
              <p className="text-sm text-slate-400 mt-2">Real-time geolocation updates will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 3. CURRICULUM & PROFILE VIEWS
const CurriculumView = ({ user }: { user: User }) => {
  const subjects = mockStore.getSubjects(user.id, user.role);
  
  return (
    <div className="space-y-6">
       <SectionHeader title="Curriculum & Assignments" description="Manage your academic tasks and deadlines." />
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {subjects.map(subject => (
           <div key={subject.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group">
             <div className="flex justify-between items-start mb-6">
               <div>
                 <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md mb-2 inline-block tracking-wider">
                   {subject.code}
                 </span>
                 <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{subject.name}</h3>
               </div>
               <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                 <BookOpen size={24} />
               </div>
             </div>
             
             <div className="space-y-4">
               <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                 <span>Pending Assignments</span>
                 <span className="h-px bg-slate-100 flex-1"></span>
               </h4>
               {subject.assignments.length > 0 ? (
                 subject.assignments.map(assign => (
                   <div key={assign.id} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
                      <div className="mt-1 text-slate-400"><CheckCircle size={18} /></div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{assign.title}</p>
                        <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                          <Clock size={12} /> Due: {assign.dueDate}
                        </p>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-sm text-slate-500 font-medium">No pending assignments.</p>
                 </div>
               )}
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};

// --- MAIN DASHBOARD CONTAINER ---

interface DashboardProps {
  user: User;
  activeTab: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fade-in">
             <SectionHeader 
               title={`Welcome back, ${user.name.split(' ')[0]}`} 
               description="Here is your daily activity overview."
             />
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <StatCard 
                 title="Total Classes" 
                 value="12" 
                 icon={BookOpen} 
                 bgClass="bg-blue-50" 
                 colorClass="text-blue-600" 
               />
               <StatCard 
                 title="Attendance" 
                 value="85%" 
                 icon={CheckCircle} 
                 bgClass="bg-emerald-50" 
                 colorClass="text-emerald-600" 
               />
               <StatCard 
                 title="Pending Tasks" 
                 value="3" 
                 icon={Clock} 
                 bgClass="bg-amber-50" 
                 colorClass="text-amber-600" 
               />
               <StatCard 
                 title="Notices" 
                 value="5" 
                 icon={Bell} 
                 bgClass="bg-purple-50" 
                 colorClass="text-purple-600" 
               />
             </div>
             
             {/* Quick Actions based on Role */}
             <div className="mt-8">
               <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {(user.role === UserRole.STUDENT || user.role === UserRole.CR) && (
                   <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-xl shadow-indigo-200 transform hover:scale-[1.02] transition-all cursor-pointer">
                      <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                        <MapPin size={24} className="text-white" />
                      </div>
                      <h4 className="font-bold text-2xl mb-2">Mark Attendance</h4>
                      <p className="text-indigo-100 text-sm">Enter the code from your teacher to mark yourself present.</p>
                   </div>
                 )}
                 {(user.role === UserRole.TEACHER || user.role === UserRole.CR || user.role === UserRole.HOD) && (
                   <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-xl shadow-slate-200 transform hover:scale-[1.02] transition-all cursor-pointer">
                      <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                        <Users size={24} className="text-white" />
                      </div>
                      <h4 className="font-bold text-2xl mb-2">Monitor Class</h4>
                      <p className="text-slate-300 text-sm">Track real-time location and attendance status.</p>
                   </div>
                 )}
                  <div className="p-8 rounded-2xl bg-white border border-slate-200 text-slate-800 shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all cursor-pointer">
                      <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <Calendar size={24} className="text-indigo-600" />
                      </div>
                      <h4 className="font-bold text-2xl mb-2">Schedule</h4>
                      <p className="text-slate-500 text-sm">View your upcoming classes and events.</p>
                   </div>
               </div>
             </div>
          </div>
        );
      case 'notices':
        return <NoticeBoard user={user} />;
      case 'attendance_student':
        return <AttendanceMarking user={user} />;
      case 'attendance_monitor':
      case 'attendance_teacher':
      case 'all_attendance':
        return <AttendanceMonitor user={user} />;
      case 'curriculum':
        return <CurriculumView user={user} />;
      case 'class_management':
        return (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Users size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Class Management</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2">Manage groupings, CR assignment, and registrations here.</p>
            </div>
        );
      case 'admin_panel':
        return (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <AlertTriangle size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">HOD Admin Panel</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2">Global registry and system configuration.</p>
            </div>
        );
      default:
        return <div className="p-10 text-center text-slate-500">Feature Under Construction</div>;
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      {renderContent()}
    </div>
  );
};

export default Dashboard;
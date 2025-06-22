// components/Sidebar.tsx
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, LayoutDashboard, ClipboardList, 
  X, Menu, GraduationCap, Settings, 
  BookOpen, HelpCircle, LogOut 
} from 'lucide-react';

const routes = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/pre_reg', label: 'Pre‑Registration', icon: ClipboardList },
    { path: '/student/22XX230', label: 'Pre registered courses', icon: LayoutDashboard },
  { path: '/courses', label: 'My Courses', icon: BookOpen },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/help', label: 'Help Center', icon: HelpCircle },
];

export default function Sidebar() {
  const [open, setOpen] = React.useState(false);
  
  // Close sidebar when pressing Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      {/* Modern hamburger button */}
      <button
        className="md:hidden fixed top-6 left-6 z-50 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
        onClick={() => setOpen(o => !o)}
      >
        {open ? (
          <X size={24} className="transform group-hover:rotate-90 transition-transform" />
        ) : (
          <Menu size={24} className="transform group-hover:scale-110 transition-transform" />
        )}
        <span className="sr-only">Toggle sidebar</span>
      </button>

      {/* Overlay when open on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Enhanced Sidebar */}
      <nav
        className={`
          fixed top-0 left-0 h-full w-72
          transform transition-all duration-300 ease-in-out
          z-50
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col bg-gradient-to-br from-blue-900/90 via-blue-800/90 to-indigo-900/90 backdrop-blur-lg border-r border-blue-700/30 shadow-2xl">
          {/* Header with logo and close button for mobile */}
          <div className="p-6 pb-4 border-b border-blue-600/30 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-3 rounded-xl shadow-lg">
                <GraduationCap className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">EduPortal</h2>
                <p className="text-sm text-blue-200 font-light">Student Management System</p>
              </div>
            </div>
            
            {/* Close button for mobile (visible only on small screens) */}
            <button 
              className="md:hidden p-2 rounded-lg text-blue-200 hover:bg-blue-700/50 hover:text-white transition-colors"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Navigation links */}
          <ul className="mt-4 px-3 flex-1">
            {routes.map((r) => (
              <li key={r.path} className="mb-1">
                <NavLink
                  to={r.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-xl transition-all duration-300 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-600/60 to-indigo-600/60 text-white shadow-lg' 
                      : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'}`
                  }
                  onClick={() => setOpen(false)}
                >
                  <r.icon 
                    size={20} 
                    className="mr-3" 
                  />
                  <span className="font-medium">{r.label}</span>
                  <div className="ml-auto">
                    {r.path === '/pre_reg' && (
                      <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-200">
                        New
                      </span>
                    )}
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
          
          {/* User section */}
          <div className="p-4 border-t border-blue-700/30">
            <div className="flex items-center p-3 bg-blue-800/30 rounded-xl">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                <span className="font-bold text-white">JS</span>
              </div>
              <div className="ml-3">
                <p className="font-medium text-white text-sm">John Smith</p>
                <p className="text-xs text-blue-200">Student ID: 22XX230</p>
              </div>
              <button className="ml-auto p-2 rounded-lg text-blue-200 hover:bg-blue-700/50 hover:text-white transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
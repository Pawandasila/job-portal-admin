import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  Briefcase,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  User,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { logout } = useContext(AuthContext);

  const navigation = [
    { name: 'Dashboard', icon: Home, path: '/home' },
    { name: 'Job Management', icon: Briefcase, path: '/jobs' },
    { name: 'Applicant Management', icon: Users, path: '/applicants' },
    { name: 'Companie Management', icon: Activity, path: '/companies' },
    { name: 'Report Management', icon: FileText, path: '/reports' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.div 
      initial={false}
      animate={{ 
        width: collapsed ? 80 : 256,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
      className="h-screen  shadow-xl fixed left-0 top-0 z-40 flex flex-col border-r border-indigo-700"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 border-b border-indigo-700/50 px-4">
        <AnimatePresence>
          {!collapsed && (
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="text-xl font-bold  bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 animate-fadeIn"
            >
              JobPortal
            </motion.h1>
          )}
        </AnimatePresence>
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ rotate: collapsed ? -180 : 180, backgroundColor: "rgba(79, 70, 229, 0.5)" }}
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-full bg-indigo-700/30 text-white focus:outline-none ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </motion.button>
      </div>
      
      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="space-y-3">
          {navigation.map((item) => {
            const active = isActive(item.path);
            return (
              <motion.div key={item.name} whileHover={{ x: active ? 4 : 2 }}>
                <Link
                  to={item.path}
                  className={`flex items-center ${
                    collapsed ? 'justify-center' : 'px-4'
                  } py-3 text-sm font-medium rounded-xl ${
                    active
                      ? 'text-white bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-blue-500/20'
                      : 'text-gray-600 hover:bg-indigo-500/30 hover:text-gray-800'
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    animate={{ scale: active ? 1.1 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <item.icon className={`${collapsed ? 'mx-auto' : 'mr-3'} h-5 w-5`} />
                  </motion.div>
                  
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={active ? 'font-semibold' : ''}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>
      
      {/* User Profile Footer */}
      <div className="border-t border-indigo-700/50 py-4 px-4 relative">
        <div 
          className={`flex items-center ${collapsed ? 'justify-center' : ''} cursor-pointer`}
          onClick={() => !collapsed && setShowUserMenu(!showUserMenu)}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white flex-shrink-0 shadow-md"
          >
            <User className="h-5 w-5" />
          </motion.div>
          
          <AnimatePresence>
            {!collapsed && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="ml-3 flex-1 flex items-center"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Admin User</p>
                  <p className="text-xs text-gray-500">admin@jobportal.com</p>
                </div>
                <motion.div
                  animate={{ rotate: showUserMenu ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* User dropdown menu */}
        <AnimatePresence>
          {showUserMenu && !collapsed && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute bottom-full left-2 mb-2 w-56 bg-indigo-800 rounded-lg shadow-xl py-1 z-50 border border-indigo-700/50"
            >
              <motion.div whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.5)' }}>
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-200 first:rounded-t-lg">
                  View Profile
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.5)' }}>
                <Link to="/account-settings" className="block px-4 py-2 text-sm text-gray-200">
                  Account Settings
                </Link>
              </motion.div>
              
              <div className="border-t border-indigo-700/50 my-1"></div>
              
              <motion.div whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.5)' }}>
                <button onClick={logout} className="flex w-full items-center px-4 py-2 text-sm text-red-300 last:rounded-b-lg">
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Logout</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Simple logout for collapsed state */}
        {collapsed && (
          <motion.div 
            whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.5)' }}
            className="mt-3 flex justify-center py-2 rounded-lg"
          >
            <Link to="/login" className="text-gray-300">
              <LogOut className="h-5 w-5" />
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;
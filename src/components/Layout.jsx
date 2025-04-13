import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Bell, Search, User, Menu } from 'lucide-react';

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className={`flex flex-col flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Top navbar - now completely separate from the sidebar */}
        <header className="bg-white shadow-sm z-10 sticky top-0">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Mobile menu button - only shows on small screens */}
            <button 
              className="p-2 rounded-md text-gray-500 lg:hidden" 
              onClick={() => setCollapsed(!collapsed)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Search bar */}
            <div className="flex-1 max-w-lg ml-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  type="text"
                  placeholder="Search jobs, candidates, or companies..."
                />
              </div>
            </div>
            
            {/* Right navbar items */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-6 w-6" />
                </button>
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">3</span>
                
                {/* Notification dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50">
                    <div className="px-4 py-2 border-b">
                      <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer">
                          <p className="text-sm font-medium text-gray-900">New application received</p>
                          <p className="text-xs text-gray-500">Senior Developer position • 10 min ago</p>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 text-center">
                      <button className="text-xs font-medium text-blue-600 hover:text-blue-500">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User profile menu */}
              <div className="relative">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="ml-2 hidden md:block">
                    <p className="text-sm font-medium text-gray-700">Admin User</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
                
                {/* Profile dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Your Profile
                      </a>
                      <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                      </a>
                      <div className="border-t my-1"></div>
                      <a href="/login" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                        Sign out
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 p-2">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
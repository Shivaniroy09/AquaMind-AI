import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Droplets, LogOut, User as UserIcon, Moon, Sun, ShieldAlert, Home } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isDark, setIsDark] = React.useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = React.useState(false)

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
      setIsDark(true)
    }
  }

  return (
    <nav className="glass-panel sticky top-0 z-50 mb-8 border-b-0 rounded-none md:rounded-b-2xl mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <Droplets className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-400">
              AquaMind AI
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Home className="h-4 w-4" />
            <span className="hidden sm:block">Home</span>
          </Link>
          
          {user?.is_admin && (
            <div className="relative">
              <button 
                onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                onBlur={() => setTimeout(() => setIsAdminDropdownOpen(false), 200)}
                className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer focus:outline-none"
              >
                <ShieldAlert className="h-4 w-4" />
                <span className="hidden sm:block">Admin</span>
              </button>
              
              {isAdminDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700 z-50">
                  <Link 
                    to="/admin?type=user" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    onClick={() => setIsAdminDropdownOpen(false)}
                  >
                    User Details
                  </Link>
                  <Link 
                    to="/admin?type=admin" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    onClick={() => setIsAdminDropdownOpen(false)}
                  >
                    Admin Details
                  </Link>
                </div>
              )}
            </div>
          )}
          
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              className="flex items-center gap-2 ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition cursor-pointer focus:outline-none"
            >
              <UserIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium hidden sm:block text-gray-700 dark:text-gray-300">{user?.username}</span>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700 z-50">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <UserIcon className="h-4 w-4 text-blue-500" />
                  Edit Profile
                </Link>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

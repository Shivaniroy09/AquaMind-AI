import React, { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { User as UserIcon, Lock, Save, ShieldAlert } from 'lucide-react'
import api from '../services/api'

export default function Profile() {
  const { user, login } = useContext(AuthContext)
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    company_name: user?.company_name || '',
    address: user?.address || ''
  })
  
  const [countryCode, setCountryCode] = useState('+1')
  const [phoneNumberInput, setPhoneNumberInput] = useState('')

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  const [profileStatus, setProfileStatus] = useState({ type: '', message: '' })
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  // Pre-fill profile data on load
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        company_name: user.company_name || '',
        address: user.address || ''
      })
      
      if (user.phone_number) {
        const match = user.phone_number.match(/^(\+\d{1,4})\s?(.*)$/)
        if (match) {
            setCountryCode(match[1])
            setPhoneNumberInput(match[2])
        } else {
            setPhoneNumberInput(user.phone_number)
        }
      }
    }
  }, [user])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setProfileStatus({ type: '', message: '' })
    
    const fullPhoneNumber = phoneNumberInput.trim() ? `${countryCode} ${phoneNumberInput.trim()}` : ''
    const payload = {
        ...profileData,
        phone_number: fullPhoneNumber
    }
    
    try {
      const res = await api.put('/auth/me', payload)
      setProfileStatus({ type: 'success', message: 'Profile updated successfully!' })
      // Optionally update the context user here if needed, or trigger a re-fetch
      // For simplicity, we could refresh the token or just let the user know they might need to re-login if username changed.
    } catch (error) {
      setProfileStatus({ type: 'error', message: error.response?.data?.detail || 'Failed to update profile.' })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match.' })
      return
    }
    
    setLoading(true)
    setPasswordStatus({ type: '', message: '' })
    try {
      await api.put('/auth/me/password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      })
      setPasswordStatus({ type: 'success', message: 'Password changed successfully!' })
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' })
    } catch (error) {
      setPasswordStatus({ type: 'error', message: error.response?.data?.detail || 'Failed to change password.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <UserIcon className="text-blue-500" /> My Profile
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your personal information and security settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Profile Details Form */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-teal-500" />
            Profile Details
          </h3>
          
          {profileStatus.message && (
            <div className={`mb-6 p-4 rounded-lg border ${profileStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800' : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800'}`}>
              {profileStatus.message}
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <input 
                  type="text" 
                  required
                  className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white"
                  value={profileData.username}
                  onChange={e => setProfileData({...profileData, username: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white"
                  value={profileData.email}
                  onChange={e => setProfileData({...profileData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
              <div className="mt-1 flex rounded-lg shadow-sm">
                <select
                  className="bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-l-lg px-3 py-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white border-r-0"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="+1">🇺🇸/🇨🇦 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+86">🇨🇳 +86</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+55">🇧🇷 +55</option>
                  <option value="+27">🇿🇦 +27</option>
                </select>
                <input 
                  type="tel" 
                  className="flex-1 min-w-0 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-r-lg focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white"
                  value={phoneNumberInput}
                  onChange={e => setPhoneNumberInput(e.target.value)}
                  placeholder="(555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
              <input 
                type="text" 
                className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white"
                value={profileData.company_name}
                onChange={e => setProfileData({...profileData, company_name: e.target.value})}
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
              <textarea 
                rows="3"
                className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white"
                value={profileData.address}
                onChange={e => setProfileData({...profileData, address: e.target.value})}
                placeholder="123 Water St, City, Country"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="h-4 w-4" /> Save Profile
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="space-y-8">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-500" />
              Change Password
            </h3>

            {passwordStatus.message && (
              <div className={`mb-6 p-4 rounded-lg border ${passwordStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800' : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800'}`}>
                {passwordStatus.message}
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                <input 
                  type="password" 
                  required
                  className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  value={passwordData.current_password}
                  onChange={e => setPasswordData({...passwordData, current_password: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                <input 
                  type="password" 
                  required
                  className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  value={passwordData.new_password}
                  onChange={e => setPasswordData({...passwordData, new_password: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                <input 
                  type="password" 
                  required
                  className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  value={passwordData.confirm_password}
                  onChange={e => setPasswordData({...passwordData, confirm_password: e.target.value})}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Lock className="h-4 w-4" /> Update Password
                </button>
              </div>
            </form>
          </div>

          {user?.is_admin && (
            <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-purple-100 dark:border-purple-800/30">
              <h3 className="text-xl font-semibold mb-2 text-purple-900 dark:text-purple-100 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-purple-500" />
                Administrator Privileges
              </h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                You have elevated permissions. As an admin, you can view other users' insights, manage platform-wide features, and access advanced analytics via the Admin Dashboard.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

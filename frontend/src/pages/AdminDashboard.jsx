import React, { useState, useEffect, useContext } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Users, Activity, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import api from '../services/api'

export default function AdminDashboard() {
  const { user } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedUserId, setExpandedUserId] = useState(null)
  const [userActivity, setUserActivity] = useState({})
  const [userRecommendations, setUserRecommendations] = useState({})
  const [activityLoading, setActivityLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const viewType = searchParams.get('type') || 'user'
  
  const filteredUsers = users.filter(u => viewType === 'admin' ? u.is_admin : !u.is_admin)
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#4ECDC4'];
  const CATEGORIES = ['Kitchen', 'Bathroom', 'Laundry', 'Garden', 'Cleaning', 'Drinking', 'Others'];

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching users", error)
      setLoading(false)
    }
  }

  const toggleUserExpansion = async (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null)
      return
    }
    
    setExpandedUserId(userId)
    
    // Fetch activity if not already fetched
    if (!userActivity[userId]) {
      setActivityLoading(true)
      try {
        const [actRes, recRes] = await Promise.all([
          api.get(`/admin/users/${userId}/activity`),
          api.get(`/admin/users/${userId}/recommendations`)
        ]);
        setUserActivity(prev => ({...prev, [userId]: actRes.data}))
        setUserRecommendations(prev => ({...prev, [userId]: recRes.data.recommendations}))
      } catch (error) {
        console.error(`Error fetching data for user ${userId}`, error)
      } finally {
        setActivityLoading(false)
      }
    }
  }

  if (!user?.is_admin) {
    return <Navigate to="/" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="text-blue-500" /> {viewType === 'admin' ? 'Admin Details' : 'User Details'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {viewType === 'admin' ? 'Manage admin accounts and their activity.' : 'Manage users and monitor their activity.'}
          </p>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/20">
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">ID</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Username</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Email</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Total Usage</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Entries</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Role</th>
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <React.Fragment key={u.id}>
                    <tr 
                      className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
                      onClick={() => toggleUserExpansion(u.id)}
                    >
                      <td className="p-4 text-gray-700 dark:text-gray-300">{u.id}</td>
                      <td className="p-4 font-medium text-gray-900 dark:text-white">{u.username}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                      <td className="p-4 text-blue-600 dark:text-blue-400 font-semibold">{u.total_water_usage.toFixed(1)} L</td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{u.usage_count}</td>
                      <td className="p-4">
                        {u.is_admin ? (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded text-xs font-bold">Admin</span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded text-xs font-bold">User</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {expandedUserId === u.id ? <ChevronUp className="inline text-gray-400" /> : <ChevronDown className="inline text-gray-400" />}
                      </td>
                    </tr>
                    
                    {/* Expanded Activity Row */}
                    {expandedUserId === u.id && (
                      <tr className="bg-gray-50/50 dark:bg-gray-800/10 border-b border-gray-200 dark:border-gray-700/50">
                        <td colSpan="7" className="p-6">
                          <h4 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            <Activity className="h-4 w-4 text-teal-500" /> Insights for {u.username}
                          </h4>
                          
                          {activityLoading && !userActivity[u.id] ? (
                            <p className="text-sm text-gray-500">Loading insights...</p>
                          ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Left Column: Chart & Activity */}
                              <div className="space-y-6">
                                {userActivity[u.id]?.length > 0 ? (
                                  <>
                                    <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-700 rounded-lg p-4 shadow-sm h-[340px] flex flex-col">
                                      <h5 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Usage Breakdown</h5>
                                      <div className="flex-1 w-full relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                          <PieChart>
                                            <Pie
                                              data={CATEGORIES.map(cat => ({
                                                name: cat,
                                                value: userActivity[u.id].filter(a => a.category === cat).reduce((sum, curr) => sum + curr.amount_liters, 0)
                                              })).filter(d => d.value > 0)}
                                              cx="50%"
                                              cy="45%"
                                              innerRadius={55}
                                              outerRadius={80}
                                              paddingAngle={5}
                                              dataKey="value"
                                            >
                                              {CATEGORIES.map(cat => ({
                                                name: cat,
                                                value: userActivity[u.id].filter(a => a.category === cat).reduce((sum, curr) => sum + curr.amount_liters, 0)
                                              })).filter(d => d.value > 0).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                              ))}
                                            </Pie>
                                            <Tooltip 
                                              contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                                              itemStyle={{ color: '#fff' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                          </PieChart>
                                        </ResponsiveContainer>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h5 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Recent Logs</h5>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                        {userActivity[u.id].slice(0, 10).map(activity => (
                                          <div key={activity.id} className="p-3 bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm">
                                            <div className="flex justify-between items-center mb-1">
                                              <span className="font-medium text-gray-900 dark:text-white text-sm">{activity.category}</span>
                                              <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">{activity.amount_liters} L</span>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                              {new Date(activity.date_recorded).toLocaleString()}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <p className="text-sm text-gray-500 italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">No usage activity found for this user.</p>
                                )}
                              </div>
                              
                              {/* Right Column: Admin AI Guidance */}
                              <div>
                                <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-700 rounded-lg p-5 shadow-sm h-full">
                                  <h5 className="flex items-center gap-2 text-md font-semibold mb-4 text-gray-900 dark:text-white">
                                    <Lightbulb className="text-yellow-500 h-5 w-5" />
                                    AI Admin Guidance
                                  </h5>
                                  {userRecommendations[u.id] ? (
                                    <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                                      {userRecommendations[u.id].map((rec, i) => (
                                        <li key={i} className="flex gap-3 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                                          <span className="text-blue-500 flex-shrink-0">✦</span>
                                          <span>{rec}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-sm text-gray-500">Loading recommendations...</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                
                {filteredUsers.length === 0 && !loading && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">No {viewType}s found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

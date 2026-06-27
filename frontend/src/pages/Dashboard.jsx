import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { Droplets, TrendingUp, AlertTriangle, Lightbulb, Plus, Trash2 } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'

export default function Dashboard() {
  const [summary, setSummary] = useState({ today_usage: 0, weekly_usage: 0, monthly_usage: 0 })
  const [usages, setUsages] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [leakInfo, setLeakInfo] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [newUsage, setNewUsage] = useState({ category: 'Kitchen', amount_liters: '' })

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#4ECDC4'];
  const CATEGORIES = ['Kitchen', 'Bathroom', 'Laundry', 'Garden', 'Cleaning', 'Drinking', 'Others']

  const fetchData = async () => {
    try {
      const [sumRes, usageRes, predRes, leakRes, recRes] = await Promise.all([
        api.get('/usage/summary'),
        api.get('/usage/'),
        api.get('/ai/predict'),
        api.get('/ai/detect-leak'),
        api.get('/ai/recommendations')
      ])
      setSummary(sumRes.data)
      setUsages(usageRes.data)
      setPrediction(predRes.data)
      setLeakInfo(leakRes.data)
      setRecommendations(recRes.data.recommendations)
    } catch (error) {
      console.error("Error fetching dashboard data", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddUsage = async (e) => {
    e.preventDefault()
    if (!newUsage.amount_liters) return;
    try {
      await api.post('/usage/', { ...newUsage, amount_liters: parseFloat(newUsage.amount_liters) })
      setNewUsage({ ...newUsage, amount_liters: '' })
      fetchData()
    } catch (error) {
      console.error("Failed to add usage", error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/usage/${id}`)
      fetchData()
    } catch (error) {
      console.error("Failed to delete", error)
    }
  }

  // Prepare chart data
  const pieData = CATEGORIES.map(cat => ({
    name: cat,
    value: usages.filter(u => u.category === cat).reduce((acc, curr) => acc + curr.amount_liters, 0)
  })).filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Today's Usage</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{summary.today_usage.toFixed(1)} L</p>
          </div>
          <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full">
            <Droplets className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Weekly Usage</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{summary.weekly_usage.toFixed(1)} L</p>
          </div>
          <div className="p-4 bg-teal-100 dark:bg-teal-900/50 rounded-full">
            <TrendingUp className="h-8 w-8 text-teal-600 dark:text-teal-400" />
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Predicted Tomorrow</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{prediction ? prediction.predicted_tomorrow_liters.toFixed(1) : '-'} L</p>
          </div>
          <div className="p-4 bg-purple-100 dark:bg-purple-900/50 rounded-full">
            <Lightbulb className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Usage & List */}
        <div className="glass-panel p-6 lg:col-span-1 flex flex-col h-[500px]">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Record Usage</h3>
          <form onSubmit={handleAddUsage} className="flex flex-col sm:flex-row gap-3 mb-6">
            <select 
              className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card px-3 py-2 text-sm text-gray-900 dark:text-white"
              value={newUsage.category}
              onChange={e => setNewUsage({...newUsage, category: e.target.value})}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input 
              type="number"
              placeholder="Liters"
              step="0.1"
              required
              className="flex-1 sm:w-24 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card px-3 py-2 text-sm text-gray-900 dark:text-white"
              value={newUsage.amount_liters}
              onChange={e => setNewUsage({...newUsage, amount_liters: e.target.value})}
            />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
              <Plus className="h-5 w-5" />
            </button>
          </form>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {usages.map((u) => (
              <div key={u.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{u.category}</p>
                  <p className="text-xs text-gray-500">{new Date(u.date_recorded).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900 dark:text-white">{u.amount_liters} L</span>
                  <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts and AI Insights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Usage Breakdown</h3>
            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Leak Detection */}
            <div className="glass-panel p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                <AlertTriangle className={leakInfo?.risk_level === 'High' ? 'text-red-500' : 'text-yellow-500'} />
                Anomaly Detection
              </h3>
              {leakInfo ? (
                <div>
                  <div className="mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Risk Level: </span>
                    <span className={`font-bold ${leakInfo.risk_level === 'High' ? 'text-red-500' : leakInfo.risk_level === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>
                      {leakInfo.risk_level}
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    {(leakInfo.suggestions || []).map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-500">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Analyzing...</p>
              )}
            </div>

            {/* AI Recommendations */}
            <div className="glass-panel p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                <Lightbulb className="text-yellow-500" />
                AI Recommendations
              </h3>
              <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                {recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-blue-500 flex-shrink-0">✦</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

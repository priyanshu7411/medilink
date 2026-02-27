import { useState, useEffect } from 'react'
import { Calendar, TrendingUp, CheckCircle, XCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { storage } from '../utils/localStorage'

export default function AdherenceTracker({ medicationId }) {
  const [adherenceData, setAdherenceData] = useState([])
  const [weeklyStats, setWeeklyStats] = useState({ taken: 0, missed: 0, percentage: 0 })

  useEffect(() => {
    loadAdherenceData()
  }, [medicationId])

  const loadAdherenceData = () => {
    const logs = JSON.parse(localStorage.getItem(`adherence_${medicationId}`) || '[]')
    setAdherenceData(logs)

    // Calculate weekly stats
    const last7Days = logs.filter(log => {
      const logDate = new Date(log.date)
      const daysDiff = (Date.now() - logDate.getTime()) / (1000 * 60 * 60 * 24)
      return daysDiff <= 7
    })

    const taken = last7Days.filter(log => log.status === 'taken').length
    const missed = last7Days.filter(log => log.status === 'missed').length
    const total = taken + missed
    const percentage = total > 0 ? Math.round((taken / total) * 100) : 0

    setWeeklyStats({ taken, missed, percentage })
  }

  const markAsTaken = () => {
    const logs = JSON.parse(localStorage.getItem(`adherence_${medicationId}`) || '[]')
    logs.push({
      date: new Date().toISOString(),
      status: 'taken',
      timestamp: Date.now()
    })
    localStorage.setItem(`adherence_${medicationId}`, JSON.stringify(logs))
    loadAdherenceData()
  }

  const markAsMissed = () => {
    const logs = JSON.parse(localStorage.getItem(`adherence_${medicationId}`) || '[]')
    logs.push({
      date: new Date().toISOString(),
      status: 'missed',
      timestamp: Date.now()
    })
    localStorage.setItem(`adherence_${medicationId}`, JSON.stringify(logs))
    loadAdherenceData()
  }

  // Prepare chart data for last 7 days
  const chartData = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const dayLogs = adherenceData.filter(log => log.date.startsWith(dateStr))
    const taken = dayLogs.filter(log => log.status === 'taken').length
    const missed = dayLogs.filter(log => log.status === 'missed').length
    
    chartData.push({
      date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      taken,
      missed
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
          <TrendingUp className="text-blue-600" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Medication Adherence</h2>
          <p className="text-sm text-gray-500">Track your medication compliance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="text-green-600" size={24} />
            <span className="font-semibold text-green-800">Taken</span>
          </div>
          <p className="text-3xl font-bold text-green-700">{weeklyStats.taken}</p>
          <p className="text-sm text-green-600">Last 7 days</p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="text-red-600" size={24} />
            <span className="font-semibold text-red-800">Missed</span>
          </div>
          <p className="text-3xl font-bold text-red-700">{weeklyStats.missed}</p>
          <p className="text-sm text-red-600">Last 7 days</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-blue-600" size={24} />
            <span className="font-semibold text-blue-800">Adherence</span>
          </div>
          <p className="text-3xl font-bold text-blue-700">{weeklyStats.percentage}%</p>
          <p className="text-sm text-blue-600">This week</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-3">Weekly Adherence Chart</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="taken" fill="#10b981" name="Taken" />
            <Bar dataKey="missed" fill="#ef4444" name="Missed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-3">
        <button
          onClick={markAsTaken}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
        >
          <CheckCircle size={20} />
          Mark as Taken Today
        </button>
        <button
          onClick={markAsMissed}
          className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 flex items-center justify-center gap-2"
        >
          <XCircle size={20} />
          Mark as Missed
        </button>
      </div>
    </div>
  )
}


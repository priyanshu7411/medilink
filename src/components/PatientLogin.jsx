import { useState } from 'react'
import { User, Lock, ArrowLeft, Activity, Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function PatientLogin({ onLogin, onBack }) {
  const { isDark, toggleTheme } = useTheme()
  const [patientId, setPatientId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (!patientId.trim() || !password.trim()) {
      setError('Please enter both Patient ID and Password')
      return
    }

    if (patientId.trim().toLowerCase() === 'demo' && password === 'patient123') {
      onLogin()
    } else {
      setError('Invalid Patient ID or Password. For demo: Patient ID is "demo" and password is "patient123".')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                <Activity className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">MediLink</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Healthcare Platform</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="text-yellow-500" size={20} />
              ) : (
                <Moon className="text-gray-600 dark:text-gray-300" size={20} />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <User className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">Patient Login</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 text-sm">
            Sign in to access your medical records
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Patient ID
              </label>
              <input
                type="text"
                placeholder="demo"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-gray-400 dark:placeholder-gray-500"
                value={patientId}
                onChange={(e) => {
                  setPatientId(e.target.value)
                  setError('')
                }}
                onKeyPress={handleKeyPress}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Demo Patient ID: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">demo</code>
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-gray-400 dark:placeholder-gray-500"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                onKeyPress={handleKeyPress}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Demo password: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">patient123</code>
              </p>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Lock size={18} />
              Sign In
            </button>
          </div>

          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-xs text-blue-900 dark:text-blue-200 text-center">
              <strong>💡 Demo Mode:</strong> Patient ID is <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">demo</code> and 
              Password is <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">patient123</code>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

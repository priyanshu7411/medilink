import { useState } from 'react'
import { Stethoscope, LogIn, Lock, ArrowLeft, Activity, Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function DoctorLogin({ onLogin, onBack }) {
  const { isDark, toggleTheme } = useTheme()
  const [code, setCode] = useState('')
  const [doctorName, setDoctorName] = useState('')
  
  const handleLogin = () => {
    if (!code.trim() || !doctorName.trim()) {
      alert('Please enter both your name and patient access code')
      return
    }
    onLogin(code.trim(), doctorName.trim())
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
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors text-sm"
            >
              <ArrowLeft size={18} />
              <span>Back to Home</span>
            </button>
          )}
          
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <Stethoscope className="text-green-600 dark:text-green-400" size={32} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">Doctor Portal</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 text-sm">
            Access patient medical records securely
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Your Name
              </label>
              <input 
                type="text"
                placeholder="Dr. Sharma"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:border-green-600 dark:focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 placeholder-gray-400 dark:placeholder-gray-500"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Lock size={16} />
                Patient Access Code
              </label>
              <input 
                type="text"
                placeholder="MED-XXXXXX"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono focus:border-green-600 dark:focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 placeholder-gray-400 dark:placeholder-gray-500"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Patient will provide this code (format: MED-XXXXXX)
              </p>
            </div>
            
            <button 
              onClick={handleLogin}
              className="w-full bg-green-600 dark:bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              Access Patient Records
            </button>
          </div>
          
          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-xs text-yellow-900 dark:text-yellow-200 text-center">
              <strong>🔒 Security Notice:</strong> Only access records with patient consent. 
              All access is logged for security purposes.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

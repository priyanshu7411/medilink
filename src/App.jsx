import { useState, useEffect } from 'react'
import { Activity, LogOut, Search, Bell, User as UserIcon, Moon, Sun } from 'lucide-react'
import { storage } from './utils/localStorage'
import { reminderService } from './utils/reminderService'
import { useTheme } from './contexts/ThemeContext'
import HomePage from './components/HomePage'
import PatientLogin from './components/PatientLogin'
import PatientProfile from './components/PatientProfile'
import MedicationList from './components/MedicationList'
import PrescriptionScanner from './components/PrescriptionScanner'
import Timeline from './components/Timeline'
import ShareAccess from './components/ShareAccess'
import Scans from './components/Scans'
import AllergyReactions from './components/AllergyReactions'
import LabResults from './components/LabResults'
import EmergencyCard from './components/EmergencyCard'
import AdherenceTracker from './components/AdherenceTracker'
import DoctorLogin from './components/DoctorLogin'
import DoctorDashboard from './components/DoctorDashboard'

function App() {
  const { isDark, toggleTheme } = useTheme()
  const [view, setView] = useState('home')
  const [patient, setPatient] = useState(null)
  const [doctorName, setDoctorName] = useState('')
  const [isPatientAuthenticated, setIsPatientAuthenticated] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  
  useEffect(() => {
    const patientData = storage.getPatient()
    setPatient(patientData)
    
    // Initialize reminder service
    reminderService.requestPermission().then(() => {
      reminderService.start()
    })
    
    return () => {
      reminderService.stop()
    }
  }, [refreshKey])
  
  const handleSelectPortal = (portal) => {
    if (portal === 'patient') {
      setView('patient-login')
    } else if (portal === 'doctor') {
      setView('doctor-login')
    }
  }
  
  const handlePatientLogin = () => {
    setIsPatientAuthenticated(true)
    setView('patient-dashboard')
  }
  
  const handlePatientLogout = () => {
    setIsPatientAuthenticated(false)
    setView('home')
  }
  
  const handleDoctorLogin = (code, name) => {
    const patientData = storage.getPatient()
    const enteredCode = code.trim().toUpperCase()
    const storedCode = patientData.accessCode.trim().toUpperCase()
    
    if (enteredCode === storedCode) {
      setDoctorName(name)
      setView('doctor-dashboard')
    } else {
      alert(`❌ Invalid access code! Please check and try again.\n\nYou entered: ${enteredCode}\n\nPlease copy the exact code from the Patient view's "Share Access" section.`)
    }
  }
  
  const handleDoctorLogout = () => {
    setDoctorName('')
    setView('home')
  }
  
  const handleMedicationAdded = () => {
    setRefreshKey(prev => prev + 1)
  }
  
  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="animate-spin text-blue-600 dark:text-blue-400">
          <Activity size={48} />
        </div>
      </div>
    )
  }
  
  // Home Page
  if (view === 'home') {
    return <HomePage onSelectPortal={handleSelectPortal} />
  }
  
  // Patient Login
  if (view === 'patient-login') {
    return (
      <PatientLogin 
        onLogin={handlePatientLogin}
        onBack={() => setView('home')}
      />
    )
  }
  
  // Doctor Login
  if (view === 'doctor-login') {
    return (
      <DoctorLogin 
        onLogin={handleDoctorLogin}
        onBack={() => setView('home')}
      />
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Modern Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors">
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
            
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search anything in MediLink"
                  className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                />
              </div>
              
              {/* Dark Mode Toggle */}
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
              
              {view === 'patient-dashboard' && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{patient.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Patient</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <UserIcon className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                </div>
              )}
              
              {view === 'doctor-dashboard' && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Dr. {doctorName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Doctor</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <UserIcon className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                </div>
              )}
              
              <button
                onClick={view === 'patient-dashboard' ? handlePatientLogout : handleDoctorLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {view === 'patient-dashboard' && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {patient.name}!</h1>
              <p className="text-gray-600 dark:text-gray-400">Here's your health overview</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <EmergencyCard patient={patient} />
                <PatientProfile patient={patient} />
                <AllergyReactions patient={patient} onUpdate={handleMedicationAdded} />
                <MedicationList medications={patient.medications} />
                <AdherenceTracker medicationId={patient.medications?.[0]?.id} />
                <PrescriptionScanner 
                  onMedicationAdded={handleMedicationAdded}
                  currentMeds={patient.medications}
                />
                <LabResults patient={patient} onUpdate={handleMedicationAdded} />
                <Scans scans={patient.scans || []} isDoctor={false} />
                <Timeline 
                  medications={patient.medications}
                  notes={patient.notes}
                />
              </div>
              
              <div className="space-y-6">
                <ShareAccess accessCode={patient.accessCode} />
              </div>
            </div>
          </div>
        )}
        
        {view === 'doctor-dashboard' && doctorName && (
          <DoctorDashboard 
            patient={patient}
            doctorName={doctorName}
            onLogout={handleDoctorLogout}
          />
        )}
      </main>
    </div>
  )
}

export default App

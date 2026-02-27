import { useState, useEffect } from 'react'
import { LogOut, User } from 'lucide-react'
import { storage } from '../utils/localStorage'
import PatientProfile from './PatientProfile'
import MedicationList from './MedicationList'
import Timeline from './Timeline'
import AddPrescription from './AddPrescription'
import Scans from './Scans'
import AllergyReactions from './AllergyReactions'
import LabResults from './LabResults'
import EmergencyCard from './EmergencyCard'
import { analyzeClinicalData } from '../utils/clinicalAI'

export default function DoctorDashboard({ patient: initialPatient, doctorName, onLogout }) {
  const [refreshKey, setRefreshKey] = useState(0)
  const [patient, setPatient] = useState(initialPatient)
  const [suggestions, setSuggestions] = useState([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  
  useEffect(() => {
    const patientData = storage.getPatient()
    setPatient(patientData)
  }, [refreshKey])
  
  useEffect(() => {
    if (patient) {
      loadSuggestions()
    }
  }, [patient])
  
  const loadSuggestions = async () => {
    setLoadingSuggestions(true)
    try {
      const results = await analyzeClinicalData(patient)
      setSuggestions(results || [])
    } catch (error) {
      console.error('Error loading suggestions:', error)
      setSuggestions([])
    } finally {
      setLoadingSuggestions(false)
    }
  }
  
  const handlePrescriptionAdded = () => {
    setRefreshKey(prev => prev + 1)
    // Reload suggestions after prescription is added
    if (patient) {
      loadSuggestions()
    }
  }
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Dr. {doctorName}</h1>
        <p className="text-gray-600">Viewing patient: <span className="font-semibold">{patient.name}</span></p>
      </div>
      
      <EmergencyCard patient={patient} />
      
      {/* Clinical AI Suggestions */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Clinical AI Assistant</h2>
        {loadingSuggestions ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-3 text-gray-600">Loading clinical insights...</p>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-4">
            {suggestions.map((s, i) => (
              <div 
                key={i} 
                className={`border-l-4 rounded-lg p-4 ${
                  s.priority === 'high' 
                    ? 'border-red-500 bg-red-50' 
                    : s.priority === 'medium' 
                    ? 'border-yellow-500 bg-yellow-50' 
                    : 'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{s.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    s.priority === 'high' 
                      ? 'bg-red-200 text-red-800' 
                      : s.priority === 'medium' 
                      ? 'bg-yellow-200 text-yellow-800' 
                      : 'bg-blue-200 text-blue-800'
                  }`}>
                    {s.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Reasoning:</span> {s.reasoning}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Action:</span> {s.action}
                </p>
                <div className="mt-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {s.category.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 py-4">No clinical suggestions at this time.</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="space-y-6">
          <PatientProfile patient={patient} />
          <AllergyReactions patient={patient} onUpdate={handlePrescriptionAdded} />
          <MedicationList medications={patient.medications} />
          <Scans scans={patient.scans || []} isDoctor={true} />
        </div>
        
        <div className="space-y-6">
          <AddPrescription 
            doctorName={doctorName}
            currentMedications={patient.medications}
            patient={patient}
            onPrescriptionAdded={handlePrescriptionAdded}
          />
          <LabResults patient={patient} onUpdate={handlePrescriptionAdded} />
          <Timeline 
            medications={patient.medications}
            notes={patient.notes}
          />
        </div>
      </div>
    </div>
  )
}


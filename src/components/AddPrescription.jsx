import { useState } from 'react'
import { Plus, FileText } from 'lucide-react'
import { storage } from '../utils/localStorage'
import { checkInteractions } from '../data/drugInteractions'
import DrugInteractionAlert from './DrugInteractionAlert'

export default function AddPrescription({ doctorName, currentMedications, patient, onPrescriptionAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: ''
  })
  const [interactions, setInteractions] = useState([])
  const [allergyWarning, setAllergyWarning] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [overrideReason, setOverrideReason] = useState('')
  
  const checkAllergies = (drugName) => {
    const reactions = patient?.reactions || []
    const drugLower = drugName.toLowerCase().trim()
    
    return reactions.find(reaction => 
      reaction.drugName.toLowerCase().trim() === drugLower
    )
  }
  
  const handleAddMedication = () => {
    if (!formData.name || !formData.dosage || !formData.frequency) {
      alert('Please fill all fields')
      return
    }
    
    // Check for allergies first
    const allergy = checkAllergies(formData.name)
    if (allergy) {
      setAllergyWarning(allergy)
      return
    }
    
    // Check for drug interactions
    const foundInteractions = checkInteractions(formData.name, currentMedications)
    
    if (foundInteractions.length > 0) {
      setInteractions(foundInteractions)
    } else {
      storage.addMedication({
        ...formData,
        doctor: doctorName
      })
      
      setFormData({ name: '', dosage: '', frequency: '' })
      onPrescriptionAdded()
      alert('✅ Medication added successfully!')
    }
  }
  
  const handleOverrideAllergy = () => {
    if (!overrideReason.trim()) {
      alert('Please provide a reason for overriding the allergy warning')
      return
    }
    
    storage.addMedication({
      ...formData,
      doctor: doctorName,
      overrideReason: overrideReason
    })
    
    setFormData({ name: '', dosage: '', frequency: '' })
    setAllergyWarning(null)
    setOverrideReason('')
    onPrescriptionAdded()
    alert('⚠️ Medication added despite allergy warning! Reason logged.')
  }
  
  const handleForceAdd = () => {
    storage.addMedication({
      ...formData,
      doctor: doctorName
    })
    
    setFormData({ name: '', dosage: '', frequency: '' })
    setInteractions([])
    onPrescriptionAdded()
    alert('⚠️ Medication added despite interaction warning!')
  }
  
  const handleAddNote = () => {
    if (!noteText.trim()) {
      alert('Please enter a note')
      return
    }
    
    storage.addNote({
      content: noteText,
      doctor: doctorName
    })
    
    setNoteText('')
    onPrescriptionAdded()
    alert('✅ Clinical note added successfully!')
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
          <Plus className="text-green-600" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Add New Prescription</h2>
          <p className="text-sm text-gray-500">Create prescription and notes</p>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Medicine Name *
          </label>
          <input 
            type="text"
            placeholder="e.g., Aspirin, Metformin, Ibuprofen"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Dosage *
          </label>
          <input 
            type="text"
            placeholder="e.g., 75mg, 500mg, 5mg"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.dosage}
            onChange={(e) => setFormData({...formData, dosage: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Frequency *
          </label>
          <input 
            type="text"
            placeholder="e.g., Once daily, Twice daily, Three times a day"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.frequency}
            onChange={(e) => setFormData({...formData, frequency: e.target.value})}
          />
        </div>
        
        <button 
          onClick={handleAddMedication}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Check & Add Medication
        </button>
      </div>
      
      <hr className="my-6 border-gray-200" />
      
      <div>
        <h3 className="font-bold mb-3 flex items-center gap-2 text-gray-800">
          <FileText size={20} className="text-green-600" />
          Add Clinical Note
        </h3>
        <textarea 
          placeholder="Enter observations, diagnosis, treatment plan, or follow-up instructions..."
          className="w-full border border-gray-300 rounded-lg px-4 py-3 h-28 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        <button 
          onClick={handleAddNote}
          className="mt-3 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
        >
          Add Clinical Note
        </button>
      </div>
      
      {interactions.length > 0 && (
        <DrugInteractionAlert 
          interactions={interactions}
          onClose={() => {
            setInteractions([])
          }}
        />
      )}

      {allergyWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8 shadow-2xl">
            <div className="bg-red-100 border-4 border-red-600 rounded-lg p-6 mb-6">
              <h2 className="text-3xl font-bold text-red-800 mb-4 flex items-center gap-2">
                ⚠️ CRITICAL ALLERGY WARNING
              </h2>
              <p className="text-xl font-semibold text-red-900 mb-2">
                PATIENT ALLERGIC TO: <span className="text-red-600">{allergyWarning.drugName.toUpperCase()}</span>
              </p>
              <p className="text-lg text-red-800 mb-2">
                Documented Reaction: <span className="font-bold">{allergyWarning.reactionType}</span>
              </p>
              <p className="text-lg text-red-800 mb-2">
                Severity: <span className="font-bold">{allergyWarning.severity.toUpperCase()}</span>
              </p>
              <p className="text-sm text-red-700">
                Date: {new Date(allergyWarning.date).toLocaleDateString('en-IN')}
              </p>
              {allergyWarning.description && (
                <p className="text-sm text-red-700 mt-2">{allergyWarning.description}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Reason for Override (Required) *
              </label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                className="w-full border-2 border-red-300 rounded-lg px-4 py-3 h-24 focus:border-red-600 focus:outline-none resize-none"
                placeholder="Explain why this medication is necessary despite the allergy..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleOverrideAllergy}
                className="flex-1 bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700"
              >
                Override & Add Medication
              </button>
              <button
                onClick={() => {
                  setAllergyWarning(null)
                  setOverrideReason('')
                }}
                className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


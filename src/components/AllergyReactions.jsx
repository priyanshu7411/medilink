import { useState } from 'react'
import { AlertTriangle, Plus, X, MoreVertical } from 'lucide-react'
import { storage } from '../utils/localStorage'

export default function AllergyReactions({ patient, onUpdate }) {
  const [showModal, setShowModal] = useState(false)
  const [reaction, setReaction] = useState({
    drugName: '',
    reactionType: '',
    severity: 'mild',
    date: new Date().toISOString().split('T')[0],
    description: ''
  })

  const reactionTypes = [
    'Rash', 'Swelling', 'Nausea', 'Breathing difficulty', 
    'Dizziness', 'Headache', 'Itching', 'Hives', 'Other'
  ]

  const handleSubmit = () => {
    if (!reaction.drugName || !reaction.reactionType) {
      alert('Please fill in drug name and reaction type')
      return
    }

    const patientData = storage.getPatient()
    if (!patientData.reactions) {
      patientData.reactions = []
    }

    patientData.reactions.push({
      id: Date.now(),
      ...reaction
    })

    storage.savePatient(patientData)
    setShowModal(false)
    setReaction({
      drugName: '',
      reactionType: '',
      severity: 'mild',
      date: new Date().toISOString().split('T')[0],
      description: ''
    })
    onUpdate()
  }

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'severe': return 'bg-red-50 border-red-200 text-red-800'
      case 'moderate': return 'bg-orange-50 border-orange-200 text-orange-800'
      default: return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    }
  }

  const reactions = patient.reactions || []

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Documented Reactions</h2>
            <p className="text-sm text-gray-500">{reactions.length} reactions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm font-medium"
          >
            <Plus size={16} />
            Report
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {reactions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No documented reactions</p>
      ) : (
        <div className="space-y-3">
          {reactions.map((r) => (
            <div
              key={r.id}
              className={`border rounded-lg p-4 ${getSeverityColor(r.severity)}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm mb-1">{r.drugName}</h3>
                  <p className="text-xs mb-1">
                    <span className="font-medium">Reaction:</span> {r.reactionType}
                  </p>
                  <p className="text-xs mb-1">
                    <span className="font-medium">Severity:</span> {r.severity.toUpperCase()}
                  </p>
                  {r.description && (
                    <p className="text-xs mt-2 opacity-90">{r.description}</p>
                  )}
                </div>
                <div className="text-xs opacity-70">
                  {new Date(r.date).toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Report Adverse Reaction</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Drug Name *</label>
                <input
                  type="text"
                  value={reaction.drugName}
                  onChange={(e) => setReaction({...reaction, drugName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., Penicillin, Aspirin"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Reaction Type *</label>
                <select
                  value={reaction.reactionType}
                  onChange={(e) => setReaction({...reaction, reactionType: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select reaction type</option>
                  {reactionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Severity *</label>
                <select
                  value={reaction.severity}
                  onChange={(e) => setReaction({...reaction, severity: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Date Occurred</label>
                <input
                  type="date"
                  value={reaction.date}
                  onChange={(e) => setReaction({...reaction, date: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Description</label>
                <textarea
                  value={reaction.description}
                  onChange={(e) => setReaction({...reaction, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 h-24 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  placeholder="Describe the reaction in detail..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Save Reaction
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

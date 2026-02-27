import { useState, useEffect } from 'react'
import { Pill, Clock, CheckCircle, AlertCircle, MoreVertical } from 'lucide-react'
import ReminderModal from './ReminderModal'
import { reminderService } from '../utils/reminderService'

export default function MedicationList({ medications }) {
  const [selectedMed, setSelectedMed] = useState(null)
  const [reminders, setReminders] = useState({})

  useEffect(() => {
    medications.forEach(med => {
      const reminder = reminderService.getReminder(med.id)
      if (reminder) {
        setReminders(prev => ({ ...prev, [med.id]: reminder }))
      }
    })
  }, [medications])

  const handleSetReminder = (medication) => {
    setSelectedMed(medication)
  }

  const handleSaveReminder = (reminder) => {
    reminderService.saveReminder(reminder)
    setReminders(prev => ({ ...prev, [reminder.medicationId]: reminder }))
  }

  const getTodayStatus = (medicationId) => {
    const logs = JSON.parse(localStorage.getItem(`adherence_${medicationId}`) || '[]')
    const today = new Date().toDateString()
    const todayLog = logs.find(log => new Date(log.date).toDateString() === today)
    return todayLog?.status || null
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Pill className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Current Medications</h2>
            <p className="text-sm text-gray-500">{medications.length} medications</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={20} />
        </button>
      </div>
      
      {medications.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No medications recorded</p>
      ) : (
        <div className="space-y-3">
          {medications.map((med) => {
            const reminder = reminders[med.id]
            const todayStatus = getTodayStatus(med.id)
            
            return (
              <div key={med.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{med.name}</h3>
                      {reminder?.enabled && (
                        <Clock className="text-blue-600" size={16} title="Reminder set" />
                      )}
                      {todayStatus === 'taken' && (
                        <CheckCircle className="text-green-600" size={16} title="Taken today" />
                      )}
                      {todayStatus === 'missed' && (
                        <AlertCircle className="text-red-600" size={16} title="Missed today" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">{med.dosage}</span> • {med.frequency}
                    </p>
                    {reminder?.enabled && (
                      <p className="text-xs text-blue-600 mb-1">
                        Reminders: {reminder.times.join(', ')}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Prescribed by: <span className="font-medium">{med.doctor}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <div className="text-xs text-gray-400">
                      {new Date(med.addedDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                    <button
                      onClick={() => handleSetReminder(med)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs rounded-lg hover:bg-blue-100 flex items-center gap-1 font-medium"
                    >
                      <Clock size={14} />
                      {reminder?.enabled ? 'Edit' : 'Reminder'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedMed && (
        <ReminderModal
          medication={selectedMed}
          onClose={() => setSelectedMed(null)}
          onSave={handleSaveReminder}
        />
      )}
    </div>
  )
}

import { useState } from 'react'
import { X, Clock } from 'lucide-react'

export default function ReminderModal({ medication, onClose, onSave }) {
  const [reminderTimes, setReminderTimes] = useState(['08:00'])
  const [enabled, setEnabled] = useState(true)

  const addTime = () => {
    setReminderTimes([...reminderTimes, '08:00'])
  }

  const removeTime = (index) => {
    setReminderTimes(reminderTimes.filter((_, i) => i !== index))
  }

  const updateTime = (index, time) => {
    const newTimes = [...reminderTimes]
    newTimes[index] = time
    setReminderTimes(newTimes)
  }

  const handleSave = () => {
    onSave({
      medicationId: medication.id,
      times: reminderTimes,
      enabled
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Clock className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Set Reminder</h2>
              <p className="text-xs text-gray-500">{medication.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Enable Reminders</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Reminder Times</label>
            <div className="space-y-2">
              {reminderTimes.map((time, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => updateTime(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {reminderTimes.length > 1 && (
                    <button
                      onClick={() => removeTime(index)}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addTime}
                className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium border border-gray-200"
              >
                + Add Another Time
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Save Reminder
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

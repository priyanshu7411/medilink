import { useState } from 'react'
import { FileText, Plus, X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { storage } from '../utils/localStorage'

export default function LabResults({ patient, onUpdate }) {
  const [showModal, setShowModal] = useState(false)
  const [selectedTest, setSelectedTest] = useState('')
  const [formData, setFormData] = useState({
    testName: '',
    value: '',
    unit: '',
    date: new Date().toISOString().split('T')[0],
    normalRange: ''
  })

  const commonTests = [
    { name: 'Fasting Blood Sugar', unit: 'mg/dL', normalRange: '70-100' },
    { name: 'HbA1c', unit: '%', normalRange: '<5.7' },
    { name: 'Total Cholesterol', unit: 'mg/dL', normalRange: '<200' },
    { name: 'LDL Cholesterol', unit: 'mg/dL', normalRange: '<100' },
    { name: 'HDL Cholesterol', unit: 'mg/dL', normalRange: '>40' },
    { name: 'Blood Pressure (Systolic)', unit: 'mmHg', normalRange: '<120' },
    { name: 'Blood Pressure (Diastolic)', unit: 'mmHg', normalRange: '<80' },
    { name: 'Creatinine', unit: 'mg/dL', normalRange: '0.6-1.2' },
    { name: 'SGPT', unit: 'U/L', normalRange: '<40' },
    { name: 'SGOT', unit: 'U/L', normalRange: '<40' },
    { name: 'TSH', unit: 'mIU/L', normalRange: '0.4-4.0' }
  ]

  const handleTestSelect = (test) => {
    setSelectedTest(test)
    setFormData({
      testName: test.name,
      unit: test.unit,
      normalRange: test.normalRange,
      value: '',
      date: new Date().toISOString().split('T')[0]
    })
  }

  const handleSubmit = () => {
    if (!formData.testName || !formData.value) {
      alert('Please fill in test name and value')
      return
    }

    const patientData = storage.getPatient()
    if (!patientData.labResults) {
      patientData.labResults = []
    }

    // Determine status
    let status = 'normal'
    if (formData.normalRange) {
      const value = parseFloat(formData.value)
      const range = formData.normalRange
      
      if (range.includes('-')) {
        const [min, max] = range.split('-').map(Number)
        if (value < min || value > max) status = 'abnormal'
      } else if (range.startsWith('<')) {
        const max = parseFloat(range.substring(1))
        if (value >= max) status = 'abnormal'
      } else if (range.startsWith('>')) {
        const min = parseFloat(range.substring(1))
        if (value <= min) status = 'abnormal'
      }
    }

    patientData.labResults.push({
      id: Date.now(),
      ...formData,
      status
    })

    storage.savePatient(patientData)
    setShowModal(false)
    setFormData({ testName: '', value: '', unit: '', date: new Date().toISOString().split('T')[0], normalRange: '' })
    setSelectedTest('')
    onUpdate()
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'normal': return 'text-green-600 bg-green-50 border-green-200'
      case 'abnormal': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    }
  }

  const labResults = patient.labResults || []

  // Group by test name for trends
  const testGroups = {}
  labResults.forEach(result => {
    if (!testGroups[result.testName]) {
      testGroups[result.testName] = []
    }
    testGroups[result.testName].push(result)
  })

  // Get latest results
  const latestResults = Object.keys(testGroups).map(testName => {
    const results = testGroups[testName]
    return results.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
  })

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <FileText className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Lab Results</h2>
            <p className="text-sm text-gray-500">{labResults.length} results</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium"
        >
          <Plus size={16} />
          Add Result
        </button>
      </div>

      {latestResults.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No lab results recorded</p>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestResults.map((result) => {
              const trendData = testGroups[result.testName]
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(-6)
                .map(r => ({
                  date: new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                  value: parseFloat(r.value)
                }))

              return (
                <div key={result.id} className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{result.testName}</h3>
                      <p className="text-2xl font-bold mt-2">
                        {result.value} {result.unit}
                      </p>
                      <p className="text-sm mt-1">Normal: {result.normalRange}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(result.status)}`}>
                      {result.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {trendData.length > 1 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold mb-2">Trend (Last 6 readings)</p>
                      <ResponsiveContainer width="100%" height={100}>
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Add Lab Result</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Select Common Test</label>
                <div className="grid grid-cols-2 gap-2">
                  {commonTests.map(test => (
                    <button
                      key={test.name}
                      onClick={() => handleTestSelect(test)}
                      className={`p-3 border-2 rounded-lg text-left hover:border-blue-500 ${
                        selectedTest?.name === test.name ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">{test.name}</div>
                      <div className="text-xs text-gray-600">{test.unit} • Normal: {test.normalRange}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Test Name *</label>
                <input
                  type="text"
                  value={formData.testName}
                  onChange={(e) => setFormData({...formData, testName: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-600 focus:outline-none"
                  placeholder="Or enter custom test name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Value *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-600 focus:outline-none"
                    placeholder="mg/dL, %, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Normal Range</label>
                  <input
                    type="text"
                    value={formData.normalRange}
                    onChange={(e) => setFormData({...formData, normalRange: e.target.value})}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-600 focus:outline-none"
                    placeholder="e.g., 70-100, <200"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Save Lab Result
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
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


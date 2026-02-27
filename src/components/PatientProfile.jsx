import { User, Calendar, Droplet, AlertCircle, MoreVertical } from 'lucide-react'

export default function PatientProfile({ patient }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <User className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{patient.name}</h2>
            <p className="text-sm text-gray-500">Patient Profile</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Calendar size={20} className="text-gray-600" />
          <div>
            <p className="text-xs text-gray-500">Age</p>
            <p className="text-sm font-semibold text-gray-900">{patient.age} years</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Droplet size={20} className="text-red-600" />
          <div>
            <p className="text-xs text-gray-500">Blood Group</p>
            <p className="text-sm font-semibold text-gray-900">{patient.bloodGroup}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <AlertCircle className="text-blue-600" size={16} />
          Chronic Conditions
        </h3>
        <div className="flex flex-wrap gap-2">
          {patient.conditions.map((cond, i) => (
            <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100">
              {cond}
            </span>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <AlertCircle className="text-red-600" size={16} />
          Allergies
        </h3>
        <div className="flex flex-wrap gap-2">
          {patient.allergies.map((allergy, i) => (
            <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium border border-red-100">
              ⚠️ {allergy}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

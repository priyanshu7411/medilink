import { AlertTriangle, X, AlertCircle } from 'lucide-react'

export default function DrugInteractionAlert({ interactions, onClose }) {
  if (interactions.length === 0) return null
  
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return {
        bg: 'bg-red-50',
        border: 'border-red-600',
        text: 'text-red-900',
        badge: 'bg-red-600 text-white'
      }
      case 'high': return {
        bg: 'bg-orange-50',
        border: 'border-orange-600',
        text: 'text-orange-900',
        badge: 'bg-orange-600 text-white'
      }
      case 'medium': return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-600',
        text: 'text-yellow-900',
        badge: 'bg-yellow-600 text-white'
      }
      default: return {
        bg: 'bg-gray-50',
        border: 'border-gray-600',
        text: 'text-gray-900',
        badge: 'bg-gray-600 text-white'
      }
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-3xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-red-600">
                Drug Interaction Warning!
              </h2>
              <p className="text-gray-600 mt-1">
                {interactions.length} dangerous interaction{interactions.length > 1 ? 's' : ''} detected
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={28} />
          </button>
        </div>
        
        <div className="space-y-5">
          {interactions.map((interaction, i) => {
            const colors = getSeverityColor(interaction.severity)
            return (
              <div 
                key={i} 
                className={`border-l-4 ${colors.border} ${colors.bg} p-5 rounded-r-lg shadow-sm`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle size={24} className={colors.text} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${colors.badge}`}>
                        {interaction.severity} Risk
                      </span>
                    </div>
                    <p className="font-bold text-xl mb-2">
                      <span className="text-red-600">{interaction.drug1}</span>
                      {' '}⚠️{' '}
                      <span className="text-red-600">{interaction.drug2}</span>
                    </p>
                  </div>
                </div>
                
                <div className="ml-9">
                  <div className="mb-3">
                    <p className="font-semibold text-gray-900 mb-1">⚠️ What happens:</p>
                    <p className={`${colors.text} leading-relaxed`}>{interaction.message}</p>
                  </div>
                  
                  <div className="bg-white bg-opacity-70 p-4 rounded-lg border-2 border-green-200">
                    <p className="font-semibold text-green-800 mb-1 flex items-center gap-2">
                      <AlertCircle size={18} />
                      Clinical Recommendation:
                    </p>
                    <p className="text-gray-800 leading-relaxed">{interaction.recommendation}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-8 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
          <p className="text-yellow-900 font-medium text-center">
            ⚠️ Do not ignore this warning. Consult with the prescribing doctor or pharmacist before proceeding.
          </p>
        </div>
        
        <button 
          onClick={onClose}
          className="mt-6 w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors shadow-lg"
        >
          I Understand - Close Warning
        </button>
      </div>
    </div>
  )
}


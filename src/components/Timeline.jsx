import { Clock, Pill, FileText, MoreVertical } from 'lucide-react'

export default function Timeline({ medications, notes }) {
  const events = [
    ...medications.map(med => ({ 
      type: 'medication', 
      data: med, 
      date: med.addedDate 
    })),
    ...notes.map(note => ({ 
      type: 'note', 
      data: note, 
      date: note.date 
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date))
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Clock className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Medical Timeline</h2>
            <p className="text-sm text-gray-500">{events.length} events</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={20} />
        </button>
      </div>
      
      {events.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No medical events recorded</p>
      ) : (
        <div className="space-y-4">
          {events.map((event, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  event.type === 'medication' 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-green-50 border border-green-200'
                }`}>
                  {event.type === 'medication' ? 
                    <Pill className="text-blue-600" size={18} /> : 
                    <FileText className="text-green-600" size={18} />
                  }
                </div>
                {i < events.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gray-200 mt-2 min-h-[40px]" />
                )}
              </div>
              
              <div className="flex-1 pb-4">
                <div className="text-xs text-gray-500 mb-2 font-medium">
                  {new Date(event.date).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                
                {event.type === 'medication' ? (
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-1">{event.data.name}</h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{event.data.dosage}</span> • {event.data.frequency}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Prescribed by: <span className="font-medium">{event.data.doctor}</span>
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Clinical Note</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{event.data.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      By: <span className="font-medium">{event.data.doctor}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

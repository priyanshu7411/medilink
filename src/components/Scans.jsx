import { FileImage, Download, Calendar, User, MoreVertical } from 'lucide-react'

export default function Scans({ scans, isDoctor = false }) {
  if (!scans || scans.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileImage className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Medical Scans & Reports</h2>
              <p className="text-sm text-gray-500">No scans available</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={20} />
          </button>
        </div>
        <div className="text-center py-12">
          <FileImage className="mx-auto mb-4 text-gray-300" size={48} />
          <p className="text-gray-500">No scans or reports available</p>
          <p className="text-gray-400 text-sm mt-2">
            {isDoctor ? 'Scans will appear here when uploaded by the patient' : 'Upload your scans and reports to view them here'}
          </p>
        </div>
      </div>
    )
  }

  const getScanTypeIcon = (type) => {
    const typeLower = type.toLowerCase()
    if (typeLower.includes('mri')) return '🧲'
    if (typeLower.includes('ct')) return '⚡'
    if (typeLower.includes('xray') || typeLower.includes('x-ray')) return '📷'
    if (typeLower.includes('ultrasound')) return '🔊'
    if (typeLower.includes('ecg') || typeLower.includes('ekg')) return '📈'
    return '📄'
  }

  const getScanTypeColor = (type) => {
    const typeLower = type.toLowerCase()
    if (typeLower.includes('mri')) return 'bg-purple-50 border-purple-200 text-purple-700'
    if (typeLower.includes('ct')) return 'bg-blue-50 border-blue-200 text-blue-700'
    if (typeLower.includes('xray') || typeLower.includes('x-ray')) return 'bg-green-50 border-green-200 text-green-700'
    if (typeLower.includes('ultrasound')) return 'bg-yellow-50 border-yellow-200 text-yellow-700'
    if (typeLower.includes('ecg') || typeLower.includes('ekg')) return 'bg-red-50 border-red-200 text-red-700'
    return 'bg-gray-50 border-gray-200 text-gray-700'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <FileImage className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Medical Scans & Reports</h2>
            <p className="text-sm text-gray-500">{scans.length} scans</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scans.map((scan) => (
          <div
            key={scan.id}
            className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${getScanTypeColor(scan.type)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getScanTypeIcon(scan.type)}</span>
                <div>
                  <h3 className="font-semibold text-sm">{scan.type}</h3>
                  {scan.bodyPart && (
                    <p className="text-xs opacity-80">{scan.bodyPart}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2 text-xs">
                <Calendar size={12} />
                <span>{new Date(scan.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}</span>
              </div>
              {scan.facility && (
                <div className="flex items-center gap-2 text-xs">
                  <User size={12} />
                  <span>{scan.facility}</span>
                </div>
              )}
              {scan.doctor && (
                <p className="text-xs">
                  <span className="font-medium">Doctor:</span> {scan.doctor}
                </p>
              )}
            </div>

            {scan.description && (
              <p className="text-xs mb-3 opacity-90 leading-relaxed line-clamp-2">{scan.description}</p>
            )}

            {scan.fileUrl && (
              <a
                href={scan.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white bg-opacity-70 rounded-lg hover:bg-opacity-100 transition-colors text-xs font-medium"
              >
                <Download size={14} />
                View Report
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

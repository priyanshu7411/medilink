import { useState } from 'react'
import { Phone, AlertCircle, Heart, Pill, User, Download, Share2, MoreVertical } from 'lucide-react'
import QRCode from 'qrcode.react'
import { jsPDF } from 'jspdf'

export default function EmergencyCard({ patient }) {
  const [showFullCard, setShowFullCard] = useState(false)

  const emergencyContacts = patient.emergencyContacts || [
    { name: 'Dr. Sharma', relationship: 'Primary Doctor', phone: '+91-98765-43210', primary: true },
    { name: 'Rajesh Kumar Jr.', relationship: 'Son', phone: '+91-98765-43211', primary: false }
  ]

  const generateEmergencySMS = () => {
    const allergies = patient.allergies?.join(', ') || 'None'
    const medications = patient.medications?.map(m => m.name).join(', ') || 'None'
    const conditions = patient.conditions?.join(', ') || 'None'
    
    const message = `MEDICAL EMERGENCY - ${patient.name}, Age ${patient.age}, Blood Group ${patient.bloodGroup}. Allergic to: ${allergies}. Current medications: ${medications}. Chronic conditions: ${conditions}. Location: [Your location]. Contact Dr at [Hospital].`
    
    return encodeURIComponent(message)
  }

  const downloadMedicalID = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    
    doc.setFillColor(220, 53, 69)
    doc.rect(0, 0, pageWidth, 30, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.text('MEDICAL ID CARD', pageWidth / 2, 20, { align: 'center' })
    
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(16)
    doc.text(`Name: ${patient.name}`, 20, 50)
    doc.text(`Age: ${patient.age} years`, 20, 60)
    doc.text(`Blood Group: ${patient.bloodGroup}`, 20, 70)
    
    if (patient.allergies && patient.allergies.length > 0) {
      doc.setFillColor(255, 0, 0)
      doc.rect(20, 80, pageWidth - 40, 20, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(14)
      doc.text(`⚠️ ALLERGIES: ${patient.allergies.join(', ')}`, pageWidth / 2, 95, { align: 'center' })
      doc.setTextColor(0, 0, 0)
    }
    
    doc.setFontSize(12)
    doc.text(`Chronic Conditions: ${patient.conditions?.join(', ') || 'None'}`, 20, 120)
    
    const meds = patient.medications?.map(m => `${m.name} (${m.dosage})`).join(', ') || 'None'
    doc.text(`Current Medications: ${meds}`, 20, 130)
    
    const primaryContact = emergencyContacts.find(c => c.primary) || emergencyContacts[0]
    if (primaryContact) {
      doc.text(`Emergency Contact: ${primaryContact.name} - ${primaryContact.phone}`, 20, 140)
    }
    
    doc.setFontSize(10)
    doc.text(`Access Code: ${patient.accessCode}`, 20, 160)
    
    doc.save(`MedicalID_${patient.name.replace(' ', '_')}.pdf`)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
            <AlertCircle className="text-red-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Emergency Information</h2>
            <p className="text-sm text-gray-500">Critical medical details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFullCard(!showFullCard)}
            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium"
          >
            {showFullCard ? 'Less' : 'More'}
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Heart className="text-red-600" size={18} />
              <div>
                <p className="text-xs text-gray-500">Blood Group</p>
                <p className="text-sm font-bold text-gray-900">{patient.bloodGroup}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="text-red-600" size={18} />
              <div>
                <p className="text-xs text-gray-500">Age</p>
                <p className="text-sm font-bold text-gray-900">{patient.age} years</p>
              </div>
            </div>
          </div>

          {patient.allergies && patient.allergies.length > 0 && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-3">
              <p className="font-semibold text-red-900 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                ALLERGIES: {patient.allergies.join(', ')}
              </p>
            </div>
          )}

          {patient.conditions && patient.conditions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Chronic Conditions:</p>
              <div className="flex flex-wrap gap-2">
                {patient.conditions.map((cond, i) => (
                  <span key={i} className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs border border-orange-200">
                    {cond}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {patient.medications && patient.medications.length > 0 && (
          <div>
            <p className="text-xs font-semibold mb-2 flex items-center gap-1">
              <Pill className="text-blue-600" size={14} />
              Current Medications:
            </p>
            <div className="bg-blue-50 rounded-lg p-3">
              {patient.medications.map((med, i) => (
                <p key={i} className="text-xs">
                  • {med.name} ({med.dosage}) - {med.frequency}
                </p>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold mb-2 flex items-center gap-1">
            <Phone className="text-green-600" size={14} />
            Emergency Contacts:
          </p>
          <div className="space-y-2">
            {emergencyContacts.map((contact, i) => (
              <div key={i} className="flex items-center justify-between bg-green-50 rounded-lg p-3">
                <div>
                  <p className="text-sm font-semibold">{contact.name}</p>
                  <p className="text-xs text-gray-600">{contact.relationship}</p>
                </div>
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-medium"
                >
                  <Phone size={14} />
                  {contact.phone}
                </a>
              </div>
            ))}
          </div>
        </div>

        {showFullCard && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-semibold mb-2">Access Code for Full Records:</p>
            <div className="flex items-center gap-3">
              <code className="flex-1 text-lg font-mono bg-white px-3 py-2 rounded-lg border border-gray-200 text-center text-blue-600">
                {patient.accessCode}
              </code>
              <div className="bg-white p-2 rounded-lg border border-gray-200">
                <QRCode value={patient.accessCode} size={60} level="H" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <a
            href={`sms:?body=${generateEmergencySMS()}`}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm"
          >
            <Share2 size={16} />
            Emergency SMS
          </a>
          <button
            onClick={downloadMedicalID}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
          >
            <Download size={16} />
            Medical ID
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(patient.accessCode)
              alert('Access code copied!')
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium text-sm"
          >
            Copy Code
          </button>
        </div>
      </div>
    </div>
  )
}

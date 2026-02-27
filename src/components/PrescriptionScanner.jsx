import { useState } from 'react'
import { Camera, Upload, Loader2, CheckCircle } from 'lucide-react'
import { createWorker } from 'tesseract.js'
import { storage } from '../utils/localStorage'
import { checkInteractions } from '../data/drugInteractions'
import DrugInteractionAlert from './DrugInteractionAlert'

export default function PrescriptionScanner({ onMedicationAdded, currentMeds }) {
  const [scanning, setScanning] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const [extractedMeds, setExtractedMeds] = useState([])
  const [interactions, setInteractions] = useState([])
  const [progress, setProgress] = useState(0)
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setScanning(true)
    setExtractedText('')
    setExtractedMeds([])
    setProgress(0)
    
    try {
      const worker = await createWorker('eng')
      const result = await worker.recognize(file, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100))
          }
        }
      })
      await worker.terminate()
      
      const text = result.data.text
      setExtractedText(text)
      
      const medicines = extractMedicines(text)
      setExtractedMeds(medicines)
      
      if (medicines.length === 0) {
        alert('⚠️ No medicines detected. Please try again with a clearer image.')
        setScanning(false)
        return
      }
      
      let allInteractions = []
      medicines.forEach(med => {
        const medInteractions = checkInteractions(med.name, currentMeds)
        allInteractions = [...allInteractions, ...medInteractions]
      })
      
      if (allInteractions.length > 0) {
        setInteractions(allInteractions)
      } else {
        medicines.forEach(med => {
          storage.addMedication(med)
        })
        alert(`✅ ${medicines.length} medication(s) added successfully!`)
        onMedicationAdded()
        setExtractedText('')
        setExtractedMeds([])
      }
      
    } catch (error) {
      console.error('OCR Error:', error)
      alert('❌ Failed to scan prescription. Please try again with a clearer image.')
    } finally {
      setScanning(false)
      setProgress(0)
    }
  }
  
  const extractMedicines = (text) => {
    const medicines = []
    const medKeywords = ['tab', 'cap', 'syrup', 'inj', 'tablet', 'capsule', 'injection']
    const lines = text.split('\n').filter(line => line.trim().length > 3)
    
    lines.forEach(line => {
      const lowerLine = line.toLowerCase()
      const hasMedKeyword = medKeywords.some(keyword => lowerLine.includes(keyword))
      
      if (hasMedKeyword) {
        const words = line.split(/\s+/).filter(w => w.length > 1)
        
        const keywordIndex = words.findIndex(w => 
          medKeywords.some(keyword => w.toLowerCase().includes(keyword))
        )
        
        if (keywordIndex >= 0 && words.length > keywordIndex + 1) {
          const medName = words[keywordIndex + 1]
            .replace(/[^a-zA-Z]/g, '')
            .trim()
          
          if (medName.length >= 3) {
            const dosageMatch = line.match(/(\d+\s*mg|\d+\s*mcg|\d+\s*ml|\d+\s*g)/i)
            const dosage = dosageMatch ? dosageMatch[0] : '1 tablet'
            
            medicines.push({
              name: medName.charAt(0).toUpperCase() + medName.slice(1).toLowerCase(),
              dosage: dosage,
              frequency: 'As directed',
              doctor: 'Scanned Prescription'
            })
          }
        }
      }
    })
    
    return medicines
  }
  
  const handleForceAdd = () => {
    extractedMeds.forEach(med => {
      storage.addMedication(med)
    })
    alert(`⚠️ ${extractedMeds.length} medication(s) added despite interaction warning!`)
    setInteractions([])
    setExtractedText('')
    setExtractedMeds([])
    onMedicationAdded()
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
          <Camera className="text-blue-600" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Scan Prescription</h2>
          <p className="text-sm text-gray-500">OCR-based digitization</p>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-700">
          <strong>📸 Tips for best results:</strong> Ensure good lighting, clear handwriting visible, 
          and capture the entire prescription in frame.
        </p>
      </div>
      
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
        <Upload size={56} className="text-gray-400 mb-3" />
        <span className="text-gray-700 font-semibold text-lg">Click to upload prescription</span>
        <span className="text-gray-500 text-sm mt-1">Supports JPG, PNG, or PDF</span>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden"
          onChange={handleImageUpload}
          disabled={scanning}
        />
      </label>
      
      {scanning && (
        <div className="mt-6">
          <div className="flex items-center justify-center gap-3 text-blue-600 mb-3">
            <Loader2 className="animate-spin" size={24} />
            <span className="font-semibold">Scanning prescription... {progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {extractedMeds.length > 0 && !scanning && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-bold mb-3 flex items-center gap-2 text-green-800">
            <CheckCircle size={20} />
            Detected Medications ({extractedMeds.length}):
          </h3>
          <ul className="space-y-2">
            {extractedMeds.map((med, i) => (
              <li key={i} className="bg-white p-3 rounded border-l-2 border-green-500">
                <p className="font-semibold">{med.name}</p>
                <p className="text-sm text-gray-600">{med.dosage} • {med.frequency}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {extractedText && !scanning && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900 font-medium">
            View raw extracted text
          </summary>
          <pre className="mt-2 p-4 bg-gray-100 rounded text-xs text-gray-700 overflow-auto max-h-40">
            {extractedText}
          </pre>
        </details>
      )}
      
      {interactions.length > 0 && (
        <DrugInteractionAlert 
          interactions={interactions}
          onClose={() => setInteractions([])}
        />
      )}
    </div>
  )
}

